/* SPSS Mission Control — shared simulation, sync, and rendering for the film "To Just Live".
 *
 * Every screen derives its numbers from the same function of (phase, time), so the main TV and the
 * three engineer consoles always agree. Tabs on the same computer stay in sync automatically
 * (BroadcastChannel + localStorage). Separate computers each need the key pressed on them.
 *
 * KEYS:  → / SPACE next phase   ← previous phase   1-6 jump to phase   R restart phase clock
 *        G next GO in the poll  SHIFT+G reset poll  ] / [ skip mission clock ±5 min
 *        F fullscreen           H show/hide controls
 */
(function () {
  'use strict';

  // ---------- mission constants ----------
  const PERIOD = 5520;        // orbital period, seconds (92 min)
  const ORBIT_MET = 524;      // T+08:44 orbit insertion
  const MECO = 155;          // nacelle shutdown: the wing-root nacelles throttle to idle; main engines carry on to orbit
  const ORBITS = 3;           // planned orbits ("a go for at least 3 orbits"); each orbit is 92 min
  const ANOM = Math.round((ORBIT_MET + (ORBITS - 0.06) * PERIOD) / 60) * 60;  // late in the final orbit (T+04:39:00 for 3): reentry prep / fuel low
  const D2R = Math.PI / 180;
  const INC = 51.6 * D2R, LAT0 = 39.77, LON0 = -86.16;            // launch from SPSS headquarters
  const U0 = Math.asin(Math.sin(LAT0 * D2R) / Math.sin(INC));

  const PHASES = [
    { id: 'prelaunch', name: 'PRE-LAUNCH',     base: -120 },
    { id: 'launch',    name: 'LAUNCH',         base: -10 },
    { id: 'orbit',     name: 'ORBIT',          base: ORBIT_MET },
    { id: 'anomaly',   name: 'REENTRY PREP',   base: ANOM },
    { id: 'deorbit',   name: 'DE-ORBIT BURN',  base: ANOM + 75, cont: true },
    { id: 'los',       name: 'LOSS OF SIGNAL', base: ANOM + 95, cont: true },
  ];
  const POLL = ['BOOSTERS & VEHICLE', 'WEATHER & RANGE', 'GUIDANCE & GRAVITY', 'FLIGHT'];

  // p = phase; m = mission time (absolute for phases 0-2, seconds after phase start for 3-5)
  // s = station (omit = everyone); l = level ('w' caution, 'a' alarm)
  const EVENTS = [
    { p: 0, m: -120, t: 'TERMINAL COUNT INITIATED' },
    { p: 0, m: -118, t: 'VEHICLE ON INTERNAL POWER', s: 1 },
    { p: 0, m: -116, t: 'RANGE STATUS GREEN', s: 2 },
    { p: 0, m: -114, t: 'GUIDANCE ALIGNED — HQ PAD 1', s: 3 },
    { p: 0, m: -112, t: 'CREW 2 — HATCH CLOSED' },
    { p: 1, m: -5, t: 'AUTO SEQUENCE START' },
    { p: 1, m: -3, t: 'MAIN ENGINE + NACELLE IGNITION', s: 1 },
    { p: 1, m: 0, t: 'LIFTOFF CONFIRMED' },
    { p: 1, m: 6, t: 'LAUNCH PAD CLEAR' },
    { p: 1, m: 10, t: 'ROLL PROGRAM' },
    { p: 1, m: 62, t: 'MAX-Q' },
    { p: 1, m: MECO, t: 'NACELLES TO IDLE' },
    { p: 1, m: 162, t: 'MAIN ENGINES THROTTLE 40%', s: 1 },
    { p: 2, m: ORBIT_MET, t: 'MAIN ENGINE CUTOFF', s: 1 },
    { p: 2, m: ORBIT_MET, t: 'NOMINAL ORBIT INSERTION' },
    { p: 2, m: ORBIT_MET + 3, t: 'GRAVITY COIL ACTIVATED' },
    { p: 2, m: ORBIT_MET + 5, t: 'WINDOWS CLEARED' },
    { p: 2, m: ORBIT_MET + 16, t: 'CONTROLS LOCKED — REMOTE GUIDANCE', s: 3 },
    { p: 2, m: ORBIT_MET + 36, t: 'GO FOR ' + ORBITS + ' ORBITS' },
    { p: 2, m: ORBIT_MET + 90, t: 'FUEL USAGE ABOVE PREDICT — MONITOR', s: 1 },
    { p: 3, m: 0, t: 'REENTRY PREP — CONFIG FOR DE-ORBIT' },
    { p: 3, m: 2, t: 'CAUTION — MAIN FUEL 4.9%', l: 'w' },
    { p: 3, m: 3, t: 'CAUTION — BACKUP FUEL 19.8%', l: 'w' },
    { p: 3, m: 5, t: 'MASTER ALARM — FUEL LOW', l: 'a' },
    { p: 4, m: 0, t: 'DE-ORBIT BURN COMMANDED', l: 'w' },
    { p: 4, m: 1, t: 'IGNITION SEQUENCE START', l: 'w' },
    { p: 4, m: 4, t: 'MAIN ENGINE IGNITION', l: 'w' },
    { p: 4, m: 5, t: 'CHAMBER PRESSURE HIGH', l: 'a' },
    { p: 5, m: 0, t: 'LOSS OF SIGNAL', l: 'a' },
    { p: 5, m: 1, t: 'ALL TELEMETRY STALE', l: 'a' },
    { p: 5, m: 3, t: 'NO CARRIER — S-BAND / X-BAND', l: 'a' },
  ];

  const TIMELINE = [
    { t: 'GO/NO-GO', p: 0, m: -120, d: -120 },
    { t: 'LIFTOFF', p: 1, m: 0, d: 0 },
    { t: 'MAX-Q', p: 1, m: 62, d: 62 },
    { t: 'NACELLES IDLE', p: 1, m: MECO, d: MECO },
    { t: 'ORBIT INSERTION', p: 2, m: ORBIT_MET, d: ORBIT_MET },
    { t: 'GRAVITY COIL', p: 2, m: ORBIT_MET + 3, d: ORBIT_MET + 3 },
    { t: 'ORBIT ' + ORBITS, p: 2, m: ORBIT_MET + (ORBITS - 1) * PERIOD, d: ORBIT_MET + (ORBITS - 1) * PERIOD },
    { t: 'DE-ORBIT BURN', p: 4, m: 0, d: ANOM + 75, burn: true },
    { t: 'REENTRY', p: 9, m: 0, d: ANOM + 680 },
    { t: 'LANDING', p: 9, m: 0, d: ANOM + 2280 },
  ];

  const STATIONS = [
    { lon: -86, n: 'GS-HQ' }, { lon: -157, n: 'GS-HAWAII' }, { lon: 145, n: 'GS-GUAM' },
    { lon: 116, n: 'GS-PERTH' }, { lon: -4, n: 'GS-MADRID' }, { lon: 28, n: 'GS-HBK' }, { lon: -70, n: 'GS-SANTIAGO' },
  ];

  // ---------- helpers ----------
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  // smooth deterministic jitter so retakes and every screen look identical
  const n = (t, s) => (Math.sin(t * 0.21 + s * 1.7) * 0.45 + Math.sin(t * 0.57 + s * 3.1) * 0.3 + Math.sin(t * 1.33 + s * 5.3) * 0.15 + Math.sin(t * 3.7 + s * 7.9) * 0.1);
  const pad = (v) => String(v).padStart(2, '0');
  function fmtClock(sec, neg) {
    const a = sec < 0 ? Math.ceil(-sec - 1e-9) : Math.floor(sec);   // T- counts 5,4,3,2,1 then T+0
    return (neg ? (sec < 0 ? 'T- ' : 'T+ ') : '') + pad(Math.floor(a / 3600)) + ':' + pad(Math.floor(a / 60) % 60) + ':' + pad(a % 60);
  }
  const fmtMET = (s) => fmtClock(s, true);

  function fuelAt(met) {
    if (met <= 0) return [100, 100];
    if (met < ORBIT_MET) return [100 - 30 * met / ORBIT_MET, 100];
    if (met < ANOM) {                       // the slow leak: visible only if you watch the decimals
      const k = (met - ORBIT_MET) / (ANOM - ORBIT_MET);
      return [70 - 65.1 * k, 100 - 80.2 * k];
    }
    const d = met - ANOM;
    return [Math.max(0.4, 4.9 - 0.06 * d), Math.max(0.9, 19.8 - 0.27 * d)];   // alarm section: drains fast
  }

  function trackAt(met) {
    const tm = Math.max(met, 0);
    const u = U0 + 2 * Math.PI * tm / PERIOD;
    const lat = Math.asin(Math.sin(INC) * Math.sin(u)) / D2R;
    let lon = LON0 + (Math.atan2(Math.cos(INC) * Math.sin(u), Math.cos(u)) - Math.atan2(Math.cos(INC) * Math.sin(U0), Math.cos(U0))) / D2R - 360 * tm / 86164;
    lon = ((lon + 180) % 360 + 360) % 360 - 180;
    return [lat, lon];
  }

  // ---------- shared state ----------
  // Scene pages (e.g. mainConsole-launch.html) set window.SPSS_LOCK before loading this script.
  // A locked page always shows its one scene, starting fresh on load; only R (restart) changes it.
  const LOCKS = {
    poll:   { phase: 0, metStart: -5, holdAt: -5, label: 'GO/NO-GO — POLL, HOLD AT T-5 (MAIN TV THEN LAUNCHES)' },
    launch: { phase: 1, metStart: -5, label: 'LAUNCH — T-5 COUNTDOWN, LIFTOFF, ASCENT' },
    orbit:  { phase: 2, metStart: ORBIT_MET, label: 'ORBIT — JUST REACHED ORBIT, GRAVITY COIL ON' },
    ending: { phase: 3, metStart: ANOM, label: 'ENDING — MASTER ALARM, FUEL LOW, TANKS DRAINING' },
  };
  const LOCK = LOCKS[window.SPSS_LOCK] ? window.SPSS_LOCK : null;
  const KEY = 'spss-state-v1' + (LOCK ? '-' + LOCK : '');
  const fresh = () => LOCK
    ? { phase: LOCKS[LOCK].phase, start: Date.now(), metStart: LOCKS[LOCK].metStart, offset: 0, poll: LOCK === 'poll' ? [null, null, null, null] : [-75, -69, -63, -57], v: 0 }
    : { phase: 0, start: Date.now(), metStart: PHASES[0].base, offset: 0, poll: [null, null, null, null], v: 0 };
  let S = fresh();
  if (!LOCK) {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Date.now() - saved.v < 12 * 3600e3) S = saved;
    } catch (e) { /* ignore */ }
  }

  const bc = 'BroadcastChannel' in window ? new BroadcastChannel(LOCK ? 'spss-' + LOCK : 'spss') : null;
  function save() {
    S.v = Date.now();
    const j = JSON.stringify(S);
    try { localStorage.setItem(KEY, j); } catch (e) { /* ignore */ }
    if (bc) bc.postMessage(j);
    dirty = true;
  }
  function adopt(j) {
    try { const s = JSON.parse(j); if (s && s.v > S.v) { S = s; dirty = true; } } catch (e) { /* ignore */ }
  }
  if (bc) bc.onmessage = (e) => adopt(e.data);
  addEventListener('storage', (e) => { if (e.key === KEY && e.newValue) adopt(e.newValue); });

  function setPhase(i, restart) {
    if (LOCK) { const v = S.v; S = fresh(); S.v = v; save(); return; }
    i = clamp(i, 0, PHASES.length - 1);
    const ph = PHASES[i];
    const cur = tel(Date.now()).met;
    S.metStart = (ph.cont && i > S.phase && !restart) ? Math.max(ph.base, cur) : ph.base;
    S.phase = i; S.start = Date.now(); S.offset = 0;
    if (i === 0) S.poll = [null, null, null, null];
    else S.poll = S.poll.map((v, k) => (v == null ? -60 + k * 6 : v));
    save();
  }

  // ---------- telemetry: everything on every screen comes from here ----------
  function tel(t) {
    const P = S.phase, e = (t - S.start) / 1000;
    const ph = (e < 0 && P > 0) ? P - 1 : P;     // chart history from before the phase began
    let met = S.metStart + e + S.offset, hold = false;
    const holdAt = LOCK && LOCKS[LOCK].holdAt != null ? LOCKS[LOCK].holdAt : -10;
    if (P === 0 && met >= holdAt) { met = holdAt; hold = true; }
    const ms = t / 1000;
    const x = clamp(met / ORBIT_MET, 0, 1);
    const inOrbit = met >= ORBIT_MET && ph >= 1;
    const oa = 2 * Math.PI * (met - ORBIT_MET) / PERIOD;
    const los = ph === 5;
    const pe = ph >= 3 ? e : 0;                    // seconds into the current dramatic phase

    const T = { met, hold, phase: P, ph, los, e, phaseName: PHASES[P].name, phaseId: PHASES[P].id };
    T.metStr = fmtMET(met);
    T.clockLbl = P === 0 ? (hold ? 'COUNTDOWN — HOLD' : 'COUNTDOWN') : (met < -10 ? 'COUNTDOWN' : met < 0 ? 'AUTO SEQUENCE' : 'MISSION ELAPSED TIME');
    T.utc = new Date(t).toISOString().slice(11, 19) + ' UTC';
    T.losStr = 'LOS + ' + fmtClock(Math.max(0, e));

    // trajectory
    let alt, vel;
    if (met <= 0 || ph === 0) { alt = 0; vel = 0; }
    else if (!inOrbit) { alt = 410 * Math.pow(Math.sin(x * Math.PI / 2), 1.4); vel = 27580 * Math.pow(x, 1.6); }
    else { alt = 410 + 6 * Math.sin(oa); vel = 27580 - 9 * Math.sin(oa); }
    if (ph >= 4) alt -= Math.max(0, pe - 4) * 0.02;
    T.alt = alt; T.vel = vel;
    T.downrange = ph >= 1 && met > 0 ? (inOrbit ? 1650 + (met - ORBIT_MET) * 7.66 : 1650 * x * x) : 0;
    T.orbit = inOrbit ? 1 + Math.floor((met - ORBIT_MET) / PERIOD) : 0;
    T.orbitStr = (inOrbit ? T.orbit : '—') + ' / ' + ORBITS;
    T.apogee = inOrbit ? 416.0 : null;
    T.perigee = inOrbit ? 404.0 : null;
    T.incl = ph >= 1 && met > 0 ? 51.6 : null;
    T.periodMin = inOrbit ? PERIOD / 60 : null;
    T.nextOrbit = inOrbit ? fmtClock(PERIOD - ((met - ORBIT_MET) % PERIOD)) : '--:--:--';

    // fuel
    const [mf, bf] = fuelAt(met), [mf2, bf2] = fuelAt(met - 6);
    T.mainFuel = mf; T.backupFuel = bf;
    T.mainRate = (mf - mf2) * 10; T.backupRate = (bf - bf2) * 10;     // % per minute
    T.mainPress = 3.2 * clamp(mf / 60, 0.25, 1) + 0.01 * n(ms, 1);
    T.backupPress = 3.0 * clamp(bf / 60, 0.3, 1) + 0.01 * n(ms, 2);

    // propulsion
    let thrust = 0;
    if (ph === 1) {
      if (met >= -3 && met < 0) thrust = 100 * (met + 3) / 3;
      else if (met >= 0 && met < MECO) thrust = (met > 50 && met < 72) ? 72 : 100;
      else if (met >= 162 && met < ORBIT_MET) thrust = 40;
    }
    if (ph === 4 && pe >= 4) thrust = 100;
    T.thrust = thrust;
    T.chamber = thrust * 0.97 + (thrust ? n(ms, 3) * 0.8 : 0) + (ph === 4 && pe >= 4 ? Math.min(40, (pe - 4) * 3) : 0);
    // engines: 2 rear main engines burn to orbit; 2 wing-root nacelles assist until MECO then idle; RCS for attitude in orbit
    T.mainSt = ph === 0 ? 'READY' : ph === 1 ? (met < -3 ? 'READY' : met < ORBIT_MET ? 'BURN' : 'OFF') : ph === 4 ? (pe < 4 ? 'IGNITION' : 'BURN') : 'ARMED';
    T.nacSt = ph === 0 ? 'READY' : ph === 1 ? (met < -3 ? 'READY' : met < MECO ? 'BURN' : 'IDLE') : 'IDLE';
    T.rcsSt = ph <= 1 ? 'SAFE' : 'ACTIVE';
    let accel = 0;
    if (ph === 1 && met > 0 && met < MECO) accel = 1.3 + 2.2 * (met / MECO);
    else if (ph === 1 && met >= 162 && met < ORBIT_MET) accel = 0.6 + 0.3 * x;
    else if (ph === 4 && pe >= 4) accel = 0.42;
    T.accel = accel + (accel ? 0.01 * n(ms, 4) : 0);
    T.heat = ph === 1 && met > 0 ? 20 + 360 * Math.sin(clamp(met / 240, 0, 1) * Math.PI) : inOrbit ? -40 + 60 * Math.sin(oa) : 18;
    T.bus = 28.1 + 0.05 * n(ms, 5);
    T.avionics = 31 + 0.4 * n(ms, 6);

    // gravity coil & cabin
    const coilOn = ph >= 2 && met >= ORBIT_MET + 3, arming = ph === 2 && met >= ORBIT_MET && !coilOn;
    T.coilSt = coilOn ? 'ACTIVE' : arming ? 'ARMING' : 'OFF';
    T.gField = coilOn ? 1 + 0.003 * n(ms, 7) : arming ? (met - ORBIT_MET) / 3 : 0;
    T.coilAmps = coilOn ? 412 + 2 * n(ms, 8) : arming ? 412 * (met - ORBIT_MET) / 3 : 0;
    T.coilTemp = coilOn ? 34 + 0.5 * n(ms, 9) : 21;
    T.cabinP = 101.3 + 0.05 * n(ms, 10);
    T.cabinT = 21.4 + 0.1 * n(ms, 11);
    T.o2 = 20.9 + 0.02 * n(ms, 12);
    T.windows = ph >= 2 && met >= ORBIT_MET + 5 ? 'CLEAR' : 'SHIELDED';
    T.controls = 'LOCKED';

    // attitude
    T.pitch = met <= 10 || ph === 0 ? 90 : !inOrbit ? 90 - 88 * Math.pow(x, 0.55) : 0.3 * n(ms, 13);
    T.roll = met < 10 || ph === 0 ? 0 : met < 25 && !inOrbit ? 30 * (met - 10) / 15 : !inOrbit ? 30 : -12 + 0.4 * n(ms, 14);
    T.yaw = ph === 4 ? Math.min(180, pe * 45) : 0.2 * n(ms, 15);
    if (ph === 4) T.pitch = 0.6 * n(ms, 16);
    const [lat, lon] = trackAt(met);
    T.lat = lat; T.lon = lon;
    T.latStr = Math.abs(lat).toFixed(2) + '° ' + (lat >= 0 ? 'N' : 'S');
    T.lonStr = Math.abs(lon).toFixed(2) + '° ' + (lon >= 0 ? 'E' : 'W');

    // comms & range
    let gs = STATIONS[0], best = 999;
    for (const s of STATIONS) { const d = Math.abs(((lon - s.lon + 540) % 360) - 180); if (d < best) { best = d; gs = s; } }
    T.station = ph >= 2 ? gs.n : 'GS-HQ';
    T.signal = ph === 0 ? -48 + 0.5 * n(ms, 17) : -70 + 3 * n(ms, 18);
    T.xband = T.signal - 6 + n(ms, 19);
    T.latency = ph === 0 ? 4 : 28 + 3 * n(ms, 20);
    T.datarate = 12.4 + 0.3 * n(ms, 21);
    T.wind = 8 + 3 * n(ms, 22);
    T.gust = T.wind + 4 + 2 * n(ms, 23);
    T.windDir = 240 + 8 * n(ms, 24);
    T.airTemp = 17.2 + 0.1 * n(ms, 25);
    T.shear = ph === 1 && met > 40 && met < 80 ? 'HIGH — IN LIMITS' : 'GO';
    T.padSt = ph === 0 ? 'SECURED' : ph === 1 && met < 6 ? 'HOT' : 'CLEAR';
    T.fts = ph <= 1 ? 'ARMED' : 'SAFED';
    T.tracking = ph === 0 ? 'PAD' : ph === 1 ? 'RADAR LOCK' : 'RELAY LINK';

    // status
    T.alarm = ph === 3 || ph === 4;
    T.status = [
      pollNow(e, met).every((v) => v != null) ? 'POLL COMPLETE — GO FOR LAUNCH'
        : hold ? 'TERMINAL COUNT — HOLD FOR GO/NO-GO POLL' : 'TERMINAL COUNT — GO/NO-GO POLL',
      met < -10 ? 'TERMINAL COUNT — GO FOR LAUNCH' : met < 0 ? 'AUTO SEQUENCE START' : met < MECO ? 'ASCENT — POWERED FLIGHT' : met < 162 ? 'ASCENT — NACELLES TO IDLE' : met < ORBIT_MET ? 'ASCENT — MAIN ENGINES' : 'ORBIT INSERTION',
      'NOMINAL ORBIT — ORBIT ' + Math.max(1, T.orbit) + ' OF ' + ORBITS,
      'MASTER ALARM — FUEL LOW',
      pe < 4 ? 'DE-ORBIT BURN — IGNITION SEQUENCE' : 'DE-ORBIT BURN — IN PROGRESS',
      'LOSS OF SIGNAL',
    ][ph];
    T.alarmText = ph === 3 ? 'MASTER ALARM · FUEL LOW · MAIN ' + mf.toFixed(1) + '% · BACKUP ' + bf.toFixed(1) + '%'
      : ph === 4 ? 'DE-ORBIT BURN · FUEL LOW · CHAMBER PRESSURE HIGH' : '';

    if (los) {
      for (const k of ['alt', 'vel', 'downrange', 'apogee', 'perigee', 'incl', 'periodMin', 'mainFuel', 'backupFuel', 'mainRate', 'backupRate',
        'mainPress', 'backupPress', 'thrust', 'chamber', 'accel', 'heat', 'bus', 'avionics', 'gField', 'coilAmps', 'coilTemp', 'cabinP',
        'cabinT', 'o2', 'pitch', 'roll', 'yaw', 'signal', 'xband', 'latency', 'datarate']) T[k] = null;
      for (const k of ['mainSt', 'nacSt', 'rcsSt', 'coilSt', 'windows', 'controls', 'station', 'tracking', 'latStr', 'lonStr', 'orbitStr', 'nextOrbit']) T[k] = '----';
      T.tracking = 'NO TRACK';
    }
    return T;
  }

  // ---------- event log ----------
  function evMet(ev) {
    if (ev.p < 3) return ev.m;
    return (ev.p === S.phase ? S.metStart : PHASES[ev.p].base) + ev.m;
  }
  // Poll results: on the GO/NO-GO scene page each station flips to GO on a timer; elsewhere G presses set them.
  const POLL_DELAY = 5; // seconds before the first station (Boosters & Vehicle) goes GO
  const POLL_GAP = 2;   // seconds between each station after that
  const POLL_COUNT_DELAY = 0.5;   // after the last GO ("go for launch"), the T-5 countdown starts
  const POLL_RELEASE = POLL_DELAY + POLL_GAP * (POLL.length - 1) + POLL_COUNT_DELAY;
  function pollNow(e, met) {
    return LOCK === 'poll' && S.phase === 0 ? POLL.map((_, i) => (e >= POLL_DELAY + POLL_GAP * i ? met : null)) : S.poll;
  }

  function doneEvents(T, station) {
    const list = [];
    pollNow(T.e, T.met).forEach((m, i) => { if (m != null) list.push({ p: 0, m, t: POLL[i] + ' — GO', l: 'g', s: i < 3 ? i + 1 : 0 }); });
    for (const ev of EVENTS) list.push(ev);
    return list
      .filter((ev) => (ev.p < S.phase || (ev.p === S.phase && evMet(ev) <= T.met + 0.01)))
      .filter((ev) => !station || !ev.s || ev.s === station)
      .sort((a, b) => (a.p - b.p) || (evMet(a) - evMet(b)));
  }

  // ---------- DOM ----------
  const fmtCache = {};
  const nf = (d) => fmtCache[d] || (fmtCache[d] = new Intl.NumberFormat('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
  const OK = ['GO', 'ACTIVE', 'CLEAR', 'LOCKED', 'READY', 'SAFED', 'SECURED', 'RADAR LOCK', 'RELAY LINK', 'PAD', 'ARMED', 'SAFE'];
  const WARN = ['ARMING', 'STANDBY', 'IGNITION', 'BURN', 'HOT', 'SHIELDED', 'HIGH — IN LIMITS'];
  const BAD = ['----', 'NO TRACK', 'NO-GO'];

  let els = {}, dirty = true, lastLogKey = '';

  function buildHeader(h) {
    const st = +h.dataset.station || 0;
    const sub = st ? `<div>CONSOLE ${h.dataset.call} · ${h.dataset.title}</div>` : '<div>FLIGHT DIRECTOR · MAIN DISPLAY</div>';
    h.innerHTML = `
      <div class="brand"><div class="logo">SPSS</div>
        <div class="sub"><div>MISSION CONTROL — SPSS HEADQUARTERS</div><div>MODEL 9 · SPSS.C9 · FLIGHT 001</div>${sub}</div></div>
      <div class="clock"><div class="lbl" data-t="clockLbl"></div><div class="big" data-t="metStr"></div></div>
      <div class="right"><div class="utc" data-t="utc"></div>
        <div class="chips">${st ? `<span class="pollchip">POLL <b data-pollv="${st - 1}"></b></span>` : ''}<span class="pill" data-t="phaseName"></span></div></div>`;
  }

  function buildTimeline(el) {
    el.innerHTML = '<div class="tl-line"><i></i></div>' + TIMELINE.map((ev) =>
      `<div class="tl-node"><div class="tl-name">${ev.t}</div><div class="tl-dot"></div><div class="tl-time">${fmtMET(ev.d)}</div></div>`).join('');
    els.tlNodes = [...el.querySelectorAll('.tl-node')];
    els.tlFill = el.querySelector('.tl-line i');
  }

  function injectOverlays() {
    const los = document.createElement('div');
    los.className = 'losbox';
    los.innerHTML = '<div class="l1">LOSS OF SIGNAL</div><div class="l2" data-t="losStr"></div><div class="l3">NO TELEMETRY · ALL DATA STALE</div>';
    document.body.appendChild(los);

    const help = document.createElement('div');
    help.className = 'help';
    help.innerHTML = LOCK ? `<h3>SPSS CONSOLE — CONTROLS</h3>
      <p style="color:var(--text);font-size:1rem;margin-bottom:1.2rem">THIS PAGE: ${LOCKS[LOCK].label}</p>
      <div class="keys">
        <div><kbd>R</kbd> RESTART SCENE (PRESS ON "ACTION")</div><div><kbd>F</kbd> FULLSCREEN · <kbd>H</kbd> HIDE THIS</div><div><kbd>M</kbd> MUTE ALARM SOUND (MAIN TV)</div>
      </div>
      <p>OPEN TABS OF THE SAME SCENE ON THIS COMPUTER RESTART TOGETHER.</p>` : `<h3>SPSS CONSOLE — CONTROLS</h3>
      <div class="phases">${PHASES.map((p, i) => `<div><kbd>${i + 1}</kbd> ${p.name}</div>`).join('')}</div>
      <div class="keys">
        <div><kbd>→</kbd><kbd>SPACE</kbd> NEXT PHASE</div><div><kbd>←</kbd> PREVIOUS PHASE</div>
        <div><kbd>R</kbd> RESTART PHASE (FOR RETAKES)</div><div><kbd>G</kbd> NEXT "GO" IN POLL · <kbd>⇧G</kbd> RESET</div>
        <div><kbd>]</kbd><kbd>[</kbd> SKIP CLOCK ±5 MIN</div><div><kbd>F</kbd> FULLSCREEN · <kbd>H</kbd> HIDE THIS</div>
      </div>
      <p>TABS ON THIS COMPUTER STAY IN SYNC. OTHER COMPUTERS NEED THE SAME KEY PRESSED.</p>`;
    document.body.appendChild(help);

    // Hidden scene switcher: invisible hot corner at bottom-left slides out a sidebar
    const file = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    const base = file.replace(/-(poll|launch|orbit|ending)$/, '');
    const nav = document.createElement('nav');
    nav.className = 'scenenav';
    const SCREENS = [['mainConsole', 'MAIN TV', 'FLIGHT DIRECTOR'], ['engineerone', 'ENG 1', 'FUEL'], ['engineertwo', 'ENG 2', 'RANGE'], ['engineerthree', 'ENG 3', 'GNC']];
    const screenLinks = SCREENS.map(([f, name, sub]) =>
      `<a href="${f}${LOCK ? '-' + LOCK : ''}.html" class="${base === f ? 'cur' : ''}">${name}<small>${sub}</small></a>`).join('');
    nav.innerHTML = `<div class="hot"></div><div class="tray"><div class="ttl">SWITCH SCREEN</div><div class="screens">${screenLinks}</div><div class="ttl">SWITCH SCENE</div>${
      Object.keys(LOCKS).map((s) => {
        const [name, desc] = LOCKS[s].label.split(' — ');
        return `<a href="${base}-${s}.html" class="${LOCK === s ? 'cur' : ''}">${name}<small>${desc}</small></a>`;
      }).join('')}</div>`;
    document.body.appendChild(nav);

  }

  function collect() {
    els.t = [...document.querySelectorAll('[data-t]')];
    els.bars = [...document.querySelectorAll('[data-bar]')];
    els.charts = [...document.querySelectorAll('canvas[data-chart]')];
    els.track = document.querySelector('canvas[data-track]');
    els.adi = document.querySelector('canvas[data-adi]');
    els.tanks = [...document.querySelectorAll('svg[data-tank]')];
    els.isMain = !!document.querySelector('header[data-station="0"]');
    els.logs = [...document.querySelectorAll('[data-log]')];
    els.poll = [...document.querySelectorAll('[data-pollv]')];
  }

  function setClass(el, cls) {
    if (el._cls === cls) return;
    el.classList.remove('ok', 'warn', 'crit');
    if (cls) el.classList.add(cls);
    el._cls = cls;
  }

  function render() {
    const now = Date.now();
    // GO/NO-GO page: on the main TV, once the poll finishes, roll straight into the T-5 countdown and liftoff.
    // Engineer screens stay held at T-5.
    if (LOCK === 'poll' && els.isMain && S.phase === 0 && now - S.start >= POLL_RELEASE * 1000) {
      S = Object.assign({}, S, { phase: 1, start: S.start + POLL_RELEASE * 1000, metStart: -5, poll: [-5, -5, -5, -5] });
      dirty = true;
    }
    const T = tel(now);
    const b = document.body.classList;
    for (const p of PHASES) b.toggle('ph-' + p.id, p.id === T.phaseId);
    b.toggle('alarm', T.alarm);
    b.toggle('los', T.los);
    b.toggle('hold', T.hold);

    for (const el of els.t) {
      const v = T[el.dataset.t];
      let txt;
      if (v == null) txt = '----';
      else if (typeof v === 'number') txt = nf(+el.dataset.d || 0).format(v);
      else txt = v;
      if (el._txt !== txt) { el.textContent = txt; el._txt = txt; }
      let cls = '';
      if (typeof v === 'number') {
        if (el.dataset.lo && v < +el.dataset.lo) cls = 'crit';
        if (el.dataset.hi && v > +el.dataset.hi) cls = 'crit';
      } else if (el.hasAttribute('data-st')) {
        cls = BAD.includes(txt) ? 'crit' : WARN.includes(txt) ? 'warn' : OK.includes(txt) ? 'ok' : '';
      }
      setClass(el, cls);
    }
    for (const el of els.bars) {
      const v = T[el.dataset.bar], max = +el.dataset.max || 100;
      const w = v == null ? 0 : clamp(v / max * 100, 0, 100);
      el.style[el.dataset.dir === 'v' ? 'height' : 'width'] = w.toFixed(2) + '%';   // data-dir="v": vertical tank
      setClass(el.parentElement, v != null && el.dataset.lo && v < +el.dataset.lo ? 'crit' : '');
    }
    for (const svg of els.tanks) {               // vertical tank gauge: fuel level inside one tank outline
      const v = T[svg.dataset.tank], f = v == null ? 0 : clamp(v / 100, 0, 1);
      const top = 2, bot = 150, y = bot - f * (bot - top);
      svg.querySelector('.liq').setAttribute('y', y.toFixed(2));
      svg.querySelector('.liq').setAttribute('height', (bot - y).toFixed(2));
      const surf = svg.querySelector('.surf');
      surf.setAttribute('y1', y.toFixed(2)); surf.setAttribute('y2', y.toFixed(2));
      surf.style.display = f > 0 && f < 1 ? '' : 'none';
    }
    const poll = pollNow(T.e, T.met);
    for (const el of els.poll) {
      const go = poll[+el.dataset.pollv] != null;
      const txt = go ? 'GO' : 'NO-GO';
      if (el._txt !== txt) { el.textContent = txt; el._txt = txt; }
      setClass(el, go ? 'ok' : 'crit');
    }
    if (els.tlNodes) {
      let lastDone = -1;
      els.tlNodes.forEach((node, i) => {
        const ev = TIMELINE[i];
        const done = ev.p < S.phase || (ev.p === S.phase && T.met >= ev.m);
        if (done) lastDone = i;
        node.classList.toggle('done', done);
        node.classList.toggle('lost', T.los && !done);
      });
      els.tlNodes.forEach((node, i) => node.classList.toggle('now', i === lastDone + 1 && !T.los));
      els.tlFill.style.width = (Math.max(0, lastDone) / (TIMELINE.length - 1) * 100) + '%';
    }

    const logKey = S.v + ':' + doneEvents(T, 0).length;
    if (logKey !== lastLogKey || dirty) {
      lastLogKey = logKey;
      for (const ol of els.logs) {
        const evs = doneEvents(T, +ol.dataset.log).reverse().slice(0, +ol.dataset.n || 8);
        ol.innerHTML = evs.map((ev, i) => `<li class="${ev.l || ''}${i === 0 && !dirty ? ' fresh' : ''}"><time>${fmtMET(evMet(ev))}</time><span>${ev.t}</span></li>`).join('');
      }
    }
    dirty = false;
    if (window.SPSS_onFrame) window.SPSS_onFrame(T);
  }

  // ---------- canvases ----------
  function fit(cv) {
    const dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    return [cv.getContext('2d'), w, h, dpr];
  }
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const PAL = () => [css('--accent'), css('--text'), css('--warn')];

  function drawChart(cv, now) {
    const [g, w, h, dpr] = fit(cv);
    const keys = cv.dataset.chart.split('|'), span = (+cv.dataset.span || 120) * 1000, N = 160;
    const series = keys.map(() => []);
    for (let i = 0; i <= N; i++) {
      const T = tel(now - span * (1 - i / N));
      keys.forEach((k, j) => series[j].push(T[k]));
    }
    let lo = cv.dataset.min != null ? +cv.dataset.min : Infinity, hi = cv.dataset.max != null ? +cv.dataset.max : -Infinity;
    if (cv.dataset.min == null || cv.dataset.max == null) {
      for (const s of series) for (const v of s) if (v != null) {
        if (cv.dataset.min == null) lo = Math.min(lo, v);
        if (cv.dataset.max == null) hi = Math.max(hi, v);
      }
      if (!isFinite(lo)) lo = 0;
      if (!isFinite(hi)) hi = 1;
      const minSpan = +cv.dataset.minspan || 1;
      if (hi - lo < minSpan) { const c = (hi + lo) / 2; lo = c - minSpan / 2; hi = c + minSpan / 2; }
      const p = (hi - lo) * 0.12;
      if (cv.dataset.min == null) lo -= p;
      if (cv.dataset.max == null) hi += p;
    }
    g.clearRect(0, 0, w, h);
    const L = 44 * dpr, R = 8 * dpr, Tp = 8 * dpr, B = 8 * dpr, pw = w - L - R, phh = h - Tp - B;
    g.strokeStyle = 'rgba(255,255,255,0.09)'; g.lineWidth = 1 * dpr;
    g.fillStyle = css('--muted'); g.font = `500 ${11 * dpr}px 'Oxanium', sans-serif`; g.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const y = Tp + phh * i / 4;
      g.beginPath(); g.moveTo(L, y); g.lineTo(w - R, y); g.stroke();
      const val = hi - (hi - lo) * i / 4;
      g.fillText(Math.abs(hi - lo) < 10 ? val.toFixed(1) : Math.round(val), 4 * dpr, y);
    }
    const colors = (cv.dataset.colors || '').split('|').map((c) => c && css(c));
    const pal = PAL();
    series.forEach((s, j) => {
      g.strokeStyle = colors[j] || pal[j % pal.length]; g.lineWidth = 2 * dpr; g.lineJoin = 'round';
      g.beginPath(); let pen = false;
      s.forEach((v, i) => {
        if (v == null) { pen = false; return; }
        const X = L + pw * i / N, Y = Tp + phh * (1 - (v - lo) / (hi - lo));
        if (pen) g.lineTo(X, Y); else g.moveTo(X, Y);
        pen = true;
      });
      g.stroke();
    });
  }

  function drawTrack(cv, now) {
    const [g, w, h, dpr] = fit(cv), T = tel(now);
    g.clearRect(0, 0, w, h);
    const X = (lon) => (lon + 180) / 360 * w, Y = (lat) => (90 - lat) / 180 * h;
    g.lineWidth = 1 * dpr; g.font = `${10 * dpr}px 'Oxanium', sans-serif`; g.fillStyle = css('--muted');
    for (let lon = -180; lon <= 180; lon += 30) {
      g.strokeStyle = lon === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)';
      g.beginPath(); g.moveTo(X(lon), 0); g.lineTo(X(lon), h); g.stroke();
      if (lon > -180 && lon < 180) g.fillText(Math.abs(lon) + (lon < 0 ? 'W' : lon > 0 ? 'E' : ''), X(lon) + 3 * dpr, h - 5 * dpr);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      g.strokeStyle = lat === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)';
      g.beginPath(); g.moveTo(0, Y(lat)); g.lineTo(w, Y(lat)); g.stroke();
      g.fillText(Math.abs(lat) + (lat < 0 ? 'S' : lat > 0 ? 'N' : ''), 3 * dpr, Y(lat) - 5 * dpr);
    }
    g.strokeStyle = 'rgba(255,255,255,0.12)'; g.setLineDash([4 * dpr, 4 * dpr]);
    for (const lat of [51.6, -51.6]) { g.beginPath(); g.moveTo(0, Y(lat)); g.lineTo(w, Y(lat)); g.stroke(); }
    g.setLineDash([]);
    for (const s of STATIONS) {
      const sx = X(s.lon), sy = Y(s.lon === -86 ? 39.77 : s.lon === -157 ? 21 : s.lon === 145 ? 13 : s.lon === 116 ? -32 : s.lon === -4 ? 40 : s.lon === 28 ? -26 : -33);
      g.strokeStyle = css('--muted'); g.strokeRect(sx - 3 * dpr, sy - 3 * dpr, 6 * dpr, 6 * dpr);
      g.fillText(s.n.replace('GS-', ''), sx + 6 * dpr, sy + 3 * dpr);
    }
    const path = (from, to, color, dash) => {
      g.strokeStyle = color; g.lineWidth = 2 * dpr; g.setLineDash(dash || []);
      g.beginPath(); let prev = null;
      for (let m = from; m <= to; m += 30) {
        if (m < 0) continue;
        const [la, lo] = trackAt(m);
        if (prev == null || Math.abs(lo - prev) > 180) g.moveTo(X(lo), Y(la)); else g.lineTo(X(lo), Y(la));
        prev = lo;
      }
      g.stroke(); g.setLineDash([]);
    };
    if (T.ph >= 1 && T.met > 0) {
      path(T.met - PERIOD, T.met, css('--accent'));
      if (!T.los) path(T.met, T.met + PERIOD * 0.9, 'rgba(255,255,255,0.35)', [6 * dpr, 6 * dpr]);
    }
    const sx = X(T.lon), sy = Y(T.lat);
    const c = T.los ? css('--alarm') : css('--text');
    g.strokeStyle = c; g.fillStyle = c; g.lineWidth = 2 * dpr;
    g.beginPath(); g.arc(sx, sy, 7 * dpr, 0, Math.PI * 2); g.stroke();
    g.fillRect(sx - 2.5 * dpr, sy - 2.5 * dpr, 5 * dpr, 5 * dpr);
    g.font = `${12 * dpr}px 'Oxanium', sans-serif`;
    g.fillText(T.los ? 'SPSS.C9 LAST KNOWN' : 'SPSS.C9', sx + 11 * dpr, sy - 9 * dpr);
  }

  function drawADI(cv, now) {
    const [g, w, h, dpr] = fit(cv), T = tel(now);
    g.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 14 * dpr;
    const pitch = T.pitch == null ? 0 : T.pitch, roll = T.roll == null ? 0 : T.roll;
    const ppd = r / 45; // pixels per degree of pitch
    g.save();
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.clip();
    g.translate(cx, cy); g.rotate(-roll * D2R); g.translate(0, pitch * ppd);
    g.fillStyle = T.los ? 'rgba(255,59,59,0.10)' : 'rgba(79,179,255,0.16)'; g.fillRect(-2 * r, -4 * r, 4 * r, 4 * r);
    g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(-2 * r, 0, 4 * r, 4 * r);
    g.strokeStyle = css('--text'); g.lineWidth = 2 * dpr;
    g.beginPath(); g.moveTo(-2 * r, 0); g.lineTo(2 * r, 0); g.stroke();
    g.lineWidth = 1 * dpr; g.fillStyle = css('--muted'); g.font = `${10 * dpr}px 'Oxanium', sans-serif`; g.textBaseline = 'middle';
    for (let p = -90; p <= 90; p += 10) {
      if (!p) continue;
      const y = -p * ppd, len = (p % 30 === 0 ? 0.45 : 0.25) * r;
      g.strokeStyle = 'rgba(255,255,255,0.4)';
      g.beginPath(); g.moveTo(-len, y); g.lineTo(len, y); g.stroke();
      if (p % 30 === 0) g.fillText(Math.abs(p), len + 4 * dpr, y);
    }
    g.restore();
    g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 1 * dpr;
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    for (const a of [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60]) {
      const ang = (a - 90) * D2R, l = a % 30 === 0 ? 12 : 7;
      g.beginPath(); g.moveTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      g.lineTo(cx + Math.cos(ang) * (r + l * dpr), cy + Math.sin(ang) * (r + l * dpr)); g.stroke();
    }
    g.strokeStyle = css('--warn'); g.lineWidth = 3 * dpr;
    g.beginPath(); g.moveTo(cx - r * 0.45, cy); g.lineTo(cx - r * 0.15, cy); g.lineTo(cx - r * 0.08, cy + r * 0.08);
    g.moveTo(cx + r * 0.45, cy); g.lineTo(cx + r * 0.15, cy); g.lineTo(cx + r * 0.08, cy + r * 0.08); g.stroke();
    g.fillStyle = css('--warn'); g.fillRect(cx - 2 * dpr, cy - 2 * dpr, 4 * dpr, 4 * dpr);
  }

  function drawAll() {
    const now = Date.now();
    for (const cv of els.charts) drawChart(cv, now);
    if (els.track) drawTrack(els.track, now);
    if (els.adi) drawADI(els.adi, now);
  }

  // ---------- input ----------
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (LOCK && !'rRfFhH?'.includes(k)) return;      // scene pages never change phase
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') setPhase(S.phase + 1);
    else if (k === 'ArrowLeft' || k === 'PageUp') setPhase(S.phase - 1, true);
    else if (k >= '1' && k <= String(PHASES.length)) setPhase(+k - 1, true);
    else if (k === 'r' || k === 'R') setPhase(S.phase, true);
    else if (k === 'G') { S.poll = [null, null, null, null]; save(); }
    else if (k === 'g') { const i = S.poll.indexOf(null); if (i >= 0) { S.poll[i] = tel(Date.now()).met; save(); } }
    else if (k === ']') { S.offset += 300; save(); }
    else if (k === '[') { S.offset -= 300; save(); }
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
    else if (k === 'h' || k === 'H' || k === '?') document.body.classList.toggle('show-help');
    else return;
    e.preventDefault();
    render();
  }

  let idle;
  function wake() {
    document.body.classList.remove('nocursor');
    clearTimeout(idle);
    idle = setTimeout(() => document.body.classList.add('nocursor'), 2000);
  }

  function init() {
    const h = document.querySelector('header[data-station]');
    if (h) buildHeader(h);
    const tl = document.getElementById('timeline');
    if (tl) buildTimeline(tl);
    injectOverlays();
    collect();
    const q = new URLSearchParams(location.search).get('phase');
    if (q != null && !LOCK) {
      const i = isNaN(+q) ? PHASES.findIndex((p) => p.id === q) : +q - 1;
      if (i >= 0 && i !== S.phase) setPhase(i, true);
    }
    addEventListener('keydown', onKey);
    addEventListener('mousemove', wake);
    wake();
    render(); drawAll();
    setInterval(render, 100);
    setInterval(drawAll, 200);
    if (document.fonts) document.fonts.ready.then(drawAll);
  }

  window.SPSS = { tel, setPhase, PHASES, get state() { return S; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

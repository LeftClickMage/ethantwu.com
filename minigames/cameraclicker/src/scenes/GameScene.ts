import Phaser from "phaser";

type Upgrade = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  perClickBonus: number;
  perSecondBonus: number;
  owned: number;
};

export class GameScene extends Phaser.Scene {
  private photos = 0;
  private perClick = 1;
  private perSecond = 0;

  private photosText!: Phaser.GameObjects.Text;
  private rateText!: Phaser.GameObjects.Text;
  private cameraSprite!: Phaser.GameObjects.Image;
  private upgradeButtons: Phaser.GameObjects.Container[] = [];

  private upgrades: Upgrade[] = [
    {
      id: "lens",
      name: "Sharper Lens",
      description: "+1 photo per click",
      baseCost: 10,
      costGrowth: 1.15,
      perClickBonus: 1,
      perSecondBonus: 0,
      owned: 0,
    },
    {
      id: "tripod",
      name: "Auto Tripod",
      description: "+1 photo/sec",
      baseCost: 50,
      costGrowth: 1.2,
      perClickBonus: 0,
      perSecondBonus: 1,
      owned: 0,
    },
    {
      id: "drone",
      name: "Camera Drone",
      description: "+10 photos/sec",
      baseCost: 500,
      costGrowth: 1.25,
      perClickBonus: 0,
      perSecondBonus: 10,
      owned: 0,
    },
    {
      id: "studio",
      name: "Photo Studio",
      description: "+50 photos/click",
      baseCost: 2500,
      costGrowth: 1.3,
      perClickBonus: 50,
      perSecondBonus: 0,
      owned: 0,
    },
  ];

  constructor() {
    super("GameScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, 40, "Camera Clicker", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0);

    this.photosText = this.add
      .text(width / 2, 90, "0 photos", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "28px",
        color: "#f5f5f5",
      })
      .setOrigin(0.5, 0);

    this.rateText = this.add
      .text(width / 2, 130, "+1 / click  |  0 / sec", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        color: "#9aa0a6",
      })
      .setOrigin(0.5, 0);

    this.cameraSprite = this.add.image(width * 0.32, height * 0.55, "digicam").setInteractive({ useHandCursor: true }).setScale(5);

    this.cameraSprite.on("pointerdown", () => this.handleClick());

    this.buildUpgradePanel();

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.perSecond > 0) {
          this.photos += this.perSecond * 0.1;
          this.refreshHud();
        }
      },
    });

    this.scale.on("resize", this.handleResize, this);
  }

  private handleClick(): void {
    this.photos += this.perClick;
    this.tweens.add({
      targets: this.cameraSprite,
      scale: { from: 5.25, to: 5 },
      duration: 120,
      ease: "Quad.easeOut",
    });
    this.spawnFloatingNumber(this.perClick);
    this.refreshHud();
  }

  private spawnFloatingNumber(value: number): void {
    const txt = this.add
      .text(this.cameraSprite.x, this.cameraSprite.y - 80, `+${value}`, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "24px",
        color: "#3aa0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: txt,
      y: txt.y - 60,
      alpha: 0,
      duration: 700,
      onComplete: () => txt.destroy(),
    });
  }

  private buildUpgradePanel(): void {
    this.upgradeButtons.forEach((b) => b.destroy());
    this.upgradeButtons = [];

    const { width, height } = this.scale;
    const panelX = width * 0.65;
    const startY = height * 0.25;
    const spacing = 90;

    this.upgrades.forEach((u, i) => {
      const container = this.add.container(panelX, startY + i * spacing);
      const bg = this.add
        .rectangle(0, 0, 340, 78, 0x2a2a30)
        .setStrokeStyle(2, 0x444450)
        .setInteractive({ useHandCursor: true });
      const title = this.add
        .text(-155, -26, `${u.name}`, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0, 0);
      const desc = this.add
        .text(-155, -4, u.description, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
          color: "#9aa0a6",
        })
        .setOrigin(0, 0);
      const cost = this.add
        .text(-155, 18, "", {
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
          color: "#f5c542",
        })
        .setOrigin(0, 0);
      const owned = this.add
        .text(155, 0, "", {
          fontFamily: "system-ui, sans-serif",
          fontSize: "20px",
          color: "#3aa0ff",
          fontStyle: "bold",
        })
        .setOrigin(1, 0.5);

      bg.on("pointerdown", () => this.buyUpgrade(u));
      bg.on("pointerover", () => bg.setFillStyle(0x33333a));
      bg.on("pointerout", () => bg.setFillStyle(0x2a2a30));

      container.add([bg, title, desc, cost, owned]);
      container.setData("upgrade", u);
      container.setData("costText", cost);
      container.setData("ownedText", owned);
      this.upgradeButtons.push(container);
    });

    this.refreshHud();
  }

  private currentCost(u: Upgrade): number {
    return Math.ceil(u.baseCost * Math.pow(u.costGrowth, u.owned));
  }

  private buyUpgrade(u: Upgrade): void {
    const cost = this.currentCost(u);
    if (this.photos < cost) return;
    this.photos -= cost;
    u.owned++;
    this.perClick += u.perClickBonus;
    this.perSecond += u.perSecondBonus;
    this.refreshHud();
  }

  private refreshHud(): void {
    this.photosText.setText(`${Math.floor(this.photos)} photos`);
    this.rateText.setText(
      `+${this.perClick} / click  |  ${this.perSecond} / sec`
    );
    this.upgradeButtons.forEach((c) => {
      const u = c.getData("upgrade") as Upgrade;
      const costText = c.getData("costText") as Phaser.GameObjects.Text;
      const ownedText = c.getData("ownedText") as Phaser.GameObjects.Text;
      const cost = this.currentCost(u);
      costText.setText(`Cost: ${cost}`);
      ownedText.setText(`x${u.owned}`);
      const affordable = this.photos >= cost;
      costText.setColor(affordable ? "#7CFC8E" : "#f5c542");
    });
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;
    this.photosText.setX(width / 2);
    this.rateText.setX(width / 2);
    this.cameraSprite.setPosition(width * 0.32, height * 0.55);
    const panelX = width * 0.65;
    const startY = height * 0.25;
    this.upgradeButtons.forEach((c, i) => c.setPosition(panelX, startY + i * 90));
  }
}

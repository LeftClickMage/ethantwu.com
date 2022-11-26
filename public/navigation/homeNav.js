
document.write(`
  <style>
  
  .font-increase-2x{
    font-size:150%;
  }

      #navigationBar{
        background-color:rgba(248,249,250,0.85);
        transition: background-color 400ms;
        z-index: 19;
      }
      #navigationBar:hover{
        background-color:rgba(248,249,250,1);
        transition: background-color 500ms;
      }
  </style>
  <nav class="navbar navbar-expand-md navbar-light p-0 m-0 position-fixed w-100 top-0" id="navigationBar">
  <div class="container-fluid">
    <a class="navbar-brand repathHREF" href="/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">
    <img src="/public/logos/lcm-logo.png" width="70px" class="repathIMG">
    </a>
    <a class="navbar-brand" href="https://smasher.ethantwu.com" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Smasher Minigame">
      <img src="/public/logos/smasher-logo.png" width="70px" class="repathIMG">
      </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link font-increase-2x repathHREF" href="/fairopbot.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="FairOPBot" id="discordBot">Discord Bot</a>
          </li>
          <li class="nav-item">
            <a class="nav-link font-increase-2x repathHREF" href="/minigames/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Minigames" id="minigames">Minigames</a>
          </li>
         
        </ul>
      </div>

  </div>
</nav>


`);

var spliter = String(window.location);
spliter = spliter.split('/')
while(true){
  if (spliter[spliter.length-1] != "www.ethantwu.com" ||spliter[spliter.length-1] != "ethantwu.com" ){
    spliter.pop();
  } else {
    break;
  }
}
var path;
for(let i = 0; i < spliter.length; i++){
  path += spliter[i] + "/";
}
path = path.replace("undefined", "");
path = path.substring(0, path.length-1);

const outer = document.querySelectorAll('.repathIMG');
for(let i = 0; i<outer.length; i++){

  var src=outer[i].src;
  if (src.startsWith("file://")){
    src= src.replace("file://", "");
  }
  outer[i].setAttribute("src", path+src);

  }
const inner = document.querySelectorAll('.repathHREF');
for(let i = 0; i<inner.length; i++){

   var href=inner[i].getAttribute('href');
   if(href.startsWith("file://")){
    href= href.replace("file://", "");
   }
    inner[i].setAttribute("href", path+href);

  }
  


  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
  if(document.title == "Ethan Twu - FairOPBot"){
    document.getElementById('discordBot').classList.add("active");
  } else if(document.title == "Ethan Twu - Minigames"){
    document.getElementById('minigames').classList.add("active");
  }
// var penguinPath = "file:///media/fuse/crostini_e202c9d5225290161ded36479c47b60d686ceb00_termina_penguin/ethantwu.com/";
var penguinPath = "https://ethantwu.com/";

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
      .tooltip-inner {
    max-width: 100% !important;
}
  </style>
  <nav class="navbar navbar-expand-md navbar-light p-0 m-0 position-fixed w-100 top-0" id="navigationBar">
  <div class="container-fluid">
    <a class="navbar-brand hrefRepath" href="index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">
    <img src="public/logos/lcm-logo.png" width="70px" class="imgRepath">
    </a>
    <a class="navbar-brand" href="https://smasher.ethantwu.com" data-bs-toggle="tooltip"  data-bs-container="body" data-bs-placement="bottom" data-bs-html ="true" title="<span class='badge bg-warning'>BETA</span> Smasher Minigame">
      <img src="public/logos/smasher-logo.png" width="70px" class="imgRepath">
      </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link font-increase-2x hrefRepath" href="fairopbot.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="FairOPBot" id="discordBot">Discord Bot</a>
          </li>
          <li class="nav-item">
            <a class="nav-link font-increase-2x hrefRepath" href="minigames/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Minigames" id="minigames">Minigames</a>
          </li>
         
          
        </ul>
        <ul class="navbar-nav ms-auto me-1">
          <a class="hrefRepath" href="media.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Social Media" ><button class="btn btn-danger fs-4">Media</button></a>
        </ul>
      </div>

  </div>
</nav>


`);
var elements = document.querySelectorAll(".hrefRepath");
for(let i =0; i<elements.length; i++){
  elements[i].setAttribute("href", penguinPath + elements[i].getAttribute("href"));
}

var elements = document.querySelectorAll(".imgRepath");
for(let i =0; i<elements.length; i++){
  elements[i].setAttribute("src", penguinPath + elements[i].getAttribute("src"));
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
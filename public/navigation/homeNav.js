//var penguinPath = "http://localhost:8001/";
var penguinPath = "https://ethantwu.com/";



//248,249,250,0.85
document.write(`
  <style>
  
  .font-increase-2x{
    font-size:150%;
  }

      #navigationBar{
        background-color:rgba(0, 0, 0, 0.8);
        transition: background-color 400ms;
        z-index: 19;
      }
      #navigationBar:hover{
        background-color:rgba(0,0,0,1);
        transition: background-color 500ms;
      }
      .tooltip-inner {
    max-width: 100% !important;
}
  </style>

  <nav class="border border-5 border-light border-top-0 border-start-0 border-end-0 navbar navbar-expand-md navbar-dark p-0 m-0 position-fixed top-0 w-100" id="navigationBar">
  <div class="container-fluid">
    <a class="navbar-brand hrefRepath" href="index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">
    <img src="public/logos/lcm-logo.png" width="70px" class="imgRepath">
    </a>
    <!--<a class="navbar-brand" href="https://smasher.ethantwu.com" data-bs-toggle="tooltip"  data-bs-container="body" data-bs-placement="bottom" data-bs-html ="true" title="<span class='badge bg-warning'>BETA</span> Smasher Minigame">
      <img src="public/logos/smasher-logo.png" width="70px" class="imgRepath">
      </a>-->


    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="false" aria-label="Toggle navigation" id="testing">
      <img src="public/navigation/navbarOpen.png" class="imgRepath pixelArt" width = "60" id="navbarToggler">
      </button>

      
      <div class="navbar-collapse collapse" id="collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link font-increase-2x hrefRepath" href="classes/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Classes" id="classes">Classes</a>
          </li>
          
          <li class="nav-item">
            <a class="nav-link font-increase-2x hrefRepath" href="minigames/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Minigames" id="minigames">Minigames</a>
          </li>
          <li class="nav-item">
            <a class="nav-link font-increase-2x hrefRepath" href="projects.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Projects" id="projects">Projects</a>
          </li>
          <li class="nav-item">
            <a class="nav-link font-increase-2x hrefRepath" href="fairopbot.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="FairOPBot" id="discordBot">Discord Bot</a>
          </li>
          
        </ul>
        <ul class="navbar-nav ms-auto me-1 mb-3 mb-md-0">
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


  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  })
  if(document.title == "Ethan Twu - FairOPBot"){
    document.getElementById('discordBot').classList.add("active");
  } else if(document.title == "Ethan Twu - Minigames"){
    document.getElementById('minigames').classList.add("active");
  } else if(document.title == "Ethan Twu - Projects"){
    document.getElementById('projects').classList.add("active");
  } else if(document.title == "Ethan Twu - Classes"){
    document.getElementById('classes').classList.add("active");
  }

      var toggler = document.getElementById("navbarToggler");
      var navbarCollapse = document.getElementById('collapse');

  function changeRotation(){
    if(navbarCollapse.classList.contains('show')){
      toggler.src = penguinPath + "public/navigation/navbarClose.png";
    } else {
      toggler.src = penguinPath + "public/navigation/navbarOpen.png";
    }
    requestAnimationFrame(changeRotation);
  }

changeRotation();
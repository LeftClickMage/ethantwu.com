document.write(`
    <style>
        @keyframes fadeInNavbar{
            from {
                opacity:0%;
                transform: rotate(180deg) scale(0);
            }
            to{
                opacity:100%;
                transform: rotate(360deg) scale(1);
            }
        }
        @keyframes fadeOutNavbar{
            from {
                opacity:100%;
                transform: rotate(0deg) scale(1);
            }
            to{
                opacity:0%;
                transform: rotate(180deg) scale(0);
            }
        }
            
            .font-increase-2x{
                  font-size:150%;
            }

            #navigationBar{
                  background-color:rgba(0, 0, 0, 0.75);
                  transition: background-color 400ms;
                  z-index: 10000;

            }
            #navigationBar:hover{
                  background-color:rgba(0,0,0,1);
                  transition: background-color 500ms;
            }
      
            .homeLogoNavbar{
                  transition:0.3s;
            }

            .homeLogoNavbar:hover{
                  -webkit-filter: drop-shadow(0px 0px 15px #FFFFFF);
                  filter: drop-shadow(0px 0px 15px #FFFFFF);
                  cursor:pointer;
            }

            .fadeInNavbar {
                  animation: fadeInNavbar 0.35s ease-in-out forwards; 
            }
            .fadeOutNavbar {
                  animation: fadeOutNavbar 0.35s ease-in-out forwards; 
            }
      </style>

    <nav class="border border-5 border-light border-top-0 border-start-0 border-end-0 navbar navbar-expand-md navbar-dark p-0 m-0 position-fixed top-0 w-100" id="navigationBar" style="overflow:visible !important;">
        <div class="container-fluid" style="overflow:visible !important;">
            <a class="navbar-brand" href="/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home" style="overflow:visible !important;">
                <img src="/public/logos/lcm-logo.png" width="90px" class = "homeLogoNavbar" style="overflow:visible !important; padding:10px; margin:-10px;">
            </a>

            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="false" aria-label="Toggle navigation" id="testing" style="overflow:visible !important;">
                <img src="/public/navigation/navbarOpen.png" class="pixelArt homeLogoNavbar" width = "80" id="navbarToggler" style="overflow:visible !important; padding:10px; margin:-10px;">
            </button>

      
            <div class="navbar-collapse collapse" id="collapse">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="/projects/shortfilms.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Short Films" id="shortfilms">Short Films</a>
                    </li>
                  
                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="/minigames/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Minigames" id="minigames">Minigames</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="/projects.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Projects" id="projects">Projects</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="/fairopbot.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="FairOPBot" id="discordBot">Discord Bot</a>
                    </li>
                    
                </ul>
                <ul class="navbar-nav ms-auto me-1 mb-3 mb-md-0">
                    <a href="/media.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Social Media" ><button class="btn btn-danger fs-4">Media</button></a>
                </ul>
            </div>

        </div>
    </nav>


`);



if(document.title == "Ethan Twu - FairOPBot"){
    document.getElementById('discordBot').classList.add("active");
} else if(document.title == "Ethan Twu - Minigames"){
    document.getElementById('minigames').classList.add("active");
} else if(document.title == "Ethan Twu - Projects"){
    document.getElementById('projects').classList.add("active");
} else if(document.title == "Ethan Twu's Projects - Short Films"){
    document.getElementById('shortfilms').classList.add("active");
}

  
var toggler = document.getElementById("navbarToggler");
var navbarCollapse = document.getElementById('collapse');

var readyToSetNavbarIcon = true;
var navbarExpanded;

function changeRotation(){
    
    if(navbarCollapse.classList.contains('show') && readyToSetNavbarIcon){
        navbarExpanded = true;
        setNavbarIconType("closed");
    } else if (readyToSetNavbarIcon) {
        navbarExpanded = false;
        setNavbarIconType("open");
    }
    
    requestAnimationFrame(changeRotation);
}


changeRotation();

async function fadingNavbar(value){
    toggler.classList.remove('fadeInNavbar');
    toggler.classList.add('fadeOutNavbar');
    await downtime(350);
    readyToSetNavbarIcon = true;
    
    setNavbarIconType(value);
  
    toggler.classList.remove('fadeOutNavbar');
    toggler.classList.add('fadeInNavbar');
}

function setNavbarIconType(value){
  if(value == "open"){
    toggler.src = "/public/navigation/navbarOpen.png";
  } else if (value == "closed") {
    toggler.src = "/public/navigation/navbarClose.png";
  }
}


document.getElementById("navbarToggler").addEventListener("click", (event)=>{
    readyToSetNavbarIcon = false;
    if(!navbarExpanded){
        fadingNavbar("closed");
    } else {
        fadingNavbar("open");
    }
});
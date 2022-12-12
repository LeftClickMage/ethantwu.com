document.write(`

    <div id = "loading" style="position:fixed; top:0; left: 0; width:100vw; height:100vh; z-index:999999999999; background-color:white;">
    <p class="display-5 fw-bold" style="position:absolute; left:50%; top:50%; transform: translate(-50%,-50%);" id = "loadingDivtext">Please wait for the page to load.</p>

    </div>
`);
document.body.setAttribute("style", "margin:0;")
function removeLoading(){
    document.body.removeChild(document.getElementById('loading'));
}
document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    document.getElementById('loadingDivtext').innerHTML = "Almost done!";
  } else if (document.readyState === 'complete') {
    removeLoading();
  }
}
document.write(`
    <div id = "loading" style="position:fixed; top:0; left: 0; width:100vw; height:100vh; z-index:99999; background-color:white;">
    </div>
`);
document.body.setAttribute("style", "margin:0;")
function removeLoading(){
    document.body.removeChild(document.getElementById('loading'));
}
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    removeLoading();
  }
}
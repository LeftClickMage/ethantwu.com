if(window.location.hostname == "localhost"){
    window.addEventListener('error', function(event) {
      alert("Error:" + event.message + "\nSource: " + event.filename + "\nLine:" + event.lineno + "Column:" + event.colno + "\nError object:" + event.error + "\nError Trace: " + event.error.stack);  
   });
}

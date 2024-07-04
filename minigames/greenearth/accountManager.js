
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, set, ref, update, onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
  //auth and database?
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDoevajRqmzVQJwAINFwqydESwdLaFwBCg",
    authDomain: "login-data-for-ethantwu.firebaseapp.com",
    projectId: "login-data-for-ethantwu",
    storageBucket: "login-data-for-ethantwu.appspot.com",
    messagingSenderId: "971447062094",
    appId: "1:971447062094:web:b8ec76707b3260e730fd1f",
    databaseURL: "https://login-data-for-ethantwu-default-rtdb.firebaseio.com",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
 
  

login.addEventListener("click", (event) => {


        var username = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    update(ref(database, 'users/' + user.uid), {
        last_login: new Date()
    });

   // alert("SIGN IN CREWAWERSDF");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });


});





signUps.addEventListener("click", (event) => {

event.preventDefault();
        var username = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        if(validateInput(email) == false || validatePass(password) == false){
            alert("Input Valid Details");
            return;
        }


createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;// Signed up 
    
   set(ref(database, 'users/' + user.uid), {
       username: username,
      email: email,
      cash: player.cash,
      levels: [player.houseLevel, player.highestWave, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
     last_login: new Date(),
     
  });

    // alert("USER CREWAWERSDF");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });


});

const user = auth.currentUser;
onAuthStateChanged(auth, (user) =>{
    
    if(user){
        const uid = user.uid;
        return onValue(ref(database, '/users/' + uid), (snapshot) => {
       var data = snapshot.val();
        player.username = data.username;
        player.cash = data.cash;
        player.houseLevel = data.levels[0];
        player.uid = uid;
        player.highestWave = data.levels[1];
        accDetected(true);
  // ...
        }, {
      onlyOnce: true
    });
    } else {
      player.username = "Guest";
        player.cash = 0;
        player.houseLevel = 0;
        player.uid = "";
        player.highestWave = 0;
        accDetected(false);
    }
});

logout.addEventListener("click", (event)=>{
    signOut(auth).then(()=>{
        // alert("SIGN OUT");
    }).catch((error)=>{
        alert("EROR");
    });
});


// // const userId = auth.currentUser.uid;

export function updateData(){
  update(ref(database, 'users/' + player.uid), {
        cash: player.cash,
        levels: [player.houseLevel, player.highestWave, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    })
    .then(()=>{
        // alert("Updated Data");
    })
    .catch((error)=>{
        alert(error.message);
    })
}

function validatePass(password){
    if(password.length < 6){
        return false;
    } else {
        return true;
    }
}
function validateInput(value){
    if(value == null){
        return false;
    } 
    if(value <=0) {
        return false;
    } else {
        return true;
    }
}


window.updateData = updateData;

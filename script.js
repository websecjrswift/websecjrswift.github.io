import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDKrXtP70xM20FlTuHt0RuQrT2vVUStVGk",

    authDomain: "practice-fc54e.firebaseapp.com",

    databaseURL: "https://practice-fc54e-default-rtdb.firebaseio.com",

    projectId: "practice-fc54e",

    storageBucket: "practice-fc54e.appspot.com",

    messagingSenderId: "433900705046",

    appId: "1:433900705046:web:28781fa4b152f6f07aac37"

};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);

let titleRef = rtdb.ref(db, "/");
let chats = rtdb.child(titleRef, "chats")

rtdb.onValue(chats, ss=>{
  //alert(JSON.stringify(ss.val()));
  let msgarray = (ss.val());
  let newarr = Object.values(msgarray);
  console.log(Object.values(msgarray));
  let msgList = "";
  for (var i = 0, msgg; msgg = newarr[i]; i++) {
    msgList += "<li>" + msgg + "</li>";
  }
  document.querySelector("#chatsloc").innerHTML = msgList;
})

var clickHandlerMSG = function(){
  var msg = document.querySelector("#msg").value;
  rtdb.push(chats, msg);
}

var clickHandlerClear = function(){
  var msg = document.querySelector("#msg").value;
  rtdb.set(chats, []);
  document.querySelector("#chatsloc").innerHTML = "no messages";
}

document.querySelector("#sendmsg").addEventListener("click", clickHandlerMSG);
document.querySelector("#clear").addEventListener("click", clickHandlerClear);

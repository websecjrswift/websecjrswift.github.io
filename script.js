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
$("#chatsloc").html("no messages");


var clickHandlerUser = function(){
  var username = $("#usertext").val();
  $("#usernamedisplay").html("hello " + username);
}

var clickHandlerMSG = function(){
  console.log(username);
  var msg = $("#msg").val();
  var username = $("#usertext").val();
  var chatmsg = {message: msg, User: username};
  //console.log(chatmsg);
  rtdb.push(chats, chatmsg);
}

rtdb.onValue(chats, ss=>{
  //alert(JSON.stringify(ss.val()));
  $("#chatsloc").empty();
  ss.forEach(function(el){
    let msg = JSON.stringify(el.val().message);
    let user = JSON.stringify(el.val().User);
    let userinput = user.replace(/"/g, '');
    $("#chatsloc").append("<li>" + userinput + ":" + msg + "</li>");
  })
})


var clickHandlerClear = function(){
  var msg = $("#msg").val();
  rtdb.set(chats, []);
  $("#chatsloc").html("no messages");
}

$("#sendmsg").click(clickHandlerMSG);
$("#clear").click(clickHandlerClear);
$("#inputuser").click(clickHandlerUser);

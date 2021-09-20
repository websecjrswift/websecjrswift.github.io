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
let users = rtdb.child(titleRef, "users")

$("#chatsloc").html("no messages");

var clickHandlerUser = function(){
  var username = $("#usertext").val();
  let usertext = $("#usernamedisplay").text();
  if (usertext == '') {
    rtdb.push(users, username);
  }
  else 
  {
    alert("you are already signed in");
  }
  //$("#usernamedisplay").html(username);
}

var clickHandlerMSG = function(){
  console.log(username);
  var msg = $("#msg").val();
  var username = $("#usernamedisplay").text();
  var chatmsg = {message: msg, User: username};
  rtdb.push(chats, chatmsg);
}

var clickHandlerEdit = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let msg = this.innerHTML;
  let ind = msg.indexOf(":");
  let msgUser = msg.slice(0, ind);
  var username = $("#usernamedisplay").text();
  if (username == msgUser){
    let edit = window.prompt("Edit your Message","");
    this.innerHTML = username + ':"' + edit + '"';
    let message = rtdb.ref(db, "chats/" + curID + "/message");
    rtdb.set(message, edit)
  }
  else {
    alert("you can't edit this message");
  }
}

rtdb.onValue(chats, ss=>{
  //alert(JSON.stringify(ss.val()));
  $("#chatsloc").empty();
  if (ss.val() != null){
    let msgIDs = Object.keys(ss.val());
    msgIDs.map((anId)=>{
      let msg = JSON.stringify(ss.val()[anId].message);
      let user = JSON.stringify(ss.val()[anId].User);
      let userinput = user.replace(/"/g, '');
      $("#chatsloc").append(
        `<div class="msg" data-id=${anId}>${userinput + ":" + msg}</div>`
      );
    });
    $(".msg").click(clickHandlerEdit);
  };
});

rtdb.onValue(users, ss=>{
  $("#userLoc").empty();
  let usertext = $("#usernamedisplay").text();
  if (ss.val() != null){
    let userIDs = Object.keys(ss.val());
    userIDs.map((anId)=>{
      let user = JSON.stringify(ss.val()[anId]);
      let userinput = user.replace(/"/g, '');
      $("#userLoc").append(
        `<div class="user" data-id=${anId}>${userinput}</div>`
      );  
      $("#usernamedisplay").html(
        `<div class="user" data-id=${anId}>${userinput}</div>`
      );
    });
  }
});

var clickHandlerClear = function(){
  var msg = $("#msg").val();
  rtdb.set(chats, []);
  $("#chatsloc").html("no messages");
}

var clickHandlerSO = function(){
  let username = $("#usernamedisplay").text();
  if (username != ''){
    let htmltag = JSON.stringify($("#usernamedisplay").html());
    let ind = htmltag.indexOf("data-id");
    let ind2 = htmltag.indexOf(">");
    let userID = htmltag.slice(ind + 10, ind2 - 2);
    let userRef = rtdb.ref(db, "users/" + userID)
    rtdb.set(userRef, null);
    $("#usernamedisplay").html('');
  }
}

$("#sendmsg").click(clickHandlerMSG);
$("#clear").click(clickHandlerClear);
$("#inputuser").click(clickHandlerUser);
$("#signout").click(clickHandlerSO);

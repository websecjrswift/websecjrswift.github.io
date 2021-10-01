import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQ-9McYiMr9WI5ajVFnnUP1Yzs4RVRbok",
  authDomain: "auth-4c4c7.firebaseapp.com",
  databaseURL: "https://auth-4c4c7-default-rtdb.firebaseio.com",
  projectId: "auth-4c4c7",
  storageBucket: "auth-4c4c7.appspot.com",
  messagingSenderId: "1035368066042",
  appId: "1:1035368066042:web:efdeefcd49a7a3880e5243",
  measurementId: "G-N17BDBGTGN"
};


const app = initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);
let auth = fbauth.getAuth(app);
let titleRef = rtdb.ref(db, "/");
let chats = rtdb.child(titleRef, "chats")
let users = rtdb.child(titleRef, "users")
/*
$("#logout").on("click", ()=>{
  fbauth.signOut(auth);
});
*/

let renderUser = function(userObj){
  //$("#app").html(JSON.stringify(userObj));
  let uid = userObj.uid;
  let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
  //let username = rtdb.ref(uidRef, username);
  //console.log(uid);
  rtdb.get(usernameRef).then(ss=>{
    $("#usernamedisplay").html(ss.val());
  });
  $("#logout").on("click", ()=>{
    fbauth.signOut(auth);
    $("usernamedisplay").html("");
    $("loggedin").hide();
  })
}

fbauth.onAuthStateChanged(auth, user => {
  //console.log(uidRef.val().username);
  if (!!user){
    $("#login").hide();
    renderUser(user);
    $("loggedin").show();
    //$("#usernamedisplay").html(username);
  }
  else {
    $("#login").show();
  };
});

$("#register").on("click", ()=>{
  let email = $("#regemail").val();
  let p1 = $("#regpass1").val();
  let p2 = $("#regpass2").val();
  if (p1 != p2){
    alert("Passwords don't match");
    return;
  }
  fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata=>{
    let uid = somedata.user.uid;
    //console.log(uid);
    var username = $("#username").val();
    let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
    let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
    let newacctRef = rtdb.ref(db, `/users/${uid}/roles/newacct`);
    let adminRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
    rtdb.set(userRoleRef, true);
    rtdb.set(newacctRef, true);
    rtdb.set(usernameRef, username);
    rtdb.set(adminRoleRef, false);
    rtdb.set(newacctRef, false);
  //let username = rtdb.ref(uidRef, username);
  //console.log(uid);
    rtdb.get(usernameRef).then(ss=>{
      $("#usernamedisplay").html(ss.val());
    });
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});


$("#login").on("click", ()=>{
  let email = $("#logemail").val();
  let pwd = $("#logpass").val();
  fbauth.signInWithEmailAndPassword(auth, email, pwd).then(
    somedata=>{
      //console.log(somedata);
      //console.log("here");
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

var clickHandlerMSG = function(){
  //console.log(username);
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

var makeAdmin = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let adminRoleRef = rtdb.ref(db, `/users/${curID}/roles/admin`);
  rtdb.set(adminRoleRef, true);
}
  

var killAdmin = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let adminRoleRef = rtdb.ref(db, `/users/${curID}/roles/admin`);
  rtdb.set(adminRoleRef, false);
}

rtdb.onValue(users, ss=>{
  $("#userLoc").empty();
  if (ss.val() != null){
    let userIDs = Object.keys(ss.val());
    userIDs.map((anId)=>{
      let user = JSON.stringify(ss.val()[anId].username);
      let userinput = user.replace(/"/g, '');
      $("#userLoc").append(
        `<div class="user" data-id=${anId}>${userinput}</div> <button type="button" class="makeadmin" data-id=${anId}>Make Admin</button> <button type="button" class="killadmin" data-id=${anId}>Kill Admin</button>`
      );
    });
    $(".makeadmin").click(makeAdmin);
    $(".killadmin").click(killAdmin);
  }         
});

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

var clickHandlerClear = function(){
  var msg = $("#msg").val();
  rtdb.set(chats, []);
  $("#chatsloc").html("no messages");
}


$("#sendmsg").click(clickHandlerMSG);
$("#clear").click(clickHandlerClear);
  if (!!user){
    $("#login").hide();
    renderUser(user);
    $("loggedin").show();
    //$("#usernamedisplay").html(username);
  }
  else {
    $("#login").show();
  };
});

$("#register").on("click", ()=>{
  let email = $("#regemail").val();
  let p1 = $("#regpass1").val();
  let p2 = $("#regpass2").val();
  if (p1 != p2){
    alert("Passwords don't match");
    return;
  }
  fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata=>{
    let uid = somedata.user.uid;
    //console.log(uid);
    var username = $("#username").val();
    let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
    let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
    let newacctRef = rtdb.ref(db, `/users/${uid}/roles/newacct`);
    let adminRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
    rtdb.set(userRoleRef, true);
    rtdb.set(newacctRef, true);
    rtdb.set(usernameRef, username);
    rtdb.set(adminRoleRef, false);
    rtdb.set(newacctRef, false);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});


$("#login").on("click", ()=>{
  let email = $("#logemail").val();
  let pwd = $("#logpass").val();
  fbauth.signInWithEmailAndPassword(auth, email, pwd).then(
    somedata=>{
      //console.log(somedata);
      //console.log("here");
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

var clickHandlerMSG = function(){
  //console.log(username);
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

var makeAdmin = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let adminRoleRef = rtdb.ref(db, `/users/${curID}/roles/admin`);
  rtdb.set(adminRoleRef, true);
}
  

var killAdmin = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let adminRoleRef = rtdb.ref(db, `/users/${curID}/roles/admin`);
  rtdb.set(adminRoleRef, false);
}

rtdb.onValue(users, ss=>{
  $("#userLoc").empty();
  if (ss.val() != null){
    let userIDs = Object.keys(ss.val());
    userIDs.map((anId)=>{
      let user = JSON.stringify(ss.val()[anId].username);
      let userinput = user.replace(/"/g, '');
      $("#userLoc").append(
        `<div class="user" data-id=${anId}>${userinput}</div> <button type="button" class="makeadmin" data-id=${anId}>Make Admin</button> <button type="button" class="killadmin" data-id=${anId}>Kill Admin</button>`
      );
    });
    $(".makeadmin").click(makeAdmin);
    $(".killadmin").click(killAdmin);
  }         
});

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

var clickHandlerClear = function(){
  var msg = $("#msg").val();
  rtdb.set(chats, []);
  $("#chatsloc").html("no messages");
}


$("#sendmsg").click(clickHandlerMSG);
$("#clear").click(clickHandlerClear);

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
let chatrooms = rtdb.child(titleRef, "chatrooms")
let general = rtdb.child(chatrooms, "general")
let users = rtdb.child(titleRef, "users")
let signedinusers = rtdb.child(titleRef, "signedinusers")


var adminval = null;
var curuid = "";
var curusername = "";
var curchat = general;
//if the user is not an admin, hide the make and kill admin classes
//else, show them
let renderUser = function(userObj){
  let uid = userObj.uid;
  curuid = uid;
  let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
  let adminRed = rtdb.ref(db, `/users/${uid}/roles/admin`);
  let signedinRef = rtdb.ref(db, `/users/${uid}/signedin`);
  rtdb.set(signedinRef, true);
  rtdb.get(usernameRef).then(ss=>{
    $("#usernamedisplay").html(ss.val());
    curusername = ss.val();
  });
  rtdb.get(adminRed).then(ss=>{
    //alert(ss.val());
    adminval = ss.val();
    //alert(adminval);
    if (ss.val()==true){
      $("#adminDisplay").show();
      $(".makeadmin").show();
      $(".killadmin").show();
      $("#clear").show();
    }
    else {
      $("#adminDisplay").hide();
      $(".makeadmin").hide();
      $(".killadmin").hide();
      $("#clear").hide();
    }
  });
  $("#logout").on("click", ()=>{
    fbauth.signOut(auth);
    rtdb.set(signedinRef, false);
  })
}

fbauth.onAuthStateChanged(auth, user => {
  if (!!user){
    $("#login").hide();
    renderUser(user);
    $("#loggedin").show();
    $("#part1").show();
    $("#part2").show();
    $("#generalchat").show();
    $("#chatrooms").show();
  }
  else {
    $("#login").show();
    $("#usernamedisplay").html("");
    $("#loggedin").hide();
    $("#part1").hide();
    $("#part2").hide();
    $("#generalchat").hide();
    $("#chatrooms").hide();
  };
});

$("#register").on("click", ()=>{
  let email = $("#regemail").val();
  let p1 = $("#regpass1").val();
  let p2 = $("#regpass2").val();
  $(".makeadmin").hide();
  $(".killadmin").hide();
  if (p1 != p2){
    alert("Passwords don't match");
    return;
  }
  fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata=>{
    let uid = somedata.user.uid;
    var username = $("#username").val();
    let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
    let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
    let newacctRef = rtdb.ref(db, `/users/${uid}/roles/newacct`);
    let adminRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
    let signedinRef = rtdb.ref(db, `/users/${uid}/signedin`);
    let chatroomRef = rtdb.ref(db, `/users/${uid}/chatrooms`);
    rtdb.set(userRoleRef, true);
    rtdb.set(newacctRef, true);
    rtdb.set(usernameRef, username);
    rtdb.set(adminRoleRef, false);
    rtdb.set(newacctRef, false);
    rtdb.set(signedinRef, true);
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
  $(".makeadmin").hide();
  $(".killadmin").hide();
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
  rtdb.push(curchat, chatmsg);
  rtdb.get(curchat).then(ss=>{
  $("#chatsloc").empty();
  if (ss.val() != null){
    let msgIDs = Object.keys(ss.val());
    msgIDs.map((anId)=>{
      let msg = JSON.stringify(ss.val()[anId].message);
      if (msg != null){
      let user = JSON.stringify(ss.val()[anId].User);
      let userinput = user.replace(/"/g, '');
      let msginput = msg.replace(/"/g, '');
      $("#chatsloc").prepend(
        `<div class="msg" data-id=${anId}>${">" + userinput + ":" + msginput}</div>`
      );
      };
    });
    $(".msg").click(clickHandlerEdit);
  };
  })
}

var clickHandlerEdit = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let msg = this.innerHTML;
  let ind = msg.indexOf(":");
  let msgUser = msg.slice(4, ind);
  var username = $("#usernamedisplay").text();
  if (username == msgUser || adminval == true){
    let edit = window.prompt("Edit this Message","");
    let editinput = edit.replace(/"/g, '');
    this.innerHTML = ">" + msgUser + ":" + editinput;
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
  rtdb.get(adminRoleRef).then(ss=>{
    if (ss.val() != true){
      rtdb.set(adminRoleRef, true);
      alert("you made an admin");
    }
  });
}
  

var killAdmin = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let adminRoleRef = rtdb.ref(db, `/users/${curID}/roles/admin`);
  rtdb.get(adminRoleRef).then(ss=>{
    if (ss.val() != false){
      rtdb.set(adminRoleRef, false);
      alert("you killed an admin");
    };
  });
};

var makechat = function(user){
  let chatname = window.prompt("What do you want to call the new chat?", "");
  let chatroomobj = {name: chatname};
  rtdb.push(chatrooms, chatroomobj);
}

var returnToGeneral = function(){
  curchat = general;
  $("#person").html("Chatting in general");
  rtdb.get(curchat).then(ss=>{
  $("#chatsloc").empty();
  if (ss.val() != null){
    let msgIDs = Object.keys(ss.val());
    msgIDs.map((anId)=>{
      let msg = JSON.stringify(ss.val()[anId].message);
      if (msg != null){
      let user = JSON.stringify(ss.val()[anId].User);
      let userinput = user.replace(/"/g, '');
      let msginput = msg.replace(/"/g, '');
      $("#chatsloc").prepend(
        `<div class="msg" data-id=${anId}>${">" + userinput + ":" + msginput}</div>`
      );
      };
    });
  }
    $(".msg").click(clickHandlerEdit);
  });
}

var joinChatroom = function(target){
  let curTarget = target.currentTarget;
  var curID = $(curTarget).attr("data-id");
  let chatref = rtdb.ref(db, `/chatrooms/${curID}/name`)
  rtdb.get(chatref).then(ss=>{
    $("#person").html("Chatting in " + ss.val());
  });
  curchat = rtdb.ref(db, `/chatrooms/${curID}`);
  rtdb.onValue(curchat, ss=>{
  $("#chatsloc").empty();
  if (ss.val() != null){
    let msgIDs = Object.keys(ss.val());
    msgIDs.map((anId)=>{
      let msg = JSON.stringify(ss.val()[anId].message);
      if (msg != null){
      let user = JSON.stringify(ss.val()[anId].User);
      let userinput = user.replace(/"/g, '');
      let msginput = msg.replace(/"/g, '');
      $("#chatsloc").prepend(
        `<div class="msg" data-id=${anId}>${">" + userinput + ":" + msginput}</div>`
      );
      };
    });
  }
    $(".msg").click(clickHandlerEdit);
  });
}

rtdb.onValue(chatrooms, ss=>{
  $("#usermadechats").empty();
  let chatIDs = Object.keys(ss.val());
  chatIDs.map((anId)=>{
    let name = JSON.stringify(ss.val()[anId].name);
    if (name != null){
    let nameinput = name.replace(/"/g, '');
    $("#usermadechats").append(
    `<div class="chatroom" data-id=${anId}>${nameinput}</div> <button type="button" class="join" data-id=${anId}>Join Chat</button>`
    );
    };
    $(".join").click(joinChatroom);
  })
});
/*
rtdb.onChildChanged(chatrooms, ss=>{
  rtdb.get(curchat).then(ss=>{
  $("#chatsloc").empty();
  if (ss.val() != null){
    let msgIDs = Object.keys(ss.val());
    msgIDs.map((anId)=>{
      let msg = JSON.stringify(ss.val()[anId].message);
      if (msg != null){
      let user = JSON.stringify(ss.val()[anId].User);
      let userinput = user.replace(/"/g, '');
      let msginput = msg.replace(/"/g, '');
      $("#chatsloc").prepend(
        `<div class="msg" data-id=${anId}>${">" + userinput + ":" + msginput}</div>`
      );
      };
    });
  }
    $(".msg").click(clickHandlerEdit);
  });
})

let testvar = rtdb.ref(db, `/chatrooms/-MmELPwV1w7-XZG0n0-O`);

rtdb.onValue(curchat, ss=>{
  $("#chatsloc").empty();
  if (ss.val() != null){
    let msgIDs = Object.keys(ss.val());
    msgIDs.map((anId)=>{
      let msg = JSON.stringify(ss.val()[anId].message);
      if (msg != null){
      let user = JSON.stringify(ss.val()[anId].User);
      let userinput = user.replace(/"/g, '');
      let msginput = msg.replace(/"/g, '');
      $("#chatsloc").prepend(
        `<div class="msg" data-id=${anId}>${">" + userinput + ":" + msginput}</div>`
      );
      };
    });
    $(".msg").click(clickHandlerEdit);
  };
});
*/
rtdb.onValue(users, ss=>{
  $("#userLoc").empty();
  if (ss.val() != null){
    let userIDs = Object.keys(ss.val());
    userIDs.map((anId)=>{
      let user = JSON.stringify(ss.val()[anId].username);
      let adminval = ss.val()[anId].roles.admin;
      if (user != null){
      let userinput = user.replace(/"/g, '');
      if (adminval == true){
        $("#userLoc").append(
        `<div class="user" data-id=${anId}>${userinput + " (admin)"}</div> <button type="button" class="makeadmin" data-id=${anId}>Make Admin</button> <button type="button" class="killadmin" data-id=${anId}>Kill Admin</button>`
          );
      }else {
        $("#userLoc").append(
        `<div class="user" data-id=${anId}>${userinput}</div> <button type="button" class="makeadmin" data-id=${anId}>Make Admin</button> <button type="button" class="killadmin" data-id=${anId}>Kill Admin</button>`
          );
      };
      };
    });
    $(".makeadmin").click(makeAdmin);
    $(".killadmin").click(killAdmin);
  }         
});

rtdb.onChildChanged(users, ss=>{
  let users = rtdb.ref(db, '/users')
  rtdb.get(users).then(ss=>{
    let uids = Object.keys(ss.val());
    $("#signedinLoc").empty();
    uids.map((anId)=>{
      let signedinval = ss.val()[anId].signedin;
      let username = JSON.stringify(ss.val()[anId].username);
      let userinput = username.replace(/"/g, '');
      //alert('here');
      if (signedinval == true) {
        $('#signedinLoc').append(
        `<p>${userinput}</p>`
        );
      };
    })
  })
});

$("#sendmsg").click(clickHandlerMSG);
$("#return").click(returnToGeneral);
$("#makechat").click(makechat);

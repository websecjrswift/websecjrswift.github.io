var clickHandlerColor = function(){
  var bkgcolor = document.querySelector("#color").value;
  document.body.style.backgroundColor = bkgcolor;
  console.log(bkgcolor)
}

var clickHandlerName = function(){
  var yourName = document.querySelector("#name").value;
  document.querySelector("#nameText").innerText = "Your name is " + yourName;
}

var clickHandlerDate = function(){
  var yourDate = document.querySelector("#date").value;
  document.querySelector("#dateText").innerText = "Your birthday is " + yourDate;
}

document.querySelector("#inputcolor").addEventListener("click", clickHandlerColor);
document.querySelector("#inputname").addEventListener("click", clickHandlerName);
document.querySelector("#inputdate").addEventListener("click", clickHandlerDate);

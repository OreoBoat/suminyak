var regex = /(\/icom\/files\/.*.pdf)/gi;
var regexname = /<title>(.*?)\.pdf<\/title>/gi;
var linking = "http://www.icom.org.cn";
var a = document.getElementById("Info");
var b = document.getElementById("Error");
var c = document.getElementById("Success");
var d = document.getElementById("Warning");
var e = document.getElementById("keepLoading");
var f = document.getElementById("Reminder");
var btna = document.getElementById("btnA");
var btndiv = document.getElementById("Autobtn");
var btnb = document.getElementById("Spinner");
var btnc = document.getElementById("Disabled");
var btnd = document.getElementById("Yahoo");
var Autodiv = document.getElementById("Autodiv");
var btnAuto = document.getElementById("btnAuto");
var btnAutoActive = document.getElementById("btnAutoActive");
var Stylediv = document.getElementById("Stylediv");
var btnStyle = document.getElementById("btnStyle");
var btnStyleActive = document.getElementById("btnStyleActive");
var notifypdf = document.getElementById("notifypdf");
var notifystyle = document.getElementById("notifystyle");
var btnSets = document.getElementById("btnSets");
var Kingdiv = document.getElementById("Kingdiv");
var Kingbtn = document.getElementById("Kingbtn");
var btnKing = document.getElementById("btnKing");
var btnKingActive = document.getElementById("btnKingActive");
var notifyobj = "<h6><strong>Current Method:</strong></h6>Links will be <strong>opened</strong> in a new tab!";
var notifyobjactive = "<h6><strong>Current Method:</strong></h6>Links will be <strong>redirected</strong> in the current tab!";
var downloadobj = "<h6><strong>Grab the file?</strong></h6>File <strong>will not be</strong> downloaded!";
var downloadobjactive = "<h6><strong>Grab the file?</strong></h6>File <strong>will be downloaded</strong> and <strong>renamed!</strong>";

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    supreme = request.source;
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;

function whenSucess() {
  a.style.display = "none";
  e.style.display = "none";
  f.style.display = "none";
  d.style.display = "block";
  c.style.display = "block";
  btnb.style.display = "none";
  btnd.style.display = "block";
}


function completeRedirect(){
  c.style.display = "none";
  f.style.display = "none";
  btnd.style.display = "none";
}
function whenError() {
  a.style.display = "none";
  e.style.display = "none";
  f.style.display = "none";
  b.style.display = "block";
  btnb.style.display = "none";
  btnc.style.display = "block";
}

function download(url, filename) {
  fetch(url).then(function(t) {
    return t.blob().then((b)=>{
      var a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.setAttribute("download", filename);
      a.click();
    });
  });
}

function CheckNotify() {
  var successobj = document.getElementById("notifydone")
  if (localStorage.getItem("kingmode") == "true") {
    successobj.innerHTML = "Internal PDF link has been grabbed! Your file will be downloaded soon."
  }
  else if (localStorage.getItem("kingmode") == null) {
    if (localStorage.getItem("autoset") == "true" && (localStorage.getItem("redirectstyle") == null)) {
      successobj.innerHTML = "Link will be opened in a new tab soon and your file will be downloaded automatically!"
    }
    if (localStorage.getItem("autoset") == "true" && (localStorage.getItem("redirectstyle") == "true")) {
      successobj.innerHTML = "You'll be redirected soon and your file will be downloaded automatically!"
    }
    if (localStorage.getItem("autoset") == null && (localStorage.getItem("redirectstyle") == "true")) {
      successobj.innerHTML = "Internal PDF link has been grabbed! You'll be redirected to the link soon!"
    }
    if (localStorage.getItem("autoset") == null && (localStorage.getItem("redirectstyle") == null)) {
      successobj.innerHTML = "Internal PDF link has been grabbed! The link will be opened in a new tab soon!"
    }
  }
}

function StyleMode() {
  var remaining = 4;
  var obj = document.getElementById("testagain");
  var timeout = window.setInterval(function() {
    remaining--;
    if (remaining == 0) {
      window.clearInterval(timeout);
      var check = supreme.match(regex);
      var final = linking.concat(check);
      if (localStorage.getItem("kingmode") == "true") {
        obj.innerHTML = "A major!"
        SoloMode();
      }
      if (localStorage.getItem("kingmode") == null) {
        if (localStorage.getItem("autoset") == "true") {
          SoloMode();
        }
        if (localStorage.getItem("redirectstyle") == "true") {
          obj.innerHTML = "Shhh! It's a pianissimo!"
          chrome.tabs.update({url: final});
        } else {
          obj.innerHTML = "B-flat minor?"
          setTimeout(function() {
            window.open(final);
          }, 1200)
        }
      }
      return;
    }
    obj.innerHTML = remaining;
  }, 1000);
}

function SoloMode() {
  var check = supreme.match(regex);
  var checkname = supreme.match(regexname);
  var testname = "";
  var joinedname = testname.concat(checkname);
  var final = linking.concat(check);
  var finalname = joinedname.replace(/<title>|<\/title>|.pdf/g, '');
  download(final, finalname);
}

btnAuto.addEventListener("click", Setup);
function Setup() {
  btnAuto.style.display = "none";
  btnAutoActive.style.display = "block";
  localStorage.setItem("autoset", "true")
  notifypdf.innerHTML = downloadobjactive;
}

btnAutoActive.addEventListener("click", Setupoff);
function Setupoff() {
  btnAutoActive.style.display = "none";
  btnAuto.style.display = "block";
  localStorage.removeItem("autoset")
  notifypdf.innerHTML = downloadobj;
}

btnStyle.addEventListener("click", dStyle);
function dStyle() {
  btnStyle.style.display = "none";
  btnStyleActive.style.display = "block";
  localStorage.setItem("redirectstyle", "true")
  notifystyle.innerHTML = notifyobjactive;
}

btnStyleActive.addEventListener("click", Redirect);
function Redirect() {
  btnStyleActive.style.display = "none";
  btnStyle.style.display = "block";
  localStorage.removeItem("redirectstyle")
  notifystyle.innerHTML = notifyobj;
}

btnKing.addEventListener("click", KingMode);
function KingMode() {
  btnKing.style.display = "none";
  btnKingActive.style.display = "block";
  Autodiv.style.display = "none";
  Stylediv.style.display = "none";
  localStorage.setItem("kingmode", "true");
  Kingdiv.className = "alert alert-danger alert-dismissible fade show mb-0";
}

btnKingActive.addEventListener("click", NoKing);
function NoKing() {
  btnKingActive.style.display = "none";
  btnKing.style.display = "block";
  Autodiv.style.display = "block";
  Stylediv.style.display = "block";
  localStorage.removeItem("kingmode");
  Kingdiv.className = "alert alert-success alert-dismissible fade show mb-0";
}

function checkfordata() {
  if (localStorage.getItem("autoset") == "true") {
    btnAutoActive.style.display = "block";
    btnAuto.style.display = "none";
    notifypdf.innerHTML = downloadobjactive;
  }
  else {
    btnAuto.style.display = "block";
    btnAutoActive.style.display = "none";
    notifypdf.innerHTML = downloadobj;
  }
  if (localStorage.getItem("redirectstyle") == "true") {
    btnStyleActive.style.display = "block";
    btnStyle.style.display = "none";
    notifystyle.innerHTML = notifyobjactive;
  }
  else {
    btnStyle.style.display = "block";
    btnStyleActive.style.display = "none";
    notifystyle.innerHTML = notifyobj;
  }
  if (localStorage.getItem("kingmode") == "true") {
    btnKing.style.display = "none";
    btnKingActive.style.display = "block";
    Autodiv.style.display = "none";
    Stylediv.style.display = "none";
    Kingdiv.className = "alert alert-danger alert-dismissible fade show mb-0";
  }
  else {
    btnKingActive.style.display = "none";
    btnKing.style.display = "block";
    Autodiv.style.display = "block";
    Stylediv.style.display = "block";
    Kingdiv.className = "alert alert-success alert-dismissible fade show mb-0";
  }
}

document.getElementById("Settings").addEventListener("click", SettingsMode);
function SettingsMode() {
  Autodiv.style.display = "block";
  btnSets.style.display = "block";
  Stylediv.style.display = "block";
  Kingdiv.style.display = "block";
  a.style.display = "none";
  btna.style.display = "none";
  checkfordata();
}

document.getElementById("Goback").addEventListener("click", OriginalMode);
function OriginalMode() {
  // Info
  a.style.display = "block";
  // Autodiv
  Autodiv.style.display = "none";
  // Stylediv
  Stylediv.style.display = "none";
  // Kingdiv
  Kingdiv.style.display = "none";
  // btnA
  btna.style.display = "block";
  // btnSets
  btnSets.style.display = "none";
  // checkagain
  // chrome.runtime.reload()
}
document.getElementById("Manual").addEventListener("click", ManualMode);
function ManualMode() {

  a.style.display = "none";
  e.style.display = "block";
  f.style.display = "block";
  btna.style.display = "none";
  btnb.style.display = "block";

  function check() {
    var check = supreme.match(regex);

    if (check == null) {
      whenError();
    } else {
      whenSucess();
      CheckNotify();
      StyleMode();
    }
  }
  setTimeout(check, 500)
}
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    messagetest = request.source;
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

document.getElementById("manual").addEventListener("click", ManualMode);
function ManualMode() {

  function check() {
    var supreme = messagetest; //Declare supreme as message.innerText which recevies page source
    var regex = /(\/icom\/files\/.*.pdf)/gi //Declare regex pattern to check for pdf links
    var check = supreme.match(regex); //Regex match with supreme.string
    var word = "http://www.icom.org.cn" //Declare website domain link
    var final = word.concat(check); //Join string
    window.alert(final); //Alert the user of the link
    window.open(final);
  }
  
  setTimeout(check, 500)
}
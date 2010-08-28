/*
  Page-functions
*/
function changePage(page)
{
  if (page)
    new Ajax.Updater("pagecontent",
             page,
             {
              method: "get",
              onComplete: function()
              {
                jsI18n.processPage();
                createCookie("page", page, 0.42);
              }
             });
}

/*
  Language-functions
*/
function changeLocale(locale)
{
  if (!locale) var locale = "sv";
  
  jsI18n.setLocale(locale);
  
  jsI18n.processPage();
  createCookie("lang", locale);
}

/*
  Use when page loads
*/
function initPage()
{
  translatePage();
  
  var page  = readCookie("page");
  if (page)
    changePage(page);
  else
    changePage("frontpage.html");
}

function translatePage()
{
  var locale  = readCookie("lang");
  if (locale)
    jsI18n.setLocale(locale);
  else
    jsI18n.setLocale("sv");
  
  jsI18n.processPage();
}


/*
  Visibility-functions
*/
/*  
  Toggle visibility of an element
    Arguments:
        [0] - Element ID
*/
function toggleVisibility(id)
{
  var id  = document.getElementById(id);
  if (id)
  {
    if (id.style.visibility == "hidden")
    {
      id.style.display    = "block";
      id.style.visibility = "visible";
    }
    else
    {
      id.style.display    = "none";
      id.style.visibility = "hidden";
    }
  }
}

/*  
  Set the specified element's visibility
    Arguments:
        [0] - Element ID
        [1] - Show (bool)
*/
function showElement(id, show)
{
  var id  = document.getElementById(id);
  
  if (id)
  {
    if (show)
    {
      id.style.display    = "block";
      id.style.visibility = "visible";
    }
    else
    {
      id.style.display    = "none";
      id.style.visibility = "hidden";
    }
  }
}

/*
  Remove the specified element
*/
function removeElement(id)
{
  var id  = document.getElementById(id);
  
  if (id)
  {
    var pid = id.parentNode;
    pid.removeChild(id);
  }
}

/*
  File-functions
*/
function loadXMLDoc(dname)
{
  if (window.XMLHttpRequest)
    xhttp = new XMLHttpRequest();
  else
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  
  xhttp.open("GET", dname, false);
  xhttp.send();
  
  return xhttp.responseXML;
}

/*
  Cookie-functions	(source: http://www.quirksmode.org/js/cookies.html)
*/
function createCookie(name,value,days)
{
  if (days)
  {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else
    var expires = "";
  
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name)
{
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  
  for(var i=0;i < ca.length;i++)
  {
    var c = ca[i];
    while (c.charAt(0) == ' ')
      c = c.substring(1, c.length);
    
    if (c.indexOf(nameEQ) == 0)
      return c.substring(nameEQ.length, c.length);
  }
  
  return null;
}

function eraseCookie(name)
{
  createCookie(name, "", -1);
}

// Event-functions
function addEvent(ele, evt, fn, capture)
{
  if (window.attachEvent)
    ele.attachEvent("on" + evt, fn);
  else
  {
    if (!capture) capture = false;
  
    ele.addEventListener(evt, fn, capture);
  }
}
/*
  Page-functions
*/
function changePage(page)
{
  if (page)
  {
    var html  = loadXMLDoc(page, true);
    var id  = document.getElementById("pagecontent");
    if (html && id)
    {
      id.innerHTML  = html;
      
      jsI18n.processPage();
      createCookie("page", page, 0.42);
    
      if(page == "frontpage.html")
        loadNews();
    }
  }
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

/**
  Loads news from twitter
**/
function loadNews()
{
  //We use hashtags to filter by language
  var lang_regex = new RegExp("#" + jsI18n.locale, "m");
  getTwitters('news', {
      id: Config.news_account,
      count: 3,
      enableLinks: false,
      filter: lang_regex,
      ignoreReplies: true,
      clearContents: true,
      template: "<span class=\"date\">%time%</span><span class\"content\">%text%</span>"
    });
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
function loadXMLDoc(dname, notXML, func)
{  
  if (window.XMLHttpRequest)
    xhttp = new XMLHttpRequest();
  else
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  
  if (func)
  {
    var async = true;
    addEvent(xhttp, "readystatechange", func);
  }
  else
    var async = false;
  
  xhttp.open("GET", dname, async);
  xhttp.send();
  
  if (notXML)
    return xhttp.responseText;
  else
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
/*
  Cross-browser Add Event-listener function
*/
var addEvent = (function( window, document ) {  
    if ( document.addEventListener ) {  
        return function( elem, type, cb ) {  
            if ( elem && !elem.length ) {  
                elem.addEventListener(type, cb, false );  
            }  
            else if ( elem && elem.length ) {  
                var len = elem.length;  
                for ( var i = 0; i < len; i++ ) {  
                    addEvent( elem[i], type, cb );  
                }  
            }  
        };  
    }  
    else if ( document.attachEvent ) {  
        return function ( elem, type, cb ) {  
            if ( elem && !elem.length ) {  
                elem.attachEvent( 'on' + type, function() { return cb.call(elem) } );  
            }  
            else if ( elem.length ) {  
                var len = elem.length;  
                for ( var i = 0; i < len; i++ ) {  
                    addEvent( elem[i], type, cb );  
                }  
            }  
        };  
    }
})( this, document );

// Compability functions
/*
  Check if the browser supports the audio-tag
*/
function supports_audio()
{
  return !!document.createElement("audio").pause;
}

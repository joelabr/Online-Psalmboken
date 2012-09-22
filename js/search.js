/*
  Search-functions
*/

//Singleton application instance.
//Put search related methods into
//here (refactor).
app = new function Application() {
  var hymnBook = null
  var curHymnBook = "";
  var searchMethods = new Array()
 
  //Adds a search method. Associates the given
  //regular expression with the given HymnBook method. 
  function addSearchMethod(regex, funcname) {
    searchMethods.push({"regex":regex, "func":funcname})
  }

  //Adds a search result to the page 
  function addSearchResult(element)
  {
    // Insert what we are searching for "Search results for: 'XXX'"    
    var test = document.getElementById(element.id + "_searchquery");
    
    if (test)
      test.innerHTML = "\"" + document.hymnform.searchquery.value + "\"";
    
    processSearchResults()
  }
  
  //Changes melody
  this.changeMelody = function(id) {
    var melodyId = document.getElementById(id + "_melodySelector").value;
    var downloadLink = document.getElementById(id + "_downloadMelody");
    
    // Change download link
    downloadLink.href = "hymns/midi/" + melodyId + ".mid";
    
    // Change list with links to hymns with the same melody
    app.updateListOfHymnsWithSameMelody(id);
  }
  
  this.clearSearchResults = function()
  {    
    var searchResults = document.getElementById("searchresults");
    if (searchResults)
      while (searchResults.childNodes.length > 0)
        removeElement(searchResults.childNodes[0].id);
      
    processSearchResults();
  }

  /*
    Initializes the app.
  */
  this.init = function() {
    // Add an event-listener to Audio-tag in search result to reset playback when it has ended.
    var audio = document.getElementById("audioplayer");

    if (audio) {
      addEvent(audio, "ended", function() {
        resetPlaybackTime(audio.id);
      });
    }

    //Add search methods (order is significant!)
    addSearchMethod(/^[123456789]\d*$/, "searchByNumber")
    addSearchMethod(/^category:/, "searchByCategory")
    addSearchMethod(/^author:/, "searchByAuthor")
    addSearchMethod(/^\d+:+\d+$/, "searchVerse")
    //Global handler (must be added last!)
    addSearchMethod(/.+/, "searchByContent")
  }()


  /*
    Returns the audio extension (e.g. "ogg")
    to use.
  */
  function getAudioExtension() {
    var oracle = document.createElement("audio");
    if(oracle.canPlayType && !!oracle.canPlayType('audio/ogg; codecs="vorbis"'))
      return "ogg";
    else
      return "mp3";
  }
 
  /*
    Plays/pauses a melody. The ID if the hymn
    to be played is given as the first parameter.
  */ 
  this.playPauseMelody = function(id) {
    var audio = document.getElementById("audioplayer"),
        melodyId = document.getElementById(id + "_melodySelector").value,
        ext = getAudioExtension(),
        melodyPath = "hymns/" + ext + "/" + melodyId + "." + ext;

    if (supportsAudio() && audio.src !== melodyPath)
    {
        audio.pause()
        audio.src= melodyPath
        audio.load()
    }
    
    
    if(audio.paused)
      audio.play();
    else
      audio.pause();
  }

  //Presents the given data to the user
  this.presentSearchResult = function(data)
  {
    if(data)
    {
      var searchResults = document.getElementById("searchresults")
      if(window.ActiveXObject)
      {
        data  = stringToElement(data.substr(data.indexOf("?>") + 2))
        searchResults.innerHTML = data.innerHTML + searchResults.innerHTML
        addSearchResult(data.firstChild)
      }
      else
      {
        searchResults.insertBefore(data, searchResults.childNodes[0])
        addSearchResult(searchResults.childNodes[0])
      }
    }
    
    jsI18n.processPage()
    showElement("searchresults_p", true)
    showElement("searchresults", true)
  }

  function processSearchResults()
  {
    var searchResults = document.getElementById("searchresults");
    
    if (searchResults.childNodes.length > 1)
      for (var i = 1; i < searchResults.childNodes.length; i++)
        showElement(searchResults.childNodes[i].id + "_hymnDiv", false);
    
    if (searchResults.childNodes.length > 5)
    {
      var temp = searchResults.childNodes[searchResults.childNodes.length - 1]; // Must use this method instead of searchResults.lastChild to make it work in IE
      removeElement(temp.id);
    }

    if (searchResults.childNodes.length == 0)
    {
      showElement("searchresults_p", false)
      showElement("searchresults", false)
    }
  }

  //Removes the search result with the given id
  this.removeSearchResult = function(id)
  {
    if (id)
    {
      removeElement(id);
      
      processSearchResults()  
    }
  }

  //Searches for a hymn 
  //If the optional argument is given,
  //that text will be used as the search text.
  this.searchHymn = function(searchtext) {
    document.getElementById('searchtips').style.display='none'

    if(searchtext != null)
      document.hymnform.searchquery.value = searchtext

    var query = document.hymnform.searchquery.value
    var hbname = document.hymnform.hymnbook.value
    //TODO: Select hymnbook
    if (hbname)
    {
      if (curHymnBook !== hbname)
      {
        showElement("loadingImage", true);
        hymnBook  = new HymnBook("xml/hymnbooks/" + hbname + ".xml");
        showElement("loadingImage", false);
        
        curHymnBook = hbname;
      }
    }
    
    if (hymnBook)
    {
      //Call search method
      for(var i = 0; i < searchMethods.length; i++)
      {
        var sm = searchMethods[i]
        if(query.match(sm["regex"]))
        {
          hymnBook[sm["func"]].apply(this, [query])
          break;
        }
      }
    }

    //Focus on query
    document.hymnform.searchquery.focus()
    document.hymnform.searchquery.select()
  }

  this.showSearchTips = function() {
    document.getElementById('searchtips').style.display='block'
  }
  
  // Shows all the hymns with the same melody as the hymn with the given ID
  this.showHymnsWithMelody = function(id)
  {
    var showHymnsList = document.getElementById(id + "_showHymnsSameMelody");
    
    app.updateListOfHymnsWithSameMelody(id);
    showElement(id + "_hymnsWithSameMelodyList", true);
    
    var anchorParent = showHymnsList.parentNode;
    anchorParent.removeChild(showHymnsList);
  }
  
  // Updates list of hymns with same melody as the hymn with the given ID
  this.updateListOfHymnsWithSameMelody = function(id)
  {
    var hymnList = document.getElementById(id + "_hymnsWithSameMelodyList");
    var hymnNumbers = document.getElementById(id + "_melodySelector").value.split("_");
    
    hymnList.innerHTML = "";
    
    var length, currentHymn;
    for (var i = 0, length = hymnNumbers.length; i < length; i++)
    {
      currentHymn = hymnNumbers[i].match(/\d+/);
      
      var tempA = document.createElement("a");
        tempA.href = "javascript: app.searchHymn('" + new Number(currentHymn) + "')";
        tempA.innerHTML = new Number(currentHymn);
        
      var tempLi = document.createElement("li");
        tempLi.appendChild(tempA);
        
      hymnList.appendChild(tempLi);
    }
  }
}

//Helper for converting a XML Node (lists)
//into an XML document.
function NodeToXMLConverter()
{
  //Converts a node list into xml
  this.nodeListToXML = function(list, parentnode) {
    var xmlstr = "<" + parentnode + ">"
    
    for(var i = 0; i < list.length; i++)
      xmlstr += nodeToString(list[i])
    
    return stringToXML(xmlstr + "</" + parentnode + ">") 
  }

  function nodeToString(node) {
    if(window.ActiveXObject)
      return node.xml
    else
      return new XMLSerializer().serializeToString(node)
  }

  this.nodeToXML  = function(node) {
    return stringToXML(nodeToString(node))
  }

  function stringToXML(str) {
    if(window.ActiveXObject)
    {
      var xml = new ActiveXObject("Microsoft.XMLDOM")
      xml.async = false
      xml.loadXML(str)
      return xml
    }
    else
      return new DOMParser().parseFromString(str, "text/xml")
  }
}


/*
  **IE-specific!**
  Creates a "generic" element and sets it's innerHTML property to str
  
  Hack?
*/
function stringToElement(str)
{
  var temp  = document.createElement("div");
  temp.innerHTML  = str;
  
  return temp;
}

/*
  Helper for searching through a document with XSLT.
*/
function XPathHelper(xml)
{
  var xmlDoc = xml
  //Returns all instances matched by the given xpath expression.
  this.evaluate = function(xpath, result) {
    if (xmlDoc != null)
    {
      if (window.ActiveXObject) //IE
      {
        xmlDoc.setProperty("SelectionLanguage", "XPath");
        return xmlDoc.selectNodes(xpath);
      }
      else
        return xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, result);
    }
    return null;
  }
  
  //Returns all instances found by the given xpath expression as an array.
  this.findAll = function (xpath, result) {
    var results = this.evaluate(xpath, result)
    if(window.ActiveXObject && results)
      return results
    else if(!window.ActiveXObject)
    {
      var nodes = []
      var node;
      while(node = results.iterateNext())
        nodes.push(node)
      return nodes
    }
    else
      return []
  }

  //Returns the first instance matched by the given xpath expression.
  this.findFirst = function(xpath, result) {
    var results = this.evaluate(xpath, result)
    if (window.ActiveXObject && results && results.length > 0)
        return results[0]
    else if(!window.ActiveXObject)
      return results.iterateNext()
    else
      return null
  }
}

/*
  Helper for processing XML
  with an XSLT stylesheet.
*/
function XSLTHelper(xslt)
{
  var xsltDoc = xslt;

  this.process = function(xml)
  {
    if(window.ActiveXObject) //IE
    {
      xml.setProperty("SelectionLanguage", "XPath")
      return xml.transformNode(xsltDoc)
    }
    else if(document.implementation && document.implementation.createDocument)
    {
      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      return xsltProcessor.transformToFragment(xml, document);
    }
    else //Not supported
    {
      return null;
    }
  }
}
  

function HymnBook(fname)
{
  var xmlDoc      = loadXMLDoc(fname, false);
  var lastResults = null;

  //Returns XML for all hymns in the hymn book
  this.allHymns = function() {
    return new XPathHelper(xmlDoc).evaluate("hymns/hymn");
  }

  //Processes the given XML node with the named stylesheet
  function processWithXSL(node, xslt) {
    var xml = null
    if(node.length != undefined)
      xml = new NodeToXMLConverter().nodeListToXML(node, "hymns")
    else
      xml = new NodeToXMLConverter().nodeToXML(node);
    
    var processor = new XSLTHelper(loadXMLDoc(xslt, false));
    return processor.process(xml);
  }
  
  //Searches hymn by author
  this.searchByAuthor = function(str) {
    var author = str.replace(/author:\s*/gi, "")
    if (xmlDoc != null)
    {
      var xpath = "/hymns/hymn[authors/author[contains(name, '" + author + "')]]"
      var hymns = new XPathHelper(xmlDoc).findAll(xpath)
      if(hymns.length > 0)
        app.presentSearchResult(processWithXSL(hymns, "xml/hymns.xsl"))
      else
        app.showSearchTips()
    }
  }

  //Searches hymn by category
  this.searchByCategory = function(str) {
    var category = str.replace(/category:\s*/gi, "")
    if (xmlDoc != null)
    {
      var xpath = "/hymns/hymn[contains(category, '" + category + "')]";
      var hymns = new XPathHelper(xmlDoc).findAll(xpath);
      if(hymns.length > 0)
        app.presentSearchResult(processWithXSL(hymns, "xml/hymns.xsl"))
      else
        app.showSearchTips()
    }
  }

  //Searches a hymn by verse content.
  //Uses javascript for the search. 
  this.searchByContent = function(str) {
    var hymns = []
    var regex = new RegExp(searchEscape(str), "i")
    var all = new XPathHelper(xmlDoc).findAll('//hymn')
    for(var i = 0; i < all.length; i++)
    {
      // Search in title first
      var titles = all[i].getElementsByTagName("title")
      var title = (window.ActiveXObject) ? titles[0].text : titles[0].textContent 
      if(title.match(regex))
        hymns.push(all[i])
      else { //Search in verses if necessary
        var verses = all[i].getElementsByTagName("verse")
        for(var v = 0; v < verses.length; v++)
        {
          var content = (window.ActiveXObject) ? verses[v].text : verses[v].textContent
          if(content.match(regex))
          {
            hymns.push(all[i])
            break
          } 
        } 
      }
    }
    if(hymns.length > 0)
      app.presentSearchResult(processWithXSL(hymns, "xml/hymns.xsl"))
    else
      app.showSearchTips()
  }


  //Searches a hymn by number 
  this.searchByNumber = function(num) {
    if (xmlDoc != null)
    {
      var xpath = "/hymns/hymn[number=" + num + "]";
      var hymn = new XPathHelper(xmlDoc).findFirst(xpath);
      if(hymn)
        app.presentSearchResult(processWithXSL(hymn, "xml/hymn.xsl"))
      else
        app.showSearchTips()
    }
  }

  //Escapes a string to make it suitable as a hymn search regex.
  //Inserts word boundaries, allows wildcards (only as suffix)
  //and "and" functionality by using commas.
  function searchEscape(str) {
    return RegExp.escape(str).replace("\\,", ".*").replace("\\*", "\\w*").replace(/(\w+)(\\w\*)*/, "\\b$1$2\\b")
  }

  //Searches for a particular verse in a hymn
  this.searchVerse = function(str) {
    alert("Searching for verse " + str)
  }
}	

/*
  Search-functions
*/

//Singleton application instance.
//Put search related methods into
//here (refactor).
app = new function Application() {
  var hymnBook = new HymnBook("xml/1937.xml")
  var resultDivs  = new Array()
  var searchMethods = new Array()
 
  //Adds a search method. Associates the given
  //regular expression with the given HymnBook method. 
  function addSearchMethod(regex, funcname) {
    searchMethods.push({"regex":regex, "func":funcname})
  }

  //Adds a search result to the page 
  function addSearchResult(element)
  {
    resultDivs.push(element)
    processSearchResults()
  }

  /*
    Initializes the app.
  */
  this.init = function() {
    //Add search methods (order is significant!)
    addSearchMethod(/^[123456789]\d*$/, "searchByNumber")
    addSearchMethod(/^category:/, "searchByCategory")
    addSearchMethod(/^author:/, "searchByAuthor")
    addSearchMethod(/^\d+:+\d+$/, "searchVerse")
    //Global handler (must be added last!)
    addSearchMethod(/.+/, "searchByContent")
  }
  this.init()
  
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
        searchResults.insertBefore(data, searchResults.childNodes[1])
        addSearchResult(searchResults.childNodes[1])
      }
    }
    
    jsI18n.processPage()
    showElement("searchresults_h", true)
    showElement("searchresults", true)
  }

  function processSearchResults()
  {
    if (resultDivs.length > 1)
      for (var i = 0; i < resultDivs.length - 1; i++)
        showElement(resultDivs[i].getElementsByTagName("div")[0].id, false)
    
    if (resultDivs.length > 5)
    {
      var temp = resultDivs.shift()
      removeElement(temp.id)
    }
    
    if (resultDivs.length == 0)
    {
      showElement("searchresults_h", false)
      showElement("searchresults", false)
    }
  }

  //Removes the search result with the given id
  this.removeSearchResult = function(id)
  {
    if (id)
    {
      removeElement(id);
      
      for (var i = 0; i < resultDivs.length; i++)
      {
        if (resultDivs[i].id  === id)
          resultDivs.splice(i, 1)
      }
      
      processSearchResults()  
    }
  }


  //Searches a hymn 
  this.searchHymn = function() {
    var query = document.hymnform.searchquery.value;
    var hbname = document.hymnform.hymnbook.value;

    //TODO: Select hymnbook
    
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

    //Focus on query
    document.hymnform.searchquery.focus()
    document.hymnform.searchquery.select()
  }
}

//Helper for converting a XML Node
//into an XML document.
function NodeToXMLConverter()
{
  this.nodeToXML  = function(node)
  {
    var xml = null;
    if (window.ActiveXObject)
    {
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(node.xml);
    }
    else
      xml = new DOMParser().parseFromString(new XMLSerializer().serializeToString(node),
                          "text/xml");
                          
    return xml;
  }
}


/*
  **IE-specific!**
  Creates a "generic" element and sets it's innerHTML property to str
  
  Hack?
*/
function stringToElement(str)
{
  var temp  = document.createElement("");
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
    var xml = new NodeToXMLConverter().nodeToXML(node);
    var processor = new XSLTHelper(loadXMLDoc(xslt, false));
    return processor.process(xml);
  }
  
  //Searches hymn by author
  this.searchByAuthor = function(str) {
    alert("Searching by author")
  }

  //Searches hymn by category
  this.searchByCategory = function(str) {
    alert("Searching by category")
  }
 
  //Searches hymn by content 
  this.searchByContent = function(str) {
    alert("Searching by content")
  }

  //Searches a hymn by number 
  this.searchByNumber = function(num) {
    if (xmlDoc != null)
    {
      var xpath = "/hymns/hymn[number=" + num + "]";
      var hymn = new XPathHelper(xmlDoc).findFirst(xpath);
      if(hymn)
        app.presentSearchResult(processWithXSL(hymn, "xml/hymn.xsl"))
    }
  }

  //Searches for a particular verse in a hymn
  this.searchVerse = function(str) {
    alert("Searching for verse " + str)
  }
}	

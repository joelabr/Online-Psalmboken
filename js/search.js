/*
  Search-functions
*/
var resultDivs  = new Array();

function NodeToXMLParser()
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

function processSearchResults(element)
{
  if (element)
  {
    if (resultDivs.length > 0)
      for (var i = 0; i < resultDivs.length; i++)
        showElement(resultDivs[i].childNodes[1].id, false);

    resultDivs.push(element);
    
    if (resultDivs.length > 5)
    {
      var temp = resultDivs.shift();
      document.getElementById("searchresults").removeChild(temp);
    }
  }
  else
  {
     alert("Element not found")
  }
}

/*
  Helper for searching through a document with XSLT.
*/
function XPathHelper(xml)
{
  var xmlDoc = xml
  //Evaluates the given XPath expression.
  this.evaluate = function(xpath, result)
  {
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
  
function presentResults(hymn)
{
  if (hymn)
  {
    var xml = new NodeToXMLParser().nodeToXML(hymn);
    var processor = new XSLTHelper(loadXMLDoc("xml/hymn.xsl"));
    var data = processor.process(xml);

    if(data)
    {
      var searchResults	= document.getElementById("searchresults");
      if(window.ActiveXObject)
        searchResults.innerHTML = data + searchResults.innerHTML;
      else
      {
        searchResults.insertBefore(data, searchResults.childNodes[1]);
        processSearchResults(searchResults.childNodes[1]);
      }
    }
    
    jsI18n.processPage();
    showElement("searchresults_h", true);
    showElement("searchresults", true);
  }
}

// Read XML-files
function HymnBook(fname)
{
  var xmlDoc      = loadXMLDoc(fname);
  var lastResults = null;
  
  this.allHymns = function() {
    return new XPathHelper(xmlDoc).evaluate("hymns/hymn");
  }

  // Search hymn number
  this.searchNumber = function(num)
  {
    if (!isNaN(num) && xmlDoc != null)
    {
      var xpath = "/hymns/hymn[number=" + num + "]";
      var lastResults = new XPathHelper(xmlDoc).evaluate(xpath);
      if (window.ActiveXObject && lastResults && lastResults.length > 0)
          presentResults(lastResults[0]);
      else if(!window.ActiveXObject)
      {
        var temp  = lastResults.iterateNext();
        if (temp)
          presentResults(temp);
      }
    }
  }
}	

var hymn1937  = new HymnBook("xml/1937.xml");
function searchHymn()
{
  if (document.hymnform.searchquery)
  {
    var query = document.hymnform.searchquery;
    
    if (query.value != "")
    {
      if (!isNaN(query.value))
      {
        if (query.value > 0)
          hymn1937.searchNumber(query.value);
      }
      else
      {
        var hymnVersePattern  = /^\d+:+\d+$/;
        var categoryPattern = /^category:\w+/i;
        var authorPattern = /^author:\w+/i;
        if (hymnVersePattern.test(query.value))
          alert("Psalm + Vers");
        else if(categoryPattern.test(query.value))
          alert("Kategori");
        else if(authorPattern.test(query.value))
          alert("Författare");
        else
          alert("Sträng");
      }
    }
  }
}

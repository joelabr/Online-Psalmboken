/*
	Search-functions
*/
function NodeToXMLParser()
{
	this.nodeToXML	= function(node)
	{
		var xml	= null;
		if (window.ActiveXObject)
		{
			xml	= new ActiveXObject("Microsoft.XMLDOM");
			xml.async	= "false";
			xml.loadXML(node.xml);
		}
		else
			xml	= new DOMParser().parseFromString(new XMLSerializer().serializeToString(node),
												  "text/xml");
												  
		return xml;
	}
}
	
function presentResults(hymn)
{
	if (hymn)
	{
		var xml	= new NodeToXMLParser().nodeToXML(hymn);
		var xsl	= loadXMLDoc("xml/hymn.xsl");
		
		var searchResults	= document.getElementById("searchresults");
		// Code for IE
		if (window.ActiveXObject)
		{
			xml.setProperty("SelectionLanguage", "XPath");
			var ex	= xml.transformNode(xsl);
			searchResults.innerHTML	= ex + searchResults.innerHTML;
		}
		// Code for Mozilla, Firefox, Opera, etc.
		else if (document.implementation && document.implementation.createDocument)
		{
			var xsltProcessor	= new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);
			var resultDocument	= xsltProcessor.transformToFragment(xml, document);
			
			//alert(searchresults.childNodes[1]);
			if (resultDocument)
				searchResults.insertBefore(resultDocument, searchResults.childNodes[1]);
		}
		
		jsI18n.processPage();
		showElement("searchresults", true);
	}
}

// Read XML-files
function HymnBook(fname)
{
	var file		= fname;
	var xmlDoc		= null;
	var lastResults	= null;
	
	this.readFile	= function()
	{
		new Ajax.Request(file,
						 {
							asynchronous: false,
							onComplete: function(response)
							{
								xmlDoc	= response.responseXML;
							}
						 });
	}
	
	// Read the XML-document
	this.readFile();
	
	// Search hymn number
	this.searchNumber	= function(num)
	{
		if (!isNaN(num) && xmlDoc != null)
		{
			if (window.ActiveXObject)
			{
				lastResults	= this.evaluate("/hymns/hymn[number=" + num + "]");
				
				if (lastResults && lastResults.length > 0)
					presentResults(lastResults[0]);
			}
			else
			{
				lastResults	= this.evaluate("/hymns/hymn[number=" + num + "]", null, XPathResult.ANY_TYPE, null);
				
				try
				{
					var temp	= lastResults.iterateNext();
					
					if (temp)
						presentResults(temp);
				}
				catch (e)
				{
					alert('Error: Document tree modified during iteration ' + e);
				}
			}
		}
	}
	
	this.evaluate	= function(xpath, nsResolver, resultType, result)
	{
		var res	= null;
		if (xmlDoc != null)
		{
			if (window.ActiveXObject)
			{
				xmlDoc.setProperty("SelectionLanguage", "XPath");
				
				res	= xmlDoc.selectNodes(xpath);
			}
			else
				res	= xmlDoc.evaluate(xpath, xmlDoc, nsResolver, resultType, result);
		}
		
		return res;
	}
}

var test	= new HymnBook("xml/1937.xml");

function searchHymn()
{
	if (document.hymnform.searchquery)
	{
		var query	= document.hymnform.searchquery;
		
		if (query.value != "")
		{
			if (!isNaN(query.value))
				if (query.value > 0)
					test.searchNumber(query.value);
			else
			{
				var pattern	= /^\d+:+\d+$/;
				
				if (pattern.test(query.value))
					alert("Psalm + Vers");
				else
					alert("Sträng");
			}
		}
	}
}
/** Deprecated. Used as reference material for future work */
function HymnEditor()
{
  this.hymns = new Array()

  this.addHymn = function(form)
  {
    var verses = this.parseVerses(form.verses.value)
    var authors = this.parseAuthors(form.authors.value)
    var hymn = {"number":form.number.value, "title":form.title.value,
      "category":form.category.value, "authors":authors, "verses":verses,
      "copyright":form.copyright.value}
   
    if(this.validHymn(hymn))
    {
      var index = this.getHymnIndex(hymn["number"])
      if(index == -1) //New hymn 
        this.hymns.push(hymn)
      else            //Existing hymn. Replace
        this.hymns[index] = hymn

      form.reset()
      form.number.focus()
      this.updateHymnList()
    }
  }
  
  this.editHymn = function(num)
  {
    var hymn = this.findHymn(num)
    if(hymn != null)
      initializeForm(hymn)
  }

  this.findHymn = function(num) {
    var hymn = null
    for(var i = 0; i < this.hymns.size(); i++)
    {
      if(this.hymns[i]["number"] == num)
        return this.hymns[i]
    }
    return hymn
  }
  
  this.getHymnIndex = function(num)
  {
    for(var i = 0; i < this.hymns.size(); i++)
    {
      if(this.hymns[i]["number"] == num)
        return i
    }
    return -1;
  }
  
  this.getXML = function() {
    var xml = "<hymns>"
    for(var i = 0; i < this.hymns.length; i++)
    {
        var hymn = this.hymns[i];
        xml += "\n\t<hymn>"
        xml += "\n\t\t<number>"+hymn["number"]+"</number>"
        xml += "\n\t\t<title>"+hymn["title"]+"</title>"
        xml += "\n\t\t<category>"+hymn["category"]+"</category>"
        xml += "\n\t\t<copyright>"+hymn["copyright"]+"</copyright>"
        xml += "\n\t\t<authors>"
        for(var a = 0; a < hymn["authors"].length; a++)
        { 
          var author = hymn["authors"][a]
          xml += "\n\t\t\t<author>"
          xml += "\n\t\t\t\t<name>"+author["name"]+"</name>"
          xml += "\n\t\t\t\t<year>"+author["year"]+"</year>"
          xml += "\n\t\t\t</author>"
        }
        xml += "\n\t\t</authors>"
        xml += "\n\t\t<verses>"
        for(var v = 0; v < hymn["verses"].length; v++)
        {
          var verse = hymn["verses"][v]
          xml += "\n\t\t\t<verse number=\""+(v+1)+"\">"
          xml += verse
          xml += "</verse>"
        }
        xml += "\n\t\t</verses>"
        xml += "\n\t\t<melodies>"
        xml += "\n\t\t\t<melody>"
        xml += "\n\t\t\t\t<id>A</id>"
        xml += "\n\t\t\t\t<author></author>"
        xml += "\n\t\t\t\t<sheet>"+hymn["number"]+"</sheet>"
        xml += "\n\t\t\t</melody>"
        xml += "\n\t\t</melodies>"
        xml += "\n\t</hymn>"
    }

    xml += "\n</hymns>"
    return xml;
  }

  function initializeForm(hymn) 
  {
    var authors = "";
    for(var i = 0; i < hymn["authors"].size(); i++)
      authors += hymn["authors"][i]["name"] + " (" + 
        hymn["authors"][i]["year"] + "), "
    authors = authors.substring(0, authors.length-2)//Strip trailing ,
    
    var form = document.getElementById("hymnform")
    form.number.value = hymn["number"]
    form.title.value = hymn["title"]
    form.category.value = hymn["category"]
    form.authors.value = authors
    form.verses.value = hymn["verses"].join("\n\n")
  }
  
  this.loadHymns = function()
  {
    var hymnBook = new HymnBook("xml/1937.xml")
    var iterator = hymnBook.allHymns()
    var hn = iterator.iterateNext()
    while(hn != null)
    {
      var hymn = new Object()
      hymn["number"] = hn.getElementsByTagName("number")[0].textContent
      hymn["title"] = hn.getElementsByTagName("title")[0].textContent
      hymn["category"] = hn.getElementsByTagName("category")[0].textContent
      hymn["copyright"] = hn.getElementsByTagName("copyright")[0].textContent
      hymn["authors"] = new Array()
      hymn["verses"] = new Array()
     
      var authors = hn.getElementsByTagName("authors")[0].
        getElementsByTagName("author")
      for(var i = 0; i < authors.length; i++)
      {
        var name = authors[i].getElementsByTagName("name")[0].textContent
        var year = authors[i].getElementsByTagName("year")[0].textContent
        hymn["authors"].push({"name":name, "year":year})
      }
      
      var verses = hn.getElementsByTagName("verse")
      for(var i = 0; i < verses.length; i++)
        hymn["verses"].push(verses[i].textContent) 
      
      this.hymns.push(hymn)
      hn = iterator.iterateNext()
    }

    this.updateHymnList()
  }
  
  this.parseAuthors = function(authorString) {
    var authors = new Array()
    var namesAndYears = authorString.split(",")
    for(var i = 0; i < namesAndYears.size(); i++)
    {
      var pair = namesAndYears[i]
      if(pair == "") continue
      var yearIndex = pair.indexOf("(") + 1
      if(yearIndex > 0)
      {
        var name = pair.substr(0, yearIndex - 1)
        var year = pair.substr(yearIndex, pair.length - yearIndex - 1)
        authors.push({"name":this.trunc(name), "year":this.trunc(year)})
      }
      else
        authors.push({"name":this.trunc(pair), "year":""})
    }
    return authors
  }
  
  this.parseVerses = function(verseString) {
    verseString = verseString.replace(/\**\d+\./g, "") //No verse numbers
    var verses = verseString.split("\n\n")
    for(var i = 0; i < verses.size(); i++)
      verses[i] = this.trunc(verses[i])

    return verses;
  }

  this.removeHymn = function(num) {
    var index = this.getHymnIndex(num)
    if(index != -1)
    {
      this.hymns[index] = this.hymns[this.hymns.length-1]
      this.hymns.pop()
      this.updateHymnList()
    }
  }

  //Truncate whitespace and newlines
  this.trunc = function(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\n/g, "").
      replace(/\s{2,}/g, " ")
  }

  this.updateHymnList = function()
  {
    //Sort hymns
    this.hymns.sort(function(a, b) {
      if(parseInt(a["number"]) < parseInt(b["number"]))
        return -1;
      if(parseInt(a["number"]) > parseInt(b["number"]))
        return 1;
      return 0;
    })
    
    var list = document.getElementById("hymns")
    var rows = ""; 
    for(var i = 0; i < this.hymns.size(); i++)
    {
      var hymn = this.hymns[i]
      var numberCell = "<td class\"numbercell\"><strong>"+
                            hymn["number"]+"</strong>.</td>" 
      var titleCell = "<td><a href=\"javascript:hymnEditor.editHymn('" +
        hymn["number"] + "')\">" + hymn["title"] + "</a></td>"
      var removeCell = "<td><a href=\"javascript:hymnEditor.removeHymn('" +
        hymn["number"] + "')\">Remove</a></td>"

      rows += "<tr>" + numberCell + titleCell + removeCell + "</tr>"
    }
    list.innerHTML = rows
  }
  
  this.updateXML = function() 
  {
    var elem = document.getElementById("xmlcontainer")
    elem.value = this.getXML()
  }

  this.validHymn = function(hymn) {
    var validNumber = !!hymn["number"].match(/^\d+$/)
    var validTitle = hymn["title"].length > 0
    var validCategory = hymn["category"].length > 0
    var validAuthor = hymn["authors"].size() > 0
    var validVerse = hymn["verses"].size() > 0 && hymn["verses"][0] != ""
    return validNumber && validTitle && validCategory && validAuthor &&
      validVerse
  }
}

hymnEditor = new HymnEditor()

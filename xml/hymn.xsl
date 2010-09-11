<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:variable name="divID" select="generate-id(/)" />
  <xsl:variable name="hymnID" select="generate-id(hymn/verses)" />
  <xsl:variable name="melodyID" select="generate-id(hymn/melodies/melody)" />
  
  <xsl:template match="/">
    <div id="{$divID}" class="box">
      <p class="lessMarginBottom">
        <a href="javascript:nop()" onclick="app.searchHymn('category:{hymn/category}')"><xsl:value-of select="hymn/category" /></a> &#160;&#187;&#160; 
        <span class="colorRed"><xsl:value-of select="hymn/number" />.&#160;
        <xsl:value-of select="hymn/title" /></span>
        <a class="imageButton closeImage rightAlign" href="javascript: app.removeSearchResult('{$divID}');"></a>
        <a data-trans="title=showresults" class="imageButton expandImage rightAlign" href="javascript: toggleVisibility('{$hymnID}');" title=""></a>
        <a data-trans="title=showmelody" class="imageButton noteImage rightAlign" href="javascript: toggleVisibility('{$melodyID}');" title=""></a>
        <a data-trans="title=playpause" class="imageButton playPauseImage rightAlign" href="javascript: void(0);" title=""></a>
        <!-- <select class="rightAlign lessMarginTop">
          <xsl:for-each select="hymn/melodies/melody">
            <option value="{id}"><xsl:value-of select="id" />, <xsl:value-of select="author" /></option>
          </xsl:for-each>
        </select> -->
      </p>
      
      <div id="{$hymnID}">
        <div id="{$melodyID}" class="hymnmelody hidden underline">
          <xsl:apply-templates select="hymn/melodies/melody[1]" />
        </div>
        <ul class="hymntext">
          <xsl:apply-templates select="hymn/verses/verse" />
        </ul>
        <div class="author">
          <xsl:apply-templates select="hymn/authors/author" />
        </div>

        <ul class="inlineMenu overline">
          <xsl:for-each select="hymn/melodies/melody">
            <li><a href="psalmer/{id}.mid"><span data-trans="melody"></span> - <xsl:value-of select="id" /></a></li>
          </xsl:for-each>
          <li class="rightAlign"><a data-trans="downloadmelody" href="#"></a></li>
        </ul>
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="melody">
    <img class="center" src="{sheet}" alt="{author}" />
    
    <div class="author">
      <xsl:value-of select="author" />
    </div>
  </xsl:template>
  
  <xsl:template match="verse">
    <li><xsl:value-of select="." /></li>
  </xsl:template>
  
  <xsl:template match="author">
    <xsl:choose>
      <xsl:when test=".=//author[last()]">
        <xsl:value-of select="name" />(<xsl:value-of select="year" />)
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="name" />(<xsl:value-of select="year" />), 
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>

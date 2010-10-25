<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:variable name="divID" select="generate-id(/)" />
  <xsl:variable name="hymnID" select="generate-id(hymn/verses)" />
  <xsl:variable name="melodyID" select="generate-id(hymn/melodies/melody)" />
  
  <xsl:template match="/">
    <div id="{$divID}" class="box">
      <div class="lessMarginBottom">
        <a href="javascript:void(0)" onclick="app.searchHymn('category:{hymn/category}')"><xsl:value-of select="hymn/category" /></a> &#160;&#187;&#160; 
        <span class="colorRed"><xsl:value-of select="hymn/number" />.&#160;
        <xsl:value-of select="hymn/title" /></span>
        <a class="iconFont rightAlign" href="javascript: app.removeSearchResult('{$divID}');">C</a>
        <a data-trans="title=showresults" class="iconFont rightAlign" href="javascript: toggleVisibility('{$hymnID}');" title="">B</a>
        <xsl:if test="count(hymn/melodies/melody) != 0">
          <xsl:apply-templates select="hymn/melodies" />
        </xsl:if>
      </div>
      
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
        <!-- <div class="overline">
          <a href="javascript:void(0)" onclick="app.sendErrorReport('')">Skicka felrapport</a>
        </div> -->
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="melodies">
    <xsl:if test="string-length(melody/sheet) > 0">
      <a data-trans="title=showmelody" class="imageButton noteImage rightAlign" href="javascript: toggleVisibility('{$melodyID}');" title=""></a>
    </xsl:if>
    <a data-trans="title=playpause" class="iconFont rightAlign" href="javascript: app.playPauseMelody('{$hymnID}');" title="">A</a>
    <div class="inline rightAlign">
      <span data-trans="melody"></span>
      <select class="lessMarginTop hymnselect" onchange="javascript: app.changeMelody('{$hymnID}', this.value)">
        <xsl:for-each select="melody">
          <option value="{file}"><xsl:value-of select="id" /></option>
        </xsl:for-each>
      </select>
      <audio id="audio_{$hymnID}" src="hymns/{melody/file}" ><span data-trans="oldbrowser" /></audio>
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
    <a href="javascript:void(0)" onclick="app.searchHymn('author:{name}')">
      <xsl:value-of select="name" />
    </a>
    <xsl:if test="string-length(year) > 0">(<xsl:value-of select="year" />)</xsl:if>
    <xsl:if test="position() != last()">, </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>

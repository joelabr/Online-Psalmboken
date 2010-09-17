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
        <a class="imageButton closeImage rightAlign" href="javascript: app.removeSearchResult('{$divID}');"></a>
        <a data-trans="title=showresults" class="imageButton expandImage rightAlign" href="javascript: toggleVisibility('{$hymnID}');" title=""></a>
        <a data-trans="title=showmelody" class="imageButton noteImage rightAlign" href="javascript: toggleVisibility('{$melodyID}');" title=""></a>
        <a data-trans="title=playpause" class="imageButton playPauseImage rightAlign" href="javascript: app.playPauseMelody('{$hymnID}');" title=""></a>
        <xsl:if test="count(hymn/melodies/melody) != 0">
          <div class="inline rightAlign">
            <span data-trans="melody"></span>
            <select class="lessMarginTop hymnselect" onchange="javascript: app.changeMelody('{$hymnID}', this.value)">
              <xsl:for-each select="hymn/melodies/melody">
                <option value="{../../number}{id}.ogg"><xsl:value-of select="id" /></option>
              </xsl:for-each>
            </select>
            <audio id="audio_{$hymnID}" src="hymns/{hymn/number}A.ogg" ><span data-trans="oldbrowser" /></audio>
          </div>
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
    <a href="javascript:void(0)" onclick="app.searchHymn('author:{name}')">
      <xsl:value-of select="name" />
    </a>
    <xsl:if test="year > 0">(<xsl:value-of select="year" />)</xsl:if>
    <xsl:if test="position() != last()">, </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>

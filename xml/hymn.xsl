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
        <ul class="annotations">
          <xsl:apply-templates select="hymn/annotations/annotation" />
        </ul>
        <ul class="hymntext">
          <xsl:apply-templates select="hymn/verses/verse" />
        </ul>
        <xsl:apply-templates select="hymn/copyright" />
        <div class="author">
          <xsl:apply-templates select="hymn/authors/author" />
        </div>
        <xsl:if test="contains(hymn/melodies/melody[1]/file, '_')">
          <div class="overline smallText">
            <a id="{$hymnID}_showHymnsSameMelody" data-trans="samemelody" href="javascript: app.showHymnsWithMelody('{$hymnID}')">Visa psalmer som kan sjungas med samma melodi</a>
            <ul id="{$hymnID}_hymnsWithSameMelodyList" class="hidden inlineMenu">
            </ul>
          </div>
        </xsl:if>
        <!-- <div class="overline">
          <a href="javascript:void(0)" onclick="app.sendErrorReport('')">Skicka felrapport</a>
        </div> -->
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="melodies">
    <xsl:if test="string-length(melody/sheet) > 0">
      <a data-trans="title=showmelody" class="iconFont rightAlign" href="javascript: toggleVisibility('{$melodyID}');" title="">E</a>
    </xsl:if>
    <xsl:if test="string-length(melody/file) > 0">
      <a data-trans="title=downloadmelody" class="iconFont rightAlign" href="hymns/midi/{melody/file}.mid" title="">D</a>
      <a data-trans="title=playpause" class="iconFont rightAlign" href="javascript: app.playPauseMelody('{$hymnID}');" title="">A</a>
    </xsl:if>
    <div class="inline rightAlign">
      <span data-trans="melody"></span>
      <select id="{$hymnID}_melodySelector" class="lessMarginTop hymnselect" onchange="javascript: app.changeMelody('{$hymnID}')">
        <xsl:for-each select="melody">
          <option value="{file}"><xsl:value-of select="id" /></option>
        </xsl:for-each>
      </select>
      <audio id="{$hymnID}_audio">
        <source src="hymns/ogg/{melody/file}.ogg" />
        <source src="hymns/mp3/{melody/file}.mp3" />
        <span data-trans="oldbrowser" />
      </audio>
    </div>
  </xsl:template>
  
  <xsl:template match="melody">
    <img class="center" src="{sheet}" alt="{author}" />
    
    <div class="author">
      <xsl:value-of select="author" />
    </div>
  </xsl:template>
  
  <xsl:template match="annotation">
    <li title="" data-trans="title={@type}"><xsl:value-of select="." /></li>
  </xsl:template>
  
  <xsl:template match="verse">
    <li><xsl:value-of select="." /></li>
  </xsl:template>

  <xsl:template match="copyright">
    <xsl:if test="number(.) > 0">
      <div class="copyright">
        © <span data-trans="copyright-to"></span>
        <xsl:value-of select="." />
      </div>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="author">
    <a href="javascript:void(0)" onclick="app.searchHymn('author:{name}')">
      <xsl:value-of select="name" />
    </a>
    <xsl:if test="string-length(year) > 0">(<xsl:value-of select="year" />)</xsl:if>
    <xsl:if test="position() != last()">, </xsl:if>
  </xsl:template>
  
  <!-- <xsl:template name="splitMelody">
    <xsl:param name="inputString"></xsl:param>
    <xsl:param name="firstString" select="substring-before($inputString, '_')" />
    <xsl:param name="remainingString" select="substring-after($inputString, '_')" />
    
    <xsl:choose>
      <xsl:when test="contains($inputString, '_')">        
        <li><a href="javascript: app.searchHymn('{number($firstString)}')"><xsl:value-of select="number($firstString)" /></a></li>

        <xsl:if test="$remainingString != ''">
          <xsl:call-template name="splitMelody">
            <xsl:with-param name="inputString" select="$remainingString" />
          </xsl:call-template>
        </xsl:if>
      </xsl:when>
      <xsl:otherwise>
        <li><a href="javascript: app.searchHymn('{number($inputString)}')"><xsl:value-of select="number($inputString)" /></a></li>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template> -->
</xsl:stylesheet>

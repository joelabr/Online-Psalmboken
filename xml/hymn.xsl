<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="/">
		<div>
			<!-- <h6 data-trans="searchresults"></h6> -->
			<div class="box">
				<p><span data-trans="hymnnumber" style="color:#C80815"></span><xsl:value-of select="hymn/number" /></p>
				<p><span data-trans="hymntitle" style="color:#C80815"></span><xsl:value-of select="hymn/title" /></p>
				<p><span data-trans="category" style="color:#C80815"></span><xsl:value-of select="hymn/category" /></p>
				
				<br />
				<p class="underline"><a data-trans="showmelody" class="smallText" href="javascript: toggleVisibility('hymnmelody');"></a></p>
				<div class="hymnmelody underline">
					<xsl:apply-templates select="hymn/melodies/melody[1]" />
				</div>
				<ul class="hymntext">
					<xsl:apply-templates select="hymn/verses/verse" />
				</ul>
				<div class="author">
					<xsl:apply-templates select="hymn/authors/author" />
				</div>
				
				<ul class="inlineMenu overline">
					<li><a href="#"><span data-trans="melody"></span> 1</a></li>
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
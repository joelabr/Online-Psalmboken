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
				<div class="hymnmelody hidden underline">
					<img class="center" src="http://www2.siba.fi/virtuaalikatedraali/vanhatvirret/e7.gif" alt="Temp melody"/>
					<footer class="author">
						Carlus Loremus, 2008
					</footer>
				</div>
				<ul class="hymntext">
					<xsl:for-each select="hymn/verses/verse">
						<li><xsl:value-of select="." /></li>
					</xsl:for-each>
				</ul>
				<footer class="author">
					<xsl:for-each select="hymn/authors">
						<xsl:choose>
							<xsl:when test="author[last()]">
								<xsl:value-of select="author/name" />(<xsl:value-of select="author/year" />)
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="author/name" />(<xsl:value-of select="author/year" />), 
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</footer>
				
				<ul class="inlineMenu overline">
					<li><a href="#"><span data-trans="melody"></span> 1</a></li>
					<li class="rightAlign"><a data-trans="downloadmelody" href="#"></a></li>
				</ul>
			</div>
		</div>
	</xsl:template>

</xsl:stylesheet>
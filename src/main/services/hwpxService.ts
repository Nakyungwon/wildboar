import JSZip from 'jszip'
import { writeFile } from 'fs/promises'
import type { FormSchema, FormData } from '../../shared/types/form'
import type { DocumentGenerationResult } from '../../shared/types/document'

// HWPX XML declaration (matches Hancom output exactly)
const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'

// Full HWPML namespace set declared by Hancom on the root of every content document.
// Hancom's parser is strict about these being present, so we replicate the complete set.
const HWPML_NS = [
  'xmlns:ha="http://www.hancom.co.kr/hwpml/2011/app"',
  'xmlns:hp="http://www.hancom.co.kr/hwpml/2011/paragraph"',
  'xmlns:hp10="http://www.hancom.co.kr/hwpml/2016/paragraph"',
  'xmlns:hs="http://www.hancom.co.kr/hwpml/2011/section"',
  'xmlns:hc="http://www.hancom.co.kr/hwpml/2011/core"',
  'xmlns:hh="http://www.hancom.co.kr/hwpml/2011/head"',
  'xmlns:hhs="http://www.hancom.co.kr/hwpml/2011/history"',
  'xmlns:hm="http://www.hancom.co.kr/hwpml/2011/master-page"',
  'xmlns:hpf="http://www.hancom.co.kr/schema/2011/hpf"',
  'xmlns:dc="http://purl.org/dc/elements/1.1/"',
  'xmlns:opf="http://www.idpf.org/2007/opf/"',
  'xmlns:ooxmlchart="http://www.hancom.co.kr/hwpml/2016/ooxmlchart"',
  'xmlns:hwpunitchar="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar"',
  'xmlns:epub="http://www.idpf.org/2007/ops"',
  'xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"'
].join(' ')

// Generate proper header.xml with required style definitions
function generateHeaderXml(): string {
  return `${XML_DECL}
<hh:head ${HWPML_NS} version="1.4" secCnt="1">
  <hh:beginNum page="1" footnote="1" endnote="1" pic="1" tbl="1" equation="1"/>
  <hh:refList>
    <hh:fontfaces itemCnt="7">
      <hh:fontface lang="HANGUL" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
      <hh:fontface lang="LATIN" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
      <hh:fontface lang="HANJA" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
      <hh:fontface lang="JAPANESE" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
      <hh:fontface lang="OTHER" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
      <hh:fontface lang="SYMBOL" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
      <hh:fontface lang="USER" fontCnt="1">
        <hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0"/>
      </hh:fontface>
    </hh:fontfaces>
    <hh:borderFills itemCnt="1">
      <hh:borderFill id="1" threeD="0" shadow="0" centerLine="NONE" breakCellSeparateLine="0">
        <hh:slash type="NONE" crooked="0" isCounter="0"/>
        <hh:backSlash type="NONE" crooked="0" isCounter="0"/>
        <hh:leftBorder type="NONE" width="0.12mm" color="#000000"/>
        <hh:rightBorder type="NONE" width="0.12mm" color="#000000"/>
        <hh:topBorder type="NONE" width="0.12mm" color="#000000"/>
        <hh:bottomBorder type="NONE" width="0.12mm" color="#000000"/>
        <hh:diagonal type="NONE" width="0.12mm" color="#000000"/>
        <hh:fillBrush>
          <hh:winBrush faceColor="NONE" hatchColor="#FFFFFF" alpha="0"/>
        </hh:fillBrush>
      </hh:borderFill>
    </hh:borderFills>
    <hh:charProperties itemCnt="1">
      <hh:charPr id="0" height="1000" textColor="#000000" shadeColor="NONE" useFontSpace="0" useKerning="0" symMark="NONE" borderFillIDRef="1">
        <hh:fontRef hangul="0" latin="0" hanja="0" japanese="0" other="0" symbol="0" user="0"/>
        <hh:ratio hangul="100" latin="100" hanja="100" japanese="100" other="100" symbol="100" user="100"/>
        <hh:spacing hangul="0" latin="0" hanja="0" japanese="0" other="0" symbol="0" user="0"/>
        <hh:relSz hangul="100" latin="100" hanja="100" japanese="100" other="100" symbol="100" user="100"/>
        <hh:offset hangul="0" latin="0" hanja="0" japanese="0" other="0" symbol="0" user="0"/>
        <hh:bold>0</hh:bold>
        <hh:italic>0</hh:italic>
        <hh:underline type="NONE" shape="SOLID" color="#000000"/>
        <hh:strikeout shape="NONE" color="#000000"/>
        <hh:outline type="NONE"/>
        <hh:shadow type="NONE" color="#B2B2B2" offsetX="10" offsetY="10"/>
        <hh:emboss>0</hh:emboss>
        <hh:engrave>0</hh:engrave>
        <hh:supscript>0</hh:supscript>
        <hh:subscript>0</hh:subscript>
      </hh:charPr>
    </hh:charProperties>
    <hh:tabProperties itemCnt="1">
      <hh:tabPr id="0" autoTabLeft="0" autoTabRight="0"/>
    </hh:tabProperties>
    <hh:numberings itemCnt="0"/>
    <hh:bullets itemCnt="0"/>
    <hh:paraProperties itemCnt="1">
      <hh:paraPr id="0" tabPrIDRef="0" condense="0" fontLineHeight="0" snapToGrid="1" suppressLineNumbers="0" checked="0">
        <hh:align horizontal="JUSTIFY" vertical="BASELINE"/>
        <hh:breakSetting breakLatinWord="KEEP_WORD" breakNonLatinWord="KEEP_WORD" widowOrphan="0" keepWithNext="0" keepLines="0" pageBreakBefore="0" lineWrap="BREAK"/>
        <hh:margin left="0" right="0" indent="0" prev="0" next="0"/>
        <hh:lineSpacing type="PERCENT" value="160"/>
        <hh:border borderFillIDRef="1" offsetLeft="0" offsetRight="0" offsetTop="0" offsetBottom="0" connect="0" ignoreMargin="0"/>
        <hh:autoSpacing eAsianEng="0" eAsianNum="0"/>
      </hh:paraPr>
    </hh:paraProperties>
    <hh:styles itemCnt="1">
      <hh:style id="0" type="PARA" name="바탕글" engName="Normal" paraPrIDRef="0" charPrIDRef="0" nextStyleIDRef="0" langId="1042" lockForm="0"/>
    </hh:styles>
    <hh:memoProperties itemCnt="0"/>
    <hh:trackChanges itemCnt="0"/>
    <hh:trackChangeAuthors itemCnt="0"/>
  </hh:refList>
  <hh:compatibleDocument targetProgram="HWP201X"/>
  <hh:docOption>
    <hh:linkInfo path="" pageInherit="1" footnoteInherit="1"/>
  </hh:docOption>
  <hh:trackChangeConfig flags="0"/>
</hh:head>`
}

// The <hp:secPr> block lives INSIDE the first run of the first paragraph (per the
// HWPML schema and Hancom's own output) — not as a direct child of <hs:sec>.
const SEC_PR = `<hp:secPr id="" textDirection="HORIZONTAL" spaceColumns="1134" tabStop="8000" tabStopVal="4000" tabStopUnit="HWPUNIT" outlineShapeIDRef="1" memoShapeIDRef="0" textVerticalWidthHead="0" masterPageCnt="0"><hp:grid lineGrid="0" charGrid="0" wonggojiFormat="0"/><hp:startNum pageStartsOn="BOTH" page="0" pic="0" tbl="0" equation="0"/><hp:visibility hideFirstHeader="0" hideFirstFooter="0" hideFirstMasterPage="0" border="SHOW_ALL" fill="SHOW_ALL" hideFirstPageNum="0" hideFirstEmptyLine="0" showLineNumber="0"/><hp:lineNumberShape restartType="0" countBy="0" distance="0" startNumber="0"/><hp:pagePr landscape="WIDELY" width="59528" height="84188" gutterType="LEFT_ONLY"><hp:margin header="4251" footer="4251" gutter="0" left="8503" right="8503" top="5669" bottom="4251"/></hp:pagePr><hp:footNotePr><hp:autoNumFormat type="DIGIT" userChar="" prefixChar="" suffixChar=")" supscript="0"/><hp:noteLine length="-1" type="SOLID" width="0.12mm" color="#000000"/><hp:noteSpacing betweenNotes="283" belowLine="567" aboveLine="850"/><hp:numbering type="CONTINUOUS" newNum="1"/><hp:placement place="EACH_COLUMN" beneathText="0"/></hp:footNotePr><hp:endNotePr><hp:autoNumFormat type="DIGIT" userChar="" prefixChar="" suffixChar=")" supscript="0"/><hp:noteLine length="-1" type="SOLID" width="0.12mm" color="#000000"/><hp:noteSpacing betweenNotes="0" belowLine="567" aboveLine="850"/><hp:numbering type="CONTINUOUS" newNum="1"/><hp:placement place="END_OF_DOCUMENT" beneathText="0"/></hp:endNotePr><hp:pageBorderFill type="BOTH" borderFillIDRef="1" textBorder="PAPER" headerInside="0" footerInside="0" fillArea="PAPER"><hp:offset left="1417" right="1417" top="1417" bottom="1417"/></hp:pageBorderFill></hp:secPr>`

const LINESEG =
  '<hp:linesegarray><hp:lineseg textpos="0" vertpos="0" vertsize="1000" textheight="1000" baseline="850" spacing="600" horzpos="0" horzsize="42520" flags="393216"/></hp:linesegarray>'

// Generate section XML. The first paragraph carries the section properties (secPr)
// inside its first run; remaining paragraphs are plain text runs.
function generateSectionXml(paragraphs: { text: string }[]): string {
  const paraElements = paragraphs
    .map((p, idx) => {
      const secPr = idx === 0 ? SEC_PR : ''
      const textNode = p.text === '' ? '<hp:t/>' : `<hp:t>${escapeXml(p.text)}</hp:t>`
      return `<hp:p id="${idx}" paraPrIDRef="0" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0">${secPr}${textNode}</hp:run>${LINESEG}</hp:p>`
    })
    .join('')

  return `${XML_DECL}
<hs:sec ${HWPML_NS}>${paraElements}</hs:sec>`
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Generate META-INF/container.xml. Hancom's OCF parser requires the ocf: namespace
// and ocf:rootfile entries to locate the package root (Contents/content.hpf).
function generateContainerXml(): string {
  return `${XML_DECL}<ocf:container xmlns:ocf="urn:oasis:names:tc:opendocument:xmlns:container" xmlns:hpf="http://www.hancom.co.kr/schema/2011/hpf"><ocf:rootfiles><ocf:rootfile full-path="Contents/content.hpf" media-type="application/hwpml-package+xml"/></ocf:rootfiles></ocf:container>`
}

// Generate META-INF/manifest.xml. Real Hancom HWPX files ship an empty odf:manifest
// (file listing lives in content.hpf), so we match that exactly.
function generateManifestXml(): string {
  return `${XML_DECL}<odf:manifest xmlns:odf="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"/>`
}

// Generate Contents/content.hpf (the OPF package manifest). hrefs are relative to the
// package ROOT (e.g. "Contents/header.xml"), not to content.hpf's own location. The
// spine lists header then section0, matching Hancom's output.
function generateContentHpf(title: string): string {
  return `${XML_DECL}<opf:package ${HWPML_NS} version="" unique-identifier="" id=""><opf:metadata><opf:title>${escapeXml(title)}</opf:title><opf:language>ko</opf:language><opf:meta name="creator" content="text">WildBoar</opf:meta></opf:metadata><opf:manifest><opf:item id="header" href="Contents/header.xml" media-type="application/xml"/><opf:item id="section0" href="Contents/section0.xml" media-type="application/xml"/><opf:item id="settings" href="settings.xml" media-type="application/xml"/></opf:manifest><opf:spine><opf:itemref idref="header" linear="yes"/><opf:itemref idref="section0"/></opf:spine></opf:package>`
}

// Generate version.xml. Hancom uses the hv:HCFVersion element (not hv:version);
// the wrong root element causes the document to be rejected.
function generateVersionXml(): string {
  return `${XML_DECL}<hv:HCFVersion xmlns:hv="http://www.hancom.co.kr/hwpml/2011/version" tagetApplication="WORDPROCESSOR" major="5" minor="0" micro="5" buildNumber="0" os="1" xmlVersion="1.4" application="WildBoar" appVersion="1.0.0"/>`
}

// Generate settings.xml. Root element must be ha:HWPApplicationSetting.
function generateSettingsXml(): string {
  return `${XML_DECL}<ha:HWPApplicationSetting xmlns:ha="http://www.hancom.co.kr/hwpml/2011/app" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"><ha:CaretPosition listIDRef="0" paraIDRef="0" pos="0"/></ha:HWPApplicationSetting>`
}

export async function generateHwpx(
  data: FormData,
  schema: FormSchema,
  outputPath: string
): Promise<DocumentGenerationResult> {
  try {
    const zip = new JSZip()

    // Collect paragraphs from form data
    const paragraphs: { text: string }[] = []

    // Add title
    if (schema.name) {
      paragraphs.push({ text: schema.name })
      paragraphs.push({ text: '' }) // Empty line after title
    }

    // Add content based on form data and schema mapping
    for (const field of schema.fields) {
      const value = data[field.id]
      if (value !== undefined && value !== null) {
        const label = field.label
        const text = `${label}: ${String(value)}`
        paragraphs.push({ text })
      }
    }

    // If no paragraphs, add a default empty one
    if (paragraphs.length === 0) {
      paragraphs.push({ text: '' })
    }

    // createFolders: false suppresses explicit directory entries (META-INF/, Contents/),
    // matching real Hancom HWPX archives which list only files.
    const opts = { createFolders: false }

    // Add mimetype (must be first, uncompressed)
    zip.file('mimetype', 'application/hwp+zip', { compression: 'STORE', createFolders: false })

    // Add META-INF files
    zip.file('META-INF/container.xml', generateContainerXml(), opts)
    zip.file('META-INF/manifest.xml', generateManifestXml(), opts)

    // Add Contents files
    zip.file('Contents/header.xml', generateHeaderXml(), opts)
    zip.file('Contents/content.hpf', generateContentHpf(schema.name || 'WildBoar Document'), opts)
    zip.file('Contents/section0.xml', generateSectionXml(paragraphs), opts)

    // Add root files
    zip.file('version.xml', generateVersionXml(), opts)
    zip.file('settings.xml', generateSettingsXml(), opts)

    // Generate the HWPX file
    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    })

    await writeFile(outputPath, buffer)

    return { success: true, path: outputPath }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

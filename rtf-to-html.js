'use strict'
module.exports = rtfToHTML

function rtfToHTML (doc) {
  const defaults = {
    font: doc.content[0].style.font || {name: 'Times', family: 'roman'},
    fontSize: doc.content[0].style.fontSize || 24,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    foreground: {red: 0, blue: 0, green: 0},
    background: {red: 255, blue: 255, green: 255},
    firstLineIndent: doc.content[0].style.firstLineIndent || 0,
    indent: 0,
    align: 'left',
    valign: 'normal'
  }
  const content = doc.content.map(para => renderPara(para, defaults)).filter(html => html != null).join('\n\n')
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  margin-left: ${doc.marginLeft / 20}pt;
  margin-right: ${doc.marginRight / 20}pt;
  margin-top: ${doc.marginTop / 20}pt;
  margin-bottom: ${doc.marginBottom /20}pt;
  font-family: ${defaults.font.name.replace(/-\w+$/,'')}, ${genericFontMap[defaults.font.family]};
  text-indent: ${defaults.firstLineIndent / 20}pt;
}
</style>
</head>
<body>
${content}
</body>
</html>
`
}

const genericFontMap = {
  roman: 'serif',
  swiss: 'sans-serif',
  script: 'cursive',
  decor: 'fantasy',
  modern: 'sans-serif',
  tech: 'monospace',
  bidi: 'serif'
}

function colorEq (aa, bb) {
  if (!aa && !bb) return true
  if (!bb) return false
  return aa.red === bb.red && aa.blue === bb.blue && aa.green === bb.green
}

function CSS (chunk, defaults) {
  let css = ''
  if (chunk.style.foreground != null && !colorEq(chunk.style.foreground, defaults.foreground)) {
    css += `color: rgb(${chunk.style.foreground.red}, ${chunk.style.foreground.green}, ${chunk.style.foreground.blue});`
  }
  if (chunk.style.background != null && !colorEq(chunk.style.background, defaults.background)) {
    css += `background-color: rgb(${chunk.style.background.red}, ${chunk.style.background.green}, ${chunk.style.background.blue});`
  }
  if (chunk.style.firstLineIndent != null && chunk.style.firstLineIndent > 0 && chunk.style.firstLineIndent !== defaults.firstLineIndent) {
    css += `text-indent: ${chunk.style.firstLineIndent / 20}pt;`
  }
  if (chunk.style.indent != null && chunk.style.indent !== defaults.indent) {
    css += `padding-left: ${chunk.style.indent / 20}pt;`
  }
  if (chunk.style.align != null && chunk.style.align !== defaults.align) {
    css += `text-align: ${chunk.style.align};`
  }
  if (chunk.style.fontSize != null && chunk.style.fontSize !== defaults.fontSize) {
    css += `font-size: ${chunk.style.fontSize / 2}pt;`
  }
  if (chunk.style.font != null && chunk.style.font.name !== defaults.font.name) {
    css += `font-family: ${chunk.style.font.name.replace(/-\w+$/,'')}, ${genericFontMap[chunk.style.font.family]};`
  }
  return css
}

function styleTags (chunk, defaults) {
  let open = ''
  let close = ''
  if (chunk.style.italic != null && chunk.style.italic !== defaults.italic) {
    open += '<em>'
    close = '</em>' + close
  }
  if (chunk.style.bold != null && chunk.style.bold !== defaults.bold) {
    open += '<strong>'
    close = '</strong>' + close
  }
  if (chunk.style.strikethrough != null && chunk.style.strikethrough !== defaults.strikethrough) {
    open += '<s>'
    close = '</s>' + close
  }
  if (chunk.style.underline != null && chunk.style.underline !== defaults.underline) {
    open += '<u>'
    close = '</u>' + close
  }
  if (chunk.style.valign != null && chunk.style.valign !== defaults.valign) {
    if (chunk.style.valign === 'super') {
      open += '<sup>'
      close = '</sup>' + close
    } else if (chunk.style.valign === 'sub') {
      open += '<sup>'
      close = '</sup>' + close
    }
  }
  return {open, close}
}

function renderPara (para, defaults) {
  if (para.content.length === 0) return
  const style = CSS(para, defaults)
  const tags = styleTags(para, defaults)
  return `<p${style ? ' style="' + style + '"' : ''}>${tags.open}${para.content.map(span => renderSpan(span, Object.assign({}, defaults, para.style))).join('')}${tags.close}</p>`
}

function renderSpan (span, defaults) {
  const style = CSS(span, defaults)
  const tags = styleTags(span, defaults)
  const value = `${tags.open}${span.value}${tags.close}`
  if (style) {
    return `<span style="${style}">${value}</span>`
  } else {
    return value
  }
}

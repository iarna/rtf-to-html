# @iarna/rtf-to-html

Convert RTF to HTML in pure JavaScript.

```
const rtfToHTML = require('@iarna/rtf-to-html')

fs.createReadStream('example.rtf').pipe(rtfToHTML((err, html) => {
  // …
})
rtfToHTML.fromStream(fs.createReadStream('example.rtf'), (err, html) => {
  // …
})
rtfToHTML.fromString('{\\rtf1\\ansi\\b hi there\\b0}', (err, html) => {
  console.log(html)
  // prints a document containing:
  // <p><strong>hi there</strong></p>
})
```

This is built on [`rtf-parser`](https://www.npmjs.com/package/rtf-parser)
and shares its limitations.

This generates complete HTML documents from RTF documents.  It does not
currently have the facility to work on snippets of either.

Supported features:

* Paragraph detection (results in `<p>` tags) plus empty paragraph trimming.
* Font (as `font-family: Font Name, Font Family`).  Font families in RTF
  don't map perfectly to HTML.  This is the mapping we currently use:
  * roman: serif
  * swiss: sans-serif
  * script: cursive
  * decor: fantasy
  * modern: sans-serif
  * tech: monospace
  * bidi: serif
* Font size (as `font-size: #pt`)
* Bold (as `<strong>`)
* Italic (as `<em>`)
* Underline (as `<u>`)
* Strikethrough (as `<s>`)
* Superscript (as `<sup>`)
* Subscript (as `<sub>`)
* Foreground color (as `color: rgb(#,#,#)`)
* Background color (as `color: rgb(#,#,#)`)
* Paragraph first-line indents (as `text-indent: #pt`)
* Idented regions (as `padding-left: #pt`)
* Text alignment: left, right, center, justify (as `text-align:`)

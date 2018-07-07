# @iarna/rtf-to-html

Convert RTF to HTML in pure JavaScript.

```js
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

## rtfToHTML([opts], cb) → WritableStream

* opts - Optional options to pass to the HTML generator. See the section on [Options](#options) for details.
* cb - A callback accepting `(err, html)`, see the section on the [Callback](#callback) for details.

Returns a WritableStream that you can pipe into.

## rtfToHTML.fromStream(stream[, opts], cb)

* stream - A readable stream that should contain RTF.
* opts - Optional options to pass to the HTML generator. See the section on [Options](#options) for details.
* cb - A callback accepting `(err, html)`, see the section on the [Callback](#callback) for details.

## rtfToHTML.fromString(string[, opts], cb)

* string - A string containing RTF.
* opts - Optional options to pass to the HTML generator. See the section on [Options](#options) for details.
* cb - A callback accepting `(err, html)`, see the section on the [Callback](#callback) for details.

## Callback

<a name="callback">
rtfToHTML returns HTML produced from RTF using a standard Node.js style
callback, which should accept the following arguments: `(err, html)`.

If we encounter an error in parsing then it will be set in `err`.  Otherwise
the resulting HTML will be in `html`.

## Options

<a name="options">
Options are always optional. You can configure how HTML is generated with the following:

* paraBreaks - (Defaults to `\n\n`) Inserted between resulting paragraphs.
* paraTag - (Defaults to `p`) The tagname to use for paragraphs.
* template - A function that is used to generate the final HTML document, defaults to:
  ```js
  function outputTemplate (doc, defaults, content) {
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
      body {
        margin-left: ${doc.marginLeft / 20}pt;
        margin-right: ${doc.marginRight / 20}pt;
        margin-top: ${doc.marginTop / 20}pt;
        margin-bottom: ${doc.marginBottom / 20}pt;
        font-size: ${defaults.fontSize / 2}pt;
        text-indent: ${defaults.firstLineIndent / 20}pt;
      }
      </style>
    </head>
    <body>
      ${content.replace(/\n/, '\n    ')}
    </body>
  </html>`
  }
  ```

You can also configure some of the starting (default) state of the output formatting with:

* disableFonts - Defaults to `true`. If you set this to `false` then we'll output font change information when we encounter it. This is
  a bit broken due to our not supporting styles.
* fontSize - Defaults to the document-wide declared font size, or if that's missing, `24`.
* bold - Defaults to `false`
* italic - Defaults to `false`
* underline - Defaults to `false`
* strikethrough - Defaults to `false`
* foreground - Defaults to `{red: 0, blue: 0, green: 0}`
* background - Defaults to `{red: 255, blue: 255, green: 255}`
* firstLineIndent - Defaults to the document-wide value, or if that's missing, `0`. This is how far to indent the first line of new paragraphs.
* indent: Defaults to `0`
* align: Defaults to `left`.
* valign: Defaults to `normal`

## const rtfToHTML = require('rtf-to-html/rtf-to-html.js')
## rtfToHTML(doc[, opts]) → HTML

This is internally how the other interfaces are implemented.  Unlike the
other interfaces, this one is synchronous.

* doc - A parsed RTF document as produced by the `rtf-parser` library.
* opts - Optional options, see the section on [Options](#options) for details.

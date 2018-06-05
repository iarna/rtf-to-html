'use strict'
const parse = require('rtf-parser')
const rtfToHTML = require('./rtf-to-html.js')

const htmlOptions = {
  template: function(doc, defaults, content) {
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
          font-size: ${defaults.fontSize / 2}pt;
          text-indent: ${defaults.firstLineIndent / 20}pt;
        }
        </style>
      </head>
      <body>
    ${content}
      </body>
    </html>
    `
  },
  paragraphTag: 'p',
  lineBreaks: '\n\n'
}

module.exports = asStream
module.exports.fromStream = fromStream
module.exports.fromString = fromString
module.exports.htmlOptions = htmlOptions

function asStream (cb) {
  return parse(htmlifyresult(cb))
}

function fromStream (stream, cb) {
  return parse.stream(stream, htmlifyresult(cb))
}

function fromString (string, cb) {
  return parse.string(string, htmlifyresult(cb))
}

function htmlifyresult (cb) {
  return (err, doc) => {
    if (err) return cb(err)
    try {
      return cb(null, rtfToHTML(doc, htmlOptions))
    } catch (ex) {
      return cb(ex)
    }
  }
}


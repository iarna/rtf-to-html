'use strict'
const parse = require('rtf-parser')
const rtfToHTML = require('./rtf-to-html.js')

module.exports = asStream
module.exports.fromStream = fromStream
module.exports.fromString = fromString

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
      return cb(null, rtfToHTML(doc))
    } catch (ex) {
      return cb(ex)
    }
  }
}


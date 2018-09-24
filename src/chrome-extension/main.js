/**
 * init start
 */
import {
  createElementFromHTML
} from './helpers'
import './style.styl'
/* eslint-disable-next-line */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

let inited = false

function init () {
  inited = true
  let dom = createElementFromHTML('<div id="ar"></div>')
  document.body.append(dom)
  ReactDOM.render(<App />, dom)
}

export default () => {
  if (!inited) {
    setTimeout(init, 500)
  }
}


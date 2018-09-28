/**
 * init start
 */
import {createElementFromHTML} from './helpers'
import './style.styl'
const siteConfigs = process.env.siteConfigs

let inited = false
let {appUrl} = siteConfigs

function onMsg(e) {
  if (e.data && e.data.type === 'ab-msg') {
    let input = document.querySelector('textarea.cs-textarea')
    let submit = document.querySelector('div.b-btn')
    input.value = e.data.text
    submit.click()
    let rc = document.querySelector('#autob-frame')
    rc && rc.contentWindow && rc.contentWindow.postMessage({
      type: 'ab-done'
    }, '*')
  }
}

function onClick(e) {
  let {target} = e
  let {classList} = target
  if (classList.contains('autobb-hide')) {
    document.getElementById('autobb')
      .classList.add('autobb-hide-to-side')
  } else if (classList.contains('autobb-show')) {
    document.getElementById('autobb')
      .classList.remove('autobb-hide-to-side')
  }
}

function renderApp() {
  let elem = document.getElementById('autobb')
  if (elem) {
    return
  }
  elem = createElementFromHTML(
    `
    <div id="autobb" class="animate autobb-wrap" draggable="false">
      <div class="autobb-control pd1y alignright">
        <span class="autobb-toggle autobb-hide">收起</span>
        <span class="autobb-toggle autobb-show">展开</span>
      </div>
      <div class="autobb-frame-box">
        <iframe class="autobb-frame" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" allow="microphone" src="${appUrl}" id="autobb-frame">
        </iframe>
      </div>
    </div>
    `
  )
  elem.addEventListener('click', onClick)
  document.body.appendChild(elem)
}

function init () {
  renderApp()
  window.addEventListener('message', onMsg)
}

export default () => {
  if (!inited) {
    setTimeout(init, 500)
  }
}


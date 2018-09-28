/**
 * init start
 */
let inited = false

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

function renderApp() {

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


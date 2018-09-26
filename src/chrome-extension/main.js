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
    window.postMessage({
      type: 'ab-done'
    }, '*')
  }
}

function init () {
  window.addEventListener('message', onMsg)
}

export default () => {
  if (!inited) {
    setTimeout(init, 500)
  }
}


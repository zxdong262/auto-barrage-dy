
let newWindow

chrome.windows.onRemoved.addListener(function (id) {
  if (newWindow && newWindow.id === id) {
    newWindow = null
  }
})

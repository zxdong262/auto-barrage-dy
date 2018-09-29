function checkTab(tab) {
  return tab &&
    tab.url &&
    tab.url.startsWith('https://www.douyu.com/') &&
    !tab.url.startsWith('https://www.douyu.com/directory/') &&
    !tab.url.startsWith('https://www.douyu.com/member') &&
    !tab.url === 'https://www.douyu.com'
}

async function cb(tabId) {
  let tab = await new Promise((resolve) => {
    chrome.tabs.get(tabId, resolve)
  })
  if (
    checkTab(tab)
  ) {
    chrome.pageAction.show(tab.id)
    return
  }
}

chrome.tabs.onCreated.addListener(cb)
chrome.tabs.onUpdated.addListener(cb)




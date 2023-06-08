/*
 * @Author: zhangyunzhong
 * @Date: 2023-05-11 14:54:32
 * @LastEditors: zhangyunzhong
 * @LastEditTime: 2023-06-08 11:20:25
 */
// background.js
let targetUrl = 'https://gitee.com/' //要修改的目标url
let headerObj = {
  test: '123456',
  'User-Agent': '456'
} //要修改的header头参数，有则修改，无则添加
chrome.runtime.onInstalled.addListener(function () {
  console.log('插件已被安装')
})
function replaceHeader(url, requestHeaders) {
  if (url === targetUrl) {
    for (let key in headerObj) {
      const idx = requestHeaders.findIndex(x => x.name === key)
      if (idx !== -1) {
        // 有，则修改
        requestHeaders[idx].value = headerObj[key]
      } else {
        // 无，则添加
        requestHeaders.push({ name: key, value: headerObj[key] })
      }
    }
  }
  return requestHeaders
}

function updateListeners() {
  if (!listener)
    listener = function (details) {
      var header_map = { requestHeaders: details.requestHeaders }
      if (details && details.url && details.requestHeaders && details.requestHeaders.length > 0) {
        header_map = { requestHeaders: replaceHeader(details.url, details.requestHeaders) }
      }
      return header_map
    }
  chrome.webRequest.onBeforeSendHeaders.addListener(listener, { urls: ['<all_urls>'] }, ['requestHeaders', 'blocking', 'extraHeaders'])
}

var listener = null
updateListeners()

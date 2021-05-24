const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// const socketUrl = "wss://api.zhongangu.com" // websocket 连接url
// const socketUrl = "wss://websock.madeoffice.com" // websocket 连接url
const socketUrl = "wss://dev.linxyun.com:8443" // websocket 连接url
// const socketUrl = "ws://dev-exam-bt.linxyun.com:8080" // websocket 连接url

// const socketUrl = "wss://echo.websocket.org/" // websocket 连接url
// 测试使用

// function addLog(LogType , LogContent) {
//   const params = {}
//   params.DeviceID = wx.getStorageSync('memberID')
//   params.LogType = LogType
//   params.CreateTime = '_SysTime_'
//   params.LogContent = LogContent
//   insertLog(params, {
//     success: res => {
//       console.log(res)
//     }
//   })
// }
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  socketUrl,
  // addLog
}

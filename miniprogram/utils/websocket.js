var checkConnetTimer
var webSocket
var connectStatus = false
var app = getApp()

var utils = require('./util.js');

var webScoket = {

  init: function () {
    this.onOpen(); //  打开连接
    this.onClose(); //  监听连接是否关闭
    this.onError(); // 监听连接错误
    this.recvData(); // 接收数据
    // this.connect(); // 连接      
  },

  /**
   * 打开连接
   */
  onOpen: function () {
    var that = this;
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      connectStatus = true //将连接状态设成true

      var timestamp = Date.parse(new Date()) / 1000;
      console.log("onOpen timestamp : " + timestamp)
      wx.setStorageSync('wsRecvDataTime', timestamp)

      clearInterval(checkConnetTimer)
      checkConnetTimer = null // 连接时清除上一个定时器
      // 发送心跳      
      const params = {}
      params.optype = 'req'
      params.type = 'HB'
      params.userid = wx.getStorageSync('MemberID')
      that.sendHBMsg(params)

      // 发送进入通知      
      const onShow = {}
      onShow.optype = 'notify'
      onShow.type = 'onShow'
      onShow.msgInfo = wx.getStorageSync('MemberID')
      onShow.to_key = wx.getStorageSync('ExamRoomID') + '_teacher'
      onShow.to_subkey = '_Any_'
      that.send(onShow)

    });
  },

  /**
   * 连接关闭
   */
  onClose: function () {
    var that = this
    wx.onSocketClose(() => {
      console.log('已断开连接')
      connectStatus = false
    })
  },

  resetSocket: function () { // 重置webSocket，不关闭心跳定时器
    wx.closeSocket({})
    console.log('webSocket重置成功')
    webSocket = null
    connectStatus = false
  },

  closeWebSocket: function () { // 手动关闭webSocket
    var that =this
    webSocket.close({
      success() {
        console.log('webSocket关闭成功')
        webSocket = null
        connectStatus = false
        console.log('清空心跳')
        clearInterval(checkConnetTimer)
        checkConnetTimer = null
        wx.removeStorageSync('wsRecvDataTime')
        setTimeout(() => {
          that.connect()
        }, 1000)
      },
      fail: function (err) {
        webSocket = null
        connectStatus = false
        clearInterval(checkConnetTimer)
        checkConnetTimer = null
        console.log('webSocket关闭失败')
      }
    })
  },

  /**
   * 连接错误
   */
  onError: function () {
    var that = this
    wx.onSocketError(error => {
      connectStatus = false
      // console.error('socket error: ', error);
      // utils.addLog(0, 'websocket connect onError info: ' + JSON.stringify(error))
      wx.closeSocket(err => {
        console.log('close it:', err);
      })
    })
  },

  /**
   * 接收数据
   */
  recvData: function (callback) {
    var that = this
    wx.onSocketMessage(message => {
      console.log('socket message:', message)
      //数据处理。方便界面中处理数据
      var timestamp = Date.parse(new Date()) / 1000;
      wx.setStorageSync('wsRecvDataTime', timestamp)
      // if(JSON.parse(message.data).type == 'HB'){
      //   return
      // }
      callback(message)
    })
  },

  /**
   * 连接
   */
  connect: function () {
    // clearInterval(checkConnetTimer)
    // checkConnetTimer = null // 连接时清除上一个定时器
    connectStatus = false //将连接状态设成false
    var MemberID = wx.getStorageSync('MemberID')
    var EntCode = '38'
    var url = utils.socketUrl
    console.log('socketUrl : ' + url)
    // var connectUrl = url + '/websocket/' + 'token' + "/" + MemberID + '/' + ExamRoomID + '/monitor/onOpen'
    // var connectUrl = url + '/websocket/onOpen.ws?c_key=' + EntCode + '_member&c_subkey=' + MemberID
    var connectUrl = url + '/websocket/onOpen.ws?c_key=' + EntCode + '&c_subkey=' + MemberID

    console.log(connectUrl)
    webSocket = wx.connectSocket({
      url: connectUrl,
      methodL: 'GET',
      success: function (res) {
        console.log('连接')
      },
      fail: function (err) {
        console.log('connectErr')
        console.log(err)
        // utils.addLog(0, 'websocket connect error: ' + JSON.stringify(err))
        connectStatus = false
      }
    });
  },

  /**
   * 发送指令
   */
  send: function (params) {
    var that = this
    console.log(params, 'sendMsg')
    wx.sendSocketMessage({
      data: JSON.stringify(params),
      success: function (ret) {
        console.log('发送', ret)
      },
      fail: function (ret) {
        console.log('sendErr')
        console.log(ret)
      }
    });
  },

  sendHBMsg(params) {
    var that = this
    checkConnetTimer = setInterval(() => {
      if (connectStatus) {
        var timestamp = Date.parse(new Date()) / 1000;
        console.log("sendHBMsg timestamp : " + timestamp)
        if (wx.getStorageSync('wsRecvDataTime')) {
          var lasttime = wx.getStorageSync('wsRecvDataTime')
          console.log('wsRecvDataTime: ' + lasttime)
          if (timestamp - lasttime > 12) {
            that.resetSocket()
            return
          }
        }

        wx.sendSocketMessage({
          data: JSON.stringify(params),
          success: function (ret) {
            console.log('发送', ret)
          },
          fail: function (ret) {
            console.log('sendErr')
            console.log(ret)
            that.resetSocket()
          }
        });
      } else {
        that.connect()
      }
    }, 1000 * 5)
  }
}

// webScoket.init();

module.exports = {
  ws: webScoket
}
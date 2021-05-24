// app.js
var Api = require("./utils/api")
var app = getApp()
import Notify from '@vant/weapp/notify/notify';
import {
  msgList
} from './utils/msgList.js'
import {
  msg
} from './utils/message.js'
// var ws = require("./utils/websocket")
import {
  ws
} from './utils/websocket.js';
var Base64 = require('./utils/b64')
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

               //监听路由切换
               //间接实现全局设置分享内容
               wx.onAppRoute(function (res) {
                   //获取加载的页面
                   let pages = getCurrentPages(),
                       //获取当前页面的对象
                       view = pages[pages.length - 1],
                      data;
                  if (view) {
                      data = view.data;
                      console.log('是否重写分享方法', data.isOverShare);
                      if (!data.isOverShare) {
                          data.isOverShare = true;
                          view.onShareAppMessage = function () {
                              //你的分享配置
                              return {
                                  title: 'tata',
                                  path: '/pages/firstpage/index'
                              };
                          }
                      }
                  }
              })
  },

  onShow() {
    console.log(msg, '---==')
    var that = this
    // if (wx.getStorageSync('msgList')) {

    // msg.msgList()
    // }
    // wx.showModal({
    //   cancelColor: 'cancelColor',
    // })
    // console.log(getCurrentPages())
    // that.globalData.globalFlag.checkDingYue('aaa')
    Api.updateMember('lxy_contact/updateMember.action', {
      MemberID: wx.getStorageSync('MemberID'),
      Online: 0
    })
    ws.onOpen()
    ws.connect()
    ws.recvData(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var res = JSON.parse(onMessage.data)
      if (res.SessionID) {
        that.queryMsgContent(res.SessionID, res)
      }
    })

  },
  onReady() {
    console.log('ready')
    setTimeout(() => {
      console.log(msgList)
      msgList.queryMessageList()
    }, 1000)
  },
  // 当缓存中没有该用户的时候查询所有的消息消息
  async queryMsgContent(value, value2) {

    //value2历史记录
    var that = this
    const params = {}
    var arr = []
    params.limit = 1
    params.current = 1
    params.orderBy = 'order by tab_message.MsgTime Desc'

    params.SessionID = value.SessionID

    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    // }
    // console.log(res.data, '查询回来的数据')
    if (JSON.parse(res.data).RowCnt > 0) {
      var temps = JSON.parse(res.data).Records
      that.globalData.self = temps[0]
      that.globalData.globalMsg = true
      // var arr = temps.filter(item => {
      //   return item.MsgClassify == '0' && item.MsgType == '2' && item.ContentType == '1'
      // })
      // console.log(arr)
      // getCurrentPages()[getCurrentPages().length - 1].checkDingYue()
      // console.log(getCurrentPages(), '==================')
      var current = getCurrentPages()[getCurrentPages().length - 1]
      if (current.route == 'pages/messages/msg_content/msg_content') {
        current.getWebsoket(value2) //假如在消息页面，需要进行的处理
      } else if (current.route !== 'pages/messages/msg_content/msg_content' && current.route !== 'pages/messages/msg_index/index') {
        current.checkDingYue()

      }
      if (current.route == 'pages/messages/msg_index/index') {
        current.onShow() //假如在消息页面，需要进行的处理
      }
      // that.globalData.indexJS.checkDingYue(codeId)
      console.log(temps, this.globalData.globalMsg, '全局')
      var obj = this.getDataRecord(temps[0])
      this.addPush(obj)

    }
  },
  getDataRecord(temps) {
    console.log(temps, '===')
    var memberid = '38-' + wx.getStorageSync('MemberID')
    if (temps.Sender !== memberid) {
      temps.is_my = false
      temps.is_you = true

    } else {
      temps.is_you = false
      temps.is_my = true
    }
    // console.log(temps,temps.Message, 'app.js')
    // && temps.ContentType == '0'
    if (temps.MsgClassify == '0' && temps.MsgType == '0') {
      temps.Message = Base64.Base64.decode(temps.Message)
    }


    return temps

    // return temps
  },
  // 查到消息之后往消息列表里面+1
  addPush(contentInfo) {
    var value = wx.getStorageSync('content')
    value.forEach(item => {
      if (item.SessionID) {
        // console.log(contentInfo, '获取到的数据')
        // contentInfo.forEach(value => {
        if (contentInfo.SessionID == item.SessionID && contentInfo.MsgClassify == item.MsgClassify && contentInfo.MsgType == item.MsgType) {
          item.Arr.push(contentInfo)

        }
        // })
      }
    })
    console.log(value)
    wx.setStorageSync('content', value)
  },
  con() {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
    month = month + 1;

    if (month < 10) {
      month = '0' + month
    }

    if (date < 10) {
      date = '0' + date
    }

    if (minu < 10) {
      minu = '0' + minu
    }

    if (sec < 10) {
      sec = '0' + sec
    }

    return year + '' + month + '' + date + '' + hour + '' + minu + '' + sec
  },
  onHide() {
    Api.updateMember('lxy_contact/updateMember.action', {
      MemberID: wx.getStorageSync('MemberID'),
      Online: this.con()
    })
  },
  globalData: {
    userInfo: null,
    nickName: '',
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Am7ERoKUicE4z1IZ0iaI0J7uibomOq6iaFEYg0Kic96FDj1w1aCBLu9eX73RGlCVgCrYnU1INJCquice2mNmJq0OqiaiaA/132',
    EntCode: 38,
    BusinessID: 1,
    self: '',
    appId: 'wx34b2aa4a285d68dd',
    secret: 'bf88d60029d7e1fe0c92818d9ee1cba5',
    BASEURL: 'https://dev-zyxs.linxyun.com:8443/lxy_mall/file.action',
    ImageUrl: 'https://dev-zyxs.linxyun.com:8443/lxy_mall/file.action?fileUrl=', // 下载文件url

    ImageUrltest: 'https://www.meiweixuanji.com/thc_mall/file.action?fileUrl=', // 下载文件url
    // BASEURL: 'http://111.231.110.27:8008', // 请求路径url
    // BASEURL: 'https://thc.linxyun.com:8443', //测试专用
    BASEURLtest: 'https://www.meiweixuanji.com',
    uploadUrl: 'http://mall-imag.linxyun.com/',
    globalMsg: false, //全局消息
    globalFlag: '',
    wsGlobal: ws,
    msgList: [], //消息列表

  }
})
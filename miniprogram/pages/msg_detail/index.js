var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'ws://请填写您的长链接接口地址';
var upload_url = '请填写您的图片上传接口地址'
import {
  ws
} from '../../../utils/websocket.js';

var Api = require('../../../utils/api')
var Authorize = require("../../../utils/authorize.js");
Page({
  data: {
    user_input_text: '', //用户输入文字
    inputValue: '',
    returnValue: '',
    addImg: false,
    //格式示例数据，可为空
    allContentList: [{
      is_my: true,
      is_my_text: '你好',
      is_ai: true,
      is_my_img: true,
      is_two: [{
        text: '你好呀',
        a_title: '标题'
      }]
    }],
    num: 0
  },
  // 页面加载
  onLoad: function () {
    this.bottom();
    // if(wx.getStorageSync('isAuthUserInfo')) {
    //   ws.connect()
    // }
    // 连接websocket
    // ws.connect()
  },
  onShow: function (e) {
    if(wx.getStorageSync('isAuthUserInfo')) {
      ws.connect()
    }},
  // 页面加载完成
  onReady: function () {},

  // 提交文字
  submitTo: function (e) {
    let that = this;
    console.log(that.data.inputValue, '点击发送按钮')
    that.sendMessageReq()
  },
  // 发送消息api

  async sendMessageReq() {
    console.log(Api, 'api')
    var that = this
    var params = {}
    params.Sender = app.globalData.EntCode +  '-' + wx.getStorageSync('MemberID')
    params.Recver = app.globalData.EntCode +  '-' + 'oBv7I5XvgkbA7oQ4nFe39vuDB2NA'
    params.ContentType = '0'
    params.Message = that.data.inputValue
    // params.Message = '0000000'
    params.MsgClassify = '0'
    params.SessionID = ''
    let res = await Api.requestApi("lxy_contact/sendMessageReq.action", {
      ...params
    })
    if(JSON.parse(res.success)) {
      that.setData({
        inputValue: ''
      })
    }
  },

  // 微信授权
  
    // 微信授权
    auth(e) {
      console.log(e.detail.userInfo, '授权')
      var that = this;
      if (!wx.getStorageSync('isAuthUserInfo')) {
        if (e.detail.userInfo) {
          Authorize.bindGetUserInfo((res) => {
            console.log(res, '2131311')
            this.setData({
              isAuthUserInfo: true,
              AvatarUrl: res.AvatarUrl,
              nickName: res.nickName
            })

            // this.queryMember()
            // this.queryMemberAccount()
            ws.connect()
          });
        }
      } else {
      }
    },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onHide: function () {
    // SocketTask.close(function (close) {
    //   console.log('关闭 WebSocket 连接。', close)
    // })
  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function (res) {
        that.setData({
          img: res.tempFilePaths
        })
        wx.uploadFile({
          url: upload_url,
          filePath: res.tempFilePaths,
          name: 'img',
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '图片发送成功！',
              duration: 3000
            });
          }
        })
        that.data.allContentList.push({
          is_my: {
            img: res.tempFilePaths
          }
        });
        that.setData({
          allContentList: that.data.allContentList,
        })
        that.bottom();
      }
    })
  },
  addImg: function () {
    this.setData({
      addImg: !this.data.addImg
    })

  },
  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function () {
    var that = this;
    this.setData({
      scrollTop: 1000000
    })
  },
})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
// function sendSocketMessage(msg) {
//   var that = this;
//   console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
//   SocketTask.send({
//     data: JSON.stringify(msg)
//   }, function (res) {
//     console.log('已发送', res)
//   })
// } 
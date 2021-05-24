var app = getApp()
var Login = require('./login.js');
var Api = require("./api.js");
// var fortime = require("./fortime.js")
// var throttle = require("./throttle.js");
// var addmoney = require("./addmoney.js");
// var userinfo
// // 点击用户授权
function bindGetUserInfo(callback) {
  console.log('点击授权')

  Login.getCodeByWxLogin((res) => { //确认授权

    // console.log(that.data.isAuthUserInfo + "1111");
    var that = this;
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    const code = res.code;
    // Login.getUserInfo(_callback => {
      // console.log(_callback.userInfo, '这个是callback里面的值')
      if (code) {
        // 获取用户openId
        // console.log(_callback.userInfo, '其他地方获取到的userinfo')
        const wxLoginParams = { //获取用户信息参数
          // appid:wx646180a91967dfb8
          code: code,
          appid: wx.getAccountInfoSync().miniProgram.appId,
          secret: app.globalData.secret,
          EntCode: app.globalData.EntCode,
          TelNo: ''
        }
        console.log(wxLoginParams, 'wxLoginParams')
        Api.wxLogin(wxLoginParams, {
          success: function (response) {
            console.log(wx.getStorageSync('nickName'))
            console.log(response, 'fanh')
            var openId = JSON.parse(response.data.data).UserID //openId
            // 把openId存储到缓存中
            wx.setStorageSync('MemberID', openId);
            wx.setStorageSync('isAuthUserInfo', true);
            const params = {}
            params.AvatarUrl = wx.getStorageSync('avatarUrl')
            params.nickName = wx.getStorageSync('nickName')
            if (wx.getStorageSync('session_key')) {
              console.log('清除')
              wx.removeStorageSync('session_key')
              wx.setStorageSync('session_key', JSON.parse(response.data.data).session_key)
            } else {
              wx.setStorageSync('session_key', JSON.parse(response.data.data).session_key);
            }
            console.log("openID" + openId, JSON.parse(response.data.data).session_key);
            callback(params)
            wx.hideLoading()
            const value = {}
            value.MemberID = openId

            Api.queryMember(value, {
              success: (res) => {
                if (JSON.parse(res.data.data).TotalSize * 1 > 0) {} else {
                  var invi = wx.getStorageSync('InviterID')
                  var Reference = ''
                  if (invi !== '' && invi !== null) {
                    Reference = invi; //推荐人 
                  } else {
                    Reference = ''
                  }
                  var newparams = {}
                  newparams.MemberID = openId
                  newparams.MemberName = wx.getStorageSync('nickName')
                  // addMemberParams.AvatarUrl = wx.getStorageSync('avatarUrl');
                  newparams.AvatarUrl = wx.getStorageSync('avatarUrl')
                  newparams.MemberType = 0
                  newparams.Reference = Reference
                  newparams.BusinessID=getApp().globalData.BusinessID
                  newparams.Gender=wx.getStorageSync('gender')
                  //newparams.CreateTime = fortime.formatTimed(new Date())
                  Api.insertMembers('lxy_contact/insertMembers.action',newparams, {})
                }
              }
            })

          },
          fail: function (error) {
            console.log(error, 'error')
          }
        })
      }
    // }) //获取授权信息

  })
}
bindGetUserInfo:
  module.exports = {
    bindGetUserInfo
  }
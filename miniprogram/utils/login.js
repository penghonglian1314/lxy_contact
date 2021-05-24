var app = getApp();
var Api = require("./api.js");

// 是否已经授权身份信息
const isAuthUserInfo = (callback = function () {}) => {
  wx.getSetting({
    // 查看用户是否授权
    success(authResult) {
      if (authResult.authSetting['scope.userInfo']) {
        callback(true); // 已经授权
      } else {
        callback(false); //未授权
      }
    }
  })
}

// 微信登录
const getCodeByWxLogin = (callback = function () {}) => {
  wx.login({
    success: res => {
      callback(res);
    }
  })
}

// 授权后，查询微信信息
const getUserInfo = (callback = () => {}) => {
  // 用户已经授权
  wx.getUserInfo({
    // 获取用户信息
    success: (userInfoResult) => {
      var userInfo = userInfoResult.userInfo;
      app.globalData.userInfo = userInfoResult.userInfo;
      wx.setStorageSync('nickName', userInfo.nickName);
      wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
      callback && callback(userInfoResult);
    }
  })
}


const wx_login = async (code, callback = () => {}) => {
  console.log(code, 'Login')
  var params = {
    code: code,
    appid: app.globalData.appId,
    secret: app.globalData.secret,
    EntCode: 38,
    TelNo: ''
  }
  let response = await Api.wxLogin(params)
  console.log(response, 'response')
  return response
  // callback(response)
}

module.exports = {
  isAuthUserInfo,
  getCodeByWxLogin,
  getUserInfo,
  wx_login
}
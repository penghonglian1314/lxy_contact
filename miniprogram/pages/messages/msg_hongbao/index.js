// pages/messages/msg_hongbao/index.js
var Api = require('../../../utils/api')
var date = require('../../../utils/date')
var close = require('../../../utils/close')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    InteractionList: [],
    current: 1,
    limit: 50,
    total: 0,
    count: 0,
    xiaoxi: true, 
    Type: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (value) {
    var value =  app.globalData.self
    if (value.SessionID) {

      this.queryMsgContent(value)
    } else {
      this.setData({
        xiaoxi: false
      })
    }

    var value = this.data.InteractionList
    close.onclosePage(value)
  },

  async queryMsgContent(value) {
    var that = this
    const params = {}
    params.Recver = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.limit = that.data.limit
    params.current = that.data.current
    params.MsgClassify = value.MsgClassify
    params.orderBy ='order by tab_message.MsgTime Desc'
    params.MsgType = 7
    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    var temps = JSON.parse(res.data).Records

    for(var i=0;i<temps.length;i++){
      console.log(temps[i])
      temps[i].Message=JSON.parse(temps[i].Message.replace(/\\/g,''))
    }

    //temps.Message.replace(/\\/g,'')
    
    console.log(temps)
    // var data = that.getLong(temps)

    that.setData({
      InteractionList: temps,
      count: JSON.parse(res.data).TotalSize
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
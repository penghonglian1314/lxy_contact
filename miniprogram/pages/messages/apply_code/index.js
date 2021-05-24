// pages/messages/apply_code/index.js
var Api = require('../../../utils/api')
var date = require('../../../utils/date')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CodeList: [],
    xiaoxi: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var value = app.globalData.self
    console.log(app.globalData.self, 'self')
    if (value.SessionID) {
      this.queryMsgContent(value)
    } else {
      this.setData({
        xiaoxi: true
      })
    }
  },
  // 消息内容查询
  async queryMsgContent(value) {
    var that = this
    const params = {}
    params.Recver = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.MsgClassify = value.MsgClassify
    params.MsgType = value.MsgType
    params.orderBy = 'order by tab_message.MsgTime Desc'
    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    console.log(JSON.parse(res.data).RowCnt)
    if (Number(JSON.parse(res.data).RowCnt) > 0) {

      var temps = this.getRegx(JSON.parse(res.data).Records)
      that.setData({
        CodeList: temps,
        xiaoxi: false
      })
    }
  },
  // 处理时间格式
  getRegx(temps) {
    console.log(temps, '接受已经处理好的数据')
    var dateTime = new Date(); //必须要赋值
    var moment = date.timeDatas(dateTime)
    temps.map((item) => {
      var tt = item.MsgTime + '000'
      let time = new Date(Number(tt))
      // item.MsgTime = new Date(item.MsgTime)
      item.MsgTime = date.timeDatas(time)
      item.MsgTime = date.dateSecond(moment, item.MsgTime)
      console.log(item.MsgTime, '===')
    })
    return temps
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
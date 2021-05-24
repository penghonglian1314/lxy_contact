// pages/messages/system_content/index.js
var Api = require('../../../utils/api')
var date = require('../../../utils/date')
var text = require('../../../utils/text')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemContent: [],
    xiaoxi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var value = app.globalData.self
    if (value.SessionID) {

      this.queryMsgContent(value)
    }
  },
  // 处理消息长度
  // 处理消息长度
  getLong(value) {
    if (value.length > 10) {
      return value.substr(0, 10) + '...'
    } else {
      return value
    }
  },
  // 消息内容查询
  async queryMsgContent(value) {
    var that = this
    const params = {}
    var arr = []
    var arr1 = {}
    var arr2 = {}
    params.Recver = value.Recver
    params.MsgClassify = value.MsgClassify
    params.MsgType = value.MsgType
    params.orderBy = 'order by tab_message.MsgTime Desc'
    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    if (Number(JSON.parse(res.data).RowCnt) > 0) {
      var temps = that.getRegx(JSON.parse(res.data).Records)
      //判断自己是举报人还是被举报对象
      for (let i = 0; i < temps.length; i++) {
        arr1 = that.getObj(temps[i])
        arr.push(arr1)
      }
      console.log(arr, 'arr')
      that.setData({
        systemContent: arr,
        xiaoxi: true
      })
    }
  },
  // 判断自己是举报人还是被举报对象 以及举报主题
  getObj(value) {
    console.log(text)
    // str.indexOf("3") != -1
    if (value.Message.indexOf("您举报") !== -1) {
      value.ismine = false
      var ret = text.splitX(value.Message)
      var str1= this.getLong(ret[1])
      value.text = str1
      console.log(ret[1],str1, 'text')
      return value
    } else if (value.Message.indexOf("您被举报") !== -1) {
      value.ismine = true
      var ret = text.splitX(value.Message)
      var str = ret.toString()
      
      value.text = this.getLong(str)
      console.log(ret, str,'text')
      return value
    }
  },

  // 处理时间格式
  getRegx(temps) {
    console.log(temps, this.data.xiaoxi, '接受已经处理好的数据')
    var dateTime = new Date(); //必须要赋值
    var moment = date.timeDatas(dateTime)
    temps.map((item) => {
      var tt = item.MsgTime + '000'
      let time = new Date(Number(tt))
      // item.MsgTime = new Date(item.MsgTime)
      item.MsgTime = date.timeDatas(time)
      item.MsgTime = date.dateSecond(moment, item.MsgTime)
      // console.log(item.MsgTime, '===')
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
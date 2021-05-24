// pages/messages/toInteraction/toInteraction.js
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
    // console.log(JSON.parse(value.opt).SessionID, '互动消息')
    var value =  app.globalData.self
    if (value.SessionID) {

      this.queryMsgContent(value)
    } else {
      this.setData({
        xiaoxi: false
      })
    }
  },

  // 消息内容查询
  async queryMsgContent(value) {
    var that = this
    const params = {}
    params.Recver = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.limit = that.data.limit
    params.current = that.data.current
    params.MsgClassify = value.MsgClassify
    params.orderBy ='order by tab_message.MsgTime Desc'
    params.MsgType = 3
    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    var temps = that.getRegx(JSON.parse(res.data).Records)
    // var data = that.getLong(temps)

    that.setData({
      InteractionList: temps,
      count: JSON.parse(res.data).TotalSize
    })
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
      console.log(item.Message, 'message')
      item.Dynamic = this.getNews(item.Message, 'Dynamic')
      item.Comment = this.getNews(item.Message, 'Comment')
      // console.log(item.Message, item ,'===')
    })
    return temps
  },
  // 处理消息内容里面的
  getNews(value, value2) {
    console.log(value,value2)
    const reg = /\\/g
    var news = value.replace(reg, '')
    if (value2 == 'Dynamic') {

      return JSON.parse(news).Dynamic
    } else if (value2 == 'Comment') {

      return JSON.parse(news).Comment
    }
  },

  // 处理动态长度
  getLong(temps) {
    temps.map((item) => {
      if (item.ContentType == '5') {

        // if (item.Comment.length > 10) {
        //   item.Comment.split(0, 10)
        // }
        // return item.Comment
      }
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

    var value = this.data.InteractionList
    close.onclosePage(value)
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

  },

  //处理分页
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fenyeSearch()
  },
  async fenyeSearch() {
    var that = this
    var datalist = []
    var count = 0
    var current = that.data.current * 1 + 1
    var limit = that.data.limit
    var total = that.data.total
    if (that.data.InteractionList.length < that.data.count) {
      const params = {
        current: current,
        limit: limit,
        total: total,
        SessionID: that.data.parmsValue.SessionID
      }
      let res = await Api.requestApi('lxy_contact/queryMsgInteration.action', {
        ...params
      })

      if (JSON.parse(res.data).RowCnt !== '0') {
        let data = JSON.parse(res.data).Records
        this.getRegx(data)


        that.setData({
          count: JSON.parse(res.data).TotalSize,
          current: current
        })
      }
    }
  },
})
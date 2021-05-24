// pages/messages/index.js
var app = getApp()
var Api = require('../../utils/api')
import date from '../../utils/time'
var timedata = require('../../utils/moment.js')
timedata.locale('zh-cn');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 查询消息列表
  async queryMsgList() {
    var that = this
    const params = {}
    params.Recver = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.Sender = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    let res = await Api.requestApi('lxy_contact/queryMsgList.action', {
      ...params
    })
    if (JSON.parse(res.data).RowCnt > 0) {
      var temps = JSON.parse(res.data).Records
      var memberID = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
      for (var i = 0; i < temps.length; i++) {
        if (temps[i].Sender == memberID) {
          if (temps[i].Recver.split('-')[2]) {

            var value = temps[i].Recver.split('-')[1] + '-' + temps[i].Recver.split('-')[2]
          } else {
            var value = temps[i].Recver.split('-')[1]
          }


          console.log(value)
          var results = this.queryMember(value, temps)

        }
        for (var j = 0; j < temps.length; j++) {
          if (temps[j].Recver == memberID) {

            var z = JSON.stringify(temps)
            var arr = JSON.parse(z)
            arr.map((item, index) => {
              var times = item.MsgTime + '000'
              index++
              var timestamp = new Date().getTime()
              if (timestamp - times < 3600000) {

                item.MsgTime = timedata(Number(times)).format('LT')
              }
              else if (7200000 < timestamp - times < 2426400000) {
                item.MsgTime = timedata(Number(times)).add(10, 'days').calendar()

              }
            })

            setTimeout(() => {
              this.setData({
                msgList: temps
              })
              wx.setStorageSync('msgList', this.data.msgList)
            }, 100)

          }
        }
      }

    }
  },
  // 查询会员
  async queryMember(value, temps) {
    let res = await Api.requestApi('lxy_contact/queryMember.action', {
      MemberID: value
    })
    var results = app.globalData.EntCode + '-' + JSON.parse(res.data).Records[0].MemberID
    console.log(results, '查询会员返回结果')
    for (var i = 0; i < temps.length; i++) {
      if (temps[i].Recver == results) {
        temps[i].MemberID = JSON.parse(res.data).Records[0].MemberID
        temps[i].AvatarUrl = JSON.parse(res.data).Records[0].AvatarUrl
        temps[i].MemberName = JSON.parse(res.data).Records[0].MemberName
      }
    }
    console.log(this.data.msgList, '====')
    var z = JSON.stringify(temps)
    var arr = JSON.parse(z)
    arr.map((item, index) => {
      // that.setData({
      var times = item.MsgTime + '000'
      index++
      var timestamp = new Date().getTime()
      if (timestamp - times < 3600000) {

        item.MsgTime = timedata(Number(times)).format('LT')
      }
      //  else if (3600000 < timestamp - times < 7200000) {

      //   item.MsgTime = timedata(Number(times)).subtract(1, 'days').calendar()
      // }
      else if (7200000 < timestamp - times < 2426400000) {
        item.MsgTime = timedata(Number(times)).add(10, 'days').calendar()

      }
      // else if (timestamp - times > 2426400000) {
      //   item.MsgTime = timedata(Number(times)).format('YYYY [escaped] YYYY')

      // } else if (timestamp - times < 2426400000) {

      // }
      // console.log(times, '---')
      console.log(timestamp, item.MsgTime, timestamp - times)
      // });
      // date.formatDate(item.MsgTime) 1546841820000
      // console.log(item.MsgTime + '000', '=====')
    })

    setTimeout(() => {
      this.setData({
        msgList: arr
      })
      wx.setStorageSync('msgList', this.data.msgList)
    }, 100)
    // console.log(date, '处理后的时间格式')
  },
  // 前往消息列表页面
  toContentDetail(e) {
    console.log('点击前往消息列表页面', e)
    var str = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/messages/msg_detail/index?opt=' + str,
    })
  },
  // 前往系统消息列表
  toSystemDetail(e) {
    console.log('点击前往系统消息列表页面', e)
    var str = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/messages/system_content/index?opt=' + str,
    })
  },

  // 前往互动消息列表
  toInteraction(e) {
    console.log('点击前往系统消息列表页面', e)
    var str = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/messages/toInteraction/toInteraction?opt=' + str,
    })
  },


  // 前往申请消息列表
  toApply(e) {
    var str = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/messages/msg_apply/index?opt=' + str,
    })
  },
  // 删除对话框
  async deleteContent(value) {
    console.log(value, '点击删除按钮')
    var id = value.currentTarget.dataset.item.SessionID
    var temps = id.split('|')
    // var str = temps[1] + '|' + temps[0]
    let res = await Api.requestApi('lxy_contact/deleteMsgContent.action', {
      SessionID: id
      // SessionID2: str
    })
    if (res.success) {
      this.queryMsgList()
    }
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
    this.setData({
      msgList: []
    })
    setTimeout(() => {
      this.queryMsgList()
    }, 100)
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
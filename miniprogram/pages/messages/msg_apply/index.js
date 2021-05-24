// pages/messages/msg_apply/index.js
var Api = require('../../../utils/api')
var date = require('../../../utils/date')
var close = require('../../../utils/close')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
    values: [],
    limit: 20,
    current: 1,
    total: 0,
    count: 0,
    memberData: {},
    tempsArr: [],
    xiaoxi: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (value) {
    // this.queryMsgContent(value)
    var values = app.globalData.self
    console.log(values.SessionID, )

    if (values.SessionID) {

      this.queryMsgContent(values)
      this.setData({
        values: values
      })
    } else {
      this.setData({
        xiaoxi: false
      })
    }
  },
  // 消息内容查询
  async queryMsgContent(value) {
    console.log(value, '====')
    var that = this
    const params = {}
    var memberid = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.Recver = memberid
    params.Sender = memberid
    params.limit = that.data.limit
    params.current = that.data.current
    params.MsgType = value.MsgType
    params.MsgClassify = value.MsgClassify
    params.orderBy ='order by tab_message.SeqID Desc'
    let res = await Api.requestApi("lxy_contact/queryMsgContentCircle.action", {
      ...params
    })
    if(JSON.parse(res.data).RowCnt > 0) {
      this.setData({
        xiaoxi: true
      })
      that.getMsg(JSON.parse(res.data).Records)
    } else {
      this.setData({
        xiaoxi: false
      })
    }
    // var temps = that.getRegx(JSON.parse(res.data).Records)
    // }, 100)
  },
  //处理自己与其他人的请求消息
  getMsg(value) {
    var memberid = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    var arr = []
    value.forEach(item => {
      // 发送者假如跟自己一样
      if (item.Sender == memberid && item.ContentType !== '0') {
        this.queryMember(item).then(result => {
          console.log(item, '[[[[[')
          item.mine = true
          item.myMemberName = result.MemberName
          item.myAvatarUrl = result.AvatarUrl
          arr.push(item)
        })
      } else if (item.Recver == memberid) {
        item.you = true
        arr.push(item)
      }
    })
    console.log(arr, '---')
    setTimeout(() => {
      var temps1 = this.getRegx(arr)
      // setTimeout(() => {
      this.setData({
        applyList: temps1,
        // count: JSON.parse(res.data).TotalSize
      })
    }, 500)
    // return arr
  },

  //前往首页
  toShouye(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/mine/homepage/index?con=' + '' + this.getMemberID(item.Recver),
    })
  },
  //再次申请
  async reApply(e) {
    var valueParams = e.currentTarget.dataset.item

    var values = {}
    values.ContentType = 0
    values.SeqID = valueParams.SeqID
    let result = await Api.requestApi("lxy_contact/updataMsgContent.action", {
      ...values
    })
    this.queryMsgContent(this.data.values)
  },
  //查询会员
  queryMember(value) {

    var params = {}
    params.MemberID = this.getMemberID(value.Recver)
    return new Promise(function (resolve) {
      let res = Api.queryMember(params, {
        success: (res) => {
          let result = JSON.parse(res.data.data).Records[0]
          resolve(result);
        }
      })
    });
  },
  MemberDatas(value) {
    return value
  },
  // 处理时间格式
  getRegx(temps) {
    var dateTime = new Date(); //必须要赋值
    var moment = date.timeDatas(dateTime)
    temps.map((item) => {
      var tt = item.MsgTime + '000'
      let time = new Date(Number(tt))
      // item.MsgTime = new Date(item.MsgTime)
      item.MsgTime = date.timeDatas(time)
      item.MsgTime = date.dateSecond(moment, item.MsgTime)
    })
    return temps
  },
  // 同意
  async agree(e) {
    console.log(e, '点击同意')
    var params = {}
    var Recver = this.getMemberID(e.currentTarget.dataset.item.Recver)
    var Sender = this.getMemberID(e.currentTarget.dataset.item.Sender)
    var valueParams = e.currentTarget.dataset.item
    var SeqID = e.currentTarget.dataset.item.SeqID
    params.LinkMemberID = Recver
    params.MemberID = Sender
    params.CircleType = 1
    //修改圈子列表中CircleType字段
    let res = await Api.requestApi("lxy_contact/updateMsgCircle.action", {
      ...params
    })
    var values = {}
    // values.ContentType = 0
    values.ContentType = 1
    values.SeqID = valueParams.SeqID
    app.globalData.self.ContentType = 1
    let result = await Api.requestApi("lxy_contact/sendIMReq.action", {
      ...app.globalData.self
    })
    this.queryMsgContent(this.data.values)
  },
  // 处理id
  getMemberID(value) {
    var values = value.split('-')
    console.log(values.length, values[1], values[2], values[3])
    if (values.length == 2) {
      return values[1]
    }
    if (values.length == 3) {
      var params = values[1] + '-' +(values[2])
      console.log(params)
      return params
    }

  },

  // 拒绝
  async refuse(e) {
    console.log(e, '点击同意')
    var params = {}
    var valueParams = e.currentTarget.dataset.item
    var Recver = this.getMemberID(e.currentTarget.dataset.item.Recver)
    params.LinkMemberID = Recver
    params.CircleType = 2
    let res = await Api.requestApi("lxy_contact/updateMsgCircle.action", {
      ...params
    })
    var values = {}
    values.ContentType = 2
    values.SeqID = valueParams.SeqID
    let result = await Api.requestApi("lxy_contact/updataMsgContent.action", {
      ...values
    })
    this.queryMsgContent(this.data.values)
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
  //处理分页
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底分页')
    // this.fenyeSearch()
  },
  async fenyeSearch() {
    console.log('触底分页')
    var that = this
    var current = that.data.current * 1 + 1
    var limit = that.data.limit
    var total = that.data.total
    if (that.data.applyList.length < that.data.count) {
      const params = {
        current: current,
        limit: limit,
        total: total,
        MsgClassify: that.data.values.MsgClassify,
        MsgType: that.data.values.MsgType,
        Recver: that.data.values.Recver
      }
      let res = await Api.requestApi('lxy_contact/queryMsgContent.action', {
        ...params
      })

      if (JSON.parse(res.data).RowCnt !== '0') {
        let data = JSON.parse(res.data).Records
        var temps = this.getRegx(data)
        that.setData({
          count: JSON.parse(res.data).TotalSize,
          current: current,
          applyList: that.data.applyList.concat(temps)
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var value = this.data.applyList
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

  }
})
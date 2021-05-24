// pages/zhuye/zhuye.js
import Api from '../../utils/api'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhuye: {},
    linkMemberID: '',
    laheiFuncs: false,
    CircleID: '',
    Recver: '',
    SeqID: null,
    noData: false, //没有查到圈子里面的数据
    checked: false, //聊天置顶
    warning: false //查看是否有举报记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
    var value = app.globalData.self
    // value = JSON.parse(value)
    var memberid = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    console.log(value, '主页')
    // var zhuye = this.queryMember()
    this.setData({
      zhuye: value
    })
    if (memberid == value.Sender) {
      this.data.Recver = value.Recver
    } else {
      this.data.Recver = value.Sender
    }
    this.setData({
      linkMemberID: value.MemberID
    })
    this.queryMsgCircle()
    // this.queryMsgContent()


  },
  // 查询会员
  async queryMember() {
    var params = {}
    params.MemberID = this.getMemberID(this.data.Recver)
    let res = await Api.requestApi('lxy_contact/queryMember.action', {
      ...params
    })
    if (JSON.parse(res.data).RowCnt > 0) {
      return JSON.parse(res.data).Records[0]
    }
  },
  // 消息内容查询
  async queryMsgContent(value) {
    var that = this
    const params = {}
    params.Sender = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.Recver = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.MsgClassify = '2'
    params.MsgType = '0'
    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    if (JSON.parse(res.data).RowCnt > 0) {
      this.data.warning = true
      this.data.SeqID = JSON.parse(res.data).Records[0].SeqID
    } else {
      this.data.warning = false
    }
  },
  //聊天置顶
  onChange({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
    console.log(this.data.checked)
    if (this.data.checked) {
      var params = 'zhiding'
      this.updateCircle(params)
    } else {

      var params = 'nozhiding'
      this.updateCircle(params)
    }

  },
  // 修改备注
  beizhu(e) {
    wx.navigateTo({
      url: '/pages/zhuye/beizhu/beizhu?opt=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  // 拉黑操作
  lahei() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '拉黑后将无法看到对方和对方的动态',
      success(res) {
        if (res.confirm) {
          // 拉黑操作
          if (that.data.laheiFuncs) {
            var params = 'lahei'
            that.updateCircle(params)
          } else {
            that.addCircle()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //举报
  jubao() {
    var that = this
    var con = {
      MemberID: that.data.linkMemberID
    }
    console.log(con)
    wx.navigateTo({
      url: '/pages/report/index?con=' + JSON.stringify(con),
    })
  },
  // 发送消息api

  async sendMessageReq() {
    var that = this
    var params = {}
    params.Recver = that.data.Recver
    params.Sender = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.BusinessID = '38'
    params.MsgClassify = '2'
    params.MsgType = '0'
    params.ContentType = '0'
    let res = await Api.requestApi("lxy_contact/sendIMReq.action", {
      ...params
    })
    // if (JSON.parse(res.success)) {

    // }
  },
  //前往主页
  toSystemDetail(e) {
    // var value = e.currentTarget.dataset.item
    // console.log(value,e, '----')
    wx.navigateTo({
      url: '/pages/mine/homepage/index?con=' + this.data.linkMemberID,
    })
  },
  // updateMsgContet() {
  //   const params = {}
  //   params.SeqID = this.data.SeqID
  //   params.MsgClassify = 
  //   let res = await Api.requestApi('lxy_contact/updateMsgContet.action', {
  //     ...params
  //   })
  // },
  // 保存之前先查一下圈子列表，假如圈子里没有再添加
  async queryMsgCircle() {
    console.log('=====')
    var params = {}
    params.MemberID = wx.getStorageSync('MemberID')
    params.LinkMemberID = this.getMemberID(this.data.Recver)
    let res = await Api.requestApi('lxy_contact/queryMsgCircle.action', {
      ...params
    })
    console.log(JSON.parse(res.data).TotalSize, '查询列表圈子')
    if (JSON.parse(res.data).TotalSize >= 1) {
      // 执行修改操作
      this.setData({
        laheiFuncs: true,
        CircleID: JSON.parse(res.data).Records[0].CircleID
      })
      if (JSON.parse(res.data).Records[0].IsTop == '0') {
        this.setData({
          checked: false
        })
      } else if (JSON.parse(res.data).Records[0].IsTop == '1') {
        this.setData({
          checked: true
        })
      }
    } else {
      this.data.noData = true
    }
  },
  // 处理id
  getMemberID(value) {
    var values = value.split('-')
    console.log(values.length, values[1], values[2], values[3])
    if (values.length == 2) {
      return values[1]
    }
    if (values.length == 3) {
      var params = values[1] + '-' + (values[2])
      console.log(params)
      return params
    }

  },
  // 修改圈子拉黑的接口
  async updateCircle(value) {
    if (this.data.noData) {

      await this.addCircle(value)
      await this.queryMsgCircle(value)
    }
    var params = {}
    if (value == 'lahei') {

      params.CircleID = this.data.CircleID
      params.LikeType = 3
    } else if (value == 'zhiding') {

      params.CircleID = this.data.CircleID
      params.IsTop = 1
    } else if (value == 'nozhiding') {

      params.CircleID = this.data.CircleID
      params.IsTop = 0
    }

    await Api.requestApi('lxy_contact/updateCircle.action', {
      ...params
    })
  },
  // 添加圈子的接口
  async addCircle(value) {
    var params = {}
    params.MemberID = wx.getStorageSync('MemberID')

    params.LinkMemberID = this.getMemberID(this.data.Recver)
    // params.LinkMemberID = this.data.Recver
    if (value.lahei) { //拉黑操作

      params.LikeType = 2
    }
    if (value.zhiding) { //置顶操作

      params.IsTop = 1
    }
    params.BusinessID = app.globalData.EntCode
    // params.LinkMemberName = 
    // params.LinkMemberID = this.data.linkMemberID
    params.LinkRemarks = this.data.inputValue
    await Api.requestApi('lxy_contact/addCircle.action', {
      ...params
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
// pages/zhuye/beizhu/beizhu.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Api from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    inputValue: '',
    disabled: false,
    linkMemberID: '',
    updateFuns: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (value) {
    var options = JSON.parse(value.opt)
    console.log(options)
    var Recver = this.getMemberID(options.Recver)
    var Sender = this.getMemberID(options.Sender)
    console.log(Recver, Sender, 'memberid',  wx.getStorageSync('MemberID'))
    if (Recver == wx.getStorageSync('MemberID')) {
      this.data.linkMemberID = Sender
      this.queryMsgCircle()
    } else {

      this.data.linkMemberID = Recver
      this.queryMsgCircle()
    }
  },
  onReady: function () {
  },
  // 输入备注
  input(e) {
    console.log(e.detail.value, '备注')
    var value = e.detail.value
    if (value.length >= 20) {
      console.log(value.substr(0, 20))
      this.setData({
        inputValue: value.substr(0, 20)
      })
      this.setData({
        num: value.length - 1
      })
      Toast('备注名不超过二十字~');
    } else {
      this.setData({
        num: value.length,
        inputValue: value
      })
    }

  },
  // 处理id
  getMemberID(value) {
    var values = value.split('-')
    if (values.length == 2) {
      return values[1]
    }
    if (values.length == 3) {
      var params = values[1] + '-' +(values[2])
      return params
    }
  },
  save() {
    console.log('保存', this.data.updateFuns)
    if (this.data.updateFuns) {
      // 执行修改操作
      this.updateBeizhuCircle()
    } else {
      // 执行添加操作
      this.addCircle()
    }
  },
  // 保存之前先查一下圈子列表，假如圈子里没有再添加
  async queryMsgCircle() {
    console.log('=====')
    var params = {}
    params.MemberID = wx.getStorageSync('MemberID')
    params.LinkMemberID = this.data.linkMemberID
    let res = await Api.requestApi('lxy_contact/queryMsgCircle.action', {
      ...params
    })
    console.log(JSON.parse(res.data).TotalSize, '查询列表圈子')
    if (JSON.parse(res.data).TotalSize >= 1) {
      // 执行修改操作
      this.setData({
        updateFuns: true
      })
      //判断哪个是自己
    }
  },
  // 修改备注的接口
  async updateBeizhuCircle() {
    var params = {}
    params.MemberID = wx.getStorageSync('MemberID')
    params.LinkMemberID = this.data.linkMemberID
    params.LinkRemarks = this.data.inputValue
    let res = await Api.requestApi('lxy_contact/updateBeizhuCircle.action', {
      ...params
    })
    console.log(res)
    if (res.success) {

      wx.navigateBack({
        delta: -1,
      })
    }
  },
  // 添加圈子的接口
  async addCircle() {
    var params = {}
    params.MemberID = wx.getStorageSync('MemberID')
    params.LinkMemberID = this.data.linkMemberID
    params.LinkRemarks = this.data.inputValue
    let res = await Api.requestApi('lxy_contact/addCircle.action', {
      ...params
    })
    if (res.success) {

      wx.navigateBack({
        delta: -1,
      })
    }
  },
  // bindfocus() {
  //   this.setData({
  //     disabled: false
  //   })
  // },
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
var Api = require("../../../utils/api")

// pages/mine/wallet/index.js
import {timeformat} from '../../../utils/formatTime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    con: '',
    historyData:[]
  },

  toCharge(){
    wx.navigateTo({
      url: '/pages/mine/wallet/charge/index?con='+this.data.con,
    })
  },
  bianxian(){
    wx.showModal({
      title: '提示',
      content: `请确定是否变现积分721个`,
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showToast({
            title: '变现成功',
            icon: 'success'
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tixian(){
    wx.showModal({
      title: '提示',
      content: `请确定是否提现10.00`,
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showToast({
            title: '提现成功',
            icon: 'success'
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that=this

    // Api.queryMemberAccount('lxy_contact/queryMemberAccount.action',{
    //   MemberID: wx.getStorageSync('MemberID')
    // }).then(res=>{
    //   console.log(JSON.parse(res.data).Records[0])

    //   that.setData({
    //     con: JSON.parse(res.data).Records[0].Balance
    //   })
    // })

    // Api.queryMemberAccountRecord('lxy_contact/queryMemberAccountRecord.action',{
    //   MemberID: wx.getStorageSync('MemberID')
    // }).then(res=>{
    //   console.log(JSON.parse(res.data).Records)

    //   that.data.historyData=JSON.parse(res.data).Records

    //   for(var i=0;i<that.data.historyData.length;i++){
    //     that.data.historyData[i].Amount=Number(that.data.historyData[i].Amount).toFixed(2)

    //     that.data.historyData[i].CreateTime=that.data.historyData[i].CreateTime.substring(0,4)+'.'+that.data.historyData[i].CreateTime.substring(4,6)+'.'+that.data.historyData[i].CreateTime.substring(6,8)+' '+that.data.historyData[i].CreateTime.substring(8,10)+':'+that.data.historyData[i].CreateTime.substring(10,12)+':'+that.data.historyData[i].CreateTime.substring(12,14)
    //   }

    //   that.setData({
    //     historyData: that.data.historyData
    //   })
    // })
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
    var that=this

    Api.queryMemberAccount('lxy_contact/queryMemberAccount.action',{
      MemberID: wx.getStorageSync('MemberID')
    }).then(res=>{
      console.log(JSON.parse(res.data).Records[0])

      that.setData({
        con: JSON.parse(res.data).Records[0].Balance
      })
    })

    Api.queryMemberAccountRecord('lxy_contact/queryMemberAccountRecord.action',{
      MemberID: wx.getStorageSync('MemberID')
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      that.data.historyData=JSON.parse(res.data).Records

      for(var i=0;i<that.data.historyData.length;i++){
        that.data.historyData[i].Amount=Number(that.data.historyData[i].Amount).toFixed(2)

        that.data.historyData[i].CreateTime=that.data.historyData[i].CreateTime.substring(0,4)+'.'+that.data.historyData[i].CreateTime.substring(4,6)+'.'+that.data.historyData[i].CreateTime.substring(6,8)+' '+that.data.historyData[i].CreateTime.substring(8,10)+':'+that.data.historyData[i].CreateTime.substring(10,12)+':'+that.data.historyData[i].CreateTime.substring(12,14)
      }

      that.setData({
        historyData: that.data.historyData
      })
    })
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
import Authorze from '../../../utils/authorize'

import Login from '../../../utils/login'

var Api = require("../../../utils/api.js")

import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../../utils/http"

// pages/firstpage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    con:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    console.log(that)

    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })

    console.log(wx.getStorageSync('MemberID'))

    Api.queryLikes('lxy_contact/queryLikes.action',{
      RelationID: wx.getStorageSync('MemberID'),
      LikeType: 2,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      that.setData({
        con: JSON.parse(res.data).Records
      })

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
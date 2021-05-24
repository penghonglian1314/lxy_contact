var Api = require("../../../utils/api")

// pages/mine/InvitationCode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isapply:true,
    isapply1: false,
    isapply2: false,
    con: ''
  },
  
  onShareAppMessage: function (res) {
    return {
      title: '邀请你加入tata小程序',
      path: '/pages/firstpage/index'
    }
  },
  applyFor(){
    Api.addAuthorizationApply('lxy_contact/addAuthorizationApply.action',{
      BusinessID: getApp().globalData.BusinessID,
      MemberID: wx.getStorageSync('MemberID')
    }).then(res=>{
      console.log(res)
    })
    
    this.setData({
      isapply:false,
      isapply1: true
    })
    wx.showToast({
      title:'已申请,请耐心等待',
      icon:'none'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    Api.queryWxAuthorizationApply('lxy_contact/queryWxAuthorizationApply.action',{
      MemberID: wx.getStorageSync('MemberID')
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)
      
      if(JSON.parse(res.data).Records[0].ApplyStatus==0){
        that.setData({
          isapply: false,
          isapply1: true
        })

        // if(JSON.parse(res.data).Records[0].ApplyStatus==1){
        //   that.setData({
        //     isapply: true,
        //     isapply1: false
        //   })
        // }
      }else if(JSON.parse(res.data).Records[0].ApplyStatus==1){
        Api.queryWxAuthorization('lxy_contact/queryWxAuthorization.action',{
          MemberID: wx.getStorageSync('MemberID'),
          AuthStatus: 0
        }).then(res=>{
          console.log(JSON.parse(res.data).Records)

          if(JSON.parse(res.data).Records){
            if(JSON.parse(res.data).Records[0].AuthStatus==1){
              that.setData({
                isapply: true,
                isapply1: false,
                isapply2: false,
                //con: JSON.parse(res.data).Records[0].AuthorizationCode
              })
            }else{
              that.setData({
                isapply: false,
                isapply1: false,
                isapply2: true,
                con: JSON.parse(res.data).Records[0].AuthorizationCode
              })
            }
            
          }else{
            that.setData({
              isapply: true,
              isapply1: false,
              isapply2: false,
              //con: JSON.parse(res.data).Records[0].AuthorizationCode
            })
          }
        })
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
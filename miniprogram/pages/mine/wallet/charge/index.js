var Api = require("../../../../utils/api")

// pages/mine/wallet/charge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseIndex:0,
    moneyData:[
      {
        id:1,
        num:'10',
        money:'6.00'
      },
      {
        id:2,
        num:'20',
        money:'12.00'
      },
      {
        id:3,
        num:'50',
        money:'36.00'
      },
      {
        id:4,
        num:'100',
        money:'50.00'
      },
      {
        id:5,
        num:'200',
        money:'100.00',
        tag:'特惠'
      },
      {
        id:6,
        num:'500',
        money:'200.00',
        tag:'赠SVIP三个月'

      }
    ],
    con: '',
    con1: '',
    con2: {},
    num: ''
  },

  choose(e){
    console.log(e.target.dataset.item)

    this.data.con=e.target.dataset.item.num

    this.data.num=e.target.dataset.item.money

    this.setData({
      chooseIndex:e.target.dataset.item.id
    })
  },
  chargebtn(){
    var that=this

    wx.showToast({
      title: '充值成功',
      icon: 'success'
    });

    console.log(this.data.chooseIndex,'xxxxxxxxxxxxxxxx')

    Api.updateMoney('lxy_contact/updateMoney.action',{
      MemberID: wx.getStorageSync('MemberID'),
      Balance: this.data.con,
      RecordType: 11,
      Amount: this.data.con,
      // AccountType: 1,
      RelationID: 1,
      Remarks: 1
    }).then(res=>{
      console.log(res)

      var con={}

      con.Balance=that.data.con
      con.num=that.data.num
      con.type=1

      var myDate=new Date()

      con.time=myDate.getFullYear()+'.'+(myDate.getMonth()+1)+'.'+myDate.getDate()
      con.Content='您于'+con.time+'充值'+con.num+'元，获得'+con.Balance+'积分已到账'

      Api.sendIMReq('lxy_contact/sendIMReq.action',{
        MsgClassify: 0,
        Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
        Recver: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
        Message: JSON.stringify(con),
        MsgType: 7,
        ContentType: 0,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(res)
      })

      if(that.data.con2.Gender==0){
        Api.updateMember('lxy_contact/updateMember.action',{
          MemberID: wx.getStorageSync('MemberID'),
          Level: 1
        }).then(res=>{
          console.log(res)

          // wx.navigateBack({
          //   delta: 1
          // })
        })
      }
      
      that.data.con1=Number(that.data.con1)+Number(that.data.con)

      that.setData({
        con1: that.data.con1
      })
    })

    // Api.queryTradeOrders('lxy_contact/queryTradeOrders.action',{
    //   EntCode: getApp().globalData.EntCode
    // }).then(res=>{
    //   console.log(JSON.parse(res.data).Records)
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      con1: options.con
    })

    Api.queryMember({
      MemberID: wx.getStorageSync('MemberID')
    }, {success: res=>{
      console.log(JSON.parse(res.data.data).Records)

      this.data.con2=JSON.parse(res.data.data).Records[0]
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
var Api = require("../../../utils/api.js")

// pages/mine/set/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    jifennum:50,
    jifen:'自定义解锁积分',

    siradio:'1',
    sijifennum:100,
    sijifen:'自定义私聊积分',

    completed: false,  // 弹窗控制
    deposit: 0,  // 存储用户输入的内容

    _completed:false,
    _deposit:0,
    con: '',
    con1: true
  },


  // 获取用户输入的内容
  getUserInput(event) {
    const money = event.detail.value || event.detail.text
    this.setData({deposit: money})
  },
  _getUserInput(event) {
    const money = event.detail.value || event.detail.text
    this.setData({_deposit: money})
  },

  // 取消按钮触发事件
  cancelSelected(event) {
    this.setData({
      completed: false,
      _completed: false
    })
  },

  // 确定按钮触发事件
  successSelected(event) {
    if (!(/(^[0-9]*$)/.test(this.data.deposit))) {
      wx.showToast({
        title: '只能输入纯数字',
        icon: 'none',
        duration: 2000
      })
    } else {
      if(this.data.deposit != 0){
        Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
          PhotoID: this.data.con,
          PhotoType: 2,
          BusinessID: getApp().globalData.BusinessID,
          Num: this.data.deposit
        })

        this.setData({
          completed: false,
          jifen:this.data.deposit,
          jifennum:this.data.deposit,
          radio: '1'
        })
      } else {
        this.setData({completed: false})
      }
      

    }
  },

  _successSelected(event) {
    if (!(/(^[0-9]*$)/.test(this.data._deposit))) {
      wx.showToast({
        title: '只能输入纯数字',
        icon: 'none',
        duration: 2000
      })
    } else {
      if(this.data._deposit != 0){
        this.setData({
          _completed: false,
          sijifen:this.data._deposit,
          sijifennum:this.data._deposit
        })
      } else {
        this.setData({_completed: false})
      }
      
      console.log(this.data.sijifennum)

      Api.updateMember('lxy_contact/updateMember.action',{
        MemberID: wx.getStorageSync('MemberID'),
        BusinessID: getApp().globalData.BusinessID,
        MsgNum: this.data.sijifennum
      }).then(res=>{
        this.setData({
          siradio: '1',
        });
      })
    }
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    console.log(name)

    if(name==1){
      Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
        PhotoID: this.data.con,
        PhotoType: 2,
        BusinessID: getApp().globalData.BusinessID,
        Num: this.data.jifennum
      }).then(res=>{

      })
    }else if(name==2){
      Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
        PhotoID: this.data.con,
        PhotoType: 0,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{

      })
    }else if(name==3){
      Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
        PhotoID: this.data.con,
        PhotoType: 1,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{

      })
    }

    this.setData({
      radio: name,
    });
  },

  setjifen(){
    this.setData({completed: true})
  },

  _onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  _onClick(event) {
    const { siname } = event.currentTarget.dataset;
    // this.setData({
    //   radio: siname,
    // });

    if(siname==1){
      Api.updateMember('lxy_contact/updateMember.action',{
        MemberID: wx.getStorageSync('MemberID'),
        BusinessID: getApp().globalData.BusinessID,
        MsgNum: this.data.sijifennum
      }).then(res=>{
        this.setData({
          siradio: siname,
        });
      })
    }

    if(siname==2){
      Api.updateMember('lxy_contact/updateMember.action',{
        MemberID: wx.getStorageSync('MemberID'),
        MsgNum: 0,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        this.setData({
          siradio: siname,
        });
      })
    }
  },

  _setjifen(){
    this.setData({_completed: true})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    this.data.con=options.con

    if(wx.getStorageSync('gender')==1){
      this.setData({
        con1: false
      })
    }

    Api.queryMember({
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    },{success: res=>{
      that.setData({
        sijifen: JSON.parse(res.data.data).Records[0].MsgNum,
        sijifennum: JSON.parse(res.data.data).Records[0].MsgNum,
      })
    }
  })

    Api.queryPhoto('lxy_contact/queryPhoto.action',{
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      if(JSON.parse(res.data).Records){

        if(JSON.parse(res.data).Records[0].PhotoType==1){
          that.setData({
            radio: '3',
          });
        }else if(JSON.parse(res.data).Records[0].PhotoType==0){
          that.setData({
            radio: '2',
          });
        }else if(JSON.parse(res.data).Records[0].PhotoType==2){
          that.setData({
            radio: '1',
          });
        }

        // console.log(lis)

        that.setData({
          images: that.data.images,
          photoAuth: that.data.photoAuth,
          jifennum: JSON.parse(res.data).Records[0].Num,
          jifen: JSON.parse(res.data).Records[0].Num
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
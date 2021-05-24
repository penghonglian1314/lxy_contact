var Api = require("../../utils/api")

import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../utils/http"

// pages/report/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop:0,
    list: ['虚假照片', '骚扰', '肮骂','不文明聊天','色情低俗','他/她是骗子'],
    result: [],
    phone:'',
    other:'',
    fileList: [],
    FileID1: '',
    con: {}
  },
  submit(){
    console.log(this.data.result)
    console.log(this.data.phone)
    console.log(this.data.other)
    console.log(this.data.FileID1)
    console.log(this.data.con)

    var con={}

    if(!this.data.con.con){
      con.ComplaintClass=1
    }
    
    Api.addComplaint('lxy_contact/addComplaint.action ',{
      Sender: wx.getStorageSync('MemberID'),
      Recver: this.data.con.MemberID,
      BusinessID: getApp().globalData.BusinessID,
      ComplaintType: this.data.result.join(','),
      ComplaintImgs: this.data.FileID1,
      ComplaintMsg: this.data.other,
      ComplaintDynameic: this.data.con.DynamicID,
      Tel: this.data.phone,
      ...con
    }).then(res=>{
      console.log(res)

      // Api.sendIMReq( '/lxy_contact/sendIMReq.action',{
      //   MsgClassify: 2,
      //   Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
      //   Recver: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
      //   Message: '您举报的用户【${data.RecverName}】的【${data.ComplaintType}】处理结果经客服核实情况属实，我们已进行处理，感谢您的举报。',
      //   MsgType: 0,
      //   ContentType: 0,
      //   Extend: 'BusinessID='+getApp().globalData.EntCode,
      //   // BusinessID: getApp().globalData.EntCode,
      //   // MsgAgree: JSON.parse(res.data).CommentID,
      //   // InterActID: JSON.parse(res.data).CommentID,
      //   // BusinessID: getApp().globalData.BusinessID
      // })
    })

    if(this.data.fileList.length > 0){
      wx.showToast({
        title:'举报成功,平台核实后将与您取得联系',
        icon:"none",
        duration:2000
      })

      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        })
      },1000)

      
    } else {
      wx.showToast({
        title:'请提供相关图片',
        icon:"none",
        duration:2000
      })
    }
  },
  _del(event){
    console.log(event.detail.index)
    let image = this.data.fileList
    image.splice(event.detail.index,1)
    this.setData({
      fileList:image
    })
  },
  afterRead(event) {
    var that=this

    console.log(event, 'event')

    const {
      file
    } = event.detail;
    wx.showLoading({
      title: '图片上传中',
    })
    Api.uploadFileServer('lxy_contact/uploadFileServer.action',{
      EntCode:38
    }).then(res=>{
      console.log(JSON.parse(res.data).Token,'111')
      console.log(baseUrlImg+'?token='+JSON.parse(res.data).Token)
      console.log(file.url,file, file.path)

      // that.data.tok= JSON.parse(res.data).Token

      wx.uploadFile({
        url: baseUrlImg+'?token='+JSON.parse(res.data).Token,
        filePath: file.url,
        name: 'file',
        formData: {
          user: 'test'
        },
        success: (res) => {
          console.log(JSON.parse(res.data).hash)
          if (JSON.parse(res.data).hash) {
            // wx.navigateTo({
            //   url: '../apply/Upl/Upl?con='+JSON.parse(res.data).data,
            // })
  
            // Toast.success('图片上传成功');
            console.log(baseUrl1 +JSON.parse(res.data).hash)
            if(this.data.FileID1==''){
              this.data.FileID1=baseUrl1+JSON.parse(res.data).hash
            }else{
              this.data.FileID1=this.data.FileID1+','+baseUrl1+JSON.parse(res.data).hash
            }
            
            console.log(this.data.FileID1)

            that.data.fileList.push({...file,url: baseUrl1 +JSON.parse(res.data).hash})

            console.log(that.data.fileList)

            that.setData({
              fileList: that.data.fileList
            })
            // const {
            //   fileList1 = []
            // } = this.data;
            // fileList1.push({
            //   ...file,
            //   url: baseUrl1 +JSON.parse(res.data).hash
            // });
            // this.setData({
            //   fileList1,
            //   imageNum: this.data.fileList1.length
            // });
            // console.log(this.data.fileList1)
          } else {
            Toast.success('图片上传失败');
          }
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    })
  },
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.con))
    this.data.con=JSON.parse(options.con)
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
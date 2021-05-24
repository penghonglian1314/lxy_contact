var Api = require("../../utils/api.js")

var Base64 = require("../../utils/b64.js")

import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../utils/http"

import Toast from '@vant/weapp/toast/toast';

// pages/Dynamic/Dynamic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList1: [],
    FileID1: '',
    tok: '',
    checked: false,
    checked1: false,
    con:'',
    textarea: '',
    true1: false,
    true2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   true1: true,
    //   true2: true
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
    this.setData({
      true1: true,
      true2: true
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

  },

  afterRead1(event) {
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

      that.data.tok= JSON.parse(res.data).Token

      for(var i=0;i<file.length;i++){
        wx.uploadFile({
          url: baseUrlImg+'?token='+JSON.parse(res.data).Token,
          filePath: file[i].url,
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
    
              Toast.success('图片上传成功');
              console.log(baseUrl1 +JSON.parse(res.data).hash)
              if(this.data.FileID1==''){
                this.data.FileID1=baseUrl1+JSON.parse(res.data).hash
              }else{
                this.data.FileID1=this.data.FileID1+','+baseUrl1+JSON.parse(res.data).hash
              }
              
              console.log(this.data.FileID1)
              const {
                fileList1 = []
              } = this.data;
              fileList1.push({
                //...file,
                url: baseUrl1 +JSON.parse(res.data).hash,
                isImage: true
              });
              this.setData({
                fileList1,
                imageNum: this.data.fileList1.length
              });
              console.log(this.data.fileList1)
            } else {
              Toast.success('图片上传失败');
            }
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }

      
    })
  },
  // 删除图片
  Delete(event) {
    console.log(event)
    console.log(event.detail.file.url, '删除')
    var fileUrl = event.detail.file.url.slice(baseUrl1.length)
    this.deleteFile(fileUrl)
    this.data.fileList1.forEach((item, index) => {
      let arr = []
      if (event.detail.index == index) {
        arr = this.data.fileList1.splice(event.detail.index, 1)
        console.log(arr)
      }
    })

    console.log(this.data.FileID1)

    this.data.FileID1=this.data.FileID1.split(',')

    this.data.FileID1.splice(event.detail.index,1)

    console.log(this.data.FileID1)

    this.data.FileID1=this.data.FileID1.join(',')
    this.setData({
      fileList1: this.data.fileList1
    });
  },

  async deleteFile(fileUrl) {

    let res = await Api.deleteFile('lxy_contact/deleteFileServer.action', {
      FileID: fileUrl
    })
  },

  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },

  onChange1({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked1: detail });
  },

  tet(e){
    console.log(e.detail.value)

    this.data.textarea=e.detail.value
  },

  bindFormSubmit(e){
    var that=this

    console.log(this.data.textarea)
    console.log(this.data.FileID1)
    console.log(this.data.checked)
    console.log(this.data.checked1)

    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    if(this.data.textarea=='' && this.data.fileList1==''){
      wx.showModal({
        title: '内容不能为空',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })

      return false
    }
    

    if(this.data.checked){
      var con1=0
    }else{
      var con1=1
    }

    if(this.data.checked1){
      var con2=1
    }else{
      var con2=0
    }

    console.log(e)

    // var encode = encodeURIComponent(this.data.textarea);
    // // 对编码的字符串转化base64
    // var base64 = btoa(encode);

    Api.addDynamic('lxy_contact/addDynamic.action',{
      MemberID: wx.getStorageSync('MemberID'),
      PicUrls: this.data.FileID1,
      Desctet: Base64.Base64.encode(this.data.textarea),
      CanComment: con1,
      Status2: con2,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      that.data.textarea=''
      that.data.fileList1=[]
      that.data.FileID1=''
      that.data.checked=false
      that.data.checked1=false

      that.setData({
        textarea: '',
        fileList1: [],
        checked: false,
        checked1: false
      })

      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
    })
  }
})
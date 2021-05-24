var Api = require("../../../../utils/api.js")

// pages/mine/homepage/updateMeaasge/index.js
import { timeformat } from '../../../../utils/formatTime'
import { areaList } from '../../../../utils/area'

import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../../../utils/http"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:areaList,
    currentDate: new Date().getTime(),
    minDate: 20,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    updateweightData:'',
    updateheightData:'',
    updateprofessionData:'',
    updateyearnforData:'',
    updatehobbyData:'',
    updatenameData:'',
    weightshow:false,
    heightshow:false,
    professionshow:false,
    yearnforshow:false,
    hobbyshow:false,
    Cityshow:false,
    nameshow:false,
    Dateshow:false,
    ismineimg:true,
    Gender: false,
    Constellation: false,
    mine:{
      AvatarUrl:'',
      MemberName:'',
      Birth: '',
      City:'',
      Hobby:'',
      Expect:'',
      Occupation:'',
      Height:'',
      Weight:'',
      introduce:'',
      Gender: '',
      Constellation: ''
    },
    columns: ['男','女'],
    columns1: ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'],
    baseUrlImg: 'http://mall-imag.linxyun.com/'
  },
  onInput(event) {
    // console.log(111)
    this.setData({
      currentDate: event.detail,
    });
  },
  cityconfirm(event){
    let mineCity = 'mine.City'
    this.setData({
      [mineCity]: event.detail.values[1].name,
      Cityshow: false 
    });
  },
  Dateconfirm(event){
    let mineDateyear = 'mine.Birth'
    var now = new Date().getTime();
    console.log(now, event.detail)
    if(now<event.detail){
      console.log('123')
      return false
    }
    this.setData({
      [mineDateyear]: this.timeFormat(event.detail),
      Dateshow: false 
    });
  },
  weightsubmit(){
    if(this.data.updateweightData != ''){
      let mineweight = 'mine.Weight'
      this.setData({ [mineweight]: this.data.updateweightData + 'kg' });
    }
    this.setData({ weightshow: false });
  },
  heightsubmit(){
    if(this.data.updateheightData != ''){
      let mineheight = 'mine.Height'
      this.setData({ [mineheight]: this.data.updateheightData + 'cm' });
    }
    this.setData({ heightshow: false });
  },
  professionsubmit(){
    if(this.data.updateprofessionData != ''){
      let mineprofession = 'mine.Occupation'
      this.setData({ [mineprofession]: this.data.updateprofessionData });
    }
    this.setData({ professionshow: false });
  },
  yearnforsubmit(){
    if(this.data.updateyearnforData != ''){
      let mineyearnfor = 'mine.Expect'
      this.setData({ [mineyearnfor]: this.data.updateyearnforData });
    }
    this.setData({ yearnforshow: false });
  },
  hobbysubmit(){
    if(this.data.updatehobbyData != ''){
      let minehobby = 'mine.Hobby'
      this.setData({ [minehobby]: this.data.updatehobbyData });
    }
    this.setData({ hobbyshow: false });
  },
  namesubmit(){
    if(this.data.updatenameData != ''){
      let mineName = 'mine.MemberName'
      this.setData({ [mineName]: this.data.updatenameData });
    }
    this.setData({ nameshow: false });

  },

  introduce(e){
    console.log(e.detail)

    this.setData({
      'mine.introduce': e.detail
    })
  },
  onweightClose(){
    this.setData({ weightshow: false });
  },
  onheightClose(){
    this.setData({ heightshow: false });
  },
  onprofessionClose(){
    this.setData({ professionshow: false });
  },
  onyearnforClose(){
    this.setData({ yearnforshow: false });
  },
  onhobbyClose(){
    this.setData({ hobbyshow: false });
  },
  onCityClose(){
    this.setData({ Cityshow: false });
  },
  onnameClose() {
    this.setData({ nameshow: false });
  },
  onDateClose(){
    this.setData({ Dateshow: false });
  },
  updateheight(){
    this.setData({ heightshow: true });
  },
  updateweight(){
    this.setData({ weightshow: true });
  },
  updateprofession(){
    this.setData({ professionshow: true });
  },
  updateyearnfor(){
    this.setData({ yearnforshow: true });
  },
  updatehobby(){
    this.setData({ hobbyshow: true });
  },
  updateCity(){
    this.setData({ Cityshow: true });
  },
  updatedate(){
    this.setData({ Dateshow: true });
  },
  updatename(){
    this.setData({ nameshow:true })
  },
  updateGender(){
    this.setData({ Gender: true })
  },

  updateConstellation(){
    this.setData({ Constellation: true })
  },

  onCancel(){
    this.setData({ Gender: false })
  },
  onConfirm(event){
    console.log(event)
    let Gender='mine.Gender'
    this.setData({
      [Gender]: event.detail.index,
      Gender: false 
    });
  },

  onCancel_Constellation(){
    this.setData({ Constellation: false })
  },
  onConfirm_Constellation(event){
    console.log(event)
    let Constellation='mine.Constellation'
    this.setData({
      [Constellation]: event.detail.value,
      Constellation: false 
    });
  },

  isnumber(event){
    console.log(event)
    let reg = /^[0-9]*$/
    if(!reg.test(event.detail)){
      this.setData({ 
        updateheightData:'',
        updateweightData:''
      })
    }
  },
  getheadphoto(){
    var that=this

    wx.chooseImage({
			success : (res) => {
        const fil=res.tempFilePaths[0]

			  Api.uploadFileServer('lxy_contact/uploadFileServer.action',{
          EntCode:38
        }).then(res=>{
          console.log(JSON.parse(res.data).Token,'111')
    
          // that.data.tok= JSON.parse(res.data).Token
          console.log(baseUrlImg+'?token='+JSON.parse(res.data).Token)
          console.log(fil)
    
          wx.uploadFile({
            url: baseUrlImg+'?token='+JSON.parse(res.data).Token,
            filePath: fil,
            name: 'file',
            formData: {
              user: 'test'
            },
            success: (res) => {
              console.log(JSON.parse(res.data).hash)
              console.log(that.data)

              const fil=JSON.parse(res.data).hash
              
              console.log(that.data.images)

              that.data.mine.AvatarUrl=that.data.baseUrlImg+fil

              that.setData({
                // [imagePath] : path,
                'mine.AvatarUrl': that.data.mine.AvatarUrl,
                ismineimg:false
      
              })

              // Api.addPhoto('lxy_contact/addPhoto.action',{
              //   MemberID: wx.getStorageSync('MemberID'),
              //   PhotoUrl: that.data.images.join(','),
              //   BusinessID: getApp().globalData.BusinessID
              // }).then(res=>{
              //   console.log(JSON.parse(res.data).PhotoID)
              //   that.data.con.PhotoID=JSON.parse(res.data).PhotoID
              //   setTimeout(function(){
              //     // that.data.images.push(that.data.baseUrlImg+fil)
              //     // console.log(that.data.images)
              //     that.setData({
              //       //上传完并显示照片
              //       images: that.data.images
              //     });
              //   },1000)
              // })
            }
          })
        })
			  // this.setData({
        //   [imagePath] : path,
        //   'mine.AvatarUrl': that.data.mine.AvatarUrl,
        //   ismineimg:false

			  // })
			}
		})

  },
  add0(m){ return m < 10 ? '0' + m : m },
  timeFormat(timestamp) {
    // console.log(timestamp);
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    // return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
    return year + '-' + this.add0(month) + '-' + this.add0(date);
  },

  save(){
    console.log(this.data.mine)

    if(this.data.mine.Gender==0){
      wx.setStorageSync('gender', 1)
    }else{
      wx.setStorageSync('gender', 2)
    }

    Api.updateMember('lxy_contact/updateMember.action',this.data.mine).
      then(res=>{
        console.log(res)

        wx.navigateBack({
          delta: 1
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    Api.queryMember({
      MemberID: wx.getStorageSync('MemberID')
    },{success: res=>{
      console.log(JSON.parse(res.data.data).Records)

      that.setData({
        mine: JSON.parse(res.data.data).Records[0]
      })

      console.log(this.data.mine)
    }}
    )
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
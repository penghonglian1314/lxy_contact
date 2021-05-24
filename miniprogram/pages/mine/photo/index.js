var Api = require("../../../utils/api.js")

import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../../utils/http"

// pages/mine/photo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoAuthshow:false,
    photoAuthData: [
      {
        name: '公开',
        con: 0
      },
      {
        name: '需积分解锁',
        con: 2
      },
      {
        name: '需验证解锁',
        con: 1
      }
    ],
    photoAuth:'公开',
    isdelete:false,
    scrollTop:0,
    con: {},
    con1: true,
    images: [],
    baseUrlImg: 'http://mall-imag.linxyun.com/',
    con2: false
  },
  openphotoAuth(){
    this.setData({ photoAuthshow: true });
  },
  onClose() {
    this.setData({ photoAuthshow: false });
  },

  onSelect(event) {
    var that=this

    this.setData({ 
      photoAuthshow: false,
      photoAuth:event.detail.name
     });
    console.log(event.detail);

    if(event.detail.con==0){
      Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
        PhotoID: that.data.con.PhotoID,
        PhotoType: 0,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{

      })
    }else{
      Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
        PhotoID: that.data.con.PhotoID,
        PhotoType: 1,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{

      })
    }
  },
  // 本地选择照片上传
  chooseImage: function() {
    var that = this

    if(this.data.con2){
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          console.log(that.data.images)

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

                Api.queryPhoto('lxy_contact/queryPhoto.action',{
                  MemberID: wx.getStorageSync('MemberID'),
                  BusinessID: getApp().globalData.BusinessID
                }).then(res=>{
                  if(!JSON.parse(res.data).Records){
                    that.data.images.push(that.data.baseUrlImg+fil)

                    Api.addPhoto('lxy_contact/addPhoto.action',{
                      MemberID: wx.getStorageSync('MemberID'),
                      PhotoUrl: that.data.images.join(','),
                      BusinessID: getApp().globalData.BusinessID
                    }).then(res=>{
                      console.log(JSON.parse(res.data).PhotoID)
                      that.data.con.PhotoID=JSON.parse(res.data).PhotoID
                      setTimeout(function(){
                        // that.data.images.push(that.data.baseUrlImg+fil)
                        // console.log(that.data.images)
                        that.setData({
                          //上传完并显示照片
                          images: that.data.images
                        });

                        wx.showToast({
                          title: '上传成功',
                          icon: 'success'
                        });
                      },500)
                    })
                  }else{
                    that.data.images.push(that.data.baseUrlImg+fil)

                    Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
                      PhotoID: that.data.con.PhotoID,
                      PhotoUrl: that.data.images.join(','),
                      BusinessID: getApp().globalData.BusinessID
                    }).then(res=>{

                      

                      setTimeout(function(){
                        // that.data.images.push(that.data.baseUrlImg+fil)
                        // console.log(that.data.images)
                        that.setData({
                          //上传完并显示照片
                          images: that.data.images
                        });

                        wx.showToast({
                          title: '上传成功',
                          icon: 'success'
                        });
                      },500)
                    })
                  }

                  // wx.showToast({
                  //   title: '上传成功',
                  //   icon: 'success'
                  // });
                })

                

                
              }
            })
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content:"'是否允许'tata'访问您的相册",
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
        success (res) {
          if (res.confirm) {
            wx.chooseImage({
              count: 9,
              sizeType: ['compressed'],
              sourceType: ['album', 'camera'],
              success: function(res) {
                console.log(res)

                console.log(that.data.images)

                var fill=res.tempFilePaths

                  Api.uploadFileServer('lxy_contact/uploadFileServer.action',{
                    EntCode:38
                  }).then(res=>{
                    console.log(JSON.parse(res.data).Token,'111')
              
                    // that.data.tok= JSON.parse(res.data).Token
                    console.log(baseUrlImg+'?token='+JSON.parse(res.data).Token)
                    // console.log(i)
                    // console.log(fill[i])

                    for(var i=0;i<fill.length;i++){
              
                      wx.uploadFile({
                        url: baseUrlImg+'?token='+JSON.parse(res.data).Token,
                        filePath: fill[i],
                        name: 'file',
                        formData: {
                          user: 'test'
                        },
                        success: (res) => {
                          console.log(JSON.parse(res.data).hash)
                          console.log(that.data)

                          const fil=JSON.parse(res.data).hash
                          
                          console.log(that.data.images)

                          Api.queryPhoto('lxy_contact/queryPhoto.action',{
                            MemberID: wx.getStorageSync('MemberID'),
                            BusinessID: getApp().globalData.BusinessID
                          }).then(res=>{
                            if(!JSON.parse(res.data).Records){
                              that.data.images.push(that.data.baseUrlImg+fil)
        
                              Api.addPhoto('lxy_contact/addPhoto.action',{
                                MemberID: wx.getStorageSync('MemberID'),
                                PhotoUrl: that.data.images.join(','),
                                BusinessID: getApp().globalData.BusinessID
                              }).then(res=>{
                                console.log(JSON.parse(res.data).PhotoID)
                                that.data.con.PhotoID=JSON.parse(res.data).PhotoID
                                setTimeout(function(){
                                  // that.data.images.push(that.data.baseUrlImg+fil)
                                  // console.log(that.data.images)
                                  that.setData({
                                    //上传完并显示照片
                                    images: that.data.images
                                  });

                                  wx.showToast({
                                    title: '上传成功',
                                    icon: 'success'
                                  });
                                },500)
                              })
                            }else{
                              that.data.images.push(that.data.baseUrlImg+fil)
        
                              Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
                                PhotoID: that.data.con.PhotoID,
                                PhotoUrl: that.data.images.join(','),
                                BusinessID: getApp().globalData.BusinessID
                              }).then(res=>{
        
                                
        
                                setTimeout(function(){
                                  // that.data.images.push(that.data.baseUrlImg+fil)
                                  // console.log(that.data.images)
                                  that.setData({
                                    //上传完并显示照片
                                    images: that.data.images
                                  });

                                  wx.showToast({
                                    title: '上传成功',
                                    icon: 'success'
                                  });
                                },500)
                              })
                            }

                            // wx.showToast({
                            //   title: '上传成功',
                            //   icon: 'success'
                            // });
                          })

                          

                          
                        }
                      })
                  }
                })

                
              }
            })

            that.data.con2=true
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

    
    
  },

  _longtap(){
    console.log("长按")

    if(this.data.con1){
      this.setData({
        isdelete: true
      })
    }
  },
  _closeDel(){
    this.setData({
      isdelete: false
    })
  },
  _Del(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content:"是否确定删除照片",
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success (res) {
        if (res.confirm) {
          
          var index = e.currentTarget.dataset.index;
          var images = that.data.images;
          images.splice(index, 1);

          Api.updatePhoto('lxy_contact/wx/updatePhoto.action',{
            PhotoID: that.data.con.PhotoID,
            PhotoUrl: that.data.images.join(','),
            BusinessID: getApp().globalData.BusinessID
          }).then(res=>{

            

            setTimeout(function(){
              // that.data.images.push(that.data.baseUrlImg+fil)
              // console.log(that.data.images)
              that.setData({
                //上传完并显示照片
                images: that.data.images
              });
            },1000)
          })
          // that.setData({
          //   images: images
          // });
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  preview(event){
    console.log(event)
    let currentUrl = event.currentTarget.dataset.src
    console.log(currentUrl)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
    this.setData({
      isdelete: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    console.log(options)

    if(options.con1=='false'){
      console.log('123')
      this.setData({
        con1: false
      })
    }

    if(wx.getStorageSync('gender')==1){
      this.data.photoAuthData.splice(1,1)

      this.setData({
        photoAuthData: this.data.photoAuthData
      })
    }

    Api.queryPhoto('lxy_contact/queryPhoto.action',{
      MemberID: options.con,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      if(JSON.parse(res.data).Records){
        // var lis=[]

        that.data.con=JSON.parse(res.data).Records[0]

        console.log(that.data.con.PhotoUrl.split(','))

        that.data.images=that.data.con.PhotoUrl.split(',')

        console.log(that.data.images)

        if(that.data.images[0]==''){
          that.data.images=[]
        }

        // for(var i=0;i<JSON.parse(res.data).Records.length;i++){
        //   lis.push(JSON.parse(res.data).Records[i].PhotoUrl)
        // }

        if(JSON.parse(res.data).Records[0].PhotoType==1){
          that.data.photoAuth="需验证解锁"
        }

        // console.log(lis)

        that.setData({
          images: that.data.images,
          photoAuth: that.data.photoAuth
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
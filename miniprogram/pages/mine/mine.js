var Api = require("../../utils/api.js")
var Authorize = require("../../utils/authorize.js");
var app = getApp()

// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthUserInfo: false,
    member: {},
    con1: '0',
    con2: '0',
    con3: [],
    con4: true,
    con5: true,
    con6: '0',
    con7: '',
    con8: [],
    
    globalMsg: false, //控制全局消息的隐藏与显示
    globalContent: {} //全局消息里面的内容
  },

  towallet() {
    wx.navigateTo({
      url: '/pages/mine/wallet/index',
    })
  },
  toblacklist() {
    wx.navigateTo({
      url: '/pages/mine/blacklist/index?con=' + wx.getStorageSync('MemberID'),
    })
  },
  toInvitationCode() {
    wx.navigateTo({
      url: '/pages/mine/InvitationCode/index',
    })
  },
  toset() {
    wx.navigateTo({
      url: '/pages/mine/set/index?con=' + this.data.con7,
    })
  },
  tophoto(e) {
    wx.navigateTo({
      url: '/pages/mine/photo/index?con=' + e.currentTarget.dataset.index,
    })
  },
  tohomepage(e) {
    console.log(e.currentTarget.dataset.index)
    if (wx.getStorageSync('MemberID')) {
      wx.navigateTo({
        url: '/pages/mine/homepage/index?con=' + e.currentTarget.dataset.index,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.globalMsg.length > 0) {
      this.setData({
        globalMsg: true
      })
      setTimeout(() => {
        this.setData({
          globalMsg: false
        })
      }, 5000)
    }
    
  },
  checkDingYue() {
    this.setData({
      globalMsg: true
    })
    setTimeout(() => {
      this.setData({
        globalMsg: false
      })
    }, 5000)
    // console.log(this.data.globalContent, app.globalData.self)
  },
  // 前往申请消息页面
  toApply() {
    var MsgType =  app.globalData.self.MsgType
    var MsgClassify =  app.globalData.self.MsgClassify
    console.log('点击前往消息列表页面', MsgClassify == '2')

    // 前往系统消息页面
    if (MsgClassify == '2' && MsgType == '0') {
      wx.navigateTo({
        url: '/pages/messages/system_content/index',
      })

    }
    // 前往邀请码页面
    if (MsgClassify == '2' && MsgType == '4') {
      wx.navigateTo({
        url: '/pages/messages/apply_code/index',
      })
    }
    if (MsgType == 0 && MsgClassify == '0') {
      wx.navigateTo({
        url: '/pages/messages/msg_content/msg_content?opt=true',
      })
    }
    // 申请相册页面
    if (MsgType == 2 && MsgClassify == '0') {
      wx.navigateTo({
        url: '/pages/messages/msg_apply/index',
      })
    }
    // 点赞与评论页面
    if (MsgType == 3 && MsgClassify == '0') {
      wx.navigateTo({
        url: '/pages/messages/toInteraction/toInteraction',
      })

    }
    if (MsgType == 7 && MsgClassify == '0') {
      wx.navigateTo({
        url: '/pages/messages/msg_detail/index',
      })

    }
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
    var that = this

    if (!wx.getStorageSync('MemberID')) {
      return false
    }

    this.queryMember()
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

  auth(e) {
    console.log(e)
    var that = this;
    wx.getUserProfile({
      desc: '是否允许tata获取您的个人信息？', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {

        var userInfo = res.userInfo;

        console.log(userInfo)
        
        app.globalData.userInfo = userInfo
        wx.setStorageSync('nickName', userInfo.nickName);
        wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
        wx.setStorageSync('gender', userInfo.gender);
        Authorize.bindGetUserInfo((res) => {
          that.setData({
            isAuthUserInfo: true,
            member: userInfo
          })

          console.log(that.data.member, '2131311')
          this.queryMember()
          // this.queryMemberAccount()
        });

        if(wx.getStorageSync('AuthorizationCode')){
          Api.updateAuthorization('lxy_contact/updateAuthorization.action',{
            ID: wx.getStorageSync('AuthorizationCode').ID,
            AuthStatus: 1
          }).then(res=>{
            // that.setData({
            //   yqm: false
            // })
          })
        }
      }
    })

  },
  // auth(e) {
  //   console.log(e)
  //   var that = this;

  //   if (this.data.isAuthUserInfo == false) {
  //     if (e.detail.userInfo) {
  //       Authorize.bindGetUserInfo((res) => {
  //         console.log(res, '2131311')
  //         this.setData({
  //           isAuthUserInfo: true,
  //           member: res
  //         })
  //         this.queryMember()
  //         // this.queryMemberAccount()
  //       });
  //     }
  //   }
  // },

  queryMember() {
    var that = this
    Api.queryMember({
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }, {
      success: res => {
        console.log(JSON.parse(res.data.data).Records)
        if(JSON.parse(res.data.data).RowCnt > 0) {
          
        var mem = {}

        mem = JSON.parse(res.data.data).Records[0]

        wx.setStorageSync('nickName', mem.MemberName)

        wx.setStorageSync('avatarUrl', mem.AvatarUrl)

        mem.nickName = JSON.parse(res.data.data).Records[0].MemberName
        mem.avatarUrl = JSON.parse(res.data.data).Records[0].AvatarUrl

        mem.Birth = that.age_Conversion(mem.Birth)

          that.setData({
            member: mem,
            isAuthUserInfo: true
          })
        }
      }
    })

    Api.queryCircle('lxy_contact/queryCircle.action', {
      MemberID: wx.getStorageSync('MemberID'),
      LikeType: 1,
      BusinessID: getApp().globalData.BusinessID
    }).then(res => {
      console.log(JSON.parse(res.data).Records)

      if (JSON.parse(res.data).Records) {
        that.setData({
          con1: JSON.parse(res.data).Records.length
        })
      } else {
        that.setData({
          con1: 0
        })
      }

    })

    Api.queryCircle('lxy_contact/queryCircle.action', {
      LinkMemberID: wx.getStorageSync('MemberID'),
      LikeType: 1,
      BusinessID: getApp().globalData.BusinessID
    }).then(res => {
      console.log(JSON.parse(res.data).Records)

      if (JSON.parse(res.data).Records) {
        that.setData({
          con2: JSON.parse(res.data).Records.length
        })
      } else {
        that.setData({
          con2: 0
        })
      }

    })

    Api.querydynamic('lxy_contact/queryDynamic.action', {
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }).then(res => {
      console.log(JSON.parse(res.data).Records)

      var con1 = []

      for (var i = 0; i < JSON.parse(res.data).Records.length; i++) {
        if (JSON.parse(res.data).Records[i].PicUrls != '') {
          var con = JSON.parse(res.data).Records[i].PicUrls.split(',')
          for (var j = 0; j < con.length; j++) {
            con1.push(con[j])
          }
          // that.data.con8.push(JSON.parse(res.data).Records[i].PicUrls.split(','))
          that.data.con8 = con1
        }
      }

      console.log(that.data.con8)

      that.setData({
        con8: that.data.con8
      })

      if (JSON.parse(res.data).Records) {
        that.setData({
          con4: false
        })
      }
    })

    Api.queryPhoto('lxy_contact/queryPhoto.action', {
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }).then(res => {
      console.log(JSON.parse(res.data).Records)

      that.data.con7 = JSON.parse(res.data).Records[0].PhotoID

      if (JSON.parse(res.data).Records) {
        that.setData({
          con5: false
        })
      }

      var con3 = JSON.parse(res.data).Records[0].PhotoUrl

      console.log(con3.split(','))

      that.setData({
        con3: con3.split(',')
      })
    })

    Api.queryRecord('lxy_contact/queryRecord.action', {
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }).then(res => {
      console.log(JSON.parse(res.data).TotalSize)

      // if(JSON.parse(res.data).Records){
      //   that.setData({
      //     con5: false
      //   })
      // }

      that.setData({
        con6: JSON.parse(res.data).TotalSize
      })
    })
  },

  age_Conversion(date) {
    console.log(date)
    // debugger
    var age = '';
    //var str = date.replace(/-|-/g, "-").replace(/-/g, "");
    var r = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
      var Y = new Date().getFullYear();
      age = (Y - r[1]);
      return age;
    } else {
      return '时间格式错误';
    }
  },

  mine2(e) {
    wx.navigateTo({
      url: '../mine/mine2/index?con=' + e.currentTarget.dataset.index,
    })
  },

  // mine3(){
  //   wx.navigateTo({
  //     url: './mine2 copy 3/index',
  //   })
  // },

  but1() {
    wx.navigateTo({
      url: './mine2 copy/index',
    })
  },

  but2() {
    wx.navigateTo({
      url: './mine2 copy 2/index',
    })
  },

  but3() {
    wx.navigateTo({
      url: './mine2_copy_4/index',
    })
  },

  but4(e) {
    console.log(e)
    wx.navigateTo({
      url: '../messages/msg_content/msg_content?MemberID=0000000000&Code=2',
    })
  },

  but5(e) {
    console.log(e)
    wx.navigateTo({
      url: '../auth_apply/index',
    })
  }
})
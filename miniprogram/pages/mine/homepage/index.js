var Api = require("../../../utils/api.js")
var app = getApp()

// pages/mine/homepage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mine: {
      name: wx.getStorageSync('nickName'),
      AvatarUrl: wx.getStorageSync('avatarUrl'),
      sex: 0,
      age: 20,
      city: '南京',
      constellation: '狮子座',
      height: 170,
      weight: 50,
      hobby: '抽烟、喝酒、烫头',
      yearnfor: '哈哈哈',
      introduce: '我是一个粉刷匠,粉刷本领强.我要把那新房子,刷得更漂亮.'
    },
    scrollTop: 0,
    isImage: false,
    images: [],
    giftshow: false,
    giftChooseIndex: 0,
    IsChatshow: false,
    IsphotoShow: false,
    IsLinkShow: true,
    con: false,
    con1: 0,
    con2: 0,
    con3: true,
    giftList: [{
        id: 0,
        url: 'http://mall-imag.linxyun.com/FoTz3L2Ci4n-s571GEw6h2D2nFtG',
        text: '冲上云霄',
        jifen: '300'
      }, {
        id: 1,
        url: 'http://mall-imag.linxyun.com/FvFe8xe2ojMgghEHo1jzoYxBes8Y',
        text: '撩一下',
        jifen: '56'
      }, {
        id: 2,
        url: 'http://mall-imag.linxyun.com/FmLfj7ZW_N2Wy3ZHHSM4J18PeFPV',
        text: '比心',
        jifen: '18'
      }, {
        id: 3,
        url: 'http://mall-imag.linxyun.com/Fsgd007SiLQUvFjSPijCoxkgLWbo',
        text: '全场最美',
        jifen: '67'
      },
      {
        id: 4,
        url: 'http://mall-imag.linxyun.com/FjTtgcq91-_TxeO-ZeSCUynMnRlb',
        text: '糖葫芦',
        jifen: '200'
      }, {
        id: 5,
        url: 'http://mall-imag.linxyun.com/Fi1ZFFCDsPY9aY1_w6MBCCQRYcfE',
        text: '爱之蔷薇',
        jifen: '26'
      }, {
        id: 5,
        url: 'http://mall-imag.linxyun.com/Flta_HvgMnHIO17ebPj2DWmEcKBA',
        text: '法拉利',
        jifen: '890'
      }, {
        id: 5,
        url: 'http://mall-imag.linxyun.com/FhUaH0w6DIv1KXix_feAXyN5ZWCM',
        text: '礼物周',
        jifen: '45'
      }
    ],
    con8: [],
    res: {},
    jifen: false,
    Num: '',
    Num1: '',
    globalMsg: false, //控制全局消息的隐藏与显示
    globalContent: {} //全局消息里面的内容
  },
  mine2(e) {
    wx.navigateTo({
      url: '/pages/mine/mine2/index?con=' + e.currentTarget.dataset.index,
    })
  },
  tophoto(e) {
    if (this.data.con) {
      return false
    }

    wx.navigateTo({
      url: '/pages/mine/photo/index?con=' + e.currentTarget.dataset.index + '&con1=' + this.data.IsphotoShow,
    })
  },
  towallet() {
    wx.navigateTo({
      url: '/pages/mine/wallet/charge/index?con='+this.data.Num1,
    })
  },
  toupdateMeaasge() {
    wx.navigateTo({
      url: '/pages/mine/homepage/updateMeaasge/index',
    })
  },
  applyphoto() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否申请查看对方相册',
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success: res => {
        Api.queryCircle('lxy_contact/queryCircle.action',{
          MemberID: wx.getStorageSync('MemberID'),
          LinkMemberID: that.data.mine.MemberID,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          if(JSON.parse(res.data).Records){
            Api.updateCircle('lxy_contact/updateCircle.action', {
              CircleID: JSON.parse(res.data).Records[0].CircleID,
              CircleType: 0,
              BusinessID: getApp().globalData.BusinessID
            }).then(res=>{
              that.setData({
                con3: false
              })
            })
          }else{
            Api.addCircle('lxy_contact/addCircle.action', {
              MemberID: wx.getStorageSync('MemberID'),
              LinkMemberID: that.data.mine.MemberID,
              CircleType: 0,
              LikeType: 0,
              BusinessID: getApp().globalData.BusinessID
            }).then(res => {
              console.log(res)
              that.setData({
                con3: false
              })
            })
          }
        })

        

        Api.sendIMReq('lxy_contact/sendIMReq.action', {
          MsgClassify: 0,
          Sender: getApp().globalData.EntCode + '-' + wx.getStorageSync('MemberID'),
          Recver: getApp().globalData.EntCode + '-' + that.data.mine.MemberID,
          Message: wx.getStorageSync('nickName') + '申请查看你的相册',
          ContentType: 0,
          MsgType: 2,
          BusinessID: getApp().globalData.BusinessID
        }).then(res => {
          console.log(res)
        })

        this.selectComponent('#show').show({
          Icon: '',
          Text: '已申请 请您耐心等待'
        })
      }
    })
  },

  applyphoto1() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否申请查看对方相册',
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success: res => {
        if(!res.confirm){
          return false
        }

        Api.queryMember({
          MemberID: wx.getStorageSync('MemberID'),
          BusinessID: getApp().globalData.BusinessID
        },{success: res=>{
          console.log(this.data.Num,JSON.parse(res.data.data).Records[0].Balance)

          if(Number(this.data.Num)>Number(JSON.parse(res.data.data).Records[0].Balance)){
            wx.showModal({
              title: '提示',
              content: '您的积分不足，是否充值？',
              confirmColor: '#FF0055',
              cancelColor: '#AAAAAA',
              success: res => {
                if(res.confirm){
                  wx.navigateTo({
                    url: '../../mine/wallet/charge/index?con='+this.data.Num1,
                  })
                }
              }
            })

            return false
          }else{
            Api.updateMoney('lxy_contact/updateMoney.action', {
              MemberID: wx.getStorageSync('MemberID'),
              Balance: '-' + this.data.Num,
              RecordType: 23,
              Amount: this.data.Num,
              // AccountType: 1,
              RelationID: this.data.mine.MemberID,
              Remarks: 1
            }).then(res => {
              Api.updateMoney('lxy_contact/updateMoney.action', {
                MemberID: this.data.mine.MemberID,
                Balance: this.data.Num,
                RecordType: 13,
                Amount: this.data.Num,
                // AccountType: 1,
                RelationID: wx.getStorageSync('MemberID'),
                Remarks: 1
              }).then(res => {
                Api.queryCircle('lxy_contact/queryCircle.action', {
                  MemberID: wx.getStorageSync('MemberID'),
                  LinkMemberID: that.data.mine.MemberID,
                  BusinessID: getApp().globalData.BusinessID
                }).then(res => {
                  if (JSON.parse(res.data).Records) {
                    Api.updateCircle('lxy_contact/updateCircle.action', {
                      CircleID: JSON.parse(res.data).Records[0].CircleID,
                      CircleType: 1,
                      BusinessID: getApp().globalData.BusinessID
                    }).then(res => {
                      console.log(res)

                      // if(!JSON.parse(res.data).Records){
                      //   that.data.IsLinkShow=false

                      that.setData({
                        jifen: false
                      })
                      // }
                    })
                  } else {
                    Api.addCircle('lxy_contact/addCircle.action', {
                      MemberID: wx.getStorageSync('MemberID'),
                      LinkMemberID: that.data.mine.MemberID,
                      CircleType: 1,
                      LikeType: 0,
                      BusinessID: getApp().globalData.BusinessID
                    }).then(res => {
                      console.log(res)

                      // if(!JSON.parse(res.data).Records){
                      //   that.data.IsLinkShow=false

                      that.setData({
                        jifen: false
                      })
                      // }
                    })
                  }
                })
              })
            })

            wx.showToast({
              title: '已解锁',
              icon: 'success',
              duration: 2000
            })
          }
        }
        })
      }
    })
  },

  applyphoto2() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否申请解锁私聊',
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success: res => {
        if(!res.confirm){
          return false
        }

        Api.queryMember({
          MemberID: wx.getStorageSync('MemberID'),
          BusinessID: getApp().globalData.BusinessID
        },{success: res=>{
          if(Number(this.data.mine.MsgNum)>Number(JSON.parse(res.data.data).Records[0].Balance)){
            wx.showModal({
              title: '提示',
              content: '您的积分不足，是否充值？',
              confirmColor: '#FF0055',
              cancelColor: '#AAAAAA',
              success: res => {
                if(res.confirm){
                  wx.navigateTo({
                    url: '../../mine/wallet/charge/index?con='+this.data.Num1,
                  })
                }
              }
            })

            return false
          }else{
            Api.updateMoney('lxy_contact/updateMoney.action', {
              MemberID: wx.getStorageSync('MemberID'),
              Balance: '-' + this.data.mine.MsgNum,
              RecordType: 23,
              Amount: this.data.mine.MsgNum,
              // AccountType: 1,
              RelationID: this.data.mine.MemberID,
              Remarks: 1
            }).then(res => {
              Api.updateMoney('lxy_contact/updateMoney.action', {
                MemberID: this.data.mine.MemberID,
                Balance: this.data.mine.MsgNum,
                RecordType: 13,
                Amount: this.data.mine.MsgNum,
                // AccountType: 1,
                RelationID: wx.getStorageSync('MemberID'),
                Remarks: 1
              }).then(res => {
                Api.queryCircle('lxy_contact/queryCircle.action', {
                  MemberID: wx.getStorageSync('MemberID'),
                  LinkMemberID: that.data.mine.MemberID,
                  BusinessID: getApp().globalData.BusinessID
                }).then(res => {
                  if (JSON.parse(res.data).Records) {
                    Api.updateCircle('lxy_contact/updateCircle.action', {
                      CircleID: JSON.parse(res.data).Records[0].CircleID,
                      MsgType: 1,
                      BusinessID: getApp().globalData.BusinessID
                    }).then(res => {
                      console.log(res)
                    })
                  } else {
                    Api.addCircle('lxy_contact/addCircle.action', {
                      MemberID: wx.getStorageSync('MemberID'),
                      LinkMemberID: that.data.mine.MemberID,
                      MsgType: 1,
                      LikeType: 0,
                      BusinessID: getApp().globalData.BusinessID
                    }).then(res => {
                      console.log(res)
                    })
                  }
                })
              })

              this.onChatClose()

              wx.showToast({
                title: '已解锁私聊，快去聊天吧',
                icon: 'none',
                duration: 2000
              })
            })
          }
        }
        })
      }
    })
  },

  applyphoto3(){
    this.setData({
      giftshow: true
    })

    this.onChatClose()
  },

  onChatClose() {
    this.setData({
      IsChatshow: false
    })
  },
  ChatOpen(e) {
    console.log(this.data.mine, e)

    if(this.data.mine.Gender!=1){
      wx.navigateTo({
        url: '../../messages/msg_content/msg_content?MemberID='+e.currentTarget.dataset.index+'&Code=1&MemberName=' + e.currentTarget.dataset.name + '&Gender=' + e.currentTarget.dataset.gender,
      })

      return false
    }

    if(this.data.mine.MsgNum==0){
      wx.navigateTo({
        url: '../../messages/msg_content/msg_content?MemberID='+e.currentTarget.dataset.index+'&Code=1&MemberName=' + e.currentTarget.dataset.name + '&Gender=' + e.currentTarget.dataset.Gender,
      })

      return false
    }
    
    Api.queryCircle('lxy_contact/queryCircle.action',{
      MemberID: wx.getStorageSync('MemberID'),
      LinkMemberID: this.data.mine.MemberID,
      MsgType: 1,
      // LikeType: 1,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      if(JSON.parse(res.data).Records){
        wx.navigateTo({
          url: '../../messages/msg_content/msg_content?MemberID='+e.currentTarget.dataset.index+'&Code=1',
        })
      }else{
        this.setData({
          IsChatshow: true
        })
      }
    })
  },
  GiftClick(e) {
    console.log(e)
    this.setData({
      giftChooseIndex: e.currentTarget.dataset.index
    })
  },
  giveGift() {
    this.setData({
      giftshow: true
    })
  },
  GiftClose() {
    this.setData({
      giftshow: false
    })
  },
  giveGiftsbumit() {
    var that = this

    console.log(this.data.giftChooseIndex)

    Api.queryMemberAccount('lxy_contact/queryMemberAccount.action', {
      MemberID: wx.getStorageSync('MemberID')
    }).then(res => {
      console.log(JSON.parse(res.data).Records[0])

      if (Number(JSON.parse(res.data).Records[0].Balance) > Number(that.data.giftList[this.data.giftChooseIndex].jifen)) {
        Api.updateMoney('lxy_contact/updateMoney.action', {
          MemberID: wx.getStorageSync('MemberID'),
          Amount: Number(that.data.giftList[this.data.giftChooseIndex].jifen),
          Balance: '-' + Number(that.data.giftList[this.data.giftChooseIndex].jifen),
          RecordType: 24,
          RelationID: this.data.mine.MemberID,
          Remarks: 1,
          RelationType: that.data.giftList[this.data.giftChooseIndex].text
        }).then(res => {
          Api.updateMoney('lxy_contact/updateMoney.action', {
            MemberID: this.data.mine.MemberID,
            Amount: Number(that.data.giftList[this.data.giftChooseIndex].jifen),
            Balance: Number(that.data.giftList[this.data.giftChooseIndex].jifen),
            RecordType: 14,
            RelationID: wx.getStorageSync('MemberID'),
            Remarks: 1,
            RelationType: that.data.giftList[this.data.giftChooseIndex].text
          }).then(res => {
            //console.log(JSON.parse(res.data).Records[0])
  
            this.selectComponent('#show').show({
              Icon: '',
              Text: '['+that.data.mine.MemberName+']已成功收到礼物',
            })

            if(that.data.giftList[this.data.giftChooseIndex].jifen>=that.data.mine.MsgNum){
              Api.queryCircle('lxy_contact/queryCircle.action', {
                MemberID: wx.getStorageSync('MemberID'),
                LinkMemberID: that.data.mine.MemberID,
                BusinessID: getApp().globalData.BusinessID
              }).then(res => {
                if (JSON.parse(res.data).Records) {
                  Api.updateCircle('lxy_contact/updateCircle.action', {
                    CircleID: JSON.parse(res.data).Records[0].CircleID,
                    MsgType: 1,
                    BusinessID: getApp().globalData.BusinessID
                  }).then(res => {
                    console.log(res)
                  })
                } else {
                  Api.addCircle('lxy_contact/addCircle.action', {
                    MemberID: wx.getStorageSync('MemberID'),
                    LinkMemberID: that.data.mine.MemberID,
                    MsgType: 1,
                    LikeType: 0,
                    BusinessID: getApp().globalData.BusinessID
                  }).then(res => {
                    console.log(res)
                  })
                }
              })
            }
          })
        })
      } else {
        wx.showModal({
          title: '提示',
          content: "您的积分不足，是否充值？",
          confirmColor: '#FF0055',
          cancelColor: '#AAAAAA',
          success: res => {
            wx.navigateTo({
              url: '../../mine/wallet/charge/index?con='+this.data.Num1,
            })
          }
        })
      }
    })
    // wx.showToast({
    //   title: '已成功收到礼物',
    //   icon: 'success',
    //   duration: 2000
    // })
    this.setData({
      giftshow: false
    })
  },
  good(e) {
    var that = this

    Api.queryMemberAccountRecord('lxy_contact/queryMemberAccountRecord.action',{
      MemberID: wx.getStorageSync('MemberID'),
      RelationID: e.currentTarget.dataset.index,
      RecordType: 24
    }).then(res=>{
      if(JSON.parse(res.data).Records){
        Api.queryLikes('lxy_contact/queryLikes.action', {
          MemberID: wx.getStorageSync('MemberID'),
          RelationID: e.currentTarget.dataset.index,
          LikeClass: 0,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res => {
          console.log(res)

          if (!JSON.parse(res.data).Records) {
            Api.addLikes('lxy_contact/addLikes.action', {
              MemberID: wx.getStorageSync('MemberID'),
              RelationID: e.currentTarget.dataset.index,
              LikeClass: 0,
              LikeType: 1,
              BusinessID: getApp().globalData.BusinessID
            }).then(res => {
              console.log(res)

              that.data.con1 += 1

              that.setData({
                con1: that.data.con1
              })

              wx.showToast({
                title: '已点赞',
                icon: 'success',
                duration: 2000
              })
            })
          }else{
            wx.showToast({
              title: '已赞',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: "给她送过礼物才能评价哦~",
          confirmColor: '#FF0055',
          cancelColor: '#AAAAAA'
        })
      }
    })

    
  },
  nogood(e) {
    var that=this

    Api.queryMemberAccountRecord('lxy_contact/queryMemberAccountRecord.action',{
      MemberID: wx.getStorageSync('MemberID'),
      RelationID: e.currentTarget.dataset.index,
      RecordType: 24
    }).then(res=>{
      if(JSON.parse(res.data).Records){
        Api.queryLikes('lxy_contact/queryLikes.action', {
          MemberID: wx.getStorageSync('MemberID'),
          RelationID: e.currentTarget.dataset.index,
          LikeClass: 1,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res => {
          console.log(res)

          if (!JSON.parse(res.data).Records) {
            Api.addLikes('lxy_contact/addLikes.action', {
              MemberID: wx.getStorageSync('MemberID'),
              RelationID: e.currentTarget.dataset.index,
              LikeClass: 1,
              LikeType: 1,
              BusinessID: getApp().globalData.BusinessID
            }).then(res => {
              console.log(res)

              that.data.con2 += 1

              that.setData({
                con2: that.data.con2
              })

              wx.showToast({
                title: '已踩',
                icon: 'success',
                duration: 2000
              })
            })
          }else{
            wx.showToast({
              title: '已踩',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: "给她送过礼物才能评价哦~",
          confirmColor: '#FF0055',
          cancelColor: '#AAAAAA'
        })
      }
    })

    
  },

  age_Conversion(date) {
    console.log(date)
    // debugger
    var age = '';
    //var str = date.replace(/-|-/g, "-").replace(/-/g, "");
    var r = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return '--';
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
      var Y = new Date().getFullYear();
      age = (Y - r[1]);
      return age;
    } else {
      return '时间格式错误';
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // var options = {
    //   con: 'o2GX35H0yZE70Df7qji9ufC81F_s'
    // }
    this.data.res = options
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
    console.log(this.data.globalContent, app.globalData.self)
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
  queryMember(options) {
    var that = this

    // var options={con: res}

    Api.queryMember({
      MemberID: options.con,
      BusinessID: getApp().globalData.BusinessID
    }, {
      success: res => {
        console.log(JSON.parse(res.data.data).Records)

        that.data.mine = JSON.parse(res.data.data).Records[0]

        that.data.mine.Birth = that.age_Conversion(that.data.mine.Birth)

        if (wx.getStorageSync('MemberID') == options.con) {
          that.setData({
            IsphotoShow: true
          })

          Api.queryPhoto('lxy_contact/queryPhoto.action', {
            MemberID: wx.getStorageSync('MemberID'),
            BusinessID: getApp().globalData.BusinessID
          }).then(res => {
            console.log(JSON.parse(res.data).Records)

            if (JSON.parse(res.data).Records) {
              var lis = []

              lis = JSON.parse(res.data).Records[0].PhotoUrl

              that.data.images = lis.split(',')

              console.log(that.data.images)

              // for(var i=0;i<JSON.parse(res.data).Records.length;i++){
              //   lis.push(JSON.parse(res.data).Records[i].PhotoUrl)
              // }

              // console.log(lis)

              that.setData({
                images: that.data.images
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
          })
        } else {
          Api.queryPhoto('lxy_contact/queryPhoto.action', {
            MemberID: options.con,
            BusinessID: getApp().globalData.BusinessID
          }).then(res => {
            console.log(JSON.parse(res.data).Records)

            if (JSON.parse(res.data).Records) {
              if (JSON.parse(res.data).Records[0].PhotoType == 1) {
                that.data.con = true
              } else if (JSON.parse(res.data).Records[0].PhotoType == 2) {
                that.data.jifen = true
              }

              var lis = []

              lis = JSON.parse(res.data).Records[0].PhotoUrl

              that.data.images = lis.split(',')

              console.log(that.data.images)

              // for(var i=0;i<JSON.parse(res.data).Records.length;i++){
              //   lis.push(JSON.parse(res.data).Records[i].PhotoUrl)
              // }

              // console.log(lis)

              that.setData({
                con: that.data.con,
                jifen: that.data.jifen,
                images: that.data.images,
                Num: JSON.parse(res.data).Records[0].Num
              })
            }


          })

          Api.addRecord('lxy_contact/addRecord.action', {
            MemberID: wx.getStorageSync('MemberID'),
            DynamicID: options.con,
            BusinessID: getApp().globalData.BusinessID
          })

          Api.querydynamic('lxy_contact/queryDynamic.action', {
            MemberID: options.con,
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
          })

          Api.queryMember({
            MemberID: wx.getStorageSync('MemberID'),
            BusinessID: getApp().globalData.BusinessID
          },{success: res=>{
            that.setData({
              Num1: JSON.parse(res.data.data).Records[0].Balance
            })
          }
        })
        }

        that.setData({
          mine: that.data.mine
        })

        console.log(this.data.mine)

        Api.queryCircle('lxy_contact/queryCircle.action', {
          MemberID: wx.getStorageSync('MemberID'),
          LinkMemberID: that.data.mine.MemberID,
          // LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res => {
          console.log(res)

          if (!JSON.parse(res.data).Records || JSON.parse(res.data).Records[0].LikeType != 1) {
            that.data.IsLinkShow = false

            that.setData({
              IsLinkShow: false
            })
          }

          if (JSON.parse(res.data).Records[0].CircleType == 1) {
            that.setData({
              con: false,
              jifen: false,
              //con3: false
            })
          } else if (JSON.parse(res.data).Records[0].CircleType == 0) {
            that.setData({
              // con: false,
              con3: false
            })
          }
        })
      }
    })

    Api.queryzan('lxy_contact/queryzan.action', {
      MemberID: options.con
    }, {
      success: res => {
        console.log(res)
        console.log(JSON.parse(res.data.data).TotalSize)

        if (JSON.parse(res.data.data).Records) {
          that.setData({
            con1: Number(JSON.parse(res.data.data).Records[0].Likes)
          })
        }


      }
    })

    Api.querycai('lxy_contact/querycai.action', {
      MemberID: options.con
    }, {
      success: res => {
        console.log(JSON.parse(res.data.data).TotalSize)

        if (JSON.parse(res.data.data).Records) {
          that.setData({
            con2: Number(JSON.parse(res.data.data).Records[0].Stepons)
          })
        }


      }
    })
  },

  but(e) {
    var that = this

    Api.addCircle('lxy_contact/addCircle.action', {
      MemberID: wx.getStorageSync('MemberID'),
      LinkMemberID: e.currentTarget.dataset.index.MemberID,
      MemRemarks: wx.getStorageSync('nickName'),
      LinkRemarks: e.currentTarget.dataset.index.MemberName,
      LikeType: 1,
      BusinessID: getApp().globalData.BusinessID
    }).then(res => {
      console.log(res)

      that.setData({
        IsLinkShow: true
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
    this.queryMember(this.data.res)
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
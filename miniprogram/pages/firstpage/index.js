import Authorze from '../../utils/authorize'

import Login from '../../utils/login'

var Api = require("../../utils/api")

var Base64 = require("../../utils/b64.js")

const { windowWidth, windowHeight } = wx.getSystemInfoSync();

import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../utils/http"

// pages/firstpage/index.js
// var Api = require('../../utils/api')
// var Authorize = require("../../utils/authorize");
import {
  ws
} from '../../utils/websocket.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    con:[],
    comm: false,
    com: '',
    RelationID: 0,
    RelationID1: '',
    RelationID2: '',
    RelationID3: '',
    con1: '',
    con2: '',
    con3: '',
    current: 1,
    limit: 10,
    total: 0,
    current1: 1,
    limit1: 10,
    total1: 0,
    ts: true,
    yqm: false,
    yqm1: true,
    tet: '',
    navHeight: '',
    mainHeight:'',
    menuButtonInfo: {},
    searchMarginTop: 0, // 搜索框上边距
    searchWidth: 0, // 搜索框宽度
    searchHeight: 0, // 搜索框高度
    SelectShow:false,
    islady:true,
    btnactive:1,
    btnactive1:1,
    online:true,
    par: {
      // MemberID: wx.getStorageSync('MemberID')
    },
    res: {},
    Icon: '',
    Text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    console.log(options,'00000')

    // if(options!=''){
    //   if(JSON.parse(options.con).AuthStatus==0){
    //     wx.setStorageSync('AuthorizationCode', JSON.parse(options.con))
        
    //     this.setData({
    //       yqm: false
    //     })
    //   }else{
    //     this.setData({
    //       yqm1: false
    //     })
    //   }
    // }

    

    // if(options.con||wx.getStorageSync('MemberID')){
    //   this.setData({
    //     yqm: false
    //   })
    // }

    Api.queryWxAuthorization('lxy_contact/queryWxAuthorization.action',{
      MemberID: wx.getStorageSync('MemberID'),
      AuthStatus: 0
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      if(JSON.parse(res.data).Records[0]){
        that.data.res=JSON.parse(res.data).Records[0]
      }
    })

    this.setData({
      menuButtonInfo: wx.getMenuButtonBoundingClientRect()
    })
    // console.log(this.data.menuButtonInfo)
    const { top, width, height, right } = this.data.menuButtonInfo
    wx.getSystemInfo({
      success: (res) => {
        const { statusBarHeight } = res
        const margin = top - statusBarHeight
        this.setData({
          navHeight: (height + statusBarHeight + (margin * 2)),
          mainHeight:windowHeight - (height + statusBarHeight + (margin * 2)),
          searchMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
          searchHeight: height,  // 与胶囊按钮同高
          searchWidth: right - width // 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
        })
      },
    })

    this.querydynamic()
  },

  searchClick(){
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    this.setData({
      SelectShow:true
    })
  },

  SelectClose() {
    this.setData({ SelectShow: false });
  },

  selall(){
    this.setData({ btnactive: 1 });
  },
  selnew(){
    this.setData({ btnactive: 2 });
  },
  selbeautiful(){
    this.setData({ btnactive: 3 });
  },

  selall1(){
    this.setData({ btnactive1: 1 });
  },
  selnew1(){
    this.setData({ btnactive1: 2 });
  },
  selbeautiful1(){
    this.setData({ btnactive1: 3 });
  },
  selVIP(){
    this.setData({ btnactive: 2 });
  },
  selSVIP(){
    this.setData({ btnactive: 3 });
  },

  onlineChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ online: detail });
  },

  but_yqm(){
    console.log(this.data.tet)
  },

  tet(e){
    console.log(e.detail.value)

    this.data.tet=e.detail.value
  },

  but_ts(){
    this.setData({
      ts: false
    })
  },

  but_cz(){
    this.setData({
      btnactive: 1,
      btnactive1: 1,
      online: true
    })
  },

  but_sx(){
    console.log(this.data.btnactive)

    console.log(this.data.btnactive1)
    
    var con={}

    if(this.data.btnactive==1){
      this.data.par={}
      this.data.current=1
    }else if(this.data.btnactive==2){
      this.data.par.Gender=1
      this.data.current=1
    }else if(this.data.btnactive==3){
      this.data.par.Gender=0
      this.data.current=1
    }
    
    if(this.data.online){
      this.data.par.Online=0
    }else{
      this.data.par.Onlines=1
    }

    this.data.current1=1

    if(this.data.btnactive1==1){
      this.querydynamic(this.data.par)
    }else if(this.data.btnactive1==2){
      this.queryCircleLinkMemberID(this.data.par)
    }else if(this.data.btnactive1==3){
      this.queryCircleMemberID(this.data.par)
    }

    

    this.setData({ SelectShow: false });
  },

  but_dz(e){
    console.log(e)

    // wx.navigateTo({
    //   url: '../mine/homepage/index?con='+e.currentTarget.dataset.index,
    // })
  },

  preview(event){
    console.log(event)
    let currentUrl = event.currentTarget.dataset.src
    console.log(currentUrl)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.index // 需要预览的图片http链接列表
    })
    this.setData({
      isdelete: false
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
    this.btnGroup = this.selectComponent("#btn-group")
    this.popover = this.selectComponent('#popover');
    this.Grilpopover = this.selectComponent('#Grilpopover');
    this.manpopover = this.selectComponent('#manpopover');

    this.popover = this.selectComponent('#popover');
    var that=this

    console.log(that)

    // this.querydynamic()

    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
  },

  querydynamic(con){
    var that=this

    Api.querydynamic('lxy_contact/queryDynamic.action',{
      current: this.data.current,
      limit: this.data.limit,
      total: this.data.total,
      BusinessID: getApp().globalData.BusinessID,
      //Online: 0,
      ...this.data.par
    }).then(res=>{
      let meaasge = JSON.parse(res.data).Records

      if(meaasge){
        meaasge.forEach(item => {
        item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

        item.Desctet=Base64.Base64.decode(item.Desctet)

        item.PicUrls=item.PicUrls.split(',')
        
        item.UrlList=item.UrlList.split(',')

        item.UrlList1=item.UrlList1.split(',')

        item.Likes=Number(item.Likes)

        item.Comments=Number(item.Comments)

        console.log(item)

        if(wx.getStorageSync('MemberID')){
          for(var i=0;i<item.UrlList1.length;i++){
            if(item.UrlList1[i]==wx.getStorageSync('MemberID')){
              item.ydz='0'
            }
          }
          
        }

        item.Birth=that.age_Conversion(item.Birth)
        item.CreateTime=that.funtime(item.CreateTime)

        if(this.data.current>1){
          that.data.con.push(item)
        }
      })
      }else{
        meaasge=[]
      }

      
      console.log(that.data.con,'22222222222222222222')

      if(this.data.current==1){
        that.data.con=meaasge
      }

      console.log(that.data.con)

      console.log(that.data.btnactive1)
      
      Api.queryCircle('lxy_contact/queryCircle.action',{
        MemberID: wx.getStorageSync('MemberID'),
        //LinkMemberID: that.data.con.MemberID,
        LikeType: 2,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(JSON.parse(res.data))
        
        for(var i=0;i<JSON.parse(res.data).Records.length;i++){
          for(var j=0;j<that.data.con.length;j++){
            if(JSON.parse(res.data).Records[i].LinkMemberID==that.data.con[j].MemberID){
              console.log(that.data.con[j])
              that.data.con.splice(j,1)
            }
          }
        }
      })

      console.log(that.data.con)

      for(var i=0;i<that.data.con.length;i++){
        if(that.data.con[i].Status2==1){
          if(that.data.con[i].Gender==wx.getStorageSync('Gender')){
            that.data.con.splice(i,1)
          }
        }
      }

      setTimeout(function(){
        that.setData({
          con: that.data.con
        })
      },500)
    })
  },

  queryCircleLinkMemberID(){
    var that=this

    var par={}

        if(that.data.btnactive==2){
          par.Gender=1
        }else if(that.data.btnactive==3){
          par.Gender=0
        }

        if(that.data.online){
          par.Online=0
        }else{
          par.Onlines=1
        }

        Api.queryCircleLinkMemberID('lxy_contact/queryCircleLinkMemberID.action',{
          LinkMemberID: wx.getStorageSync('MemberID'),
          current: that.data.current,
          limit: that.data.limit,
          total: that.data.total,
          ...par
        }).then(res=>{
          console.log(JSON.parse(res.data))

          let meaasge=[]

          if(JSON.parse(res.data).Records){
            meaasge=JSON.parse(res.data).Records

            if(meaasge){
              meaasge.forEach(item => {
              item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')
      
              item.Desctet=Base64.Base64.decode(item.Desctet)
      
              item.PicUrls=item.PicUrls.split(',')
              
              item.UrlList=item.UrlList.split(',')
      
              item.UrlList1=item.UrlList1.split(',')
      
              item.Likes=Number(item.Likes)
      
              console.log(item)
      
              if(wx.getStorageSync('MemberID')){
                for(var i=0;i<item.UrlList1.length;i++){
                  if(item.UrlList1[i]==wx.getStorageSync('MemberID')){
                    item.ydz='0'
                  }
                }
                
              }
      
              item.Birth=that.age_Conversion(item.Birth)
              item.CreateTime=that.funtime(item.CreateTime)
      
              if(this.data.current>1){
                console.log('111')

                that.data.con.push(item)
              }
            })
            }
            console.log(that.data.con,'22222222222222222222')
      
            // if(that.data.current==1){
            //   console.log('222')
            //   that.data.con=meaasge
            // }
          }

          if(that.data.current==1){
            console.log('222')
            that.data.con=meaasge
          }

          that.setData({
            con: that.data.con
          })
        })
  },

  queryCircleMemberID(){
    var that=this

    var con=[]

        var par={}

        if(that.data.btnactive==2){
          par.Gender=1
        }else if(that.data.btnactive==3){
          par.Gender=0
        }

        if(that.data.online){
          par.Online=0
        }else{
          par.Onlines=1
        }

        Api.queryCircleMemberID('lxy_contact/queryCircleMemberID.action',{
          MemberID: wx.getStorageSync('MemberID'),
          current: that.data.current,
          limit: that.data.limit,
          total: that.data.total,
          ...par
        }).then(res=>{
          console.log(JSON.parse(res.data))

          var meaasge=[]

          if(JSON.parse(res.data).Records){
            meaasge=JSON.parse(res.data).Records

            meaasge.forEach(item => {
              item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

              item.Desctet=Base64.Base64.decode(item.Desctet)
      
              item.PicUrls=item.PicUrls.split(',')
      
              item.Likes=Number(item.Likes)

              item.UrlList=item.UrlList.split(',')

              item.UrlList1=item.UrlList1.split(',')
      
              item.Birth=that.age_Conversion(item.Birth)
              item.CreateTime=that.funtime(item.CreateTime)

              if(wx.getStorageSync('MemberID')){
                for(var i=0;i<item.UrlList1.length;i++){
                  if(item.UrlList1[i]==wx.getStorageSync('MemberID')){
                    item.ydz='0'
                  }
                }
                
              }
      
              if(this.data.current>1){
                that.data.con.push(item)
              }
            })

            // if(this.data.current==1){
            //   that.data.con=meaasge
            // }

            console.log(that.data.con)
          }

          if(this.data.current==1){
            that.data.con=meaasge
          }

          that.setData({
            con: that.data.con
          })
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
    }else{
      return '时间格式错误';
    }
  },

  funtime(time) {
      var now = new Date().getTime();
    console.log(now)
     //var time1=new Date(time);
      // 下面两种转换格式都可以。
       //var tmpTime = Date.parse(time.replace(/-/gi, "/"));
     //var tmpTime=time1.getTime();
     var starttime = time.substring(0,4)+'/'+time.substring(4,6)+'/'+time.substring(6,8)+'/'+time.substring(8,10)+':'+time.substring(10,12)+':'+time.substring(12,14)
     console.log(starttime)
        var tmpTime = (new Date(starttime)).getTime();
        console.log(tmpTime)
      // 
      var result;
      // 一分钟 1000 毫秒 乘以 60
      var minute = 1000 * 60 ;
      var hour = minute * 60;
      var day = hour * 24;
      var week = day * 7;
      var month = day * 30;
      var year = day * 365;
      // 现在时间 减去 传入时间 得到差距时间
      var diffValue = now - tmpTime;
      // 小于 0 直接返回
      if (diffValue < 0) {
        return;
    
      }
      // 计算 差距时间除以 指定时间段的毫秒数
      var yearC = diffValue / year;
      var monthC = diffValue / month;
      var weekC = diffValue / week;
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      if (yearC >= 1) {
        console.log("年前");
        result = "" + parseInt(yearC) + "月前";
      } else if (monthC >= 1) {
        console.log(parseInt(monthC) + "月前")
        result = "" + parseInt(monthC) + "月前";
      } else if (weekC >= 1) {
        console.log(parseInt(weekC) + "周前")
        result = "" + parseInt(weekC) + "周前";
      } else if (dayC >= 1) {
        console.log(parseInt(dayC) + "天前")
        result = "" + parseInt(dayC) + "天前";
      } else if (hourC >= 1) {
        console.log(parseInt(hourC) + "小时前")
        result = "" + (parseInt(hourC)) + "小时前";
        //result = { time: parseInt(hourC), dw: '时' }
    
      } else if (minC > 1) {
        console.log(parseInt(minC) + "分钟前")
        //result = {time: parseInt(minC),dw:'分'}
        result = "" + parseInt(minC) + "分钟前";
        //result = "刚刚";
      } else {
        result = "刚刚";
      }
      return result;
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  // 微信授权
  auth(e) {
    console.log(e.detail.userInfo, '授权')
    var that = this;
    if (!wx.getStorageSync('isAuthUserInfo')) {
      if (e.detail.userInfo) {
        Authorze.bindGetUserInfo((res) => {
          console.log(res, '2131311')
          this.setData({
            isAuthUserInfo: true,
            AvatarUrl: res.AvatarUrl,
            nickName: res.nickName
          })

          console.log(this.data.tet)

          Api.queryWxAuthorization('lxy_contact/queryWxAuthorization.action',{
            AuthorizationCode: this.data.tet
          }).then(res=>{
            console.log(JSON.parse(res.data).Records)

            if(JSON.parse(res.data).Records){
              if(JSON.parse(res.data).Records[0].AuthStatus==0){
                Api.updateAuthorization('lxy_contact/updateAuthorization.action',{
                  ID: JSON.parse(res.data).Records[0].ID,
                  AuthStatus: 1
                }).then(res=>{
                  that.setData({
                    yqm: false
                  })
                })
              }
            }
          })

          // this.queryMember()
          // this.queryMemberAccount()
          ws.connect()
        });
      }
    } else {}
  },

  onTap: function (e) {
    console.log(e)
    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().select('#' + e.target.id).boundingClientRect(res => {
      console.log(res)
      this.popover.onDisplay(res);
      console.log('1')
      this.Grilpopover.onDisplay(res);
      console.log('2')
      this.manpopover.onDisplay(res);
      console.log('3')
      
    }).exec();
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
    console.log('123')
    wx.showNavigationBarLoading()

    this.data.current=1

    this.querydynamic()

    wx.hideNavigationBarLoading() //完成停止加载

    wx.stopPullDownRefresh()

    this.selectComponent('#show').show({
      Icon: '',
      Text: '刷新成功，已经为您推荐最新动态'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.current+=1

    if(this.data.btnactive1==1){
      this.querydynamic(this.data.par)
    }else if(this.data.btnactive1==2){
      this.queryCircleLinkMemberID(this.data.par)
    }else if(this.data.btnactive1==3){
      this.queryCircleMemberID(this.data.par)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var con={
      MemberID: wx.getStorageSync('MemberID'),
      AuthorizationCode: JSON.stringify(this.data.res)
    }

    // console.log(con,'111')

    return {
      title: 'tata',
      // desc: '分享邀请，获取推荐奖励',
      path: 'pages/firstpage/index?con='+JSON.stringify(con),
    }
  },

  dianzan(e){
    console.log(e.currentTarget.dataset)
    console.log(wx.getStorageSync('MemberID'))
    
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    Api.queryLikes('lxy_contact/queryLikes.action',{
      MemberID: wx.getStorageSync('MemberID'),
      RelationID: e.currentTarget.dataset.index,
      LikeClass: 0,
      LikeType: 0,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      if(!JSON.parse(res.data).Records){
        Api.addLikes('lxy_contact/addLikes.action',{
          MemberID: wx.getStorageSync('MemberID'),
          RelationID: e.currentTarget.dataset.index,
          LikeClass: 0,
          LikeType: 0,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          this.data.con[e.currentTarget.dataset.index1].ydz='0'

          this.data.con[e.currentTarget.dataset.index1].Likes+=1
          if(this.data.con[e.currentTarget.dataset.index1].UrlList[0]==''){
            this.data.con[e.currentTarget.dataset.index1].UrlList[0]=wx.getStorageSync('avatarUrl')
            this.data.con[e.currentTarget.dataset.index1].UrlList1[0]=wx.getStorageSync('MemberID')
          }else{
            this.data.con[e.currentTarget.dataset.index1].UrlList.push(wx.getStorageSync('avatarUrl'))
            this.data.con[e.currentTarget.dataset.index1].UrlList1.push(wx.getStorageSync('MemberID'))
          }
          

          this.setData({
            con: this.data.con
          })
          
          console.log(this.data.con)

          var con={
            LikeID: JSON.parse(res.data).LikeID,
            ContentType: 0,
            Content: wx.getStorageSync('nickName')+'点赞了你的动态'
          }

          Api.sendIMReq('lxy_contact/sendIMReq.action',{
            MsgClassify: 0,
            Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
            Recver: getApp().globalData.EntCode+'-'+e.currentTarget.dataset.item,
            Message: JSON.stringify(con),
            MsgType: 3,
            ContentType: 0,
            BusinessID: getApp().globalData.BusinessID
          }).then(res=>{
            console.log(res)
          })
        })
      }
    })
  },

  ydianzan(e){
    console.log(e.currentTarget.dataset)
    console.log(wx.getStorageSync('MemberID'))
    
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    Api.queryLikes('lxy_contact/queryLikes.action',{
      MemberID: wx.getStorageSync('MemberID'),
      RelationID: e.currentTarget.dataset.index,
      LikeClass: 0,
      LikeType: 0,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      if(JSON.parse(res.data).Records){
        Api.deleteTabMemberLike('lxy_contact/deleteTabMemberLike.action',{
          LikeID: JSON.parse(res.data).Records[0].LikeID,
          MemberID: wx.getStorageSync('MemberID'),
          RelationID: e.currentTarget.dataset.index,
          LikeClass: 0,
          LikeType: 0,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          this.data.con[e.currentTarget.dataset.index1].ydz=''

          this.data.con[e.currentTarget.dataset.index1].Likes-=1
          if(this.data.con[e.currentTarget.dataset.index1].UrlList[0]==''){
            this.data.con[e.currentTarget.dataset.index1].UrlList[0]=wx.getStorageSync('avatarUrl')
          }else{
            var con=this.data.con[e.currentTarget.dataset.index1].UrlList1
            for(var i=0;i<con.length;i++){
              if(con[i]==wx.getStorageSync('MemberID')){
                con.splice(i,1)
                this.data.con[e.currentTarget.dataset.index1].UrlList.splice(i,1)
              }
            }
            // this.data.con[e.currentTarget.dataset.index1].UrlList.splice(wx.getStorageSync('avatarUrl'))
            // this.data.con[e.currentTarget.dataset.index1].UrlList.splice(wx.getStorageSync('MemberID'))
          }
          

          this.setData({
            con: this.data.con
          })
          
          console.log(this.data.con)

          // Api.sendIMReq('lxy_contact/sendIMReq.action',{
          //   MsgClassify: 0,
          //   Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
          //   Recver: getApp().globalData.EntCode+'-'+e.currentTarget.dataset.item,
          //   Message: JSON.parse(res.data).LikeID,
          //   MsgType: 3,
          //   ContentType: 0,
          //   BusinessID: getApp().globalData.BusinessID
          // }).then(res=>{
          //   console.log(res)
          // })
        })
      }
    })
  },

  pl(e){
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    console.log(e.currentTarget.dataset)

    console.log(this.data.con[e.currentTarget.dataset.index])

    if(this.data.con[e.currentTarget.dataset.index].CanComment==0){
      wx.showToast({
        title: '该动态不允许评论哦',
        icon: 'none',
        duration: 2000
      })

      return false
    }

    this.setData({
      comm: true
    })

    this.data.RelationID=e.currentTarget.dataset.index
    this.data.RelationID1=e.currentTarget.dataset.item
    this.data.RelationID2=e.currentTarget.dataset.index1
    this.data.RelationID3=e.currentTarget.dataset.index2
  },

  pl1(){
    this.setData({
      comm: false
    })
  },

  pl2(){

  },

  onHandleTextSync(e){
    console.log(e.detail.value)
    this.data.com=e.detail.value
  },

  but(){
    var that=this

    console.log(this.data.com)

    Api.addLikes('lxy_contact/addLikes.action',{
      BusinessID: getApp().globalData.BusinessID,
      MemberID: wx.getStorageSync('MemberID'),
      LikeClass: 2,
      LikeType: 0,
      // CommentType: 0,
      Comment: this.data.com,
      RelationID: this.data.RelationID1,
      // BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 2000
      })

      console.log(that.data.RelationID1)

      that.data.con[that.data.RelationID].Comments+=1
      
      var con1=''

      if(that.data.RelationID3.Desctet!=''){
        con1=that.data.RelationID3.Desctet
      }else{
        con1='[图片]'
      }

      var con={
        LikeID: JSON.parse(res.data).LikeID,
        ContentType: 5,
        Content: wx.getStorageSync('nickName')+'评论了你的动态',
        Dynamic: con1,
        Comment: that.data.com
      }

      Api.sendIMReq('lxy_contact/sendIMReq.action',{
        MsgClassify: 0,
        Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
        Recver: getApp().globalData.EntCode+'-'+that.data.RelationID2,
        Message: JSON.stringify(con),
        MsgType: 3,
        ContentType: 5,
        BusinessID: getApp().globalData.EntCode,
        MsgAgree: JSON.parse(res.data).CommentID,
        InterActID: JSON.parse(res.data).CommentID,
        BusinessID: getApp().globalData.BusinessID,
        Extend: 'BusinessID='+getApp().globalData.BusinessID
      }).then(res=>{
        console.log(res)
      })

      that.setData({
        con: that.data.con,
        com: '',
        comm: false
      })
    })
  },

  but1(e){
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    console.log(e.currentTarget.dataset.index)
    
    var con=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../mine/homepage/index?con='+con,
    })
  },

  but2(e){
    console.log(e.currentTarget.dataset.index)

    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    wx.navigateTo({
      url: '../firstpage/remarkOn/index?con='+e.currentTarget.dataset.index,
    })
  },

  lik(e){
    console.log(e.currentTarget.dataset)

    Api.queryCircle('lxy_contact/queryCircle.action',{
      MemberID: wx.getStorageSync('MemberID'),
      LinkMemberID: this.data.con1,
      // LikeType: 2,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      
      if(JSON.parse(res.data).Records){
        Api.updateCircle('lxy_contact/updateCircle.action',{
          CircleID: JSON.parse(res.data).Records[0].CircleID,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        })
      }else{
        Api.queryCircle('lxy_contact/queryCircle.action',{
          MemberID: wx.getStorageSync('MemberID'),
          LinkMemberID: this.data.con1,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          if(!JSON.parse(res.data).Records){
            Api.addCircle('lxy_contact/addCircle.action',{
              MemberID: wx.getStorageSync('MemberID'),
              LinkMemberID: this.data.con1,
              LikeType: 1,
              MemRemarks: wx.getStorageSync('nickName'),
              LinkRemarks: this.data.con2,
              BusinessID: getApp().globalData.BusinessID
            }).then(res=>{
              console.log(res)
            })
          }
        })
      }
    })
      this.selectComponent('#show').show({
        Icon: '../../images/xh.png',
        Text: '已加入喜欢'
      })
      this.popover.onHide();
  },

  close(e){
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();
    
  },

  onTap: function (e) {
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    console.log(e)
    this.data.con1=e.currentTarget.dataset.index
    this.data.con2=e.currentTarget.dataset.item
    this.data.con3=e.currentTarget.dataset.index1
    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().select('#' + e.target.id).boundingClientRect(res => {
      console.log(res)
      console.log(this.popover)
      this.popover.onDisplay(res);
      
    }).exec();
  },

  blacklist(e){
    console.log(this.data.con3)
    this.data.con3.con=1
    wx.navigateTo({
      url: '/pages/report/index?con='+JSON.stringify(this.data.con3),
    })
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();

  },
})
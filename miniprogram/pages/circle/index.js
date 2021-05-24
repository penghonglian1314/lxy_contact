const app = getApp()

const { windowWidth, windowHeight } = wx.getSystemInfoSync();
// console.log(windowHeight)

var Api = require("../../utils/api.js")
// pages/circle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    isshow:false,
    SelectShow:false,
    online:true,
    online1:true,
    btnactive:1,
    btnactive1:1,
    islady:null,
    all:[],
    girlall:[],
    manall:[],
    navHeight: '',
    mainHeight:'',
    menuButtonInfo: {},
    searchMarginTop: 0, // 搜索框上边距
    searchWidth: 0, // 搜索框宽度
    searchHeight: 0, // 搜索框高度
    con: {},
    par:{},
    par1:{},
    current: 1,
    limit: 10,
    total: 0,
    current1: 1,
    limit1: 10,
    total1: 0,
    current2: 1,
    limit2: 10,
    total2: 0,
    active1: 0,
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
    
    wx.navigateTo({
      url: '/pages/circle/search/index',
    })
  },
  selall(){
    this.setData({ btnactive: 1 });
  },
  selall1(){
    this.setData({ btnactive1: 1 });
  },
  selnew(){
    this.setData({ btnactive: 2 });
  },
  selbeautiful(){
    this.setData({ btnactive: 3 });
  },
  selVIP(){
    this.setData({ btnactive1: 2 });
  },
  selSVIP(){
    this.setData({ btnactive1: 3 });
  },
  onlineChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ online: detail });
  },

  onlineChange1({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ online1: detail });
  },

  onChange(event) {
    var that=this

    // this.btnGroup = this.selectComponent("#btn-group")
    // this.popover = this.selectComponent('#popover');
    // this.Grilpopover = this.selectComponent('#Grilpopover');
    // this.manpopover = this.selectComponent('#manpopover');

    // Api.queryMember({
    //   BusinessID: getApp().globalData.BusinessID
    // },{success: res=>{
    //   let message = JSON.parse(res.data.data).Records
    //   message.forEach(item => {
    //     item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')
    //   });

    //   for(var i=0;i<message.length;i++){
    //     if(message[i].MemberID=='0000000000'){
    //       message.splice(message[i],1)
    //     }

    //     message[i].Birth=that.age_Conversion(message[i].Birth)
    //   }

    //   console.log(message)
    //   this.setData({
    //     all:message
    //   })
    // }}
    // )

    console.log(event.detail.index)

    if(event.detail.index==0){
      this.data.active1=0
    }

    if(event.detail.index==1){
      this.queryMember1()
      this.data.active1=1

      setTimeout(function(){
        that.Grilpopover = that.selectComponent('#Grilpopover');
      },1000)

      
    }

    if(event.detail.index==2){
      this.queryMember2()
      this.data.active1=2

      setTimeout(function(){
        that.manpopover = that.selectComponent('#manpopover');
      },1000)
    }

    if(event.detail.index == 1 || event.detail.index == 2){
      this.setData({
        isshow:true
      })
      if(event.detail.index == 1){
        this.setData({
          islady:true
        })
      } else {
        this.setData({
          islady:false
        })
      }
    } else {
      this.setData({
        isshow:false,
        islady:null
      })
    }
    
  },

  queryMember1(){
    var that=this

    Api.queryMember({
      BusinessID: getApp().globalData.BusinessID,
      ...this.data.par,
      current: this.data.current1,
      limit: this.data.limit1,
      total: this.data.total1,
      Gender: 1,
      Role: 0
    },{success: res=>{
      let message = []

      if(JSON.parse(res.data.data).Records){
        message=JSON.parse(res.data.data).Records

        message.forEach(item => {
          item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

          item.Birth=that.age_Conversion(item.Birth)

          if(item.Online!=0){
            item.Online=that.funtime(item.Online)
          }

          if(that.data.current1!=1){
            that.data.girlall.push(item)
          }

          if(item.PhotoUrl==''){
            item.PhotoUrl=0
          }else{
            item.PhotoUrl=item.PhotoUrl.split(',').length
          }

          
        });
      }

      

      if(that.data.current1==1){
        that.data.girlall=message
      }

      Api.queryCircle('lxy_contact/queryCircle.action',{
        MemberID: wx.getStorageSync('MemberID'),
        //LinkMemberID: that.data.con.MemberID,
        LikeType: 2,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(JSON.parse(res.data))
        
        if(JSON.parse(res.data).Records){
          for(var i=0;i<JSON.parse(res.data).Records.length;i++){
            for(var j=0;j<that.data.girlall.length;j++){
              if(JSON.parse(res.data).Records[i].LinkMemberID==that.data.girlall[j].MemberID){
                console.log(that.data.girlall[j])
                that.data.girlall.splice(j,1)
              }
            }
          }
        }
        
        

        this.setData({
          girlall:that.data.girlall
        })
      })

      

      console.log(message)
      // this.setData({
      //   girlall:that.data.girlall
      // })
    }}
    )
  },

  queryMember2(){
    var that=this

    Api.queryMember({
      BusinessID: getApp().globalData.BusinessID,
      ...this.data.par1,
      current: this.data.current2,
      limit: this.data.limit2,
      total: this.data.total2,
      Gender: 0,
      Role: 0
    },{success: res=>{
      let message = []

      if(JSON.parse(res.data.data).Records){
        message=JSON.parse(res.data.data).Records

        message.forEach(item => {
          item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

          item.Birth=that.age_Conversion(item.Birth)

          if(item.Online!=0){
            item.Online=that.funtime(item.Online)
          }

          if(that.data.current2!=1){
            that.data.manall.push(item)
          }

          if(item.PhotoUrl==''){
            item.PhotoUrl=0
          }else{
            item.PhotoUrl=item.PhotoUrl.split(',').length
          }

          
        });
      }

      

      if(that.data.current2==1){
        that.data.manall=message
      }

      Api.queryCircle('lxy_contact/queryCircle.action',{
        MemberID: wx.getStorageSync('MemberID'),
        //LinkMemberID: that.data.con.MemberID,
        LikeType: 2,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(JSON.parse(res.data))

        if(JSON.parse(res.data).Records){
          for(var i=0;i<JSON.parse(res.data).Records.length;i++){
            for(var j=0;j<that.data.manall.length;j++){
              if(JSON.parse(res.data).Records[i].LinkMemberID==that.data.manall[j].MemberID){
                console.log(that.data.manall[j])
                that.data.manall.splice(j,1)
              }
            }
          }
        }
        
        

        this.setData({
          manall:that.data.manall
        })
      })

      console.log(message)
      // this.setData({
      //   manall:that.data.manall
      // })
    }}
    )
  },

  SelectClose() {
    this.setData({ SelectShow: false });
  },
  selectClick(){
    this.setData({
      SelectShow:true
    })
  },
  close(e){
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();
    this.Grilpopover.onHide();
    this.manpopover.onHide();
    
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

    console.log(e.currentTarget.dataset.item)
    this.data.con=e.currentTarget.dataset.item
    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().select('#' + e.target.id).boundingClientRect(res => {
      console.log(res)
      this.popover.onDisplay(res);
      this.Grilpopover.onDisplay(res);
      this.manpopover.onDisplay(res);
      
    }).exec();
  },

  // 响应popover组件中的子元素点击事件
  onClickA: function (e) {
    var that=this

    console.log(e)

    // wx.showToast({
    //   title: '加入喜欢',
    //   icon: 'none'
    // });
    // 调用自定义组件 popover 中的 onHide 方法
    // this.popover.onHide();
    // this.Grilpopover.onHide();
    // this.manpopover.onHide();

    Api.queryCircle('lxy_contact/queryCircle.action',{
      MemberID: wx.getStorageSync('MemberID'),
      LinkMemberID: that.data.con.MemberID,
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
          LinkMemberID: that.data.con.MemberID,
          // LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          if(!JSON.parse(res.data).Records){
            Api.addCircle('lxy_contact/addCircle.action',{
              MemberID: wx.getStorageSync('MemberID'),
              LinkMemberID: that.data.con.MemberID,
              LikeType: 1,
              MemRemarks: wx.getStorageSync('nickName'),
              LinkRemarks: that.data.con.MemberName,
              BusinessID: getApp().globalData.BusinessID
            }).then(res=>{
              console.log(res)
            })
          }
        })
      }

      this.selectComponent('#show').show({
        Icon: '../../images/xh.png',
        Text: '已加入喜欢'
      })
    })

    this.popover.onHide();
    this.Grilpopover.onHide();
    this.manpopover.onHide();
  },
  blacklist(e){
    var that=this

    wx.showModal({
      //title: '拉黑',
      icon: 'none',
      content:"拉黑后您将无法再看到对方和对方的动态",
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',

      success: res=>{
        if(!res.confirm){
          return false
        }

        Api.queryCircle('lxy_contact/queryCircle.action',{
          MemberID: wx.getStorageSync('MemberID'),
          LinkMemberID: that.data.con.MemberID,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)
          if(JSON.parse(res.data).Records){
            Api.updateCircle('lxy_contact/updateCircle.action',{
              CircleID: JSON.parse(res.data).Records[0].CircleID,
              LikeType: 2,
              BusinessID: getApp().globalData.BusinessID
            })
          }else{
            Api.queryCircle('lxy_contact/queryCircle.action',{
              MemberID: wx.getStorageSync('MemberID'),
              LinkMemberID: that.data.con.MemberID,
              LikeType: 2,
              BusinessID: getApp().globalData.BusinessID
            }).then(res=>{
              console.log(res)
        
              if(!JSON.parse(res.data).Records){
                Api.addCircle('lxy_contact/addCircle.action',{
                  MemberID: wx.getStorageSync('MemberID'),
                  LinkMemberID: that.data.con.MemberID,
                  LikeType: 2,
                  MemRemarks: wx.getStorageSync('nickName'),
                  LinkRemarks: that.data.con.MemberName,
                  BusinessID: getApp().globalData.BusinessID
                }).then(res=>{
                  console.log(res)
                })
              }
            })
          }

          wx.showToast({
            title: '拉黑成功',
            icon: 'success'
          });
        })

        this.popover.onHide();
        this.Grilpopover.onHide();
        this.manpopover.onHide();
      }
    });
    // 调用自定义组件 popover 中的 onHide 方法
    // this.popover.onHide();
    // this.Grilpopover.onHide();
    // this.manpopover.onHide();

    
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
    
      } else if (minC >= 1) {
        console.log(parseInt(minC) + "分钟前")
        //result = {time: parseInt(minC),dw:'分'}
        // result = "" + parseInt(minC) + "分钟前";
     result = "刚刚";
      } else {
        result = "刚刚";
      }
      return result;
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

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

    Api.queryMember({
      BusinessID: getApp().globalData.BusinessID,
      // ...this.data.par,
      current: this.data.current,
      limit: this.data.limit,
      total: this.data.total,
      Role: 0
    },{success: res=>{
      let message = JSON.parse(res.data.data).Records
      message.forEach(item => {
        item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

        item.Birth=that.age_Conversion(item.Birth)
        
        if(item.Online!=0){
          item.Online=that.funtime(item.Online)
        }

        if(item.PhotoUrl==''){
          item.PhotoUrl=0
        }else{
          item.PhotoUrl=item.PhotoUrl.split(',').length
        }

        if(that.data.current!=1){
          that.data.all.push(item)
        }

        
      });

      if(that.data.current==1){
        that.data.all=message
      }

      // for(var i=0;i<message.length;i++){
      //   if(message[i].MemberID=='0000000000'){
      //     message.splice(message[i],1)
      //   }

      //   message[i].Birth=that.age_Conversion(message[i].Birth)
      // }

      Api.queryCircle('lxy_contact/queryCircle.action',{
        MemberID: wx.getStorageSync('MemberID'),
        //LinkMemberID: that.data.con.MemberID,
        LikeType: 2,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(JSON.parse(res.data))

        if(JSON.parse(res.data).Records){
          for(var i=0;i<JSON.parse(res.data).Records.length;i++){
            for(var j=0;j<that.data.all.length;j++){
              if(JSON.parse(res.data).Records[i].LinkMemberID==that.data.all[j].MemberID){
                console.log(that.data.all[j])
                that.data.all.splice(j,1)
              }
            }
          }
        }
        
        

        this.setData({
          all:that.data.all
        })
      })

      console.log(message)
      // this.setData({
      //   all:that.data.all
      // })
    }}
    )
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

  but1(e){
    console.log(e.currentTarget.dataset.index)

    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }
    
    var con=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../mine/homepage/index?con='+con,
    })
  },

  but_cz(){
    this.setData({
      btnactive: 1,
      online: true
    })
  },

  but_cz1(){
    this.setData({
      btnactive1: 1,
      online1: true
    })
  },

  but_sx(){
    console.log(this.data.btnactive)

    console.log(this.data.btnactive1)
    
    var con={}

    if(this.data.btnactive==1){
      this.data.par={}
      this.data.current1=1
    }else if(this.data.btnactive==2){
      this.data.par.Level=0
      this.data.current1=1
    }else if(this.data.btnactive==3){
      this.data.par.Level=1
      this.data.current1=1
    }

    if(this.data.online){
      this.data.par.Online=0
    }else{
      this.data.par.Onlines=1
    }

    // this.data.current=1

    this.queryMember1(this.data.par)

    this.setData({ SelectShow: false });
  },

  but_sx1(){
    console.log(this.data.btnactive)

    console.log(this.data.btnactive1)
    
    var con={}

    if(this.data.btnactive1==1){
      this.data.par1={}
      this.data.current2=1
    }else if(this.data.btnactive1==2){
      this.data.par1.Level=0
      this.data.current2=1
    }else if(this.data.btnactive1==3){
      this.data.par1.Level=1
      this.data.current2=1
    }

    if(this.data.online1){
      this.data.par1.Online=0
    }else{
      this.data.par1.Onlines=1
    }

    // this.data.current=1

    this.queryMember2(this.data.par)

    this.setData({ SelectShow: false });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this

    setTimeout(function(){
      that.btnGroup = that.selectComponent("#btn-group")
      that.popover = that.selectComponent('#popover');
      that.Grilpopover = that.selectComponent('#Grilpopover');
      that.manpopover = that.selectComponent('#manpopover');

      console.log(that.popover)
      console.log(that.Grilpopover)
      console.log(that.manpopover)
    },1000)

    // this.btnGroup = this.selectComponent("#btn-group")
    // this.popover = this.selectComponent('#popover');
    // this.Grilpopover = this.selectComponent('#Grilpopover');
    // this.manpopover = this.selectComponent('#manpopover');

    // console.log(this.popover)
    // console.log(this.Grilpopover)
    // console.log(this.manpopover)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this

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
    wx.showNavigationBarLoading()

    if(this.data.active1==0){
      this.data.current=1
    
      this.onLoad()
    }else if(this.data.active1==1){
      this.data.current1=1
    
      this.queryMember1()
    }else if(this.data.active1==2){
      this.data.current2=1
    
      this.queryMember2()
    }

    wx.hideNavigationBarLoading() //完成停止加载

    wx.stopPullDownRefresh()

    this.selectComponent('#show').show({
      Icon: '',
      Text: '刷新成功'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    
    console.log(this.data.active1)

    if(this.data.active1==0){
      this.data.current+=1
    
      this.onLoad()
    }else if(this.data.active1==1){
      this.data.current1+=1
    
      this.queryMember1()
    }else if(this.data.active1==2){
      this.data.current2+=1
    
      this.queryMember2()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
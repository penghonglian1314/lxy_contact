const app = getApp()

const { windowWidth, windowHeight } = wx.getSystemInfoSync();
// console.log(windowHeight)

var Api = require("../../../utils/api.js")
// pages/circle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    isshow:false,
    SelectShow:false,
    online:false,
    btnactive:0,
    islady:null,
    all:[
      {
        id:'A1',
        name:'小仙女',
        sex:1,
        age:19,
        city:'上海',
        signature:'*******',
        isonline:'在线'
      },
      {
        id:'A2',
        name:'张三',
        sex:0,
        age:19,
        city:'上海',
        signature:'*******',
        isonline:'在线'
      }
    ],
    girlall:[
      {
        id:'B1',
        name:'小仙女',
        sex:1,
        age:19,
        city:'上海',
        signature:'*******',
        isonline:'在线'
      }
    ],
    manall:[
      {
        id:'C1',
        name:'赵子龙',
        sex:1,
        age:19,
        city:'上海',
        signature:'*******',
        isonline:'在线'
      }
    ],
    navHeight: '',
    mainHeight:'',
    menuButtonInfo: {},
    searchMarginTop: 0, // 搜索框上边距
    searchWidth: 0, // 搜索框宽度
    searchHeight: 0, // 搜索框高度
    con: {},
    current: 1,
    limit: 10,
    total: 0,
  },
  searchClick(){
    wx.navigateTo({
      url: '/pages/circle/search/index',
    })
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
  onChange(event) {
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

    wx.showToast({
      title: '加入喜欢',
      icon: 'none'
    });
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();
    this.Grilpopover.onHide();
    this.manpopover.onHide();

    Api.queryCircle('lxy_contact/queryCircle.action',{
      MemberID: wx.getStorageSync('MemberID'),
      LinkMemberID: that.data.con.MemberID,
      LikeType: 2,
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
          LikeType: 1,
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
    })
  },
  blacklist(e){
    var that=this

    wx.showToast({
      title: '拉黑',
      icon: 'none'
    });
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();
    this.Grilpopover.onHide();
    this.manpopover.onHide();

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
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    Api.queryRecord('lxy_contact/queryRecord.action',{
      current: this.data.current,
      limit: this.data.limit,
      total: this.data.total,
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      that.data.con=JSON.parse(res.data).Records

      that.data.con.forEach(item => {
        item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

        item.PhotoUrl=item.PhotoUrl.split(',')
      });

     for(var i=0;i<that.data.con.length;i++){
      that.data.con[i].Birth=that.age_Conversion(that.data.con[i].Birth)
     }

      that.setData({
        con: that.data.con
      })

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
    
    var con=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../mine/homepage/index?con='+con,
    })
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
    },1000)

    
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this

    // Api.queryMember('',{success: res=>{
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
    this.data.current+=1

    var that=this

    Api.queryRecord('lxy_contact/queryRecord.action',{
      current: this.data.current,
      limit: this.data.limit,
      total: this.data.total,
      MemberID: wx.getStorageSync('MemberID'),
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)

      var con=[]

      con=JSON.parse(res.data).Records

      con.forEach(item => {
        item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')
        item.Birth=that.age_Conversion(item.Birth)

        that.data.con.push(item)
      });

    //  for(var i=0;i<con.length;i++){
    //   con[i].Birth=that.age_Conversion(con[i].Birth)
    //  }

    //  that.data.con.push(con)

      that.setData({
        con: that.data.con
      })

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
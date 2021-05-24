var Api = require("../../../utils/api.js")

// pages/circle/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch:true,
    value:'',
    btnlist:[],
    alldata:['1'],
    all:[]
  },
  _deletehistory(){
    wx.showModal({
      title: '提示',
      content: '是否清空搜索记录',
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '已清空',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  historyclick(e){
    this.setData({
      value:e.target.dataset.item,
      isSearch:false
    })
    console.log(e.target.dataset.item)
  },
  onChange(e) {
    this.setData({
      value: e.detail,
      isSearch:false
    });
    if(e.detail == ''){
      this.setData({
        value: e.detail,
        isSearch:true
      });
    }
    // console.log(this.data.isSearch)
    // console.log(e)
  },
  onSearch(e) {
    // console.log('搜索' + this.data.value);
    this.setData({
      // value: this.data.value,
      isSearch:false
    });
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

  onClick(e) {
    var that=this
    console.log('搜索' + this.data.value);

    Api.queryMember({
      MemberName: this.data.value,
      BusinessID: getApp().globalData.BusinessID
    },{success: res=>{
      if(!JSON.parse(res.data.data).Records){
        that.data.alldata=[]

        that.setData({
          alldata: that.data.alldata
        })
        return false
      }

      let message = JSON.parse(res.data.data).Records
      message.forEach(item => {
        item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

        if(item.Online!=0){
          item.Online=that.funtime(item.Online)
        }

        if(item.PhotoUrl==''){
          item.PhotoUrl=0
        }else{
          item.PhotoUrl=item.PhotoUrl.split(',').length
        }
      });

      for(var i=0;i<message.length;i++){
        if(message[i].MemberID=='0000000000'){
          message.splice(message[i],1)
        }

        message[i].Birth=that.age_Conversion(message[i].Birth)
      }

      console.log(message)
      this.setData({
        all:message
      })
    }}
    )

    this.setData({
      // value: this.data.value,
      isSearch:false
    });

    this.data.btnlist.push(this.data.value)

    this.setData({
      btnlist: this.data.btnlist
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
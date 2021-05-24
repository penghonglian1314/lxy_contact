var Api = require("../../../../utils/api.js")

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
  onClick(e) {
    var that=this
    console.log('搜索' + this.data.value);

    Api.queryMember({
      MemberName: this.data.value,
      BusinessID: getApp().globalData.BusinessID
    },{success: res=>{
      let message = JSON.parse(res.data.data).Records
      message.forEach(item => {
        item.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')
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
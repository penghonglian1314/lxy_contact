// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ContentList: [],
    intoView: '',
    allContentList: [],
    scrollTop: 0,
    ScrollLoading: 0,
    windowHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allContentList: wx.getStorageSync('contentInfo')[0].Arr,
    })
    this.showRecords(this.data.allContentList)
  },

  // 5.假如缓存中超过条数据，则只展示最后的十条
  showRecords(value) {
    console.log(value, value.length)
    // this.setData({
    //   toView: 'msg-9'
    // })
    var arr = []
    if (value.length > 10) {
      arr = value.slice(-10)
      console.log(arr)
      this.setData({
        ContentList: arr,
        intoView: 'msg-' + (arr.length - 1)
      })
      // this.setData({
      //   toView: 'msg-' + (arr.length - 1)
      // })
      console.log(this.data.toView)
    } else {
      this.setData({
        ContentList: value,
      })
      this.setData({
        intoView: 'msg-' + (value.length - 1)
      })
    }
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  scroll_scroll: function (e) {

    var that = this
    if (that.data.ScrollLoading == 1) { //防止多次触发
      return false
    }

    if (e.detail.scrollTop < 10) { //触发触顶事件
      that.data.ScrollLoading = 1
      console.log(e, '‘触发顶部事件‘')
      //获取隐藏的view 高度
      var query = wx.createSelectorQuery();
      query.select('#hideview').boundingClientRect()
      query.exec(function (res) {
        console.log(res, '[[[[')
        var EventData = that.data.ContentList //此数据为展示的数据
        var length =  that.data.allContentList.length
        var HideData = that.data.allContentList.slice(0, length-11) //此数据为隐藏数据
        EventData = HideData.concat(that.data.EventData) //拼接数据
        console.log(EventData, '-=---')
        if (HideData == '' || !HideData) { //判断是否隐藏数据为空
          that.setData({
            NoMoreEvent: 1,
            // scrollTop: 0,
          })
          return false
        }
        // setTimeout(() => { //自行选择是否定时进行加载
          that.setData({
            ContentList: wx.getStorageSync('contentInfo')[0].Arr,
            scrollTop: '1000rpx'
          })
          // console.log(that.data.scrollTop, '顶部的距离')
          // that.data.ScrollLoading = 0 //允许再次触发触顶事件
          // that.getEventData() //请求新的数据
        // }, 1000)
      })
    }
  },
  getEventData() {

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
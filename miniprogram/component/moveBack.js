// components/moveBack/moveBack.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
     areaWidth:wx.getSystemInfoSync().windowWidth,
    areaHeight: wx.getSystemInfoSync().windowHeight
  },
/*wx.navigateBack()：将页面跳转到来到本页面的前一个或几个页面。
    // wx.navigateBack({
      // delta:整数，用于设置返回的页面数，默认值为1,
     //  success:function(){},
     //  fail:function(){},
       //complete:function(){}
})*/
  /**
   * 组件的方法列表
   */
  methods: {
    backTo(){
      wx.navigateBack()
    }
  }
})


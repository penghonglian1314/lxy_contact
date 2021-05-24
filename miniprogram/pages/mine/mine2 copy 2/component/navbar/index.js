// components/navbar/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:String,
    isupdateMessage:{
      type:Boolean,
      value:false
    },
    showNav:{
      type:Boolean,
      value:true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight:'',
    navTop:0,
  },
  lifetimes: {
    attached: function () {
      this.setData({
        menuButtonInfo: wx.getMenuButtonBoundingClientRect()
      })
      console.log(this.data.menuButtonInfo)
      const { top, width, height, right } = this.data.menuButtonInfo
      wx.getSystemInfo({
        success: (res) => {
          const { statusBarHeight } = res
          const margin = top - statusBarHeight
          this.setData({
            navHeight: (height + statusBarHeight + (margin * 2)),
            navTop: statusBarHeight + margin + 4, // 状态栏 + 胶囊按钮边距
          })
        },
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    _navBack: function () {
      if(this.data.isupdateMessage){
        wx.showModal({
          title: '提示',
          content: '是否放弃对资料的修改',
          cancelText:'继续编辑',
          confirmText:'放弃',
          confirmColor: '#FF0055',
          cancelColor: '#AAAAAA',
          success (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              wx.navigateBack({
                delta: 1
              }) 
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.navigateBack({
          delta: 1
        }) 
      }
             
    },
    //回主页
    _toIndex: function () {
      if(this.data.isupdateMessage){
        wx.showModal({
          title: '提示',
          content: '是否放弃对资料的修改',
          cancelText:'继续编辑',
          confirmText:'放弃',
          confirmColor: '#FF0055',
          cancelColor: '#AAAAAA',
          success (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              wx.switchTab({
                url: '/pages/firstpage/index'
              })
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.switchTab({
          url: '/pages/firstpage/index'
        })
      }
      
    },
  },

})
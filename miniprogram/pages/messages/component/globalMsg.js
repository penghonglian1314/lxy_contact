// component/globalMsg.js
var app = getApp()
var Func = require('../../../utils/baseFunc')
var base64 = require('../../../utils/b64')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    globalContent: {
      type: Object,
      default: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: {},
    globalContent: {},
    Message: '您举报的用户【秀儿】的【虚假照片,骚扰】处理结果经客服核实情况属实，我们已进行处理，感谢您的举报。'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getglobalContent() {
      var cotent = app.globalData.self
      cotent.Message = Func.baseFunc.getLong(cotent.Message)
    //  var values = Func.baseFunc.getLong(this.data.Message)
      console.log(cotent)
      if (cotent.MsgType == 2) {
        cotent.AvatarUrl = 'https://imgs.9aijoy.com/3ca397bb3fb94a8d9ccca39cbd7ec0e7/202103/1c5d7f9d18c340b89546acd6968a6f52.png'
        cotent.Title = '申请查看'

      }
      if (cotent.MsgType == 3) {
        cotent.AvatarUrl = 'https://imgs.9aijoy.com/3ca397bb3fb94a8d9ccca39cbd7ec0e7/202103/190997d18d854a02a4979a1889ecf46a.png'
        cotent.Title = '互动消息'
      }
      if (cotent.MsgType == 0 && cotent.MsgClassify == 0) {
        // 开始处理消息格式
        cotent.Message =  base64.Base64.decode(cotent.Message)
        // cotent.AvatarUrl = 'https://imgs.9aijoy.com/3ca397bb3fb94a8d9ccca39cbd7ec0e7/202103/190997d18d854a02a4979a1889ecf46a.png'
        cotent.Title = '通知消息'
      }
      // var values = Func.baseFunc.getLong(this.data.Message)
      // var content = app.globalData.self
      // console.log(cotent, 'content')
      this.setData({
        globalContent: cotent,
        // Message: values
      })
    }
  },

  // 处理消息长度

  attached() {
    this.getglobalContent()
  }
})
var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
import {
  baseUrl,
  baseUrl1,
  baseUrlImg
} from "../../../utils/http"
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Loading from '../../../miniprogram_npm/@vant/weapp/loading/index';
var url = 'ws://请填写您的长链接接口地址';
var SocketTask
var upload_url = '请填写您的图片上传接口地址'

var Api = require('../../../utils/api')
var Base64 = require('../../../utils/b64')
var Authorize = require("../../../utils/authorize.js");

var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
Page({
  data: {
    limit: 20,
    current: 1,
    user_input_text: '', //用户输入文字
    inputValue: '',
    returnValue: '',
    avatarUrl: '',
    addImg: false,
    Recver: '',
    allContentList: [],
    contentList: [],
    num: 0,
    inputBottom: 0,
    scrollHeight: '100vh',
    queryValues: {},
    current: 1,
    limit: 20,
    total: 0,
    count: 0,
    parmsValue: {},
    maxSqlID: '',
    HasStorge: false,
    storageData: [],
    SessionID: '',
    ScrollLoading: 0, //是否允许触顶
    ShowCotent: true, //控制显示整个对话框
    showfunc: false, //控制功能框； 即展开功能
    showSendMsg: true, //控制是否显示发送消息发送框
    Height: false, //点击扩展之后的高度
    Circle: 0,
    fileList1: [],
    giftModal: false, //展示礼物
    showGift: false, //控制向上弹出的礼物框
    overlay: false, //是否显示遮罩层
    giftList: [{
        id: 0,
        url: 'http://mall-imag.linxyun.com/FkSu1U25ZL94IFnyFt2Q8o6xzC7H',
        text: '全场最美',
        jifen: '500'
      }, {
        id: 1,
        url: 'http://mall-imag.linxyun.com/FkSu1U25ZL94IFnyFt2Q8o6xzC7H',
        text: '全场最美',
        jifen: '3000'
      }, {
        id: 2,
        url: 'http://mall-imag.linxyun.com/FkSu1U25ZL94IFnyFt2Q8o6xzC7H',
        text: '全场最美',
        jifen: '3000'
      }, {
        id: 3,
        url: 'http://mall-imag.linxyun.com/FkSu1U25ZL94IFnyFt2Q8o6xzC7H',
        text: '全场最美',
        jifen: '1000'
      },
      {
        id: 4,
        url: 'http://mall-imag.linxyun.com/FkSu1U25ZL94IFnyFt2Q8o6xzC7H',
        text: '全场最美',
        jifen: '3000'
      }, {
        id: 5,
        url: 'http://mall-imag.linxyun.com/FkSu1U25ZL94IFnyFt2Q8o6xzC7H',
        text: '全场最美',
        jifen: '3000'
      }
    ],
    currentTarget: null,
    price: '',
    giftUrl: '',
    cacheList: [],
    ContentList: [], //经过处理之后最终的数组
    msgTypes: 0, //0.普通的p2p消息 1.图片消息 6.礼物消息
    newArrIndex: -1, //下标
    sendMsg: false,
    enhanced: true,
    refresherTriggered: false,
    contentHeight: '',
    uploadUrl: '',
    isMineLahei: false, //自己被拉黑了
    isOtherLahei: false, //对方被拉黑了
    jifenNum: 0, //积分值
  },
  // 页面加载
  onLoad: function (value) {
    // console.log(JSON.parse(value.opt), 'vlaues')
    this.setData({
      uploadUrl: app.globalData.uploadUrl
    })
    if (value.opt) {
      console.log(value.opt)
    }
    if (value.opt) {
      var content = wx.getStorageSync('content')
      console.log(value, value.opt, '传递过来的参数')
      var params = app.globalData.self
      content.forEach(item => {
        if(params.SessionID == item.SessionID && params.MsgClassify == item.MsgClassify && params.MsgType == item.MsgType) {
          this.setData({
            allContentList: item.Arr
          })
        }
      })
      // var params = value.opt
      this.data.parmsValue = params //传递过来的所有参数
      this.data.SessionID = params.SessionID
      console.log('从对话列表传递过来的参数', params)
      //1. 先判断缓存中是否有数据
      this.cache(params)
      var memberid = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
      if (params.Sender !== memberid) {
        this.setData({
          Recver: params.Sender //获得接收者
        })
      } else {
        this.setData({
          Recver: params.Recver //获得接收者
        })
      }
      // 页面加载之后显示对方的名字
      if (params.MsgType == '0') {
        wx.setNavigationBarTitle({
          title: params.MemberName
        })
      }
    }
    this.setData({
      avatarUrl: wx.getStorageSync('avatarUrl')
    })
    //查询是否被拉黑了
    this.queryMsgCircle()
    this.queryMemberAccount()
    // 查询积分

    // 如果是从私聊界面进来的
    if (value.Code == '1') {
      console.log('从私聊界面进来的', value)
      this.data.Recver = app.globalData.EntCode + '-' + value.MemberID
      // 1.先去处理一下ID
      var res = this.FromCirStorage(value)
      console.log(res, '缓存中是否有记录')
      if (res !== undefined) {
        this.data.SessionID = res.SessionID
        var value = {
          SessionID: res.SessionID,
          SeqID: res.SeqID
        }
        this.cache(value)
      } else {
        // value = {
        //   Sender: app.globalData.EntCode + '-' + wx.getStorageSync('MemberID'),
        //   Recver: app.globalData.EntCode + '-' + wx.getStorageSync('MemberID'),
        // }
        // var history = true //不是发送消息的
        // this.queryMsgContent(value, history)
      }
    }
    // 如果是从私聊界面进来的
    if (value.Code == '2') {
      console.log('从客服进来', value)
      this.data.Recver = app.globalData.EntCode + '-' + value.MemberID
      // 1.先去处理一下ID
      var res = this.FromCirStorage(value)
      console.log(res, '缓存中是否有记录')
      if (res !== undefined) {
        this.data.SessionID = res.SessionID
        var value = {
          SessionID: res.SessionID,
          SeqID: res.SeqID
        }
        this.cache(value)
      }
    }
    setTimeout(() => {
      this.setData({
        ShowCotent: false
      })
    }, 1000)
  },
  // 查询自己是否被拉黑了
  // 保存之前先查一下圈子列表，假如圈子里没有再添加
  async queryMsgCircle() {
    console.log('=====')
    var params = {}
    params.MemberID = this.data.Recver
    params.LinkMemberID = wx.getStorageSync('MemberID')
    let res = await Api.requestApi('lxy_contact/queryMsgCircle.action', {
      ...params
    })
    console.log(JSON.parse(res.data).TotalSize, '查询列表圈子')
    if (JSON.parse(res.data).TotalSize >= 1) {
      // 执行修改操作
      var temps = JSON.parse(res.data).Records[0]
      if (temps.LikeType == '3') {
        this.setData({
          isLahei: true
        })
      }
    }
  },
  //2.缓存中有没有该用户的数据
  cache(value) {
    console.log(value, '请求所有的数据')
    var storageData = wx.getStorageSync('contentInfo')
    // value 从上一个页面传递过来的参数
    if (storageData) {
      var data = storageData.some(item => {
        return item.SessionID == this.data.SessionID
      })
      if (data) {
        //找到该用户的缓存数据
        var z = storageData.filter(item => {
          return item.SessionID == this.data.SessionID
        })
        console.log(storageData, data, z, '缓存中有数据的时候')
        this.data.cacheList = z
        console.log(this.data.cacheList, this.data.cacheList[0].Arr, '缓存中的数据')
        //如果缓存中有数据，那么就去请求后面的数据
        this.queryMsgBack(this.data.cacheList)
      } else {
        this.queryMsgContent(value)
      }
    } else {
      // 假如缓存中没有，那么就请求所有的数据
      this.queryMsgContent(value)
    }
  },
  // 从聊天页面进来，先去看看缓存中是否有聊天记录
  FromCirStorage(value) {
    console.log(value.MemberID, '===')
    // 传入MemberId
    // 1.开始循环遍历缓存中的每一项，分割SessionID
    if (wx.getStorageSync('contentInfo')) {
      var data = wx.getStorageSync('contentInfo')
      var arr = []
      var str1 = ''
      for (var i = 0; i < data.length; i++) {
        var str = this.getMemberID(data[i], value)
        console.log(str)
        if (str) {
          return str
        } else {
          this.data.selfContent = false

        }
      }
    }
  },
  // 判断sessionID前后的memberid
  getMemberID(data, value) {
    var arr = data.SessionID.split('|')
    var str1 = arr[0]
    var str2 = arr[1]
    console.log(str1, str2)
    var memberID = app.globalData.EntCode + '-' + value.MemberID
    if (str1 == memberID || str2 === memberID) {
      return data
    } else {
      return false
    }
  },
    // if (wx.getStorageSync('isAuthUserInfo')) {

      // ws.connect()
      // socketOpen = true;
      // ws.recvData((res) => {
      //   console.log(res, 'websocket返回的')
      //   that.queryMsgContent(JSON.parse(res.data))
      //   // that.processingData(res)
      // });
    // }
  // 页面销毁事件
  // 1.当页面销毁之后，缓存中有数据，则修改该条数据，假如没有数据则添加数据
  // 2.当缓存中的arr为空的时候，直接清除掉该数据
  onUnload: function () {
    var storageData = wx.getStorageSync('contentInfo')
    var len = this.data.allContentList.length //数组的长度
    console.log('卸载页面', this.data.allContentList)
    if (storageData) {
      //如果有该用户的缓存
      var HasStorge = storageData.some(item => {
        return item.SessionID == this.data.SessionID
      })
      if (HasStorge) {
        storageData.filter(item => {
          if (item.SessionID == this.data.SessionID) {
            item.Arr = this.data.allContentList
            item.SeqID = this.data.allContentList[len - 1].SeqID
          }
        })
        this.setData({
          storageData: storageData,
        })
        wx.setStorageSync('contentInfo', storageData)
        this.queryMsgCount(this.data.allContentList[0])
      } else {
        if (this.data.allContentList.length > 0) {
          var params = {
            SessionID: this.data.SessionID,
            SeqID: this.data.allContentList[len - 1].SeqID,
            Arr: this.data.allContentList
          }
          storageData.push(params)
          wx.setStorageSync('contentInfo', storageData)
          this.queryMsgCount(params.Arr[0])
        }
      }
    } else {
      if (this.data.allContentList.length > 0) {
        var params = {
          SessionID: this.data.SessionID,
          // Sender: this.data.Sender,
          SeqID: this.data.allContentList[len - 1].SeqID,
          Arr: this.data.allContentList
        }
        var arr = []
        arr.push(params)
        wx.setStorageSync('contentInfo', arr)
        this.queryMsgCount(params.Arr[0])
      }
    }
    app.globalData.wsGlobal.closeWebSocket()
    app.globalData.wsGlobal.onClose()
    var arr1 = wx.getStorageSync('content')
    var value1 = app.globalData.self
    arr1.forEach(item => {
      if(item.SessionID == value1.SessionID && item.MsgType == value1.MsgType && item.MsgClassify == value1.MsgClassify) {
        item.NewSeqID = item.SeqID
      }
    })
    console.log(arr1, 'arr2')
    wx.setStorageSync('content', arr1)
    // ws.onClose()
  },
  // 每次退出页面之后，将最新的msgCount放到缓存里面

  queryMsgCount(contentInfo) {
    console.log(contentInfo, 'contentInfo')
  
    // var contentInfo = wx.getStorageSync('contentInfo')
    var value = wx.getStorageSync('msgList')
    value.forEach(item => {
      if (item.SessionID) {
        // contentInfo.forEach(value => {
          if (contentInfo.SessionID == item.SessionID && contentInfo.MsgClassify == item.MsgClassify && contentInfo.MsgType == item.MsgType) {
            console.log('msglist缓存')
            item.SeqID = contentInfo.SeqID
            item.Counts = 0
          }
        // })
      }
    })
    console.log(value)
    app.globalData.msgList = value
    // wx.clearStorageSync('msgList')
    // wx.setStorageSync('msgList', value)
  },
  // 页面滚动到底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function (rect) {
      console.log(rect.height);
      wx.pageScrollTo({
        scrollTop: rect.height + 'rpx',
      });
    }).exec()
  },
  bindscrolltop(e) {
    console.log('99999', e, this.data.allContentList)
    var len = this.data.allContentList.length
    // this.setData({
    //   ContentList: this.data.allContentList.slice(95, 106),
    //   // toView: 'msg' + '-95'
    // })
    var num = 95
    setInterval(() => {

      this.setData({
        // toView: 'msg' + '-95'
      })
    }, 500)
    console.log(num, this.data.toView)
  },
  addFuncs() {
    this.setData({
      inputBottom: 0,
      toView: 'msg-' + (this.data.allContentList.length - 1),

    })
    if (this.data.showfunc) {
      this.setData({
        showfunc: false,
        Height: false
      })
    } else {
      this.setData({
        showfunc: true,
        Height: true
      })
    }
  },
  //充值
  chongzhi() {
    // var con = 10
    wx.navigateTo({
      url: '/pages/mine/wallet/charge/index?con=' + this.data.jifenNum,
    })
  },
  funcs(e) {
    var index = e.currentTarget.dataset.index
    var that = this
    // 调用微信小程序的读取本地相册的接口
    if (index == 0 || index == 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          console.log(res)
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths[0]
          console.log(tempFilePaths)
          that.upload(tempFilePaths)
          // 发送
        }
      })
    } else if (index == 2) {
      // 发送礼物
      that.setData({
        showGift: true,
        giftModal: true,
        showfunc: false,
        showSendMsg: false
      })
    }
  },

  // 点击礼物
  present(e) {
    var item = e.currentTarget.dataset.item
    console.log(item, '点击礼物')
    this.setData({
      currentTarget: item.id,
      price: item.jifen,
      giftUrl: item.url
    })
  },
  // 点击发送礼物
  async sendGift() {
    // 发送礼物之前先 1.判断是否选择了礼物  2.查一下积分值是否能购买，
    if (this.data.price) {
      let res = await this.queryMemberAccount()
      console.log(res, 'accounnt', Number(this.data.price), res.Balance, this.data.giftUrl)
      // 与礼物价格对比
      if (Number(this.data.price) > res.Balance) {
        Toast('积分不足，请充值')
      } else {
        this.data.msgTypes = 6 
        var params = {
          path: this.data.giftUrl
        }
        await this.submitTo(params, this.data.msgTypes)
        // 添加以及修改积分表
        await this.updateMoney(this.data.price)
      }
    }
  },
  // 关闭礼物框
  onClose() {
    this.setData({
      showGift: false,
      showSendMsg: true,
      inputBottom: 0,
      Height: false
    })
  },
  // 查询积分表
  async queryMemberAccount() {
    let res = await Api.requestApi('lxy_contact/queryMemberAccount.action', {
      MemberID: wx.getStorageSync('MemberID')
    })
    if (JSON.parse(res.data).RowCnt > 0) {
      this.setData({
        jifenNum: JSON.parse(res.data).Records[0].Balance
      })
      return JSON.parse(res.data).Records[0]
    } else {
      Toast('积分不足,请充值');
    }
    console.log(res, 'resss')
  },
  // 修改积分表
  async updateMoney(value) {
    console.log(value, '修改积分表')
    let res = await Api.requestApi('lxy_contact/updateMoney.action', {
      MemberID: wx.getStorageSync('MemberID'),
      Balance: '-' + value,
      RecordType: 1,
      RelationID: '',
      Amount: value,
      Remarks: ''
    })
  },
  // 调用上传图片接口
  upload(event) {
    var that = this

    console.log(event, 'event')

    const file = event
    wx.showLoading({
      title: '图片上传中',
    })
    Api.uploadFileServer('lxy_contact/uploadFileServer.action', {
      EntCode: 38
    }).then(res => {
      console.log(JSON.parse(res.data).Token, '111')

      that.data.tok = JSON.parse(res.data).Token

      wx.uploadFile({
        url: baseUrlImg + '?token=' + JSON.parse(res.data).Token,
        filePath: file,
        name: 'file',
        formData: {
          user: 'test'
        },
        success: (res) => {
          console.log(JSON.parse(res.data).hash)
          if (JSON.parse(res.data).hash) {
            console.log(baseUrl1 + JSON.parse(res.data).hash)
            var params = {
              path: JSON.parse(res.data).hash,
              album: true
            }
            this.data.msgTypes = 1 //判断类型，假如是1则是图片
            this.submitTo(params, this.data.msgTypes)
            if (this.data.FileID1 == '') {
              this.data.FileID1 = baseUrl1 + JSON.parse(res.data).hash
            } else {
              this.data.FileID1 = this.data.FileID1 + ',' + baseUrl1 + JSON.parse(res.data).hash
            }

            console.log(this.data.FileID1)
            const {
              fileList1 = []
            } = this.data;
            fileList1.push({
              ...file,
              url: baseUrl1 + JSON.parse(res.data).hash
            });
            this.setData({
              fileList1,
              imageNum: this.data.fileList1.length
            });
            console.log(this.data.fileList1)
          } else {
            // Toast.success('图片上传失败');
          }
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    })
  },
  // 点击输入框聚焦事件
  focus: function (e) {
    var keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (this.data.allContentList.length - 1),
      inputBottom: '50rpx',
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (this.data.allContentList.length - 1)
    })

  },
  // 页面加载完成
  onReady: function () {
  },

  
  // 当接受到soket应答之后，根据sessionid去查后面的数据，首先判断缓存中是否有数据，假如有的话，那么直接拼接在后面
  // 假如缓存中没有数据的话，那么就直接拼接数据
  // 查询后面的消息

getWebsoket(res) {
  var that  = this
  console.log(res, 'pages')
    // var res = JSON.parse(onMessage.data)
      if (res.SessionID) {
        console.log('点击发送事件')
        var len = that.data.allContentList.length
        that.data.sendMsg = true
        var value = [{
          SessionID: res.SessionID,
          SeqID: that.data.allContentList[len - 1].SeqID
        }]
        that.queryMsgBack(value)

      }
},

  // 5.假如缓存中超过条数据，则只展示最后的十条
  showRecords(value) {
    console.log(value, value.length)
    // this.setData({
    //   toView: 'msg-9'
    // })
    var arr = []
    if (value.length > 15) {
      arr = value.slice(-15)
      console.log(arr)
      this.setData({
        ContentList: arr
      })
      this.setData({
        toView: 'msg-' + (arr.length - 1)
      })
      console.log(this.data.toView)
    } else {
      this.setData({
        ContentList: value,
      })
      this.setData({
        toView: 'msg-' + (value.length - 1)
      })
    }
  },


  // 处理格式
  getDataRecord(temps) {
    console.log(temps, '===')
    var memberid = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    for (var i = 0; i < temps.length; i++) {
      if (temps[i].Sender !== memberid) {
        temps[i].is_my = false
        temps[i].is_you = true

      } else {
        temps[i].is_you = false
        temps[i].is_my = true
      }
      // && temps[i].ContentType == '0'
      if (temps[i].MsgClassify == '0' && temps[i].MsgType == '0') {

        console.log(temps[i].Message, '===')
        temps[i].Message = Base64.Base64.decode(temps[i].Message)
      }
    }
    return temps
  },
  //处理下拉
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
      var EventData = that.data.ContentList //此数据为展示的数据
      var length = that.data.allContentList.length
      that.caches()
      var HideData = that.data.allContentList.slice(0, length - 11) //此数据为隐藏数据
      EventData = HideData.concat(that.data.EventData) //拼接数据
      console.log(EventData, '-=---')

      // setTimeout(() => { //自行选择是否定时进行加载
      that.setData({
        ContentList: EventData
      })
      query.exec(function (res) {
        // if (HideData == '' || !HideData) { //判断是否隐藏数据为空
        that.setData({
          NoMoreEvent: 1,
          scrollTop: res[0].height - that.data.contentHeight,
        })
        console.log(that.data.scrollTop, '=====')
        return false
        // }
        // console.log(that.data.scrollTop, '顶部的距离')
        that.data.ScrollLoading = 0 //允许再次触发触顶事件
        // that.getEventData() //请求新的数据
        // }, 1000)
      })
    }
  },

  //处理缓存数据
  caches() {
    var newArr = []
    // this.data.cacheList[0].Arr.forEach(item => {
    if (this.data.newArrIndex == -1) {

      for (var i = 0; i < this.data.cacheList[0].Arr.length; i += 10) {
        newArr.push(this.data.cacheList[0].Arr.slice(i, i + 10))
      }
      console.log(newArr)
      this.data.newArrIndex = newArr.length - 2

    } else {
      for (var i = 0; i < this.data.cacheList[0].Arr.length; i += 10) {
        newArr.push(this.data.cacheList[0].Arr.slice(i, i + 10))
      }
      this.data.newArrIndex--
    }
    console.log(this.data.newArrIndex)
    console.log('...', newArr[this.data.newArrIndex])
    // this.data.ContentList = [...newArr[this.data.newArrIndex], ...this.data.ContentList]
    var ContentList = [...newArr[this.data.newArrIndex], ...this.data.ContentList]
    // this.setData({
    //   ContentList: this.data.ContentList
    // })
    // console.log(this.data.ContentList, '----')
    console.log(ContentList, '----')
  },
  // 当缓存中没有该用户的时候查询所有的消息消息
  async queryMsgContent(value, value2) {
    console.log(value2)
    //value2历史记录
    var that = this
    const params = {}
    var arr = []
    params.limit = 20
    params.current = 1
    params.MsgClassify = 0
    params.MsgType = 0
    params.orderBy = 'order by tab_message.MsgTime ASC'
    params.SessionID = value
    // if (value2) {
    //   params.SenderParams = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    //   params.RecverParams = app.globalData.EntCode + '-' + wx.getStorageSync("MemberID")

    //   let res = await Api.requestApi("lxy_contact/queryMsgContentDesc.action", {
    //     ...params
    //   })
    // }
    //  else {

      // params.SessionID = value.SessionID
      // params.MsgClassify = 0
      // params.MsgType = 0

      let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
        ...params
      })
    // }
    // console.log(res.data, '查询回来的数据')
    if (JSON.parse(res.data).RowCnt > 0) {
      console.log('-----', res, JSON.parse(res.data).TotalSize, JSON.parse(res.data).RowCnt)
      if (Number(JSON.parse(res.data).TotalSize) > Number(JSON.parse(res.data).RowCnt)) {
        console.log('-----', JSON.parse(res.data).TotalSize)
        const values = {}
        // params.SessionID = value
        values.SessionID = value.SessionID
        values.MsgClassify = 0
        values.limit = Number(JSON.parse(res.data).TotalSize) + Number(2)
        values.current = 1
        values.MsgType = 0
        values.orderBy= "order by tab_message.MsgTime ASC"
        let results = await Api.requestApi("lxy_contact/queryMsgContent.action", {
          ...values
        })
        var temps = JSON.parse(results.data).Records
        console.log(value2, 'value2')
        // if(value2) {
        //   temps = this.getHistory(temps)
        // }
      } else {

        var temps = JSON.parse(res.data).Records

        // if(value2) {
        //   temps.forEach(item => {

        //   })
        //   temps = this.getHistory(temps)
        //   console.log(temps, 'tmeps')
        // }
      }
      // console.log(temps, '请求的参数')
      var dataResult = this.getDataRecord(temps)

      // this.showRecords(dataResult)
      // console.log(dataResult)
      that.setData({
        allContentList: dataResult,
        count: JSON.parse(res.data).TotalSize,

      })
      that.setData({

        toView: 'msg-' + (dataResult.length - 1)
      })

    }
  },
  getHistory(values) {
    var arr2 = []
    var memberIDA = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    var arr = values.forEach(item => {
      if (item.Sender == memberIDA && item.Recver == this.data.Recver && item.ContentType !== 1) {

        arr2.push(item)
        console.log(arr2, 'arr1')
      } else if (item.Sender == this.data.Recver && item.Recver == memberIDA && item.ContentType !== 1) {
        arr2.push(item)
        console.log(arr2, 'arr2')
      }
      return arr2
    })
    console.log(arr, 'arr')
    return arr
  },
  // 查询后面的消息
  async queryMsgBack(value, value2, nodata) {
    console.log(value, '---')
    //value2为true说明是发送消息之后来处理数据的
    //nodata说明发送消息的时候没有数据
    var params1 = {
      SeqID: value[0].SeqID,
      SessionID: value[0].SessionID,
      limit: 20,
      MsgType: 0,
      current: 1,
      MsgClassify: 0
    }
    if (nodata) {
      var params1 = {
        Sender: value[0].Sender,
        Recver: value[0].Recver,
        limit: 20,
        MsgType: 0,
        current: 1,
        MsgClassify: 0
      }
    }
    let res = await Api.requestApi('lxy_contact/queryMsgBack.action', {
      ...params1
    })
    var res1 = JSON.parse(res.data).Records
    var value3 = []
    var arr = []
    if (JSON.parse(res.data).RowCnt > 0) {
      if (Number(JSON.parse(res.data).RowCnt) < Number(JSON.parse(res.data).TotalSize)) {
        var params2 = {
          SeqID: value[0].SeqID,
          SessionID: value[0].SessionID,
          limit: Number(JSON.parse(res.data).TotalSize * 1 + 2),
          MsgType: 0,
          current: 1,
          MsgClassify: 0
        }
        let results = await Api.requestApi('lxy_contact/queryMsgBack.action', {
          ...params2
        })
        if (value2) {

          var res2 = JSON.parse(res.data).Records
          console.log(res2, '发送消息后来处理数据')
          var temps = this.getDataRecord(res2) //处理数据格式
          console.log(res2, temps, '发送消息后来处理数据')
          return temps
        } else {

          var res2 = JSON.parse(res.data).Records
          var temps = this.getDataRecord(res2) //处理数据格式
          console.log(temps, res2, '返回res2=====')
          arr = value[0].Arr
          arr.push(...temps)
          value3 = arr
        }
      } else {
        if (value2) {

          var temps = this.getDataRecord(res1) //处理数据格式
          return temps
        } else if (this.data.sendMsg) {

          var temps = this.getDataRecord(res1) //处理数据格式
          this.data.allContentList.push(...temps)
          arr = this.data.allContentList
        } else {
          var temps = this.getDataRecord(res1) //处理数据格式
          arr = value[0].Arr
          arr.push(...temps)
          console.log(temps, value[0], value3, '返回res1=====')
        }

        value3 = arr
      }
    } else {
      //后面没有数据了，那么直接展示缓存中的数据
      arr = value[0].Arr
      value3 = arr
      console.log(arr, value[0].Arr, value[0], )
    }
    //  value3 =  this.getDataRecord(arr)
    this.setData({
      allContentList: value3,
      toView: 'msg-' + (value3.length - 1)
    })

  },







  // 提交文字
  submitTo: function (e, value) {
    let that = this;
    console.log(that.data.inputValue, socketOpen, e, that.data.msgTypes, '点击发送按钮')
    if (that.data.inputValue) {
      that.data.msgTypes = '3'
    }
    if (that.data.msgTypes == '0') {
      Toast('输入内容不能为空')
      return false
    }
    // 发送对话
    that.sendMessageReq(e, value)
    console.log(that.data.allContentList, '点击发送')
    // 如果打开了socket就发送数据给服务器
    // sendSocketMessage(data)

  },

  // 发送消息api

  async sendMessageReq(e, value) {
    console.log(e)
    var that = this
    var params = {}
    var value = []
    params.Recver = that.data.Recver
    params.Sender = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    params.Extend = 'BusinessID=' + app.globalData.BusinessID
    // value ==1 发送图片消息
    if (that.data.msgTypes == '1') {
      params.ContentType = '1'
      params.Message = Base64.Base64.encode(e.path)
      params.Extend = params.Extend + ',' + 'uploadUrl=' + that.data.uploadUrl
    } else if (that.data.msgTypes == '3') {
      // 发送普通文字消息
      params.Message = Base64.Base64.encode(that.data.inputValue)
      params.ContentType = '0'
    } else if (that.data.msgTypes == '6') {
      // 发送礼物
      params.ContentType = '6'
      // params.Message = e.path
      params.Message = Base64.Base64.encode(e.path)
    }
    params.MsgClassify = '0'
    params.MsgType = '0'
    let res = await Api.requestApi("lxy_contact/sendIMReq.action", {
      ...params
    })
    if (JSON.parse(res.success)) {
      if (that.data.cacheList.length > 0) {

        var len = that.data.cacheList[0].Arr.length
        var value = [{
          SessionID: that.data.SessionID,
          SeqID: that.data.cacheList[0].Arr[len - 1].SeqID
        }]
        console.log(that.data.cacheList)

        var tems = true
        var data = await that.queryMsgBack(value, tems)
        that.getNewData(data, e, value)
      } else {
        // 发送消息之前有数据
        if (that.data.allContentList.length > 0) {
          var len = that.data.allContentList.length
          value = [{
            SessionID: that.data.SessionID,
            SeqID: that.data.allContentList[len - 1].SeqID
          }]
          var tems = true
          var data = await that.queryMsgBack(value, tems)
          that.getNewData(data, e, value)
          console.log('发送消息之前有数据')
        } else { //发送消息之前就没有数据
          value = [{
            Sender: app.globalData.EntCode + '-' + wx.getStorageSync('MemberID'),
            Recver: that.data.Recver
          }]
          var tems = true
          var nodata = true
          var data = await that.queryMsgBack(value, tems, nodata)
          that.getNewData(data, e, value)
          console.log(data, 'newdata1')
        }
      }
      // debugger
      //发送一次消息然后请求一次接口，返回后面的数据
      // var len1 = data.length
      // var newData = data[len1-1]
    }
  },
  //每次发送消息之后，就要重新处理一下最新数据
  getNewData(value1, value2, value3) {
    console.log(value1, 'newdata1')
    var that = this
    if (value3 == '1') {
      var params = {
        ...value1[0]
      }
    } else {
      var params = {
        ...value1[0]
      }
    }

    that.data.ContentList.push(params);
    that.data.allContentList.push(params);
    console.log(that.data.allContentList)
    this.setData({
      allContentList: that.data.allContentList,
      ContentList: that.data.ContentList,
      inputValue: '',
      SessionID: that.data.allContentList[0].SessionID
    })
    this.setData({
      toView: 'msg-' + (that.data.allContentList.length - 1)
    })
    console.log(that.data.toView)
  },


  // 去往对方主页
  detailNews(e) {
    // var str = JSON.stringify(e.currentTarget.dataset.item)
    app.globalData.self = e.currentTarget.dataset.item
    // console.log(str)
    wx.navigateTo({
      url: '/pages/zhuye/zhuye',
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onHide: function () {
    // SocketTask.close(function (close) {
    //   console.log('关闭 WebSocket 连接。', close)
    // })
  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function (res) {
        that.setData({
          img: res.tempFilePaths
        })
        wx.uploadFile({
          url: upload_url,
          filePath: res.tempFilePaths,
          name: 'img',
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '图片发送成功！',
              duration: 3000
            });
          }
        })
        that.data.allContentList.push({
          is_my: {
            img: res.tempFilePaths
          }
        });
        that.setData({
          allContentList: that.data.allContentList,
        })
      }
    })
  },
  addImg: function () {
    this.setData({
      addImg: !this.data.addImg
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.fenyeSearch()
  },
  async fenyeSearch() {
    var that = this
    var datalist = []
    var count = 0
    var current = that.data.current * 1 + 1
    var limit = that.data.limit
    var total = that.data.total
    if (that.data.allContentList.length < that.data.count) {
      const params = {
        current: current,
        limit: limit,
        total: total,
        SessionID: that.data.parmsValue.SessionID
      }
      let res = await Api.requestApi('lxy_contact/queryMsgContent.action', {
        ...params
      })

      if (JSON.parse(res.data).RowCnt !== '0') {
        let data = JSON.parse(res.data).Records
        this.getRecords(data)


        that.setData({
          count: JSON.parse(res.data).TotalSize,
          current: current
        })
      }
    }
  },

  // 对数据进行处理
  getRecords(temps) {
    console.log(temps, '触底')
    var arr = []
    var datalist = []
    for (var i = 0; i < temps.length; i++) {
      var str1 = temps[i].Sender.split('-')[1]
      var str2 = temps[i].Sender.split('-')[2]
      if (str2) {
        var str3 = str1 + '-' + str2
      } else {
        str3 = str1
      }
      console.log(temps[i].Sender.split('-')[2], str3, '===========')
      if (str3 !== wx.getStorageSync('MemberID')) {
        temps[i].is_my = false
        temps[i].is_you = true
      } else {
        temps[i].is_you = false
        temps[i].is_my = true
      }
    }

    datalist = this.data.allContentList.concat(temps)
    this.setData({
      allContentList: datalist
    })
    console.log(this.data.allContentList, '触底allContentList')
  },

  // 找出序号最大的对话
  getMaxNum(temps) {
    var contenArr = Math.max.apply(Math, temps.map((item, index) => {
      return index
    }))
    console.log(contenArr, '输出数组')
    var arrs = []
    arrs.push(temps[contenArr])
    // 将查到的sqlid最大的一条信息放到缓存里面
    wx.setStorageSync('contentInfo', arrs)
  },


})
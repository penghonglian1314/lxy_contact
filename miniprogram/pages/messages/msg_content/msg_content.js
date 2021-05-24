var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;

var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min');
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
      url: 'http://mall-imag.linxyun.com/FoTz3L2Ci4n-s571GEw6h2D2nFtG',
      text: '冲上云霄',
      jifen: '300'
    }, {
      id: 1,
      url: 'http://mall-imag.linxyun.com/FvFe8xe2ojMgghEHo1jzoYxBes8Y',
      text: '撩一下',
      jifen: '56'
    }, {
      id: 2,
      url: 'http://mall-imag.linxyun.com/FmLfj7ZW_N2Wy3ZHHSM4J18PeFPV',
      text: '比心',
      jifen: '18'
    }, {
      id: 3,
      url: 'http://mall-imag.linxyun.com/Fsgd007SiLQUvFjSPijCoxkgLWbo',
      text: '全场最美',
      jifen: '67'
    },
    {
      id: 4,
      url: 'http://mall-imag.linxyun.com/FjTtgcq91-_TxeO-ZeSCUynMnRlb',
      text: '糖葫芦',
      jifen: '200'
    }, {
      id: 5,
      url: 'http://mall-imag.linxyun.com/Fi1ZFFCDsPY9aY1_w6MBCCQRYcfE',
      text: '爱之蔷薇',
      jifen: '26'
    }, {
      id: 5,
      url: 'http://mall-imag.linxyun.com/Flta_HvgMnHIO17ebPj2DWmEcKBA',
      text: '法拉利',
      jifen: '890'
    }, {
      id: 5,
      url: 'http://mall-imag.linxyun.com/FhUaH0w6DIv1KXix_feAXyN5ZWCM',
      text: '礼物周',
      jifen: '45'
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
    nodata: false,
    placeholder: '',
    disabled: false,
    gender: null,
    storageValue: {},
    showLoading: true
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

    var content = wx.getStorageSync('content')
    if (value.opt) {
      console.log(value, value.opt, '传递过来的参数')
      var params = app.globalData.self
      content.forEach(item => {
        if (params.SessionID == item.SessionID && params.MsgClassify == item.MsgClassify && params.MsgType == item.MsgType) {
          this.setData({
            allContentList: item.Arr
          })
          this.setData({
            toView: 'msg-' + (this.data.allContentList.length - 1)
          })
        }
      })
      // var params = value.opt
      this.data.parmsValue = params //传递过来的所有参数
      this.data.SessionID = params.SessionID
      console.log('从对话列表传递过来的参数', params, this.data.allContentList)
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
    // 查询积分

    // 如果是从私聊界面进来的
    if (value.Code == '1' || value.Code == '2') {
      console.log('从私聊界面进来的', value)
      this.data.storageValue = value
      this.data.Recver = app.globalData.EntCode + '-' + value.MemberID
      // 1.先去处理一下ID
      this.data.gender = value.Gender
      var res = this.FromCirStorage(value)

      console.log(res, '缓存中是否有记录')
      if (value.Code == '1') {

        wx.setNavigationBarTitle({
          title: value.MemberName
        })
      } else {

        wx.setNavigationBarTitle({
          title: '客服'
        })
      }
      if (res !== undefined) {
        this.setData({
          allContentList: res.Arr
        })

        this.setData({
          toView: 'msg-' + (res.Arr.length - 1)
        })
      } else {
        // 缓存中没有记录
        this.setData({
          nodata: true
        })
        // 然后开始请求后面的数据
        // this.queryMsgBack(value)

      }
    }
    if (!this.data.nodata) { //假如发送消息之前没有消息,那么可以发送消息
      console.log(this.data.gender, '======')
      if (this.data.gender == '0' && wx.getStorageSync('gender') == '2') {


        var sender = this.data.allContentList.filter(item => {
          return item.Sender !== app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
        })
        if (sender.length == 0) {
          console.log(sender, 'sender')
          this.setData({
            placeholder: '对方回复才可以畅聊哟~',
            disabled: true
          })
        }
      }
    }
    setTimeout(() => {
      this.setData({
        ShowCotent: false,
        showLoading: false
      })


    }, 1000)

  },
  onShow: function () {

    this.queryMemberAccount()
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

  // 从聊天页面进来，先去看看缓存中是否有聊天记录
  FromCirStorage(value) {
    // 传入MemberId
    // 1.开始循环遍历缓存中的每一项，分割SessionID
    if (wx.getStorageSync('content')) {
      var data = wx.getStorageSync('content')
      console.log(value, data, '私聊页面缓存中内容===')
      var arr = []
      var str1 = ''
      for (var i = 0; i < data.length; i++) {
        var str = this.getMemberID(data[i], value)
        console.log(str)
        if (str && data[i].MsgType == '0' && data[i].MsgClassify == '0') {
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

  // 页面销毁事件
  // 1.当页面销毁之后，缓存中有数据，则修改该条数据，假如没有数据则添加数据
  // 2.当缓存中的arr为空的时候，直接清除掉该数据
  onUnload: function () {
    // app.globalData.wsGlobal.closeWebSocket()
    // app.globalData.wsGlobal.onClose()
    var value1 = app.globalData.self
    var arr1 = []
    var allContentList = this.data.allContentList
    if (allContentList.length > 0) {
      var contents = allContentList[allContentList.length - 1]
      var value1 = contents
    }

    console.log(allContentList, value1, 'allcontentlist')
    if (wx.getStorageSync('content')) {
      arr1 = wx.getStorageSync('content')

      var arr11 = arr1.some(item => {
        return item.SessionID == value1.SessionID && item.MsgType == value1.MsgType && item.MsgClassify == value1.MsgClassify
      })
      console.log(arr11, arr1)
      if (arr11) { //假如缓存中有此member的消息则直接修改
        arr1.forEach(item => {
          if (item.SessionID == value1.SessionID && item.MsgType == value1.MsgType && item.MsgClassify == value1.MsgClassify) {
            item.NewSeqID = value1.SeqID
            item.Arr = this.data.allContentList
            item.SeqID = value1.SeqID
          }
        })
        wx.setStorageSync('content', arr1)
      } else {
        // 假如没有的话,就往后面push
        var content = {
          SessionID: allContentList[0].SessionID,
          // SeqID: allContentList[allContentList.length - 1].SeqID,
          SeqID: allContentList[0].SeqID,
          NewSeqID: allContentList[0].SeqID,
          MsgClassify: allContentList[0].MsgClassify,
          MsgType: allContentList[0].MsgType,
          Arr: allContentList
        }
        arr1.push(content)
        wx.setStorageSync('content', arr1)
      }

      // })
    } else {
      // 没有缓存
      var content = {
        SessionID: allContentList[0].SessionID,
        // SeqID: allContentList[allContentList.length - 1].SeqID,
        SeqID: allContentList[0].SeqID,
        NewSeqID: allContentList[0].SeqID,
        MsgClassify: allContentList[0].MsgClassify,
        MsgType: allContentList[0].MsgType,
        Arr: allContentList
      }
      arr1.push(content)
      wx.setStorageSync('content', arr1)
    }

    // console.log(arr1, 'arr2')
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
  addFuncs() {
    if (this.data.disabled) {
      return false
    }
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
  onReady: function () {},


  // 当接受到soket应答之后，根据sessionid去查后面的数据，首先判断缓存中是否有数据，假如有的话，那么直接拼接在后面
  // 假如缓存中没有数据的话，那么就直接拼接数据
  // 查询后面的消息

  async getWebsoket(res) {
    var that = this
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
      var arr = await that.queryMsgBack(value)
      //  处理数据
      var data1 = that.getDataRecord(arr)
      that.getNewData(data1)

    }
  },



  // 处理格式
  getDataRecord(temps) {
    console.log(temps, '===')
    var memberid = app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    // for (var i = 0; i < temps.length; i++) {
    if (temps.Sender !== memberid) {
      temps.is_my = false
      temps.is_you = true

    } else {
      temps.is_you = false
      temps.is_my = true
    }
    // && temps.ContentType == '0'
    if (temps.MsgClassify == '0' && temps.MsgType == '0') {

      console.log(temps.Message, '===')
      temps.Message = Base64.Base64.decode(temps.Message)
    }
    // }
    return temps
  },



  // 查询后面的消息
  async queryMsgBack(value) {
    console.log(value, '---')
    var msg = this.data.allContentList[this.data.allContentList.length - 1]
    //value2为true说明是发送消息之后来处理数据的
    //nodata说明发送消息的时候没有数据

    if (this.data.nodata) {
      var params1 = {
        Sender: app.globalData.EntCode + '-' + wx.getStorageSync('MemberID'),
        Recver: this.data.Recver,
        limit: 20,
        MsgType: 0,
        current: 1,
        MsgClassify: 0,
        orderBy: 'order by tab_message.MsgTime DESC'
      }
    } else {
      var params1 = {
        SeqID: msg.SeqID,
        SessionID: msg.SessionID,
        limit: 20,
        MsgType: 0,
        current: 1,
        MsgClassify: 0,
        orderBy: 'order by tab_message.MsgTime ASC'
      }
    }
    let res = await Api.requestApi('lxy_contact/queryMsgBack.action', {
      ...params1
    })
    if (JSON.parse(res.data).RowCnt > 0) {
      return JSON.parse(res.data).Records[0]
    }

  },







  // 提交文字
  submitTo: function (e, value) {
    let that = this;
    console.log(that.data.inputValue, value, e, that.data.msgTypes, '点击发送按钮')
    if (that.data.inputValue) {
      that.data.msgTypes = '0'
    } else {

      if (that.data.msgTypes == '0') {
        Toast('输入内容不能为空')
        return false
      }
    }

    this.setData({
      showLoading: true
    })
    // 发送对话
    that.sendMessageReq(e, value)
    console.log(that.data.allContentList, '点击发送')


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
    } else if (that.data.msgTypes == '0') {
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
      var data = await that.queryMsgBack(value)
      var data1 = that.getDataRecord(data)
      // console.log(data1, 'data1')
      that.getNewData(data1, e, value)
    } else {
      that.setData({
        showLoading: false
      })
    }
  },
  //每次发送消息之后，就要重新处理一下最新数据
  getNewData(value1, value2, value3) {
    // console.log(value1, 'newdata1')
    var that = this
    that.data.allContentList.push(value1);

    // console.log(that.data.allContentList)
    // wx.setS
    this.setData({
      allContentList: that.data.allContentList,
      inputValue: '',
    })
    this.setData({
      toView: 'msg-' + (that.data.allContentList.length - 1)
    })
    // this.data.gender = value.Gender
    if (this.data.gender == '0' && wx.getStorageSync('gender') == '2') {

    }
    var sender = this.data.allContentList.filter(item => {
      return item.Sender !== app.globalData.EntCode + '-' + wx.getStorageSync('MemberID')
    })
    console.log(sender, 'sender')
    if (sender.length == 0) {
      this.setData({
        placeholder: '对方回复才可以畅聊哟~',
        disabled: true
      })
    }
    // 假如缓存中没有这条数据,那么就会往缓存中存入数据

    // 1.开始循环遍历缓存中的每一项，分割SessionID
    // var res = this.FromCirStorage(this.data.storageValue)
    // console.log(res)
    // if (res !== undefined) {

    // } else {
    //   // 开始处理数据格式,然后往缓存中放入数据
    // }

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


  weizhi(){
    var that=this

    wx.getLocation({
      success: res=>{
        console.log(res)

        const latitude = res.latitude
        const longitude = res.longitude

        var qqmapsdk = new QQMapWX({
          key: 'ZQEBZ-EMCKU-IASVX-4RPZE-NZB3F-CZBBF'
        });
    
        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success: res=>{
            console.log(res.result.address)

            that.setData({
              inputValue: res.result.address
            })
          }
        })
      }
    })
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
// pages/messages/index.js
var app = getApp()
var Api = require('./api')
// import date from './utils/time'
var timedata = require('./moment.js')
timedata.locale('zh-cn');
import date from './date'
var equals = require('./compare')
var Base64 = require('./b64')
var Func = require('./baseFunc')
var msg = require('./message')


import Dialog from '../miniprogram_npm/@vant/weapp/dialog/dialog';

var msgList = {

data: {
  msgList: [],
  current: 1,
  limit: 20,
  total: 0,
  count: 0,
  rightWidth: '100rpx',
  xiaoxi: false, //是否有消息
  msgArr: [{
      id: 0,
      AvatarUrl: '../images/xitong.png',
      MemberName: '系统通知',
      Message: '暂无通知',
      MsgClassify: 2,
      MsgType: 0
    },
    {
      id: 1,
      AvatarUrl: '../images/hudong.png',
      MemberName: '互动消息',
      Message: '暂无消息',
      MsgClassify: 0,
      MsgType: 3
    },
    {
      id: 2,
      AvatarUrl: '../images/qianbao.png',
      MemberName: '钱包提醒',
      Message: '暂无提醒',
      MsgClassify: 0,
      MsgType: 7
    },
    {
      id: 3,
      AvatarUrl: '../images/shengqing.png',
      MemberName: '申请查看',
      Message: '暂无申请',
      MsgClassify: 0,
      MsgType: 2
    },
    {
      id: 4,
      AvatarUrl: '../images/yaoqingma.png',
      MemberName: '邀请码通知',
      Message: '暂无新通知',
      MsgClassify: 2,
      MsgType: 4
    }
  ] //没有消息时展示的页面
},
/**
 * 页面的初始数据
 */


/**
 * 生命周期函数--监听页面显示
 */


// queryApp() {

//   this.queryMessageList()
// },

// 查询消息列表
async queryMessageList() {
  var that = this
  const params = {}
  params.Sender = '38-' + wx.getStorageSync('MemberID')

  params.Recver = '38-' + wx.getStorageSync('MemberID')
  params.limit = that.data.limit
  params.current = that.data.current
  let res = await Api.requestApi('lxy_contact/queryMessageList.action', {
    ...params
  })
  if (JSON.parse(res.data).RowCnt > 0) {
    // that.setData({
    //   xiaoxi: true
    // })
    
    var arrData = JSON.parse(res.data).Records
    // 判断是不是我发的消息
    var temps = await that.isMine(arrData)
    // var arr1 = await that.duplicate6(temps) //去除重复的消息
    var arr2 = await that.pushData(temps, that.data.msgArr) //拼接消息
    temps.push(...arr2)

    that.duplicate6(temps) //处理时间数据

  } else {
    // that.setData({
    //   xiaoxi: false,
    //   msgList: that.data.msgArr
    // })
  }
},

// 处理数据,去重且排序

duplicate6(arr) {
  console.log(arr, 'arr数组排序处理')
  arr.sort((a, b) => {
    return b.EndTime - a.EndTime
  }) //升序
  // arr = arr.sort();
  var num = 0
  var newArr = []
  // let res = [arr[0]];
  // arr.forEach((item, i) => {
  for (var i = 0; i < arr.length; i++) {
    if (newArr.length > 0) {
      // newArr.forEach((n, j) => {
      for (var j = i + 1; j < newArr.length; j++) {
        if (newArr[j].MsgType == arr[i].MsgType && newArr[j].MsgClassify == arr[i].MsgClassify && newArr[j].MsgType !== 0 && arr[i].MsgClassify !== 0) {
          n.Counts = Number(newArr[j].Counts) + Number(arr[i].Counts)

          // newArr.splice(j, 1);
        }
        // })
      }
    } else {
      newArr.push(arr[i])
    }
    // })
  }
  var res = this.deWeight(arr)

  wx.setStorageSync('msgList', res)
  msg.msg.msgList()
  setTimeout(() => {
    this.getRecords(res)
  }, 300)
  // this.getRecords(res)
  // console.log(res)
  // return res
},
deWeight(arr) {
  // 
  console.log(arr, 'delllll')
  var arr1 = []
  var arr2 = []
  var arr3 = []
  var arr4 = []
  var arr5 = []
  var arr6 = []
  var arr7 = []
  for (var i = 0; i <= arr.length - 1; i++) {
    // console.log(arr[i].MsgClassify=='0', arr[i].MemberName, 'arr777777---------')
    if (arr[i].MsgClassify == '0' && arr[i].MsgType == '0') {
      arr1.push(arr[i])
    } else if (arr[i].MsgClassify == '2') {
      arr2.push(arr[i])
    } else if (arr[i].MsgClassify == '0' && arr[i].MsgType == '2') {
      arr3.push(arr[i])
    } else if (arr[i].MsgClassify == '0' && arr[i].MsgType == '3') {

      arr4.push(arr[i])
      // console.log(arr4, arr[i], '---')
    } else if (arr[i].MsgClassify == '0' && arr[i].MsgType == '4') {
      arr5.push(arr[i])
    } else if (arr[i].MsgClassify == '0' && arr[i].MsgType == '7') {
      arr6.push(arr[i])
    }
  }
  // if(arr2)
  arr7 = [arr2, arr3, arr4, arr5, arr6]
  for (var j = 0; j < arr7.length; j++) {

    var arr0 = this.getArr(arr7[j])
    // console.log(arr1, arr0)
    if (arr0 !== undefined) {

      arr1.push(arr0)
    }
  }
  // console.log(arr1, arr7,'arr6')
  return arr1;
},
getArr(arr) {
  // console.log(arr, 'arr')
  if (arr.length > 0) {

    var nums = 0
    arr.forEach(item => {
      // console.log(item.Counts, '0000')
      nums += Number(item.Counts)
    })
    // console.log(nums)
    arr[0].Counts = nums
    return arr[0]
  }
},
pushData(a, b) {
  for (var i = 0; i < b.length; i++) {
    for (var j = 0; j < a.length; j++) {
      if (a[j].MsgClassify == b[i].MsgClassify && a[j].MsgType == b[i].MsgType) {
        b.splice(i, 1);
        // console.log(b, a[j].MsgClassify, b[i].MsgClassify, 'aaaa')
        //   i = i - 1;
      }
    }
  }
  // console.log(b, 'aaaa')
  return b;

},
// 去除某个属性相同的
array_diff(a, b) {
  for (var i = 0; i < b.length; i++) {
    for (var j = 0; j < a.length; j++) {
      if (a[j].id == b[i].id) {
        a.splice(j, 1);
        j = j - 1;
      }
    }
  }
  return a;
},
// 判断是图片还是文字
getTextImg(value) {
  var values = value.substr(0, 24)
  console.log(values)
  if (values == 'http://mall-imag.linxyun') {
    value = '[图片]'
    return value
  } else {
    return Func.baseFunc.getLong(value)
  }
},
// 互动消息
contactNews(value) {
  console.log(value)
  const reg = /\\/g
  // Records.forEach(element => {
  var news = value.replace(reg, '')
  // console.log(news)
  return JSON.parse(news).Content
},
// 判断发送者是否是自己，假如是自己的话就不显示（针对互动消息类的）
isMine(value) {
  console.log(value, 'ismine')
  var memberid = '38-' + wx.getStorageSync('MemberID')
  var arr = []
  value.filter(item => {
    if (item.MsgType == 0 && item.Sender == memberid) {
      // 如果 item.MsgClassify == '2'说明是系统消息，则头像变成系统头像
      arr.push(item)
    } else if (item.MsgType == 0 && item.Sender !== memberid) {
      arr.push(item)
    } else if (item.MsgType !== 0 && item.Sender !== memberid) {
      arr.push(item)
    }
  })

  console.log(arr, '数组消息')
  return arr
},




// // 处理时间格式
// async getRegx(temps) {
//   console.log(temps, '接受已经处理好的数据')
//   var z = JSON.stringify(temps)
//   var arr = JSON.parse(z)
//   var dateTime = new Date(); //必须要赋值
//   var moment = date.timeDatas(dateTime)

//   this.duplicate6(temps)
//   // this.getRecords(temps)
// },
// 查询数量queryMsgCount
async getRecords(temps) {
  var that = this
  console.log(temps, 'getRecords')
  var msgList = temps

  var dateTime = new Date(); //必须要赋值
  var moment = date.timeDatas(dateTime)
  var results1 = []
  var content = wx.getStorageSync('content')
  var msgList = wx.getStorageSync('msgList')

  if (content) {
    for (var i = 0; i < content.length; i++) {

      var arr1 = this.getCounts(content[i])
      results1.push(arr1.Arr[arr1.Arr.length - 1])
    }


    var arrs = this.data.msgArr.filter(item => {
      return !item.SessionID
    })

    // 消息置顶功能

    // results.forEach(values => {
    for (var i = 0; i < results1.length; i++) {
      var values = results1[i]

      if (values.MsgType == '0' && values.MsgClassify == '0') {
        var arr1 = await this.queryMember(values)
        var arr2 = await this.queryMsgCircle(values)
        console.log(arr1, arr2)
        if (arr1.Online == '0') {
          values.Online = true
          values.AvatarUrl = arr1.AvatarUrl
          values.MemberName = arr1.MemberName
        } else {
          console.log(arr1, 'arr1请求回来的数据')
          values.AvatarUrl = arr1.AvatarUrl
          values.MemberName = arr1.MemberName
        }
        values.IsTop = arr2
        // console.log(arr1.Online, arr2, '-----------')
      }
      if (values.MsgType == '3') {
        console.log(values.Message)
        values.MemberName = '互动消息'
        values.IsTop = 0
        values.AvatarUrl = '../../../images/hudong.png'
        values.Message = this.contactNews(values.Message)
      } else if (values.MsgClassify == '2') {
        console.log(values.Message)
        values.MemberName = '系统通知'
        values.AvatarUrl = '../../../images/xitong.png'
        values.IsTop = 0
        // console.log(values.Counts)
        // values.Message = Func.baseFunc.getLong(values.Message)
      } else if (values.MsgClassify == '0' && values.MsgType == '2') {
        // console.log(values.Message)
        values.MemberName = '申请查看'
        values.IsTop = 0
        values.AvatarUrl = '../../../images/shengqing.png'
        // console.log(values.Counts)
        // values.Message = Func.baseFunc.getLong(values.Message)
      }
      // })
    }

    results1.push(...arrs)
    // console.log(results1, 'results1')

    var results2 = this.renderList(results1)
    results2.forEach(item => {
      if (item.MsgTime) {
        item.MsgTime = date.funtime(item.MsgTime)
      }
    })
    // setTimeout(() => {
    // this.setData({
    //   msgList: results2
    // })
    // }, 3000)

    // console.log(results, 'results')
    // })

    // }, 1000)
  }
  // else {
  //   var arr3 = []
  //   arr3.push(...temps)
  //   // this.data.msgList.push(...temps)
  //   this.setData({
  //     msgList: arr3
  //   })
  //   wx.setStorageSync('msgList', arr3)

  //   msg.msg.msgList()
  // }
},
// 处理counts数量
getCounts(value) {
  if (value.NewSeqID) {
    value.Arr.forEach((item, index) => {
      if (item.SeqID == value.NewSeqID) {
        console.log(value, value.NewSeqID, index)
        value.Arr[value.Arr.length - 1].Counts = value.Arr.length - 1 - index
      }
    })
  } else {
    value.Arr.forEach((item, index) => {
      // console.log(item, index)
      if (item.SeqID == value.SeqID) {
        console.log(item, index)
        value.Arr[value.Arr.length - 1].Counts = value.Arr.length - index
      }
    })
  }

  console.log(value)
  return value
},
// 渲染数组
renderList(arr) {
  console.log(arr, 'render数组')
  const list = [];
  arr.sort(function (a, b) {
    console.log(a, b, 'abrender数组')
    //   if (a.IsTop === b.IsTop) {
    //     console.log(a.MsgTime, b.MsgTiFme)
    return b.MsgTime - a.MsgTime //降序
    //   } else {
    //     if (a.IsTop || b.IsTop) {
    //       return b.IsTop - a.IsTop
    //     } else {
    //       return b - a; //升序
    //     }
    //   }
  });
  arr.sort(function (a, b) {
    return b.IsTop - a.IsTop
  });
  console.log(arr, 'arrr')
  return arr;
},
// delMsg删除重复消息
delMsg(arr) {
  arr.sort((a, b) => {
    return b.EndTime - a.EndTime
  }) //升序
  arr.forEach(item => {
    if (item.MsgClassify == '0' && item.MsgType == '0') {}
  })
},
// 查member表，然后获得昵称
async queryMember(value) {
  var id = '38-' + wx.getStorageSync('MemberID')
  if (id == value.Sender) {

    var memberid = this.getMemRegxp(value.Recver)
  } else {

    var memberid = this.getMemRegxp(value.Sender)
  }
  console.log(memberid)
  var params = {
    MemberID: memberid
  }
  let res = await Api.requestApi('lxy_contact/queryMember.action', {
    ...params
  })
  if (JSON.parse(res.data).RowCnt > 0) {

    return JSON.parse(res.data).Records[0]
  } else {
    return false
  }
  // console.log(res)
},
// 查询圈子列表看是否置顶

// 保存之前先查一下圈子列表，假如圈子里没有再添加
async queryMsgCircle(value) {
  // console.log(value, 'vakye')
  var params = {}
  var id = '38-' + wx.getStorageSync('MemberID')
  if (id == value.Sender) {

    params.MemberID = wx.getStorageSync('MemberID')
    params.LinkMemberID = this.getMemRegxp(value.Recver)
  } else {

    params.MemberID = wx.getStorageSync('MemberID')
    params.LinkMemberID = this.getMemRegxp(value.Sender)
  }
  let res = await Api.requestApi('lxy_contact/queryMsgCircle.action', {
    ...params
  })
  // console.log(JSON.parse(res.data).TotalSize, '查询列表圈子')
  if (JSON.parse(res.data).TotalSize >= 1) {
    // 执行修改操作
    var temps = JSON.parse(res.data).Records[0]

    return temps.IsTop
  } else {
    return 0
  }
},
// 分割Memberid
getMemRegxp(value) {
  var value1 = value.split('-')
  if (value1.length == 2) {
    return value1[1]
  }
  if (value1.length == 3) {
    return value1[1] + '-' + value1[2]
  }
},












}

export {
  msgList
};
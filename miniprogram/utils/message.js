var Api = require('../utils/api')
var app = getApp()
var Base64 = require('../utils/b64')
var msgContent = {
  msgList: function () {
    var msgList = wx.getStorageSync('msgList')
    // if(!msgList) return false
    var contentInfo = wx.getStorageSync('content')
    var arr = []
    console.log(contentInfo.length)
    this.getNewsCome()
    var arr1 = [] //给后面的传递一个空数据
    msgList.forEach(item => {

      if (item.SessionID) {
        // this.uniq(msgList, content)
        // 查询所有的数据
        // 1.先去缓存里面找一下有没有这条数据
        if (contentInfo.length) {
          if (item.MsgType == '0' && item.MsgClassify == '0') {
            contentInfo.forEach(value => {
              if (value.SessionID == item.SessionID && value.MsgType == item.MsgType && value.MsgClassfiy == item.MsgClassfiy) {
                // 如果找到了数据，且数据有变化，那么就重新更新数据
                // 1.去重新请求数据，看其SeqID与之前是否一致，假如一致的话，那么说明没有新数据，就不用修改缓存中该数据
                this.getNewData(value)
                // 2.假如来了新数据，就需要将新数据拼接在后面
                // arr.push(value)
              }
            })
          } else {
            contentInfo.forEach(value => {
              if (value.MsgType == item.MsgType && value.MsgClassfiy == item.MsgClassfiy) {
                // 如果找到了数据，且数据有变化，那么就重新更新数据
                var sysMsg = true
                // 1.去重新请求数据，看其SeqID与之前是否一致，假如一致的话，那么说明没有新数据，就不用修改缓存中该数据
                this.getNewData(value, sysMsg)
                // 2.假如来了新数据，就需要将新数据拼接在后面
                // arr.push(value)
              }
            })
          }

        } else {
          // 假如缓存中没有这条数据，去查询所有满足条件的数据
          console.log(item, '----===没有数据')
          this.queryMsgContent(item, arr1)
        }

      }
    })
  },

  uniq(arr1, arr2) {

    var result = [];
    for (var i = 0; i < arr1.length; i++) {
      var isExist = false;
      if (arr1[i].MsgClassify == '0' && arr1[i].MsgType == '0') {
        for (var j = 0; j < arr2.length; j++) {

          if (arr1[i].SessionID == arr2[j].SessionID && arr1[i].MsgClassify == arr2[j].MsgClassify && arr1[i].MsgType == arr2[j].MsgType) {
            isExist = true;
            break;
          }
        }
      } else {
        for (var j = 0; j < arr2.length; j++) {

          if (arr1[i].MsgClassify == arr2[j].MsgClassify && arr1[i].MsgType == arr2[j].MsgType) {
            isExist = true;
            break;
          }
        }
      }

      if (!isExist) {
        result.push(arr1[i]);
      }
    }
    console.log(result);
    return result
  },
  // 当缓存中没有该用户的时候查询所有的消息消息
  async queryMsgContent(para, arr1, come) {
    //value2历史记录
    var that = this
    const params = {}
    var temps = []
    if (para.MsgClassify == '0' && para.MsgType == '0') {

      params.SessionID = para.SessionID
    } else {
      params.Recver = '38-' + wx.getStorageSync('MemberID')
    }
    params.limit = 500
    params.current = 1
    params.MsgClassify = para.MsgClassfiy
    params.MsgType = para.MsgType
    params.orderBy = 'order by tab_message.MsgTime ASC'

    let res = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      ...params
    })
    // }
    // console.log(res.data, '查询回来的数据')
    if (JSON.parse(res.data).RowCnt > 0) {
      // if (Number(JSON.parse(res.data).TotalSize) > Number(JSON.parse(res.data).RowCnt)) {
      //   const values = {}
      //   // params.SessionID = value
      //   values.SessionID = para.SessionID
      //   // values.MsgClassify = 0
      //   values.limit = Number(JSON.parse(res.data).TotalSize) + Number(2)
      //   values.current = 1
      //   // values.MsgType = 0
      //   values.orderBy = "order by tab_message.MsgTime ASC"
      //   let results = await Api.requestApi("lxy_contact/queryMsgContent.action", {
      //     ...values
      //   })
      //   temps = JSON.parse(results.data).Records
      //   console.log(temps, 'value2')
      // } else {

      temps = JSON.parse(res.data).Records
      // }
      console.log(temps)
      var getData = that.getDataRecord(temps, arr1)
      that.setStorage(getData, arr1, come)
      return getData
      // 开始处理数据，将数据处理成为想要的格式，这样子进入页面就会直接变成自己想要的样子

    }
  },


  // 获取新数据
  async getNewData(value, sysMsg) {
    console.log(value, 'getNewData')
    // 开始请求后面的数据
    var arrParams = []
    var arr1 = [] //传递一个空数组
    var that = this
    if (sysMsg) {

      var params1 = {
        SeqID: value.Arr[value.Arr.length - 1].SeqID,
        // SessionID: value.SessionID,
        Recver: '38-' + wx.getStorageSync('MemberID'),
        MsgClassify: value.MsgClassify,
        MsgType: value.MsgType,
        limit: 500,
        current: 1,
      }
    } else {

      var params1 = {
        SeqID: value.Arr[value.Arr.length - 1].SeqID,
        SessionID: value.SessionID,
        MsgClassify: value.MsgClassify,
        MsgType: value.MsgType,
        limit: 500,
        current: 1,
      }
    }

    let res = await Api.requestApi('lxy_contact/queryMsgBack.action', {
      ...params1
    })

    if (JSON.parse(res.data).RowCnt > 0) {
      // if (Number(JSON.parse(res.data).RowCnt) < Number(JSON.parse(res.data).TotalSize)) {
      //   var params2 = {
      //     SeqID: value.SeqID,
      //     SessionID: value.SessionID,
      //     MsgClassify: value.MsgClassify,
      //     MsgType: value.MsgType,
      //     limit: Number(JSON.parse(res.data).TotalSize * 1 + 2),
      //     current: 1,
      //   }
      //   arrParams = await Api.requestApi('lxy_contact/queryMsgBack.action', {
      //     ...params2
      //   })
      //   arrParams = JSON.parse(res.data).Records

      // } else {
      arrParams = JSON.parse(res.data).Records
      // }
      var arr1 = that.getDataRecord(arrParams)
      // 处理完格式之后，开始比较
      console.log(arrParams, arr1, 'arrParams')

      var content = wx.getStorageSync('content')
      var data = []
      var objs = null
      // 处理完数据之后，跟缓存里面的对比一下，假如是同类型的数据，拼接在Arr后面假如不是同类型的数据，重新拼接一次数据
      if (sysMsg) {
        objs = true
      } else {
        objs = false
      }
      for (var i = 0; i < arrParams.length; i++) {
        data = that.compare(arrParams[i], content, objs)
      }

      console.log(data, 'data')

      wx.setStorageSync('content', data)
      // return arr1
    } else {
      return false
      // 就说明没有新数据，可以不用处理
    }



  },
  // 比较拿到的数据与缓存中的数据
  compare(arrParams, content, sysMsg) {
    console.log(arrParams, 'arr')
    var arr1 = []
    if (sysMsg) {

      var str1 = content.some(item => {
        return arrParams.MsgClassify == item.MsgClassify && arrParams.MsgType == item.MsgType
      })
    } else {

      var str1 = content.some(item => {
        return arrParams.SessionID == item.SessionID && arrParams.MsgClassify == item.MsgClassify && arrParams.MsgType == item.MsgType
      })
    }
    if (str1) {
      if (sysMsg) {

        content.forEach(values => {
          if (arrParams.MsgClassify == values.MsgClassify && arrParams.MsgType == values.MsgType) {
            console.log(arrParams, values, 'items')
            // 假如相等的话，那么就push在后面
            // values.SeqID = arrParams.SeqID
            values.Arr.push(arrParams)
          }
        })
      } else {

        content.forEach(values => {
          if (arrParams.SessionID == values.SessionID && arrParams.MsgClassify == values.MsgClassify && arrParams.MsgType == values.MsgType) {
            console.log(arrParams, values, 'items')
            // 假如相等的话，那么就push在后面
            // values.SeqID = arrParams.SeqID
            values.Arr.push(arrParams)
          }
        })
      }
    } else {
      var content = {
        SessionID: arrParams.SessionID,
        SeqID: arrParams.SeqID,
        MsgClassify: arrParams.MsgClassify,
        MsgType: arrParams.MsgType,
        Arr: arrParams
      }
      content.push(content)
    }
    console.log(content)
    return content

  },
  // 处理格式
  getDataRecord(temps, arr1) {
    console.log(temps, '===')
    var memberid = '38-' + wx.getStorageSync('MemberID')
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
        temps[i].Message = Base64.Base64.decode(temps[i].Message)
      }
    }

    return temps

    // return temps
  },
  // 存到缓存中
  setStorage(temps, arr1, come) {
    console.log(temps, '===')
    var content = {
      SessionID: temps[0].SessionID,
      // SeqID: temps[temps.length - 1].SeqID,
      SeqID: temps[0].SeqID,
      MsgClassify: temps[0].MsgClassify,
      MsgType: temps[0].MsgType,
      Arr: temps
    }
    // 如果有缓存的话，那么里面的数据直接拿到
    var content1 = wx.getStorageSync('content')
    arr1.push(content)
    if (come && content1.length) {

      console.log(arr1, 'arrrcoming')
      var content = wx.getStorageSync('content')
      content.push(...arr1)
      wx.setStorageSync('content', content)
    } else {

      wx.setStorageSync('content', arr1)
    }
    // console.log(arr2)
  },
  // 来缓存中没有的新数据
  getNewsCome() {

    var msgList = wx.getStorageSync('msgList')
    var content = wx.getStorageSync('content')
    var arr = []
    var getData = []
    var come = true
    var arr2 = msgList.filter(item => {
      return item.SessionID
    })
    console.log(arr2)
    if (arr2.length > 0) {
      var data = this.uniq(arr2, content)
      if (data.length) {
        for (var i = 0; i < data.length; i++) {

          this.queryMsgContent(data[i], arr, come)
        }
        // data.forEach(items => {

        // })
        console.log(data, getData, 'uniquniquniq')
      }
    }
  }
}
module.exports = {
  msg: msgContent
}

// 卸载页面
var app = getApp()
function onclosePage(value) {
  var arr1 = wx.getStorageSync('content')
  var value1 = app.globalData.self
  var allContentList = value
  console.log(allContentList, 'allcontentlist')
  if (allContentList.length > 0) {
    var contents = allContentList[0]
    var value1 = contents
  }
  arr1.forEach(item => {
    if (item.MsgType == '2' && item.MsgClassify == '0' && value1.MsgType == item.MsgType && value1.MsgClassify == item.MsgClassify) {
      console.log(item, value1)
      item.NewSeqID = value1.SeqID
      // item.Arr = this.data.allContentList
      item.SeqID = value1.SeqID
    }
    if (item.MsgType == '2'  && value1.MsgType == item.MsgType && value1.MsgClassify == item.MsgClassify) {
      console.log(item, value1)
      item.NewSeqID = value1.SeqID
      // item.Arr = this.data.allContentList
      item.SeqID = value1.SeqID
    }
    if (item.MsgType == '3' && item.MsgClassify == '0'  && value1.MsgType == item.MsgType && value1.MsgClassify == item.MsgClassify) {
      console.log(item, value1)
      item.NewSeqID = value1.SeqID
      // item.Arr = this.data.allContentList
      item.SeqID = value1.SeqID
    }
    if (item.MsgType == '4' && item.MsgClassify == '0'  && value1.MsgType == item.MsgType && value1.MsgClassify == item.MsgClassify) {
      console.log(item, value1)
      item.NewSeqID = value1.SeqID
      // item.Arr = this.data.allContentList
      item.SeqID = value1.SeqID
    }
    if (item.MsgType == '7' && item.MsgClassify == '0'  && value1.MsgType == item.MsgType && value1.MsgClassify == item.MsgClassify) {
      console.log(item, value1)
      item.NewSeqID = value1.SeqID
      // item.Arr = this.data.allContentList
      item.SeqID = value1.SeqID
    }
  })
  console.log(arr1, 'arr2')
  wx.setStorageSync('content', arr1)
}
module.exports = {
  onclosePage
}

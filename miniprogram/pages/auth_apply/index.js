// pages/auth_apply/index.js
import {
  promisePost
} from "../../utils/http";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: []   
  },
  pureData:{
     currentPage: 1,
    isBottom: false,
    isRefresh: false
  },
  formatTime(date) {
    const d = new Date(date.substr(0, 4) +
      "-" +
      date.substr(4, 2) +
      "-" +
      date.substr(6, 2) +
      " " +
      date.substr(8, 2) +
      ":" +
      date.substr(10, 2) +
      ":" +
      date.substr(12, 2))
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.floor(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.floor(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 30) {
      return Math.floor(diff / 3600 / 24) + '天前'
    } else {
      return '30天前'
    }
  },
  formatAge(date) {
    if (date) {
      const year = date.substr(0, 4)
      const now = new Date().getFullYear()
      return (now - year)
    } else {
      return '-'
    }

  },
  async queryWxAuthorizationApply() {
    let res = await promisePost("lxy_contact/queryAuthApplyDetail.action", {
      BusinessID: getApp().globalData.BusinessID,
      limit: 10,
      current: 1
    })
    if (res.success) {
      const {
        Records,
        RowCnt
      } = JSON.parse(res.data)
      this.setData({
        applyList: Records.map(e => ({
          ...e,
          beforeTime: this.formatTime(e.CreateTime),
          age: this.formatAge(e.Birth)
        }))
      })
      this.pureData.isBottom = (RowCnt < 10)
      this.pureData.currentPage = 1
    }

  },
  //发送申请结束消息
  sendMsg(data) {
    console.log(data)
    const baseParams = {
      MsgClassify: 2,
      MsgType: 4,
      // ContentType: 0,
      // Sender: '38-' + data.BusinessID,
      Sender:'38',    
      Recver: '38-' + data.MemberID,
      Extend:`BusinessID=${data.BusinessID}`
    }

    // 申请通过
    if (data.ApplyStatus === 1) {
      promisePost('lxy_contact/sendIMReq.action', {
        ...baseParams,
        Message: `恭喜您，邀请码已申请成功，快去邀请靠谱朋友加入吧！`,
        ContentType: 1
      })
    } else { // 申请不通过
      promisePost(
        'lxy_contact/sendIMReq.action', {
          ...baseParams,
          Message: `非常遗憾，您的邀请码申请被拒绝了。请您保持优质的社交状态，再重新申请。`,
          ContentType: 2
        }
      )
    }
  },
  //
  addAuthorization(data) {
    promisePost(
      "lxy_contact/AddAuthorization.action",
      data
    );
  },
  // 同意
  async agree(e) {
    console.log(e, '点击同意')
    const {
      BusinessID,
      MemberID,
      MemberName
    } = e.currentTarget.dataset.item
    wx.showModal({
      content: `是否同意[${MemberName}]的邀请码申请？`,
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success: async (res) => {
        if (res.confirm) {
          // wx.showToast({
          //   title: '操作中',
          //   icon:'loading'
          // })
          let res = await promisePost("lxy_contact/updateAuthorizationApply.action", {
            ID: e.currentTarget.dataset.id,
            ApplyStatus: 1
          })
          if (res.success) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            this.sendMsg({
              BusinessID,
              MemberID,
              ApplyStatus: 1
            })
            this.addAuthorization({
              BusinessID,
              MemberID
            })
            this.queryWxAuthorizationApply()
          } else {
            wx.showToast({
              title: '网络波动',
              icon: 'fail',
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 拒绝
  async refuse(e) {
    const {
      BusinessID,
      MemberID,
      MemberName
    } = e.currentTarget.dataset.item
    wx.showModal({
      content: `是否拒绝[${MemberName}]的邀请码申请？`,
      confirmColor: '#FF0055',
      cancelColor: '#AAAAAA',
      success: async (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          let res = await promisePost("lxy_contact/updateAuthorizationApply.action", {
            ID: e.currentTarget.dataset.id,
            ApplyStatus: 2
          })

          if (res.success) {

            this.sendMsg({
              BusinessID,
              MemberID,
              ApplyStatus: 2
            })
            this.queryWxAuthorizationApply()
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.showToast({
              title: '网络波动',
              icon: 'fail',
              duration: 2000
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryWxAuthorizationApply()
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
  onPullDownRefresh: async function () {
    if (this.pureData.isRefresh) {
      return
    } else {
      this.pureData.isRefresh = true
      await this.queryWxAuthorizationApply()
      this.pureData.isRefresh = false
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    if (this.pureData.isBottom) {
      wx.showToast({
        title: '已经到底了~',
        icon: 'none'
      })
    } else {
      this.pureData.currentPage = this.pureData.currentPage + 1

      let res = await promisePost("lxy_contact/queryAuthApplyDetail.action", {
        BusinessID: getApp().globalData.BusinessID,
        limit: 10,
        current: this.pureData.currentPage
      })
      if (res.success) {
        const {
          Records,
          RowCnt
        } = JSON.parse(res.data)
        const newPart = Records.map(e => ({
          ...e,
          beforeTime: this.formatTime(e.CreateTime),
          age: this.formatAge(e.Birth)
        }))
        this.pureData.isBottom = (RowCnt < 10)
        this.setData({
          applyList: this.data.applyList.concat(newPart),

        })
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
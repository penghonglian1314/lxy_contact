var Api = require("../../../utils/api")

var Base64 = require("../../../utils/b64.js")

// pages/firstpage/remarkOn/index.js
Page({

  /**
   * 页面的初始数据
   */
   data: {
    photodata:['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3385472845,2539383542&fm=11&gp=0.jpg'],
    scrollTop:0,
    mineData:{
      MemberName:'',
        Desctet:'',
        Likes:'',
        Comments:'',
        AvatarUrl: '',
        PicUrls: []
    },
    imageData:['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3385472845,2539383542&fm=11&gp=0.jpg','https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3385472845,2539383542&fm=11&gp=0.jpg','https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3385472845,2539383542&fm=11&gp=0.jpg'],
    //评论数据
    comment_list: [
      // {
      //   comment_id: 1, //评论id
      //   comment_pr_id: 1, //评论文章所属id
      //   comment_user_avatar: '../../../images/touxiang.jpg', //评论用户头像(路径替换为你的图片路径)
      //   comment_user_name: '高飞', //评论人昵称
      //   comment_text: '千呼万唤始出来,犹抱琵琶半遮面', //评论内容
      //   comment_time: '2021年8月18日', //评论时间
      //   reply_id: 0, //回复谁的评论，默认为0
      //   parent_id: 0, //评论所属评论id，默认为0
      //   reply_name: '' //回复评论用户的昵称 默认为''
      // },
      // {
      //   comment_id: 2,
      //   comment_pr_id: 1,
      //   comment_user_avatar: '../../../images/touxiang.jpg',
      //   comment_user_name: '张维默',
      //   comment_text: '千呼万唤始出来,犹抱琵琶半遮面',
      //   comment_time: '2021年8月18日',
      //   reply_id: 0,
      //   parent_id: 0,
      //   reply_name: ''
      // },
      // {
      //   comment_id: 3,
      //   comment_pr_id: 1,
      //   comment_user_avatar: '../../../images/touxiang.jpg',
      //   comment_user_name: '张剑锋',
      //   comment_text: '千呼万唤始出来,犹抱琵琶半遮面',
      //   comment_time: '2021年8月18日',
      //   reply_id: 0,
      //   parent_id: 0,
      //   reply_name: ''
      // }
    ],
    
    //回复数据
    comment_list2: [
      {
        comment_id: 4,
        comment_pr_id: 1,
        comment_user_name: '张剑锋',
        comment_user_avatar: '../../../images/touxiang.jpg',
        comment_text: "千呼万唤始出来,犹抱琵琶半遮面",
        comment_time: '2021年8月18日',
        reply_id: 3,
        parent_id: 3,
        reply_name: ''
      },
      {
        comment_id: 5,
        comment_pr_id: 1,
        comment_user_name: '沈非隆',
        comment_user_avatar: '../../../images/touxiang.jpg',
        comment_text: "千呼万唤始出来,犹抱琵琶半遮面",
        comment_time: '2021年8月18日',
        reply_id: 3,
        parent_id: 3,
        reply_name: '张剑锋'
      }
    ],

    /*定义一些数据*/
    focus: false, //输入框是否聚焦
    placeholder: '说点什么吧...', //底部输入框占字符
    // placeholder2: '说点什么，让ta也认识看笔记的你', //顶部输入框占字符
    // value: null, //顶部输入框内容
    comment_text: null, //底部评论框内容

    /*
     *以下初始化数据是用户点击任意一条评论或回复时需要设置的数据
     *然后将设置好的数据传递给评论时新创建的评论数据对象
    */
    now_reply_name: null, //当前点击的评论或回复评论的用户昵称
    now_reply_type: 0, //当前回复类型 默认为0 1为回复评论 2为回复回复
    now_parent_id: 0, //当前点击的评论或回复评论的所属评论id
    now_reply: 0, //当前点击的评论或回复评论的id

    //模拟用户信息
    userinfo: {
      nickName: '马飞', //用户昵称
      avatarUrl: '../../../images/Member001.jpg' //用户头像
    },

    com: '',
    current: 1,
    limit: 10,
    total: 0,
    con1: '',
    con2: '',
    con3: '',
  },

  //点击用户评论或回复时触发
  replyComment(e) {
    var cid = e.currentTarget.dataset.cid; //当前点击的评论id
    var name = e.currentTarget.dataset.name; //当前点击的评论昵称
    var pid = e.currentTarget.dataset.pid; //当前点击的评论所属评论id
    var type = e.currentTarget.dataset.type; //当前回复类型
    this.setData({
        focus: true, //输入框获取焦点
        placeholder: '回复' + name + '：', //更改底部输入框占字符
        now_reply: cid, //当前点击的评论或回复评论id
        now_reply_name: name, //当前点击的评论或回复评论的用户名
        now_parent_id: pid, //当前点击的评论或回复评论所属id
        now_reply_type: type, //获取类型(1回复评论/2回复-回复评论)
    })
  },

  //底部输入框提交内容时触发
  confirm(e){
    //获取输入框输入的内容
    var comment_text = e.detail.value;
    //判断用户是否输入内容为空
    if (comment_text == '') {
      //用户评论输入内容为空时弹出
      wx.showToast({
       title: '请输入内容', //提示内容
       icon: 'none' //提示图标
     })
    } else {
        var date = new Date(); //创建时间对象
        var year = date.getFullYear(); //获取年      
        var month = date.getMonth() + 1; //获取月      
        var day = date.getDate(); //获取日      
        var hour = date.getHours(); //获取时      
        var minute = date.getMinutes(); //获取分      
        var second = date.getSeconds(); //获取秒      
        var time = `${year}年${month}月${day}日${hour}时${minute}分${second}秒`; //当前时间
        // var time = `${month}-${day}`
        var comment_list = this.data.comment_list; //获评论数据
        var comment_list2 = this.data.comment_list2; //获取回复数据
        var comment_list_length = comment_list.length; //获取当前评论数组的长度
        var last_id = comment_list[comment_list_length - 1].comment_id; //获取最后一个评论的id
        var comment_list2_length = comment_list2.length; //获取回复数组的长度
        var last_id2 = comment_list2[comment_list2_length - 1].comment_id; //获取最后回复的id
        var new_id = last_id > last_id2 ? last_id + 1 : last_id2 + 1; //当前将要发表的评论的id
        var userinfo = this.data.userinfo; //获取当前的用户信息      
        var comment_user_name = userinfo.nickName //用户昵称      
        var comment_user_avatar = userinfo.avatarUrl //用户头像
        var reply_name = null; //回复评论用户的昵称
        var parent_id = 0; //评论所属哪个评论的id
        var reply_id = this.data.now_reply; //回复谁的评论id
        //通过回复谁的评论id判断现在是评论还是回复
        if(reply_id != 0) {
          //现在是回复
          var reply_type = this.data.now_reply_type; //回复类型
          //通过回复类型判断是回复评论还是回复回复
          if (reply_type == 1) {
            //回复评论
            parent_id = this.data.now_reply; //回复评论所属评论id
            reply_name = this.data.now_reply_name; //回复评论用户昵称
          } else {
            //回复回复
            parent_id = this.data.now_parent_id; //回复评论所属评论id
            reply_name = this.data.now_reply_name; //回复评论用户昵称
          }
        } else {
          //现在是评论
        }
        var comment_detail = {} //评论/回复对象
        comment_detail.comment_id = new_id; //评论Id      
        comment_detail.comment_user_name = comment_user_name; //用户昵称      
        comment_detail.comment_user_avatar = comment_user_avatar; //用户头像      
        comment_detail.comment_text = comment_text; //评论内容      
        comment_detail.comment_time = time; //评论时间      
        comment_detail.reply_id = reply_id; //回复谁的评论的id      
        comment_detail.parent_id = parent_id; //评论所属哪个评论id      
        comment_detail.reply_name = reply_name; //回复评论人的昵称
        //判断parent_id是否为0 为0就是评论 不为0就是回复
        if(comment_detail.parent_id > 0) {
          //回复
          comment_list2.unshift(comment_detail);
        } else {
          //评论
          comment_list.unshift(comment_detail);
        }
        //动态渲染
        this.setData({
          //发表评论后将以下数据初始化 为下次发表评论做准备
          comment_text: null, //评论内容        
          now_reply: 0, //当前点击的评论id        
          now_reply_name: null, //当前点击的评论的用户昵称        
          now_reply_type: 0, //评论类型        
          now_parent_id: 0, //当前点击的评论所属哪个评论id        
          placeholder: "说点什么...", //输入框占字符
          //将加入新数据的数组渲染到页面        
          comment_list, //评论列表        
          comment_list2 //回复列表
        })
      }
  },
  //下面的方法可以绑定在输入框的bindblur属性上	
  blur(e) {
    const text = e.detail.value.trim();
    if( text == ''){
      this.setData({
        now_reply: 0, //当前点击的评论或回复评论的id        
        now_reply_name:null, //当前点击的评论或回复评论的用户昵称        
        now_reply_type:0, //当前回复类型        
        now_parent_id:0, //当前点击的评论或回复评论的所属评论id        
        placeholder: "说点什么吧...", //占字符        
        focus:false //输入框获取焦点
      })
    }
  },
    //获取输入框内容
  getCommentText(e) {
    var val = e.detail.value;
    this.setData({
      comment_text: val
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this

    console.log(options)

    Api.querydynamic('lxy_contact/queryDynamic.action',{
      DynamicID: options.con,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records[0])
      
      that.data.mineData=JSON.parse(res.data).Records[0]

      that.data.mineData.id = Math.random().toString(36).substr(2).replace(/[0-9]/g,'')

      that.data.mineData.Desctet=Base64.Base64.decode(that.data.mineData.Desctet)

      that.data.mineData.PicUrls=that.data.mineData.PicUrls.split(',')

      that.data.mineData.UrlList=that.data.mineData.UrlList.split(',')

      that.data.mineData.UrlList1=that.data.mineData.UrlList1.split(',')

      that.data.mineData.Likes=Number(that.data.mineData.Likes)

      that.data.mineData.Comments=Number(that.data.mineData.Comments)

      that.data.mineData.Birth=that.age_Conversion(that.data.mineData.Birth)
      that.data.mineData.CreateTime=that.funtime(that.data.mineData.CreateTime)

      console.log(that.data.mineData)

      if(wx.getStorageSync('MemberID')){
        for(var i=0;i<that.data.mineData.UrlList1.length;i++){
          if(that.data.mineData.UrlList1[i]==wx.getStorageSync('MemberID')){
            that.data.mineData.ydz='0'
          }
        }
        
      }

      // Api.queryLikes('lxy_contact/queryLikes.action',{
      //   RelationID: options.con,
      //   BusinessID: getApp().globalData.BusinessID
      // }).then(ress=>{
      //   that.data.mineData.pl=''

      //   console.log(JSON.parse(ress.data).Records)

      //   for(var j=0;j<JSON.parse(ress.data).Records.length;j++){
      //     if(that.data.mineData.pl==''){
      //       that.data.mineData.pl=JSON.parse(ress.data).Records[j].AvatarUrl
      //     }else{
      //       that.data.mineData.pl=that.data.mineData.pl+','+JSON.parse(ress.data).Records[j].AvatarUrl
      //     }

      //     if(wx.getStorageSync('MemberID')){
      //       if(JSON.parse(ress.data).Records[j].MemberID==wx.getStorageSync('MemberID')){
      //         that.data.mineData.ydz='0'
      //       }
      //     }
      //   }

      //   console.log(that.data.mineData.pl)

      //   that.data.mineData.pl=that.data.mineData.pl.split(',')
      // })

      console.log(that.data.mineData)

      Api.queryComment('lxy_contact/queryComment.action',{
        current: this.data.current,
        limit: this.data.limit,
        total: this.data.total,
        RelationID: options.con,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(JSON.parse(res.data).Records)

        var con=JSON.parse(res.data).Records

        for(var i=0;i<con.length;i++){
          con[i].CreateTime=that.funtime(con[i].CreateTime)

          if(that.data.mineData.MemberID==con[i].MemberID){
            con[i].res=0
          }
        }

        if(!con){
          return false
        }

        console.log(con)

        that.setData({
          comment_list: con
        })
      })

      // for(var i=0;i<that.data.mineData.length;i++){
      //   that.data.mineData[i].PicUrls=that.data.mineData[i].PicUrls.split(',')

      //   that.data.mineData[i].Likes=Number(that.data.mineData[i].Likes)
      // }

      setTimeout(function(){
        that.setData({
          mineData: that.data.mineData
        })
      },500)
    })

    // Api.addRecord('lxy_contact/addRecord.action',{
    //   MemberID: wx.getStorageSync('MemberID'),
    //   DynamicID: options.con,
    //   BusinessID: getApp().globalData.BusinessID
    // })
  },

  funtime(time) {
      var now = new Date().getTime();
    console.log(now)
     //var time1=new Date(time);
      // 下面两种转换格式都可以。
       //var tmpTime = Date.parse(time.replace(/-/gi, "/"));
     //var tmpTime=time1.getTime();
     var starttime = time.substring(0,4)+'/'+time.substring(4,6)+'/'+time.substring(6,8)+'/'+time.substring(8,10)+':'+time.substring(10,12)+':'+time.substring(12,14)
     console.log(starttime)
        var tmpTime = (new Date(starttime)).getTime();
        console.log(tmpTime)
      // 
      var result;
      // 一分钟 1000 毫秒 乘以 60
      var minute = 1000 * 60 ;
      var hour = minute * 60;
      var day = hour * 24;
      var week = day * 7;
      var month = day * 30;
      var year = day * 365;
      // 现在时间 减去 传入时间 得到差距时间
      var diffValue = now - tmpTime;
      // 小于 0 直接返回
      if (diffValue < 0) {
        return;
    
      }
      // 计算 差距时间除以 指定时间段的毫秒数
      var yearC = diffValue / year;
      var monthC = diffValue / month;
      var weekC = diffValue / week;
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      if (yearC >= 1) {
        console.log("年前");
        result = "" + parseInt(yearC) + "月前";
      } else if (monthC >= 1) {
        console.log(parseInt(monthC) + "月前")
        result = "" + parseInt(monthC) + "月前";
      } else if (weekC >= 1) {
        console.log(parseInt(weekC) + "周前")
        result = "" + parseInt(weekC) + "周前";
      } else if (dayC >= 1) {
        console.log(parseInt(dayC) + "天前")
        result = "" + parseInt(dayC) + "天前";
      } else if (hourC >= 1) {
        console.log(parseInt(hourC) + "小时前")
        result = "" + (parseInt(hourC)) + "小时前";
        //result = { time: parseInt(hourC), dw: '时' }
    
      } else if (minC >= 1) {
        console.log(parseInt(minC) + "分钟前")
        //result = {time: parseInt(minC),dw:'分'}
        // result = "" + parseInt(minC) + "分钟前";
     result = "刚刚";
      } else {
        result = "刚刚";
      }
      return result;
    },

  ydianzan(e){
    console.log(e.currentTarget.dataset)
    console.log(wx.getStorageSync('MemberID'))
    
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    Api.queryLikes('lxy_contact/queryLikes.action',{
      MemberID: wx.getStorageSync('MemberID'),
      RelationID: e.currentTarget.dataset.index,
      LikeClass: 0,
      LikeType: 0,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      if(JSON.parse(res.data).Records){
        Api.deleteTabMemberLike('lxy_contact/deleteTabMemberLike.action',{
          LikeID: JSON.parse(res.data).Records[0].LikeID,
          MemberID: wx.getStorageSync('MemberID'),
          RelationID: e.currentTarget.dataset.index,
          LikeClass: 0,
          LikeType: 0,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          this.data.mineData.ydz=''

          this.data.mineData.Likes-=1
          if(this.data.mineData.UrlList[0]==''){
            this.data.mineData.UrlList1[0]=wx.getStorageSync('avatarUrl')
          }else{
            var con=this.data.mineData.UrlList1
            for(var i=0;i<con.length;i++){
              if(con[i]==wx.getStorageSync('MemberID')){
                con.splice(i,1)
                this.data.mineData.UrlList.splice(i,1)
              }
            }
          }
          

          this.setData({
            mineData: this.data.mineData
          })
          
          console.log(this.data.mineData)

          // Api.sendIMReq('lxy_contact/sendIMReq.action',{
          //   MsgClassify: 0,
          //   Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
          //   Recver: getApp().globalData.EntCode+'-'+e.currentTarget.dataset.item,
          //   Message: JSON.parse(res.data).LikeID,
          //   MsgType: 3,
          //   ContentType: 0,
          //   BusinessID: getApp().globalData.BusinessID
          // }).then(res=>{
          //   console.log(res)
          // })
        })
      }
    })
  },

  preview(event){
    console.log(event)
    let currentUrl = event.currentTarget.dataset.src
    console.log(currentUrl)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.index // 需要预览的图片http链接列表
    })
    this.setData({
      isdelete: false
    })
  },

  dianzan(e){
    console.log(e.currentTarget.dataset)
    console.log(wx.getStorageSync('MemberID'))
    
    if(!wx.getStorageSync('MemberID')){
      wx.showModal({
        title: '请先在 我的 授权登录',
        confirmColor: '#FF0055',
        cancelColor: '#AAAAAA',
      })
      
      return false
    }

    Api.queryLikes('lxy_contact/queryLikes.action',{
      MemberID: wx.getStorageSync('MemberID'),
      RelationID: e.currentTarget.dataset.index,
      LikeClass: 0,
      LikeType: 0,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      if(!JSON.parse(res.data).Records){
        Api.addLikes('lxy_contact/addLikes.action',{
          MemberID: wx.getStorageSync('MemberID'),
          RelationID: e.currentTarget.dataset.index,
          LikeClass: 0,
          LikeType: 0,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          this.data.mineData.ydz='0'

          this.data.mineData.Likes+=1
          if(this.data.mineData.UrlList[0]==''){
            this.data.mineData.UrlList[0]=wx.getStorageSync('avatarUrl')
            this.data.mineData.UrlList1[0]=wx.getStorageSync('MemberID')
          }else{
            this.data.mineData.UrlList.push(wx.getStorageSync('avatarUrl'))
            this.data.mineData.UrlList1.push(wx.getStorageSync('MemberID'))
          }
          

          this.setData({
            mineData: this.data.mineData
          })
          
          console.log(this.data.mineData)

          var con={
            LikeID: JSON.parse(res.data).LikeID,
            ContentType: 0,
            Content: wx.getStorageSync('MemberID')+'点赞了你的动态'
          }

          Api.sendIMReq('lxy_contact/sendIMReq.action',{
            MsgClassify: 0,
            Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
            Recver: getApp().globalData.EntCode+'-'+e.currentTarget.dataset.item,
            Message: JSON.stringify(con),
            MsgType: 3,
            ContentType: 0,
            BusinessID: getApp().globalData.BusinessID
          }).then(res=>{
            console.log(res)
          })
        })
      }
    })
  },

  onHandleTextSync(e){
    console.log(e.detail.value)

    this.data.com=e.detail.value
  },

  but(e){
    var that=this

    console.log(this.data.com)

    Api.addLikes('lxy_contact/addLikes.action',{
      BusinessID: getApp().globalData.BusinessID,
      MemberID: wx.getStorageSync('MemberID'),
      LikeClass: 2,
      LikeType: 0,
      // CommentType: 0,
      Comment: this.data.com,
      RelationID: this.data.mineData.DynamicID,
      // BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(res)

      console.log(that.data.comment_list)

      that.data.comment_list.push({
        AvatarUrl: wx.getStorageSync('avatarUrl'),
        MemberName: wx.getStorageSync('nickName'),
        Comment: that.data.com
      })

      that.data.mineData.Comments+=1

      var con={
        LikeID: JSON.parse(res.data).LikeID,
        ContentType: 5,
        Content: wx.getStorageSync('nickName')+'评论了你的动态',
        Dynamic: this.data.mineData.DynamicID,
        Comment: that.data.com
      }

      Api.sendIMReq('lxy_contact/sendIMReq.action',{
        MsgClassify: 0,
        Sender: getApp().globalData.EntCode+'-'+wx.getStorageSync('MemberID'),
        Recver: getApp().globalData.EntCode+'-'+e.currentTarget.dataset.item,
        Message: JSON.stringify(con),
        MsgType: 3,
        ContentType: 5,
        BusinessID: getApp().globalData.EntCode,
        MsgAgree: JSON.parse(res.data).CommentID,
        InterActID: JSON.parse(res.data).CommentID,
        BusinessID: getApp().globalData.BusinessID
      }).then(res=>{
        console.log(res)

        wx.showToast({
          title: '评论成功',
          icon: 'success'
        });
      })

      // console.log(that.data.RelationID)

      // that.data.con[Number(that.data.RelationID)-1].Comments+=1

      that.setData({
        com: '',
        mineData: that.data.mineData,
        comment_list: that.data.comment_list
      })
    })
  },

  age_Conversion(date) {
    console.log(date)
    // debugger
    var age = '';
    //var str = date.replace(/-|-/g, "-").replace(/-/g, "");
    var r = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return '--';
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
      var Y = new Date().getFullYear();
      age = (Y - r[1]);
      return age;
    }else{
      return '时间格式错误';
    }
  },

  funtime(time) {
      var now = new Date().getTime();
     //var time1=new Date(time);
      // 下面两种转换格式都可以。
       //var tmpTime = Date.parse(time.replace(/-/gi, "/"));
     //var tmpTime=time1.getTime();
     var starttime = time.substring(0,4)+'/'+time.substring(4,6)+'/'+time.substring(6,8)+'/'+time.substring(8,10)+':'+time.substring(10,12)+':'+time.substring(12,14)
     console.log(starttime)
        var tmpTime = (new Date(starttime)).getTime();
      // 
      var result;
      // 一分钟 1000 毫秒 乘以 60
      var minute = 1000 * 60 ;
      var hour = minute * 60;
      var day = hour * 24;
      var week = day * 7;
      var month = day * 30;
      var year = day * 365;
      // 现在时间 减去 传入时间 得到差距时间
      var diffValue = now - tmpTime;
      // 小于 0 直接返回
      if (diffValue < 0) {
        return;
    
      }
      // 计算 差距时间除以 指定时间段的毫秒数
      var yearC = diffValue / year;
      var monthC = diffValue / month;
      var weekC = diffValue / week;
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      if (yearC >= 1) {
        console.log("年前");
        result = "" + parseInt(yearC) + "月前";
      } else if (monthC >= 1) {
        console.log(parseInt(monthC) + "月前")
        result = "" + parseInt(monthC) + "月前";
      } else if (weekC >= 1) {
        console.log(parseInt(weekC) + "周前")
        result = "" + parseInt(weekC) + "周前";
      } else if (dayC >= 1) {
        console.log(parseInt(dayC) + "天前")
        result = "" + parseInt(dayC) + "天前";
      } else if (hourC >= 1) {
        console.log(parseInt(hourC) + "小时前")
        result = "" + (parseInt(hourC)) + "小时前";
        //result = { time: parseInt(hourC), dw: '时' }
    
      } else if (minC >= 1) {
        console.log(parseInt(minC) + "分钟前")
        //result = {time: parseInt(minC),dw:'分'}
        // result = "" + parseInt(minC) + "分钟前";
     result = "刚刚";
      } else {
        result = "刚刚";
      }
      return result;
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
    var that=this

    setTimeout(function(){
      that.popover = that.selectComponent('#popover');
    },2000)

    this.popover = this.selectComponent('#popover');

    this.popover = this.selectComponent('#popover');
    
    console.log(this.popover)
  },

  onTap: function (e) {
    console.log(e)

    this.data.con1=e.currentTarget.dataset.index
    this.data.con2=e.currentTarget.dataset.item
    this.data.con3=e.currentTarget.dataset.index1

    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().select('#' + e.target.id).boundingClientRect(res => {
      console.log(res)
      this.popover.onDisplay(res);
      console.log('1')
      this.Grilpopover.onDisplay(res);
      console.log('2')
      this.manpopover.onDisplay(res);
      console.log('3')
      
    }).exec();
  },

  lik(e){
    console.log(e.currentTarget.dataset)

    Api.queryCircle('lxy_contact/queryCircle.action',{
      MemberID: wx.getStorageSync('MemberID'),
      LinkMemberID: this.data.con1,
      // LikeType: 2,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      
      if(JSON.parse(res.data).Records){
        Api.updateCircle('lxy_contact/updateCircle.action',{
          CircleID: JSON.parse(res.data).Records[0].CircleID,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        })
      }else{
        Api.queryCircle('lxy_contact/queryCircle.action',{
          MemberID: wx.getStorageSync('MemberID'),
          LinkMemberID: this.data.con1,
          LikeType: 1,
          BusinessID: getApp().globalData.BusinessID
        }).then(res=>{
          console.log(res)

          if(!JSON.parse(res.data).Records){
            Api.addCircle('lxy_contact/addCircle.action',{
              MemberID: wx.getStorageSync('MemberID'),
              LinkMemberID: this.data.con1,
              LikeType: 1,
              MemRemarks: wx.getStorageSync('nickName'),
              LinkRemarks: this.data.con2,
              BusinessID: getApp().globalData.BusinessID
            }).then(res=>{
              console.log(res)
            })
          }
        })
      }
    })
      this.selectComponent('#show').show({
        Icon: '../../../images/xh.png',
        Text: '已加入喜欢'
      })
      this.popover.onHide();
  },

  blacklist(e){
    console.log(this.data.con3)
    this.data.con3.con=1
    wx.navigateTo({
      url: '../../report/index?con='+JSON.stringify(this.data.con3),
    })
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();

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
    this.data.current+=1

    var that=this

    Api.queryComment('lxy_contact/queryComment.action',{
      current: this.data.current,
      limit: this.data.limit,
      total: this.data.total,
      RelationID: this.data.mineData.DynamicID,
      BusinessID: getApp().globalData.BusinessID
    }).then(res=>{
      console.log(JSON.parse(res.data).Records)
      
      for(var i=0;i<JSON.parse(res.data).Records.length;i++){
        that.data.comment_list.push(JSON.parse(res.data).Records[i])

        that.data.comment_list[i].CreateTime=that.funtime(that.data.comment_list[i].CreateTime)
      }

      that.setData({
        comment_list: that.data.comment_list
      })

      console.log(that.data.comment_list)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
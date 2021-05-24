function formatNumber(n) {
  const s = n.toString();
  return s[1] ? s : "0" + s;
}

function getWeek(date) {
  var week = date.getDay();
  var arr = ["日", "一", "二", "三", "四", "五", "六"];
  return "星期" + arr[week];
}

function funtime(time) {
    var now = new Date().getTime();
  console.log(now, time)
   //var time1=new Date(time);
    // 下面两种转换格式都可以。
     //var tmpTime = Date.parse(time.replace(/-/gi, "/"));
   //var tmpTime=time1.getTime();
  //  var starttime = time.substring(0,4)+'/'+time.substring(4,6)+'/'+time.substring(6,8)+'/'+time.substring(8,10)+':'+time.substring(10,12)+':'+time.substring(12,14)
  //  console.log(starttime)
  var times = Number(time + '000')
      var tmpTime = (new Date(times)).getTime();
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
  //     console.log("年前");
      result = "" + parseInt(yearC) + "月前";
    } else if (monthC >= 1) {
  //     console.log(parseInt(monthC) + "月前")
      result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
  //     console.log(parseInt(weekC) + "周前")
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
  //     console.log(parseInt(dayC) + "天前")
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
  //     console.log(parseInt(hourC) + "小时前")
      result = "" + (parseInt(hourC)) + "小时前";
      //result = { time: parseInt(hourC), dw: '时' }
  
    } else if (minC >= 1) {
  //     console.log(parseInt(minC) + "分钟前")
      //result = {time: parseInt(minC),dw:'分'}
      // result = "" + parseInt(minC) + "分钟前";
   result = "刚刚";
    } else {
      result = "刚刚";
    }
    return result;
  }

function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = formatNumber(tMonth + 1);
  tDate = formatNumber(tDate);
  return tYear + "-" + tMonth + "-" + tDate + " (" + getWeek(today) + ")";
}

export const getSevenDays = () => {
  return [
    getDay(0),
    getDay(1),
    getDay(2),
    getDay(3),
    getDay(4),
    getDay(5),
    getDay(6),
  ];
};

export const formatCountDown = (times) => {
  if (times > 0) {
    var days = times / (3600 * 24) > 0 ? times / (3600 * 24) : 0;
    var hours = (times % (3600 * 24)) / 3600;
    var minutes = (times % 3600) / 60;
    var seconds = (times % 3600) % 60;
    var countDown =
      days > 0 ?
      formatNumber(Math.floor(days)) +
      "天 " +
      formatNumber(Math.floor(hours)) +
      ":" +
      formatNumber(Math.floor(minutes)) +
      ":" +
      formatNumber(Math.floor(seconds)) :
      formatNumber(Math.floor(hours)) +
      ":" +
      formatNumber(Math.floor(minutes)) +
      ":" +
      formatNumber(Math.floor(seconds));
    return countDown;
  } else {
    return "00:00:00";
  }
};

export const formatMonthDayHanFromStr = (str) => {
  const date = str.substring(0, 12);
  const dateArr = date.split("-");
  const month = dateArr[1];
  const day = dateArr[2];
  return month + "月" + day + "日";
};

export const formatDate = (val) => {
  if (!val) {
    return;
  }
  let date = new Date(val);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join("-");
};

export const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " + [hour, minute, second].map(formatNumber).join(":")
  );
};

// export const timeDatas = (date) => {
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const hour = date.getHours();
//   const minute = date.getMinutes();
//   const second = date.getSeconds();

//   return year + month + day + hour + minute + second
// };
// export default {
const timeDatas = (date) => {
  console.log(date.getHours(), 'date')
  const year = date.getFullYear();
  const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + '' + (date.getMonth() + 1);
  const day = date.getDate() >= 10 ? date.getDate() : '0' + '' + date.getDate();
  const hour = date.getHours() >= 10 ? date.getHours() : '0' + '' + date.getHours();
  const minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + '' + date.getMinutes();
  const second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + '' + date.getSeconds();
  // console.log(year, month)
  return year + '' + month + '' + day + '' + hour + '' + minute + '' + second
};

const time = (date) => {
  console.log(date, '===')
  var year = date.substr(0, 4)
  var month = date.substr(4, 2)
  var day = date.substr(6, 2)
  var hour = date.substr(8, 2)
  var minute = date.substr(10, 2)
  var second = date.substr(12, 2)
  // console.log(year, month)
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
};
const dateSecond = (date1, date2) => {
  // date1当前时间, date2消息时间
  console.log(date1, date2)
  // var date1 = '20210326173850'
  // var date2 = '20210322173850'
  //1. 先比较日期，假如日期与当天不同，那么就显示日期
  var time1 = date1.substr(0, 8)
  var time2 = date2.substr(0, 8)
  var time3 = date1.substr(8, 2)
  var time4 = date2.substr(8, 2)
  var time5 = date1.substr(10, 2)
  var time6 = date2.substr(10, 2)
  console.log(time3, time4)
  if (time1 == time2) {
    // 2如果时间相等的情况下，那么判断是上午还是下午
    var time32 = date2.substr(8, 2) + ':' + date2.substr(10, 2)
    //假如时钟也相等，那么展示几分钟之前
    if (time3 == time4 && time5 !== time6) {

      var time34 = time5 - time6 + '分钟前'
      return time34
    } else if (time3 == time4 && time5 == time6) {

      var time35 = "刚刚"
      return time35
    } else {
      return time32
    }
  } else {
    // 如果是本年的

    let time1 = date1.substr(0, 4)
    let time2 = date2.substr(0, 4)
    if (time1 == time2) {
      return date2.substr(4, 2) + '/' + date2.substr(6, 2)
    } else {
      return date2.substr(4, 2) + '/' + date2.substr(4, 2) + '/' + date2.substr(6, 2)
    }
  }

  //2.比较时间，假如date2比date1在日期相同的情况下展示时间
};
const dateRegxp = (date1, date2) => {
  // date1当前时间, date2消息时间
  // console.log(date1, date2)
  // var date1 = '20210326173850'
  // var date2 = '20210322173850'
  //1. 先比较日期，假如日期与当天不同，那么就显示日期
  var time1 = date1.substr(0, 8)
  var time2 = date2.substr(0, 8)
  if (time1 == time2) {
    // 2如果时间相等的情况下，那么判断是上午还是下午
    var time32 = date2.substr(8, 2) + ':' + date2.substr(10, 2)
    return time32
  } else {
    // 如果是本年的

    let time1 = date1.substr(0, 4)
    let time2 = date2.substr(0, 4)
    if (time1 == time2) {
      return date2.substr(4, 2) + '/' + date2.substr(6, 2)
    } else {
      return date2.substr(4, 2) + '/' + date2.substr(4, 2) + '/' + date2.substr(6, 2)
    }
  }


  //2.比较时间，假如date2比date1在日期相同的情况下展示时间
}
module.exports = {
  timeDatas,
  time,
  funtime,
  dateRegxp, //展示日期
  dateSecond //展示分钟
}

// 计算当前时间与消息发送时间的时间差，从而获得时间展示结果
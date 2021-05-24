// const baseUrl = 'http://111.231.110.27:8008/';
const baseUrl = 'https://dev.linxyun.com:8443/';

const baseUrl1 = 'http://mall-imag.linxyun.com/';

const baseUrlImg = 'https://upload.qiniup.com/';

/**
 * 供外部post请求调用
 */
function myPost(url, params, callback) {
  request(url, params, "POST", callback);
}

/**
 * 供外部get请求调用
 */
function myGet(url, params, callback) {
  request(url, params, "GET", callback);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 */
// function request(url, params, method, callback) {
//   wx.request({
//     url: baseUrl + url,
//     data: dealParams(params),
//     method: method,
//     header: {
//       'content-type': 'application/json'
//     },
//     success: function (res) {
//       wx.hideLoading()
//       // console.log(res);
//       callback.success(res);
//     },
//     fail: function (error) {
//       wx.hideLoading()
//       callback.fail(error);
//     }
//   })
// }
function request(url, params, method, callback) {
  wx.request({
    url: baseUrl + url,
    data: dealParams(params),
    method: method,
    header: { 'content-type': 'application/json' },
    success: function (res) {
      wx.hideLoading()
      console.log(res);
      callback.success(res);
    },
    fail: function (error) {
      wx.hideLoading()
      callback.fail(error);
    }
  })
}


/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return {
    // EntCode: '24',
    ...params
  };
}


function promiseUpload(url, params) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: baseUrl + url,
      filePath: params.filePath,
      name: "file",
      formData: {},
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var result = res.data
        if (!result.success) {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
        resolve(result);
      },
      fail: function (err) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
        reject(err);
      },
    });
  })
}

function promiseGet(url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      data: params,
      method: "GET",
      success: function (res) {
        var result = res.data
        if (!result.success) {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
        resolve(result);
      },
      fail: function (err) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
        reject(err);
      },
    });
  });
}

function promisePost(url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      data: params,
      method: "POST",
      success: function (res) {
        var result = res.data
        if (!result.success) {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
        resolve(result);
      },
      fail: function (err) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
        reject(err);
      },
    });
  });
}



module.exports = {
  myPost,
  myGet,
  baseUrl,
  baseUrl1,
  baseUrlImg,
  promiseUpload,
  promiseGet,
  promisePost
}
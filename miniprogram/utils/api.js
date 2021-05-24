import {
  promisePost,
  myPost,
  myGet
} from './http.js';

/**
 * wx_login获取openid
 */


const requestApi = (url, params = {}) => {
  return promisePost(url, params)
}

const wxLogin = (params = {}, callback = {}) => {
  return myPost('lxy_contact/wx_login.action', params, callback)
}
const queryMemberData = (params = {}, callback = {}) => {
  return myPost('lxy_contact/queryMember.action', params, callback)
}

const queryMsgCount = (params = {}, callback = {}) => {
  return myPost('lxy_contact/queryMsgCount.action', params, callback)
}
// const insertMember = (params = {}, callback = {}) => {
//   return myPost('lxy_contact/insertMember.action', params, callback)
// }


const uploadFileServer = (url, params = {}) => {
  return promisePost(url, params)
}

const deleteFile = (url, params = {}) => {
  return promisePost(url, params)
}

const addDynamic = (url, params = {}) => {
  return promisePost(url, params)
}

const querydynamic = (url, params = {}) => {
  return promisePost(url, params)
}

const insertMembers = (url, params = {}) => {
  return promisePost(url, params)
}

const queryMember = (params = {}, callback = {}) => {
  return myGet('lxy_contact/queryMember.action', params, callback)
}

const queryLikes = (url, params = {}) => {
  return promisePost(url, params)
}

const addLikes = (url, params = {}) => {
  return promisePost(url, params)
}

const addComment = (url, params = {}) => {
  return promisePost(url, params)
}

const queryCircle = (url, params = {}) => {
  return promisePost(url, params)
}

const addCircle = (url, params = {}) => {
  return promisePost(url, params)
}

const addPhoto = (url, params = {}) => {
  return promisePost(url, params)
}

const queryPhoto = (url, params = {}) => {
  return promisePost(url, params)
}

const updateMember = (url, params = {}) => {
  return promisePost(url, params)
}

const queryComment = (url, params = {}) => {
  return promisePost(url, params)
}

const addRecord = (url, params = {}) => {
  return promisePost(url, params)
}

const queryRecord = (url, params = {}) => {
  return promisePost(url, params)
}

const sendIMReq = (url, params = {}) => {
  return promisePost(url, params)
}

const updateCircle = (url, params = {}) => {
  return promisePost(url, params)
}

const updatePhoto = (url, params = {}) => {
  return promisePost(url, params)
}

const queryTradeOrders = (url, params = {}) => {
  return promisePost(url, params)
}

const WxOrder = (url, params = {}) => {
  return promisePost(url, params)
}

const updateMoney = (url, params = {}) => {
  return promisePost(url, params)
}

const queryMemberAccount = (url, params = {}) => {
  return promisePost(url, params)
}

const queryMemberAccountRecord = (url, params = {}) => {
  return promisePost(url, params)
}

const addAuthorizationApply = (url, params = {}) => {
  return promisePost(url, params)
}

const addComplaint = (url, params = {}) => {
  return promisePost(url, params)
}

const queryWxAuthorization = (url, params = {}) => {
  return promisePost(url, params)
}

const queryWxAuthorizationApply = (url, params = {}) => {
  return promisePost(url, params)
}

const queryzan = (url, params = {}, callback = {}) => {
  return myGet(url, params,callback)
}

const querycai = (url, params = {}, callback = {}) => {
  return myGet(url, params,callback)
}

const updateAuthorization = (url, params = {}) => {
  return promisePost(url, params)
}

const deleteDynamic = (url, params = {}) => {
  return promisePost(url, params)
}

const queryCircleLinkMemberID = (url, params = {}) => {
  return promisePost(url, params)
}

const queryCircleMemberID = (url, params = {}) => {
  return promisePost(url, params)
}

const deleteTabMemberLike = (url, params = {}) => {
  return promisePost(url, params)
}
module.exports = {
  requestApi,
  wxLogin,
  deleteFile,
  uploadFileServer,
  addDynamic,
  querydynamic,
  insertMembers,
  queryMember,
  queryMemberData,
  queryLikes,
  addLikes,
  addComment,
  queryCircle,
  addCircle,
  addPhoto,
  queryPhoto,
  updateMember,
  queryComment,
  addRecord,
  queryRecord,
  queryMsgCount,
  sendIMReq,
  updateCircle,
  updatePhoto,
  queryTradeOrders,
  WxOrder,
  updateMoney,
  queryMemberAccount,
  queryMemberAccountRecord,
  addAuthorizationApply,
  addComplaint,
  queryWxAuthorization,
  queryWxAuthorizationApply,
  queryzan,
  querycai,
  updateAuthorization,
  deleteDynamic,
  queryCircleLinkMemberID,
  queryCircleMemberID,
  deleteTabMemberLike
}
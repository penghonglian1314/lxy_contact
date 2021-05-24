/**
 * 取出中括号内的内容
 * @param text
 * @returns {string}
 */
// var getBracketStr = {
function splitX(s) {
  var ret = new Array();
  if (s == null || s == "") {
    return ret;
  }
  var idx1, idx2, i = 0;
  while ((idx1 = s.indexOf("【")) > -1 && idx1 != s.length - 1) {
    idx2 = s.indexOf("】");
    if (idx2 > idx1) {
      ret[i] = s.substring(idx1 + 1, idx2);
      i++;
      s = s.substring(idx2);
    } else {
      s = s.substring(idx1);
    }
  }
  return ret;

}
// }
export {
  splitX
};
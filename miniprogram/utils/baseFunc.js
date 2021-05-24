var baseFunc = {
  getLong: function(value) {
    if (value.length > 18) {
      return value.substr(0, 18) + '...'
    } else {
      return value
    }
  }
}
export {
  baseFunc
};
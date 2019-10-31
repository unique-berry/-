function http(url,callBack){
  wx.showNavigationBarLoading();
  var that = this
  wx.request({
    url: url,
    method: 'GET',
    header:{
      "Content-type":""
    },
    success:function (res){
      console.log(res)
      wx.hideNavigationBarLoading();
      if (res.movies){
        callBack(res.movies);
        
      }else{
        callBack(res.data);
        
      }
      
    },
    fail: function (error){
      console.log(error)
    }
  })
}

module.exports = {
  http:http
}
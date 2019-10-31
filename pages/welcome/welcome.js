var app = getApp();
Page({
  onTap:function(){
    // wx.navigateTo({
    //   url: '../posts/post'
    // })
    // wx.navigateTo({
    //   url: '../posts/post'
    // })
    wx.switchTab({
      url: '/pages/posts/post'
    })
    
  },
  onLoad:function(event){
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        app.globalData.g_latitude = res.latitude
        app.globalData.g_longitude = res.longitude
        console.log(app.globalData.g_latitude, app.globalData.g_longitude)
      }
    })
  }
})
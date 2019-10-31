// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle:null,
    movies:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getClientHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        const clientHeight = res.windowHeight;
        that.setData({
          height: clientHeight + "px"
        });
      }
    })
  },
  onLoad: function (options) {
    this.getClientHeight()
    this.setData({
      "movies": [],
      "moreMovieLoad":false
    })
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category){
      case "音乐":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=20";
      break;
      case "广告":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=14";
        break;
      case "时尚":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=24";
        break;
      case "动画":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=10";
        break;
      case "科技":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=32";
        break;
      case "旅行":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=6";
        break;
      case "开胃":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=4";
        break;
      case "生活":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=36";
        break;
      case "萌宠":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=26";
        break;
      case "游戏":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=30";
        break;
      case "影视":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=8";
        break;
      case "记录":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=22";
        break;
      case "剧情":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=12";
        break;
      case "运动":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=18";
        break;
      case "创意":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=2";
        break;
      case "搞笑":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=28";
        break;
      case "综艺":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/categories/detail/index?id=38";
        break;
      case "猜你喜欢":
        dataUrl = "http://baobab.kaiyanapp.com/api/v4/discovery/hot";
        break;        
    }
    util.http(dataUrl, this.processkaiyanData);
  },
  processkaiyanData: function (moviesData){
    
    var moviesData = moviesData
      if(moviesData.nextPageUrl){  
        this.setData({
          "nextPageUrl": moviesData.nextPageUrl
        })
        
      }
      moviesData = moviesData.itemList
      var movies = this.data.movies;
    
    var nextPageUrl = this.data.nextPageUrl
    if (nextPageUrl.indexOf("page=1&needFilter=true")){
      console.log("aaaaa")
      console.log(moviesData)
      moviesData = moviesData.splice(4,6)
      // console.log(moviesData)
    }
    
      for (var idx in moviesData) {
        if ((moviesData[idx].type == "followCard") || (moviesData[idx].type == "video")){
          var data_main = moviesData[idx]
          var movieName = moviesData[idx]["data"].title;
          var slogan = moviesData[idx]["data"].category;
          var pic_url = data_main["data"].cover.feed;
          var cover = data_main["data"].cover.blurred;
          var playUrl;
          if (data_main["data"].playInfo[0] === undefined) {
            playUrl = data_main["data"].playUrl;
          } else {
            playUrl = data_main["data"].playInfo[0].url;
          }
          var description = data_main["data"].description;
          var author_img
          if (data_main["data"].author){
            author_img = data_main["data"].author.icon;
          }else{
            author_img = data_main["data"].provider.icon;
          }
          
          
          var movieId = data_main["data"].id;
          var movieType = data_main["data"].category
          var minute = Math.floor(data_main["data"].duration / 60);
          var second = (data_main["data"].duration % 60)
          if (minute < 10) {
            minute = "0" + minute
          }
          if (second < 10) {
            second = "0" + second
          }
          var duration = minute + ":" + second
          var collect = data_main["data"].consumption.collectionCount;
          var share = data_main["data"].consumption.shareCount;
          var comment = data_main["data"].consumption.replyCount;
          var temp = {
            movieName: movieName,
            pic_url: pic_url,
            playUrl: playUrl,
            description: description,
            movieId: movieId,
            author_img: author_img,
            slogan: slogan,
            movieType: movieType,
            duration: duration,
            cover: cover,
            collect: collect,
            share: share,
            comment: comment
          }
          movies.push(temp);
        } else if (moviesData[idx].type =="videoCollectionWithBrief"){
          console.log(moviesData)
            var CollectData = moviesData[idx].data.itemList
            var categoryType = this.data.movies[0].movieType
          for (var n=0; n<CollectData.length; n++){
            if ((CollectData[n].type == "video") && (CollectData[n].data.category == categoryType)){
            
              var movieName = CollectData[n].data.title;
              var pic_url = CollectData[n].data.cover.feed;
              var playUrl;
              if (CollectData[n].data.playInfo[0] === undefined) {
                playUrl = CollectData[n].data.playUrl;
              } else {
                playUrl = CollectData[n].data.playInfo[0].url;
              }
              var description = CollectData[n].data.description;
              var movieId = CollectData[n].data.id;
              var author_img = CollectData[n].data.author.icon;
              var slogan = CollectData[n].data.category;
              var movieType = CollectData[n].data.category;
              var minute = Math.floor( CollectData[n].data.duration / 60);
              var second = (CollectData[n].data.duration % 60)
              if (minute < 10) {
                minute = "0" + minute
              }
              if (second < 10) {
                second = "0" + second
              }
              var duration = minute + ":" + second
              var cover = CollectData[n].data.cover.blurred;
              var collect = CollectData[n].data.consumption.collectionCount;
              var share = CollectData[n].data.consumption.shareCount;
              var comment = CollectData[n].data.consumption.replyCount
              var temp = {
                movieName: movieName,
                pic_url: pic_url,
                playUrl: playUrl,
                description: description,
                movieId: movieId,
                author_img: author_img,
                slogan: slogan,
                movieType: movieType,
                duration: duration,
                cover: cover,
                collect: collect,
                share: share,
                comment: comment
              }

              movies.push(temp);
            }
          }
        }

      }
    
    this.setData({movies})
    this.setData({
      "moreMovieLoad": true
    })
    console.log(this.data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  toMovieDetail: function (event) {
    var movieImg = event.currentTarget.dataset.movieimg;
    var playUrl = event.currentTarget.dataset.playurl;
    var title = event.currentTarget.dataset.title;
    var movieType = event.currentTarget.dataset.movietype;
    var description = event.currentTarget.dataset.description;
    var cover = event.currentTarget.dataset.cover;
    var movieId = event.currentTarget.dataset.movieid;
    var collect = event.currentTarget.dataset.collect;
    var share = event.currentTarget.dataset.share;
    var comment = event.currentTarget.dataset.comment;
    var duration = event.currentTarget.dataset.duration;
    console.log(duration)
    var url = "../movie-detail/movie-detail?movieImg=" + escape(movieImg) + "&playUrl=" + escape(playUrl) + "&title=" + title + "&movieType=" + movieType + "&description=" + description + "&movieId=" + movieId + "&collect=" + collect + "&share=" + share + "&comment=" + comment + "&duration=" + duration+ "&cover=" + cover
    console.log
    wx.navigateTo({
      url: url
    })
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  onScrollLower:function(){
    util.http(this.data.nextPageUrl, this.processkaiyanData);
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '开眼视频',
      path: '/pages/movies/movies'
    }
  }
})
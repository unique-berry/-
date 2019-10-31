var app = getApp();
// var util = require("../../utils/color-thief.js")
Page({
  onShareAppMessage: function (res) {
    return {
      title: '开眼视频',
      path: '/pages/movies/movies'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    n:0,
    "serverHint": "服务器连接中...",
    "switch":false,
    hide: [true, true, true, true,true,true,true,true,true,true,true,true],
    "topNum":0,
    "history":[
    ],
    "hotSearch":["奶茶","美食","旅行","生活小技巧","健身","汽车","广告","动画","创意灵感","搞笑"],
    "searchMessage":[],
    "loadHidden":false,
    "inputValue":"",
    "top":"-700px",
    "searchLoadHidden":true,
    "noSearchMessage":true,
    "typeActive":"#515151",
    "recommendActive":"#e96886",
    "dateActive":"#515151"
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
  start:function(){
    this.setData({
      "switch":true
    })
  },
  onLoad: function (options) {
    if (options.movieType){
      var movieImg =options.movieImg;
      var playUrl = options.playUrl;
      var title = options.title
      var movieType = options.movieType
      var description = options.description;
      var movieId = options.movieId;
      var cover =options.cover;
      var collect = options.collect;
      var share = options.share;
      var comment = options.comment;
      var duration = options.duration
      var url = "movie-detail/movie-detail?movieImg=" +movieImg + "&playUrl=" + playUrl + "&title=" + title + "&movieType=" + movieType + "&movieId=" + movieId + "&collect=" + collect + "&share=" + share + "&comment=" + comment + "&cover=" + cover + "&description=" + description + "&duration=" + duration
      wx.navigateTo({
        url: url
      })
    }
    var  that = this
    wx.getNetworkType({
      success: function (res) {
        console.log(res.networkType);
        var network = res.networkType
        if (res.networkType !="none"){
          that.setData({
            "network":"当前网络："+network
          })
        } else {
          that.setData({
            "network": "请检查自己的网络连接:"
          })
        }
      }
    });
    this.getClientHeight();
    var ReleaseToday = "https://api.apiopen.top/todayVideo";
    // var advertising = 
    var hot = "http://baobab.kaiyanapp.com/api/v4/discovery/hot"
    // var travel = 
    // var advanceNotice = 
    // var cartoon = 
    this.data.movieList = ["https://api.apiopen.top/videoCategoryDetails?id=20","https://api.apiopen.top/videoCategoryDetails?id=14", "https://api.apiopen.top/videoCategoryDetails?id=24", "https://api.apiopen.top/videoCategoryDetails?id=10", "https://api.apiopen.top/videoCategoryDetails?id=32", "https://api.apiopen.top/videoCategoryDetails?id=6", "https://api.apiopen.top/videoCategoryDetails?id=4", "https://api.apiopen.top/videoCategoryDetails?id=36", "https://api.apiopen.top/videoCategoryDetails?id=26", "https://api.apiopen.top/videoCategoryDetails?id=30", "https://api.apiopen.top/videoCategoryDetails?id=8",  "https://api.apiopen.top/videoCategoryDetails?id=22"]
    this.data.movieName = ["music","advertising", "fashion", "cartoon", "science", "travel","food","life", "pet", "game","advanceNotice","record"]
    this.getMovieListData(ReleaseToday, "today")
    // this.getMovieListData(advertising, "advertising")
    this.getMovieListData(hot, "hot")
    // this.getMovieListData(travel, "travel")
    
    // this.getMovieListData(cartoon, "cartoon")
    console.log(this.data)
    
  },

  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    console.log(category)
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },
  toMovieDetail:function(event){
    
    console.log(event.currentTarget.dataset)
    var movieImg = event.currentTarget.dataset.movieimg;
    var playUrl = event.currentTarget.dataset.playurl;
    var title = event.currentTarget.dataset.title;
    var movieType = event.currentTarget.dataset.movietype;
    var description = event.currentTarget.dataset.description;
    description = description.replace(/[\r\n]/g, "");
    var movieId = event.currentTarget.dataset.movieid;
    var cover = event.currentTarget.dataset.cover;
    var collect = event.currentTarget.dataset.collect;
    var share = event.currentTarget.dataset.share;
    var comment = event.currentTarget.dataset.comment;
    var duration = event.currentTarget.dataset.duration;
    var url = "movie-detail/movie-detail?movieImg=" + escape(movieImg) + "&playUrl=" + escape(playUrl) + "&title=" + title + "&movieType=" + movieType + "&movieId=" + movieId + "&collect=" + collect + "&share=" + share + "&comment=" + comment + "&cover=" + escape(cover) + "&description=" + description + "&duration=" + duration
    console.log(url)
    wx.navigateTo({
      url: url
    })
  },
  getMovieListData: function (url,genre) {
    wx.showNavigationBarLoading();
    var that = this
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res)
        if(res.statusCode=="502"){
          that.setData({
            "serverHint": "web服务器通信失败:可能由于请求次数太多引起，请稍候重试"
          })
        }else{
          that.setData({
            "serverHint": "服务器连接：成功"
          })
        }
        var data
        if (genre=="hot"){
          data = res.data.itemList
        }else{
          data = res.data.result;
        }
        wx.hideNavigationBarLoading();
        // var data_six = data.slice(1,16);
        that.processMovieData(data, genre);
      },
      fail: function () {
        that.setData({
          "serverHint": "服务器响应：失败"
        })
      }
    })
  },

  processMovieData: function (moviesData,classify) {
    if (classify=="today"){
      var movies = [];
      for (var idx in moviesData) {
        if (moviesData[idx].type == "followCard") {
          var data_main = moviesData[idx]["data"].content
          var cover = data_main["data"].cover.blurred;
          var movieName = data_main["data"].title;
          var pic_url = data_main["data"].cover.feed;
          var author_img = data_main["data"].author.icon;
          var slogan = data_main["data"].slogan;
          var playUrl;
          if (data_main["data"].playInfo[0]===undefined){
            playUrl = data_main["data"].playUrl;
          }else{
            playUrl = data_main["data"].playInfo[0].url;
          }
          var movieType = data_main["data"].category
          var description = data_main["data"].description;
          var minute = Math.floor(data_main["data"].duration / 60);
          var second = (data_main["data"].duration % 60)
          if(second<10){
            second = "0" + second
          }
          var duration = minute + ":" + second
          var movieId = data_main["data"].id;
          var collect = data_main["data"].consumption.collectionCount;
          var share = data_main["data"].consumption.shareCount;
          var comment = data_main["data"].consumption.replyCount;
          var temp = {
            cover: cover,
            movieName: movieName,
            pic_url: pic_url,
            movieId: movieId,
            author_img: author_img,
            slogan: slogan,
            duration: duration,
            playUrl: playUrl,
            description: description,
            movieType: movieType,
            collect: collect,
            share: share,
            comment: comment,
            typeName: movieType
          }
          movies.push(temp);
        }
      }
      this.setData({
        movies: movies
      })
    }

    if ((classify != "today") && (classify != "hot")) {
      var movies = [];
      var movies_data={};
      var frist_arr = []
      var data = {}
      for (var idx in moviesData) {
        if (moviesData[idx].type == "followCard") {
          var data_main = moviesData[idx]["data"].content
          var movieName = moviesData[idx]["data"].header.title;
          var pic_url = data_main["data"].cover.feed;
          var playUrl;
          if (data_main["data"].playInfo[0] === undefined) {
            playUrl = data_main["data"].playUrl;
          } else {
            playUrl = data_main["data"].playInfo[0].url;
          }
          var cover = data_main["data"].cover.blurred;
          var description = data_main["data"].description;
          var author_img = data_main["data"].author.icon;
          var slogan = moviesData[idx]["data"].header.description;
          var title = moviesData[idx]["data"].header.title;
          var movieId = data_main["data"].id;
          var movieType = data_main["data"].category
          var minute = Math.floor(data_main["data"].duration / 60);
          var second = (data_main["data"].duration % 60)
          if (second < 10) {
            second = "0" + second
          }
          if (minute < 10) {
            minute = "0" + minute
          }
          var duration = minute + ":" + second
          var collect = data_main["data"].consumption.collectionCount;
          var share = data_main["data"].consumption.shareCount;
          var comment = data_main["data"].consumption.replyCount;
          var temp = {
            movieName: movieName,
            pic_url: pic_url,
            playUrl: playUrl,
            movieId: movieId,
            author_img: author_img,
            slogan: slogan,
            title: title,
            description: description,
            movieType: movieType,
            duration: duration,
            cover: cover,
            collect: collect,
            share: share,
            comment: comment,
            typeName: movieType
          }
          movies.push(temp);
        }

      }
      frist_arr[0] = movies[0]
      movies_data.first = frist_arr
      movies_data.data = movies.slice(1,4);
      data[classify] = {
        movies:movies_data
        }
      this.setData(data)
    }
    if (classify == "hot"){
      var movies = [];
      var movies_data = {};
      var frist_arr = []
      var data = {}
      for (var idx in moviesData) {
        if (moviesData[idx].type == "video") {
          var data_main = moviesData[idx]
          var movieName = data_main["data"].title;
          var pic_url = data_main["data"].cover.feed;
          var playUrl;
          if (data_main["data"].playInfo[0] === undefined) {
            playUrl = data_main["data"].playUrl;
          } else {
            playUrl = data_main["data"].playInfo[0].url;
          }
          var cover = data_main["data"].cover.blurred;
          var description = data_main["data"].description;
          var author_img = data_main["data"].author.icon;
          var slogan = data_main["data"].category;
          var title = moviesData[idx]["data"].title;
          var movieId = data_main["data"].id;
          var movieType = data_main["data"].category
          var minute = Math.floor(data_main["data"].duration / 60);
          var second = (data_main["data"].duration % 60)
          if (second < 10) {
            second = "0" + second
          }
          if (minute < 10) {
            minute = "0" + minute
          }
          var duration = minute + ":" + second
          var collect = data_main["data"].consumption.collectionCount;
          var share = data_main["data"].consumption.shareCount;
          var comment = data_main["data"].consumption.replyCount;
          var temp = {
            movieName: movieName,
            pic_url: pic_url,
            playUrl: playUrl,
            movieId: movieId,
            author_img: author_img,
            slogan: slogan,
            title: title,
            description: description,
            movieType: movieType,
            duration: duration,
            cover: cover,
            collect: collect,
            share: share,
            comment: comment,
            typeName:"猜你喜欢"
          }
          movies.push(temp);
        }
      }
      frist_arr[0] = movies[0]
      movies_data.first = frist_arr
      movies_data.data = movies.slice(1, 4);
      data[classify] = {
        movies: movies_data
      }
      this.setData(data)
    }
  },
  onScrollLower: function (event) {
    var hidden={
      hide:null
    }
    if (this.data.n == this.data.movieList.length){
        return
    }
    this.getMovieListData(this.data.movieList[this.data.n], this.data.movieName[this.data.n])
    this.data.hide[this.data.n]=false
    hidden.hide = this.data.hide
    this.setData(hidden)
    this.data.n = this.data.n+1
    
  },
  moveClick: function (off) {
    var animation = wx.createAnimation({
      duration: 500,
      delay: 0,
      timingFunction: "ease",
    });
    if(off==="show"){     
      animation.translate(0, 700).step({ duration: 500 })
    }else if(off === "hide"){
      animation.translate(0, -700).step({ duration: 500 })
    }
    this.setData({ movie: animation.export() })
  },
  bindseach:function(){
    this.moveClick("show")
  },
  bindHistory:function(event){
    var historyMessage = event.target.dataset.history
    this.setData({
      "inputValue": historyMessage,
      "searchstart":true,
      "searchMessage": []
    })
    var url = "http://baobab.kaiyanapp.com/api/v1/search?num=10&query="+historyMessage+"&start=0"
    this.getSearch(url)
    const history = this.data.history;
    history.unshift(historyMessage)
    for (var n = 0; n < history.length - 1; n++) {
      // console.log(n)
      if (history[0] === history[n + 1]) {
        history.splice(n + 1, 1)
      }
    }
    this.setData({
      "history": history
    })
  },
  bindCancel:function(){
    this.setData({
      "history":[],
    })
  },
  getSearch: function (url){
    wx.showNavigationBarLoading();
    this.setData({
      "searchLoadHidden":false
    })
    var that = this;
    var url = url
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.disposeSearchMessage(res.data.itemList);
        const nextUrl = res.data.nextPageUrl
        that.setData({
          "nextUrl":nextUrl,
          "searchLoadHidden": true
        })
        if (res.data.itemList[0]==undefined){
          that.setData({
            "noSearchMessage":false
          })
        }else{
          that.setData({
            "noSearchMessage": true
          })
        }
        wx.hideNavigationBarLoading();
      }
    })
    
  },
  disposeSearchMessage: function (moviesData) {
    var searchMessage = this.data.searchMessage;
    for (var idx in moviesData) {
      if (moviesData[idx].type==="video") {
        var data_main = moviesData[idx]
        var movieName = data_main["data"].title;
        var pic_url = data_main["data"].cover.feed;
        var playUrl;
        if (data_main["data"].playInfo[0] === undefined) {
          playUrl = data_main["data"].playUrl;
        } else {
          playUrl = data_main["data"].playInfo[0].url;
        }
        var cover = data_main["data"].cover.blurred;
        var description = data_main["data"].description;
        if (data_main["data"].author){
          var author_img = data_main["data"].author.icon;
          var slogan = moviesData[idx]["data"].author.name + ' / ' + '#' + movieType;
        }else{
          var author_img = null;
          var slogan = moviesData[idx]["data"].provider.name + '/' + '#' + movieType;
        }
        var movieType = data_main["data"].category
        var title = moviesData[idx]["data"].title;
        var movieId = data_main["data"].id;
        var minute = Math.floor(data_main["data"].duration / 60);
        var second = (data_main["data"].duration % 60)
        if (second < 10) {
          second = "0" + second
        }
        if (minute < 10) {
          minute = "0" + minute
        }
        var duration = minute + ":" + second
        var collect = data_main["data"].consumption.collectionCount;
        var share = data_main["data"].consumption.shareCount;
        var comment = data_main["data"].consumption.replyCount;
        var temp = {
          movieName: movieName,
          pic_url: pic_url,
          playUrl: playUrl,
          movieId: movieId,
          author_img: author_img,
          slogan: slogan,
          title: title,
          description: description,
          movieType: movieType,
          duration: duration,
          cover: cover,
          collect: collect,
          share: share,
          comment: comment
        }
        searchMessage.push(temp);
      }

    }
    this.setData({
      "searchMessage": searchMessage
    })
  },
  bindScrollSearch:function(){
    const url = this.data.nextUrl
    if (url == null){
      return
    }else{
      this.getSearch(url)
    }
  },
  bindfocus:function(){
    this.setData({
      "searchMessage":[],
      "loadHidden":false,
      "searchstart":false,
      "noSearchMessage":true
    })
  },
  bindblur:function(event){
    const value = event.detail.value
    history = this.data.history;
    history.unshift(value)
    var url = "http://baobab.kaiyanapp.com/api/v1/search?num=10&query=" + value + "&start=0"
    this.getSearch(url)
    this.setData({
      "history": history,
      "searchstart":true
    })
  },
  searchBlack:function(){
    this.moveClick("hide")
  },
  bindType:function(){
    this.setData({
      "typeActive": "#e96886",
      "recommendActive": "#515151",
      "dateActive": "#515151",
      "recommendHidden":true,
      "typeBoxHidden": false
    })
    this.getType();
  },
  getType:function(){
    this.setData({
      "searchLoadHidden":false
    })
    var that = this
    wx.request({
      url: "http://baobab.kaiyanapp.com/api/v4/categories/",
      method: 'GET',
      header: {
        "Content-type": ""
      },
      success: function (res) {
        console.log(res)
        that.setData({
          "typeData": res.data,
          "searchLoadHidden": true
        })
      }
    })
  },
  bindRecommend:function(){
    this.setData({
      "typeActive": "#515151",
      "recommendActive": "#e96886",
      "dateActive": "#515151",
      "recommendHidden": false,
      "typeBoxHidden":true
      
    })
  },
  bindDate:function(){
    this.setData({
      "typeActive": "#515151",
      "recommendActive": "#515151",
      "dateActive": "#e96886"
    })
  },
  onHide: function () {
    // this.moveClick("hide")
  }
})

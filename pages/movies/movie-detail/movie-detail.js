// pages/movies/movie-detail/movie-detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    "height":null,
    "heightScroll":null,
    "background":null,
    "detail":{},
    "coverControl":false,
    "blank":false,
    "commentSwitch":false,
    "videoTime":0,
    "Collented": false,
    "speedShow":false,
    "speedNum":"1.0",
    "playbackRate":false
  },

  /**
   * 生命周期函数--监听页面加载
   */

 
  getClientHeight:function(){
    console.log(this.data)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        const clientHeight = res.windowHeight;
        console.log(res)
        var videoHeightPx = 423 / 750 * res.windowWidth
        that.setData({
          "height": clientHeight+"px",
          "heightScroll": (clientHeight - (videoHeightPx+4))+"px",
          "heightcomment": (clientHeight - videoHeightPx) + "px",
          "clientHeight": clientHeight,
          "commentScroll": (clientHeight - (videoHeightPx+60))+"px",
          "videoHeightPx": videoHeightPx
        });
      }
    })
  },
  onLoad: function (options) {

    console.log(options)
    this.getClientHeight();
    var movieImg = unescape(options.movieImg);
    var playUrl = unescape(options.playUrl);
    var title = options.title
    var movieType = options.movieType
    var description = options.description;
    var movieId = options.movieId;
    var cover = unescape(options.cover);
    var collect = options.collect;
    var share = options.share;
    var comment = options.comment;
    var duration = options.duration
    var videoTime = options.videoTime

    
    var consumption = {
      "collect": collect,
      "share": share,
      "comment": comment
    }
    var detail = {
      "movieImg": movieImg,
      "playUrl": playUrl,
      "title": title,
      "movieType": movieType,
      "description": description,
      "cover": cover,
      "consumption": consumption,
      "movieId": movieId,
      "CollentPng": "/images/icon/collected.png",
      "duration": duration
    }
    this.setData({
      "detail": detail
      
    })
    var that = this
    this.onLoadUrl(movieId);
  },
  onLoadUrl:function(id){
    var that = this
    var url = "https://api.apiopen.top/videoRecommend?id="+id
    wx.request({
      url: url,
      method:"GET",
      dataType:"json",
      success:function(res){
        var data = res.data.result
        that.setData({
          "blank":true
        })
        that.processMovieData(data)
        that.ifCollent();

      }
    })
  },
  processMovieData:function(data){
    var movies=[];
    for (var n = 0; n < data.length;n++){
      if (data[n].type === "videoSmallCard"){
        var data_main = data[n]["data"]
        var title = data_main.title;
        
        var pic_url = data_main.cover.detail;
        var playUrl;
        if (data_main.playInfo[0]===undefined){
          playUrl = data_main.playUrl;
        }else{
          playUrl = data_main.playInfo[0].url;
        }
        var movieType = data_main.category
        var description = data_main.description;
        var cover = data_main.cover.blurred;
        var minute = Math.floor(data_main.duration / 60);
        var second = (data_main.duration % 60)
        if (second < 10) {
          second = "0" + second
        }
        var duration = minute + ":" + second
        var movieId = data_main.id;
        var collect = data_main.consumption.collectionCount
        var share = data_main.consumption.shareCount
        var comment = data_main.consumption.replyCount
        var temp = {
          "title": title,
          "pic_url": pic_url,
          "playUrl": playUrl,
          "movieType": movieType,
          "description": description,
          "duration": duration,
          "movieId": movieId,
          "cover":cover,
          "collect": collect,
          "share": share,
          "comment": comment
        }
        movies.push(temp)
      }
    }
    this.setData({
      movies: movies
    })
  },
  toMovieDetail: function (event) {
    this.videoContext.pause()
    const startBrowse = this.data.startBrowse
    console.log(startBrowse)
    if (startBrowse) {
      this.personRecord("browse")
    }
    var movieImg = event.currentTarget.dataset.movieimg;
    var playUrl = event.currentTarget.dataset.playurl;
    var title = event.currentTarget.dataset.title;
    var movieType = event.currentTarget.dataset.movietype;
    var description = event.currentTarget.dataset.description;
    var movieId = event.currentTarget.dataset.movieid;
    var cover = event.currentTarget.dataset.cover;
    var collect = event.currentTarget.dataset.collect;
    var share = event.currentTarget.dataset.share;
    var comment = event.currentTarget.dataset.comment;
    var duration = event.currentTarget.dataset.duration;
    var consumption = {
      "collect": collect,
      "share": share,
      "comment": comment
    }
    var detail = {
      "movieId": movieId,
      "movieImg": movieImg,
      "playUrl": playUrl,
      "title": title,
      "movieType": movieType,
      "description": description,
      "cover": cover,
      "consumption": consumption,
      "CollentPng": "/images/icon/collected.png",
      "duration": duration
    }
    this.onLoadUrl(movieId);
    this.setData({
      "detail": detail,
      "coverControl":false,
      "Collented": false,
      "commentUserInfo": false,
      "startBrowse": false,
      "speedShow": false,
      "speedNum":"1.0",
      "playbackRate": false
    })
    this.videoContext.pause();
    this.ifCollent();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },
  
  moveClick: function (off) {
    this.setData({
      "commentSwitch": true
    })
    var animation = wx.createAnimation({
      duration: 500,
      delay: 0,
      timingFunction: "ease",
    });

    if (off=="show"){
      animation.translate(0, -(this.data.clientHeight - this.data.videoHeightPx)).step({ duration: 500 })
    }else if(off=="hide"){
      animation.translate(0, (this.data.clientHeight - this.data.videoHeightPx)).step({ duration: 500 })
    }else{
     return;
    }
    
    this.setData({ movie: animation.export() })
  },
  getComment:function(event){
    var that = this;
    this.moveClick("show");
    if (!(this.data.commentUserInfo)){
      var movieId = event.currentTarget.dataset.movieid;
      var comment = event.currentTarget.dataset.comment;
      comment =parseInt(comment)
      if(comment>=50){
        comment = comment-1
      }
      console.log(comment)
      const url = "https://baobab.kaiyanapp.com/api/v1/replies/video?udid=undefined&id=" + movieId + "&num=" + comment
      wx.request({
        url: url,
        method: "GET",
        dataType: "json",
        success: function (res) {
          that.setData({
            "commentUserInfo":true,
            "commentMain": ""
          })
          
          if (res.statusCode==200&&res.data!=null){
            that.getUserComment(res.data.replyList)
            
          } else if (res.statusCode == 200 && res.data == null){
            console.log("暂无评论")
            that.setData({
              "commentMain": "暂无评论"
            })
            
          }else{
            console.log("获取评论失败")
            that.setData({
              "commentMain": "获取评论失败"
            })
          }
        }
      })
    }
  },
  commentBlack:function(){
    this.moveClick("hide");
  },
  bindtimeupdate:function(event){
    const videoTime = event.detail.currentTime
    this.setData({
      "videoTime": videoTime
    })
  },
  bindwaiting: function () {
    // this.videoContext.pause();
    // const  videoTime = this.data.videoTime
    this.videoContext.seek()
  },
  binderror:function(){
    const videoTime = this.data.videoTime
    this.videoContext.seek(videoTime)
  },
  getTime:function(time){
    var d = new Date(time)
    console.log(d)
    var Year = d.getYear()+1900
    var Month =d.getMonth()+1
    var Day = d.getDate()
    var Hours = d.getHours()
    if (Hours<10){
      Hours = "0"+Hours
    }
    var Minutes = d.getMinutes()
    if (Minutes<10){
      Minutes = "0" + Minutes
    }
    // console.log(Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes)
    return Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes
    
  },
  getUserComment:function(data){
    const commentUserInfo = [];
    for(var n in data){
      const avatar = data[n].user.avatar;
      const nickName = data[n].user.nickname;
      const likeCount = data[n].likeCount;
      const message = data[n].message;
      const time =data[n].createTime;
      const timea = this.getTime(time);
      const temp = {
        "avatar": avatar,
        "nickName": nickName,
        "likeCount": likeCount,
        "message": message,
        "time": timea
      }
      commentUserInfo.push(temp)
    }
    this.setData({
      "commentUserInfo": commentUserInfo
    })
  },

  /*收藏*/
  getNowTime:function(){
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month =myDate.getMonth()+1;
    var date = myDate.getDate();
    var hours = myDate.getHours();
    if (hours<10){
      hours = "0" + hours
    }
    var minutes = myDate.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes
    }  
    return year+ "/"+ month+ "/"+ date+" "+hours+":"+minutes
  },
  personRecord:function(recordType){
    const NowTime = this.getNowTime();
    const Collented = this.data.Collented;
    const movieImg = this.data.detail.movieImg;
    const playUrl = this.data.detail.playUrl;
    const title = this.data.detail.title;
    const movieType = this.data.detail.movieType;
    const description = this.data.detail.description;
    const movieId = (this.data.detail.movieId).toString();
    const cover = this.data.detail.cover;
    const collect = this.data.detail.consumption.collect;
    const share = this.data.detail.consumption.share;
    const comment = this.data.detail.consumption.comment;
    const duration = this.data.detail.duration;
    const detail = this.data.detail;
    const videoTime = this.data.videoTime;
    const collect_list = {
      "pic_url": movieImg,
      "playUrl": playUrl,
      "title": title,
      "movieType": movieType,
      "description": description,
      "movieId": movieId,
      "cover": cover,
      "duration": duration,
      "collect": collect,
      "share": share,
      "comment": comment,
      "videoTime": videoTime,
      "NowTime": NowTime

    }
    if (recordType==="collect"){
      var collects = wx.getStorageSync("collects")
      var collectsId = wx.getStorageSync("collectsId")
      console.log(Collented)
      if (!Collented) {
        if (collects === "") {
          console.log("没数据")
          wx.setStorageSync("collects", [collect_list])
          wx.setStorageSync("collectsId", [movieId])
        } else {
          console.log("有数据")
          collects.unshift(collect_list)
          collectsId.unshift(movieId)
          wx.setStorageSync("collects", collects)
          wx.setStorageSync("collectsId", collectsId)

        }
        detail["CollentPng"] = "/images/icon/collected_anti.png"
        this.setData({
          "Collented": true,
          "detail": detail
        })
        wx.showToast({
          title: '加入收藏成功',
          icon: 'none',
          duration: 2000
        })
      } else if (Collented) {
        var deleteId = collectsId.indexOf(movieId)
        console.log(movieId)
        console.log(collectsId)
        console.log(deleteId)
        collects.splice(deleteId, 1)
        collectsId.splice(deleteId, 1)
        wx.setStorageSync("collects", collects)
        wx.setStorageSync("collectsId", collectsId)
        detail["CollentPng"] = "/images/icon/collected.png"
        this.setData({
          "Collented": false,
          "detail": detail
        })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none',
          duration: 2000
        })
      }
    } else if (recordType==="browse"){
      var browse = wx.getStorageSync("browse")
      if (browse===""){
        wx.setStorageSync("browse", [collect_list])
      }else{
        browse.unshift(collect_list)
        wx.setStorageSync("browse", browse)
        for (var n=0; n<browse.length-1; n++){
          // console.log(n)
          if (browse[0].movieId === browse[n+1].movieId){
            browse.splice(n+1,1)
            wx.setStorageSync("browse", browse)
          }
        }
        if (browse.length==31){
          var browse = wx.getStorageSync("browse")
          browse.pop()
          wx.setStorageSync("browse", browse)
        }
      }
      
    }
  },
  onClickCollect:function(){
    this.personRecord("collect")
    this.getNowTime()
  },
  bindplay:function(){
    this.setData({
      "startBrowse":true,
      "playbackRate":true
    })
  },
  ifCollent:function(){
    const detail = this.data.detail;
    var  movieId = this.data.detail.movieId;
    var collectsId = wx.getStorageSync("collectsId")
    if (collectsId===""){
      detail["CollentPng"] = "/images/icon/collected.png"
      this.setData({
        "Collented":false,
        "detail": detail
      })
    }else{
      for (var n in collectsId){
        if (movieId == collectsId[n]){
          detail["CollentPng"] = "/images/icon/collected_anti.png"
          this.setData({
            "Collented": true,
            "detail": detail
          })
        }
      }
    }
  }, 
  /**
   * 生命周期函数--监听页面显示
   */
  bindSpeed:function(){
    this.setData({
      speedShow:true
    })
  },
  bindSpeednum:function(event){
    var speedNum = event.currentTarget.dataset.speednum;
    speedNum = parseFloat(speedNum)
    this.videoContext.playbackRate(speedNum)
    if (speedNum===1){
      speedNum = speedNum+".0"
    }
    this.setData({
      speedShow:false,
      "speedNum": speedNum
    })
  },
  bindvidetap:function(){
    this.setData({
      speedShow: false
    })
  },
  onShow: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    // setTimeout(function () {
    //   wx.switchTab({
    //     url: '../movies',
    //   })
    // }, 2000)
    // var videoTime = this.data.videoTime
    // console.log(videoTime)
    // if (videoTime) {
    //   videoTime = parseFloat(videoTime)
    //   console.log(videoTime)
    //   this.videoContext.seek()
    // }
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
    const startBrowse = this.data.startBrowse
    if (startBrowse) {
      this.personRecord("browse")
    }
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
    const movieImg = this.data.detail.movieImg;
    const playUrl = this.data.detail.playUrl;
    const title = this.data.detail.title;
    const movieType = this.data.detail.movieType;
    const description = this.data.detail.description;
    const movieId = (this.data.detail.movieId);
    const cover = this.data.detail.cover;
    const collect = this.data.detail.consumption.collect;
    const share = this.data.detail.consumption.share;
    const comment = this.data.detail.consumption.comment;
    const duration = this.data.detail.duration;
    console.log(this.data)
    return {
      title: title,
      path: "/pages/movies/movies?movieImg=" + escape(movieImg) + "&playUrl=" + escape(playUrl) + "&title=" + title + "&movieType=" + movieType + "&movieId=" + movieId + "&collect=" + collect + "&share=" + share + "&comment=" + comment + "&cover=" + escape(cover) + "&description=" + description + "&duration=" + duration
    }
  }
})
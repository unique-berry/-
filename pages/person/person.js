// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accredit:false,
    src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551179829987&di=14c1cd5a43a4ad0c29da1b13c4ccbaea&imgtype=0&src=http%3A%2F%2Fpic3.zhimg.com%2Fv2-8b17fd64844c04b93ccf126b3145dc26_r.jpg",
    person_hint:"Eyepelizer",
    like:{
      src:"/images/icon/collected_anti.png",
      active:"opacity:1"
    },
    record:{
      src: "/images/icon/record.png",
      active: "opacity:0.6"
    }
  },
  getClientHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var ClientHeight = res.screenHeight;
        console.log(ClientHeight)
        var scrpllHeight = ClientHeight - (220)
        that.setData({
          "ClientHeight": ClientHeight+"px",
          "scrpllHeight": scrpllHeight+"px"
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClientHeight()
    
    this.getStoreData("collects");
  },
  // getUser:function(){
  //   var that = this
  //   wx.login({
  //     success(res) {
  //       if (res.code) {
  //         // 发起网络请求
  //         console.log(res.code)
  //         var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxa8a46ad9590e7283&secret=b2ef8235a71557b58b089deba0215538&js_code=" + res.code + "&grant_type=authorization_code"
  //         console.log(url)
  //         wx.request({
  //           url: url,
  //           method: 'GET',
  //           header: {
  //             "Content-Type": "application/json"
  //           },
  //           success: function (res) {
  //             wx.getUserInfo({
  //               success: function (res) {
  //                 const avatarUrl = res.userInfo.avatarUrl
  //                 const nickName = res.userInfo.nickName
  //                 that.setData({
  //                   accredit: true,
  //                   src: avatarUrl,
  //                   person_hint: nickName
  //                 })
  //                 that.getLike();
  //               },
  //               fail:function(res){
  //                 that.setData({
  //                   accredit: false,
  //                   src: "../../images/icon/wx.png",
  //                   person_hint: "点击授权微信登陆"
  //                 })
  //               }
  //             })
  //           }
  //         })
  //       } else {
  //         console.log('登录失败！' + res.errMsg)
  //       }
  //     }
  //   })
  // },
  // bindGetUserInfo: function(res) {
  //   if(res.detail.userInfo) {
  //     console.log('用户点击了授权按钮')
  //     this.setData({
  //       accredit:true
  //     })
  //     this.getStoreData();
  //   }else {
  //     console.log('用户点击了取消按钮')
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  getStoreData:function(StoreType){
    const like = wx.getStorageSync(StoreType);
      console.log(like)
      this.setData({
        collect_tishi: "暂无收藏",
        likeData: like
      })    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  toMovieDetail: function (event) {
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
    var videoTime = event.currentTarget.dataset.videotime;
    var url = "../movies/movie-detail/movie-detail?movieImg=" + escape(movieImg) + "&playUrl=" + escape(playUrl) + "&title=" + title + "&movieType=" + movieType + "&movieId=" + movieId + "&collect=" + collect + "&share=" + share + "&comment=" + comment + "&cover=" + escape(cover) + "&description=" + description + "&duration=" + duration + "&videoTime=" + videoTime
    console.log(url)
    wx.navigateTo({
      url: url
    })
  },
  onShow: function () {
    const personType = this.data.like.src;
    if (personType ==="/images/icon/collected_anti.png"){
      this.getStoreData("collects");
    }else{
      this.getStoreData("browse");
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  bindCollect:function(){
    this.getStoreData("collects");
    this.setData({
      like: {
        src: "/images/icon/collected_anti.png",
        active: "opacity:1"
      },
      record: {
        src: "/images/icon/record.png",
        active: "opacity:0.6"
      }
    }) 
  },
  bindRecord:function(){
    this.getStoreData("browse");
    this.setData({
      like: {
        src: "/images/icon/collected.png",
        active: "opacity:0.6"
      },
      record: {
        src: "/images/icon/record_anti.png",
        active: "opacity:1"
      }
    }) 
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
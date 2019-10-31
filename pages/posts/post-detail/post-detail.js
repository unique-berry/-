var postsData = require("../../../data/posts-data.js")
var app = getApp();

Page({
  data:{
    isPlayingMusic:false
  },
  onLoad:function(option){
    
    var postId = option.id;
    this.data.currentPostId = postId;
    var postDetailData = postsData.postList[postId];
    this.setData({
      "postDetailData": postDetailData
    })
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    console.log(postsData)

    // var postsCollected = {
    //   1:"true",
    //   2:"false",
    //   3:"true"
    // }

    var postsCollected = wx.getStorageSync("posts_collected")
    if (postsCollected){
      var postCollected = postsCollected[postId]
      this.setData({
        "collected":postCollected
      })
    }else{
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync("posts_collected", postsCollected)
    }
    var that = this;
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        isPlayingMusic : true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic : false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap:function(event){
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId]
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      "collected": postCollected
    })

    wx.showToast({
      title: postCollected?"收藏成功":"取消收藏成功",
      duration:1000
    })

    // wx.showModal({
    //   title: '收藏',
    //   content: '是否收藏该文章',
    //   showCancel:"true",
    //   cancelText:"不收藏",
    //   cancelColor:"#333",
    //   confirmText:"收藏",
    //   confirmColor:"#405f80"
    // })
  },

  onShareTop: function(event) {
      wx.showActionSheet({
        itemList:[
          "分享给微信好友",
          "分享到朋友圈",
          "分享到QQ",
          "分享到微博"
        ],
        itemColor:"#405f80",
        success:function(res){
          console.log(res)
        }
      })
  },

  onMusicTap:function(event){
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postList[currentPostId];
    if (isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })

      this.setData({
        isPlayingMusic: true
      })
    }
  }

})
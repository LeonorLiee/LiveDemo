var liveData = require('../../data/live-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    live_key:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      live_key: liveData.liveList
    });
  },

  onLiveTap:function(event){
    var liveId = event.currentTarget.dataset.liveId;
    
    // 冒泡跳转
    wx.navigateTo({
      url: "live-detail/live-detail?id=" + liveId
    })
  }
})
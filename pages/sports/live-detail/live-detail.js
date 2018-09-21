var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pulling: false,
    livePlayerContext: {},
    src: '', //	音视频地址。目前仅支持 flv, rtmp 格式
    mode: 'live', // live（直播），RTC（实时通话）
    autoplay: false,
    muted: false,
    orientation: 'vertical', // 画面方向，可选值有 vertical，horizontal
    objectFit: 'contain', // 填充模式，可选值有 contain，fillCrop
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var liveId = options.id
    this.data.currentLiveId = liveId
    console.log(that.data.currentLiveId)

    var dataUrl = app.globalData.liveBaseAddress
    wx.request({
      url: 'http://132.232.137.244/nzgz/room/enter/e1.php',
      data: {
        sid: that.data.currentLiveId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("获取到直播地址")
        // 消息提示框
        wx.showToast({
          title: '请求完成',
          duration: 1000,
          icon: 'success'
        })
        if (res.data) {
          that.getLiveSrc(res.data)
        }
      },
      fail: function (error) {
        console.log("请求.php失败")
        console.log(error)
      }
    })
  },

  /* 
   * live_src:直播间地址
   * content_type:头部类型
   */
  getLiveSrc: function(args) {
    console.log(args)

    if (this.checkUrl(args)) {
      this.setData({
        src: args
      })
      this.createContext()
    }
  },

  checkUrl: function(str) {
    if (/^(rtmp|RTMP):\/\/[\w\/\.?&_=-]+$/.test(str) || /^(http|HTTP|https|HTTPS):\/\/[\w\/\.&_=-]+\.flv[\w\/\.=?&_-]*$/.test(str)) {
      console.log("地址校验完成")
      return true
    }
    wx.showToast({
      image: '/image/detail-img/err_icon.png',
      title: '主播已离你而去'
    })
    return false
  },

  createContext: function() {
    this.setData({
      livePlayerContext: wx.createLivePlayerContext('livePlayer')
    })
    console.log("livePlayerContext")
    console.log(this.data.livePlayerContext)
  },

  play: function () {
    if (!this.checkUrl(this.data.src)) {
      return
    }
    var that = this
    that.data.livePlayerContext.play({
      success: function (res) {
        that.setData({
          pulling: true
        })
        console.log('success' + pulling)
      },
      fail: function (res) {
        wx.showToast({
          image: '/image/detail-img/err_icon.png',
          title: '播放失败'
        })
      }
    })
    that.setData({
      pulling: true
    })
  },

  statechange(e) {
    console.log(123)
    console.log(e)
    if ([2006, 3005].indexOf(+e.detail.code) !== -1) {
      this.stop()
      setTimeout(function () {
        wx.showToast({
          image: '/image/detail-img/err_icon.png',
          title: '主播停止推流' + e.detail.code
        })
      }, 800)
    }
    if ([-2301, 3001, 3002, 3003].indexOf(+e.detail.code) !== -1) {
      this.stop()
      setTimeout(function () {
        wx.showToast({
          image: '/image/detail-img/err_icon.png',
          title: '播放失败' + e.detail.code
        })
      }, 800)
    }
  },

  stop: function () {
    var that = this
    this.data.livePlayerContext.stop({
      success: function (res) {
        that.setData({
          pulling: false
        })
      },
      fail: function (res) {
        wx.showToast({
          image: '/image/detail-img/err_icon.png',
          title: '操作失败'
        })
      }
    })
  },

  switchMuted() {
    this.setData({
      muted: !this.data.muted
    })
  },

  swicthObjectFit() {
    this.setData({
      objectFit: this.data.objectFit === 'contain' ? 'fillCrop' : 'contain'
    })
  },

  switchOrientation() {
    this.setData({
      orientation: this.data.orientation === 'vertical' ? 'horizontal' : 'vertical'
    })
  },
})
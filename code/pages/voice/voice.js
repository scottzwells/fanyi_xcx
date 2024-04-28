// pages/voice/voice.js

const recorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    if_voicing : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取全局唯一的录音管理器 RecorderManager实例
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onStop((res) => {
      this.setData({
        tempFilePath: res.tempFilePath // 文件临时路径
      })
      console.log('获取到文件：' + this.data.tempFilePath)
    })
    this.recorderManager.onError((res) => {
      console.log('录音失败了！Error是', res)
    })
  },
  //开始录音
  start: function () {
    this.recorderManager.start({
      duration: 60000,
      sampleRate: 16000, //采样率，有效值 8000/16000/44100
      numberOfChannels: 1, //录音通道数，有效值 1/2
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小
      audioSource: 'auto' //指定录音的音频输入源，可通过 wx.getAvailableAudioSources() 获取
    })
    this.if_voicing = true  // 起始状态是播放中
    console.log("开始,voice状态：", this.if_voicing)
  },

    //录音暂停OR继续，依据if_voicing来判断
  state_change: function () {
    if (this.if_voicing == true)
    {
      //录音暂停
      this.recorderManager.pause()
      this.if_voicing = false
      console.log("暂停,voice状态：", this.if_voicing)
    }
    else
    {
       //继续录音
      this.recorderManager.resume()
      this.if_voicing = true
      console.log("继续,voice状态：", this.if_voicing)
    }
  },

  //录音停止
  stop: function () {
    this.recorderManager.stop()
    console.log("停止,voice状态：", this.if_voicing)
  },
  
  //播放录音
  play: function () {
    // 获取innerAudioContext实例
    const innerAudioContext = wx.createInnerAudioContext()
    // 是否自动播放
    innerAudioContext.autoplay = true
    // 设置音频文件的路径
    innerAudioContext.src = this.data.tempFilePath;
    // 播放音频文件
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    });
    // 监听音频播放错误事件
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  
})


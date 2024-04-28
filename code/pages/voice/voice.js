// pages/voice/voice.js

// const recorderManager = wx.getRecorderManager()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    if_voicing : 1,  // 1.就绪 2.正在录音 3.正在暂停
    state_change_text : "开始录音",  // 当if_voicing=1,2,3依次显示"开始录音","暂停","继续"
    recordTime: 0,  // 用于存储录音时间，单位：秒
    tipState : "录音未开始"  // 给用户提供的提示信息，会显示在屏幕上
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer = null; // 初始化计时器

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


  //录音暂停OR继续，依据if_voicing来判断
state_change: function () {
    if (this.if_voicing == 2) {
        //录音暂停
        this.recorderManager.pause();
        clearInterval(this.timer);  // 结束计时器（但保留了recordTime数据，可以近似等效为暂停）
        this.if_voicing = 3;
        this.state_change_text = "继续";
        this.tipState = "录音已暂停"
        console.log("暂停录音了~~~,voice状态：", this.if_voicing, "text：", this.state_change_text);
    } else if (this.if_voicing == 3) {
        //继续录音
        this.recorderManager.resume();
        this.if_voicing = 2;
        this.state_change_text = "暂停";
        this.tipState = "录音已开始"
        console.log("继续录音中~~~,voice状态：", this.if_voicing, "text：", this.state_change_text);
        // 从保存的recordTime中继续计时器
        this.timer = setInterval(() => {
            this.setData({ recordTime: this.data.recordTime + 1 });
        }, 1000);
    } else {
        // 开始录音
        this.recorderManager.start({
            duration: 60000,
            sampleRate: 16000,
            numberOfChannels: 1,
            encodeBitRate: 96000,
            format: 'mp3',
            frameSize: 50,
            audioSource: 'auto'
        });
        this.if_voicing = 2;
        this.state_change_text = "暂停";
        this.tipState = "录音已开始"
        console.log("开始,voice状态：", this.if_voicing);
        this.setData({ recordTime: 0 });  
        // 启动计时器
        this.timer = setInterval(() => {
            this.setData({ recordTime: this.data.recordTime + 1 });
        }, 1000);
    }
    this.setData({ state_change_text: this.state_change_text,  tipState: this.tipState});
},


  //录音停止
  stop: function () {
    clearInterval(this.timer);  // 暂停计时器
    this.recorderManager.stop()
    this.if_voicing = 1  // 等待录音开始中阿巴阿巴~~~
    this.state_change_text = "开始录音"
    this.tipState = "录音结束"
    console.log("停止,voice状态：", this.if_voicing)
    this.setData({ state_change_text: this.state_change_text, tipState: this.tipState});
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


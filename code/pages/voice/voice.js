// pages/voice/voice.js
import {translate_api} from '../index/index.js'
import {Text2Voice} from '../index/index.js'
// const recorderManager = wx.getRecorderManager()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sourceLanguage:'zh',          
    sourceLanguage_id:1537,        // 默认源语音为普通话
    sourceLanguage_show: '普通话',  // 显示的源语言
    targetLanguage:'en',           // 默认源语言为英语
    targetLanguage_show: '英语',    // 显示的目标语言
    s_languages:['zh','en','zh','zh'],         // 源语言列表
    s_languages_id:[1537,1737,1637,1837],      // 源语言pid
    s_languages_show:['普通话','英语','粤语','四川话'], // 显示源语言列表
    t_languages: ['zh', 'en', 'jp', 'fr', 'ru', 'it'], // 支持的目标语言列表
    t_languages_show: ['中文', '英语', '日语', '法语', '俄语', '意大利'],  // 显示目标语言列表


    if_voicing : 1,  // 1.就绪 2.正在录音 3.正在暂停
    state_change_text : "开始录音",  // 当if_voicing=1,2,3依次显示"开始录音","暂停","继续"
    recordTime: 0,  // 用于存储录音时间，单位：秒
    tipState : "录音未开始",  // 给用户提供的提示信息，会显示在屏幕上
    InputVoiceUrl: "", // 录音地址
    inputContent: "",  // 录音转化后的文本
    outputContent: "", // 翻译后的文本
    filesize:0,   // 录音文件字节数
    token:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer = null; // 初始化计时器
    // this.getToken();
    //获取全局唯一的录音管理器 RecorderManager实例
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onStop((res) => {
      this.setData({
        InputVoiceUrl: res.tempFilePath // 文件临时路径
      });
      console.log('获取到文件：' + this.data.InputVoiceUrl);
      var that = this;
      //获取文件长度
      wx.getFileSystemManager().getFileInfo({
        filePath: this.data.InputVoiceUrl,
        success: function (res) {
          that.setData({filesize: res.size})
          console.log('文件长度', res)
          that.recVoice()
        }, 
        fail: function (res) {   
          console.log("读取文件长度错误",res);
        }
      });
    })
    this.recorderManager.onError((res) => {
      console.log('录音失败了！Error是', res)
    })
  },

  // 获取token
  getToken:function(){
    let that=this;
    let ApiKey='IYb8DGX8HEMIoBWk3d7B7cw8';//自己的apikey
    let SecretKey='absWpjshXySyUufrsU1ph3sYpHN6kWdP';//自己的SecretKey
    const url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+ApiKey+'&client_secret='+SecretKey
    wx.request({
        url:url,
        method: 'POST',
        success(res){
          console.log("创建access_token成功",res)
          that.setData({
            token:res.data.access_token
          });
        },
    });
  },

  // 选择源语言
  selectSourceLanguage: function (e) {
    const index = e.detail.value;
    console.log(index);
    const selectedLanguage = this.data.s_languages[index];
    const selectedLanguage_id = this.data.s_languages_id[index];
    const selectedLanguage_show = this.data.s_languages_show[index];
    console.log(selectedLanguage_id);
    this.setData({
      sourceLanguage: selectedLanguage,
      sourceLanguage_id: selectedLanguage_id,
      sourceLanguage_show: selectedLanguage_show
    });
  },

  // 选择目标语言
  selectTargetLanguage: function (e) {
    const index = e.detail.value;
    console.log(index);
    const selectedLanguage = this.data.t_languages[index];
    const selectedLanguage_show = this.data.t_languages_show[index];
    console.log(selectedLanguage);
    this.setData({
      targetLanguage: selectedLanguage,
      targetLanguage_show: selectedLanguage_show
    });
  },

  // 清空输入框
  clearInput: function () {
    this.setData({
      inputContent: '' // 清空输入框内容
    });
  },

  // 复制到剪贴板
  copyOutput: function () {
    wx.setClipboardData({
      data: this.data.outputContent, // 设置剪贴板的内容为输入框的文字
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
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
            format: 'wav',
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
    innerAudioContext.src = this.data.InputVoiceUrl;
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

  // 获取输入框的内容
  onInput: function (e) {
    this.setData({
      inputContent: e.detail.value
    })
    console.log("这是在函数onInput里面的输出：输入数据是", this.data.inputContent, "  source:", this.data.sourceLanguage, "  target:", this.data.targetLanguage);
  },

  // 语音识别
  recVoice: function (){
    const voiceUrl = this.data.InputVoiceUrl;
    console.log("获取的录音地址:", voiceUrl)
    if (!voiceUrl) {
      wx.showToast({
        title: '请先录音',
        icon: 'none'
      });
    return;
    }
    // 获取接口地址
    const voice_url = "http://vop.baidu.com/server_api";
    const token = "24.ac01b2ed7d141bee9092f99f09c087cf.2592000.1718281481.282335-70632248"; // 百度接口访问令牌
    const size = this.data.filesize;
    const pid = this.data.sourceLanguage_id;
    let that = this;
    console.log("录音文件大小有",size);
    // 将语音转换成 Base64 格式
    wx.getFileSystemManager().readFile({
      filePath: voiceUrl,
      encoding: 'base64',
      success: (res) => {
        const file_content = res.data;
        console.log("转化成功\n")
        // 发起网络请求
        wx.request({
          url: voice_url,
          data: {
            token:token,
            cuid: "fanyi_xcx",
            format:'wav',
            rate:16000,
            channel:1,
            speech: file_content,
            len:size,
            dev_pid:pid,
          },
          headers: {
            'Content-Type': 'application/json' 
          }, 
          method: "post",
          success: (res) => {
            // 解析返回结果
            const result_json = res.data;
            console.log("百度API返回值:\n", result_json);
            if (res.data.result == '') {
              wx.showModal({
                title: '提示',
                content: '听不清楚，请重新说一遍！',
                showCancel: false
              })
              return;
            }
            if(res.data.err_no != 0){
              wx.showModal({
                title: '提示',
                content: '识别失败！',
                showCancel: false
              })
              return;
            }
            let origin_text = '';
            for (let result of result_json.result)
            {
              origin_text += result+'\n';
            }
            origin_text = origin_text.trim();  // 去掉最后一个换行符
            this.setData({inputContent:origin_text});
          },
          fail: (err) => {
            console.error('调用语音识别接口失败', err);
            this.setData(
              {outputContent: "调用语音识别接口失败", err}
            )
          }
        });
      },

      fail: (err) => {
        console.error('读取录音失败', err);
      }

    });
  },

  // 语音翻译
  tranVoice: function(){
    if (!this.data.inputContent) {
      this.setData({
        outputContent: "请先录音"
      });
      return ;
    };
    let origin_text = this.data.inputContent;
    // 调用翻译函数，将原始文本翻译为目标语言
    let tran_text = translate_api(origin_text,this.data.sourceLanguage, this.data.targetLanguage);
    console.log("tran_text:", tran_text)
    // // 创建一个空数组来存储每个Promise的结果
    // let results = [];
    // 使用Promise.all等待所有Promise完成
    tran_text.then((results) =>
    {
      console.log("^^^^^^^^^^^^^^^^^^^^^");
      console.log("Results:", results); // 输出所有Promise的结果
      console.log(origin_text); // 输出识别到的文字
      
      this.setData(
        {outputContent: results}
      )

    }).catch((error) => {
      console.error("Error:", error);
    });
  },

  // 文本转语言
  output2voice: function(){
    let language = ''  // 只能是zh_CN或en_US
    console.log(this.data.targetLanguage)
    if (this.data.targetLanguage == 'zh')
    {
      language = 'zh_CN'
      Text2Voice(this.data.outputContent, language);
    }
    else if (this.data.targetLanguage=='en')
    {
      language = 'en_US'
      Text2Voice(this.data.outputContent, language);
    }
    else
    {
      wx.showToast({
        title: '不支持的语种，语音合成只支持中文和英语',
        icon: 'none',
        duration: 2000  // 提示框显示时间，单位为毫秒
      });
    }
    console.log("语音识别", language)
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


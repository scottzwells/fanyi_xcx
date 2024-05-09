// pages/index/index.js

import { translate } from '../../utils/baidu-translate-api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent: "",  // 输入文本
    outputContent: "这是初始文本",  // 输出结果
    sourceLanguage: 'zh', // 默认源语言为中文
    targetLanguage: 'en', // 默认目标语言为英语
    sourceLanguage_show: '中文', // 显示的源语言
    targetLanguage_show: '英语', // 显示的目标语言
    languages: ['zh', 'en', 'ja'], // 支持的语言列表
    languages_show: ['中文', '英语', '日语']  // 显示语言列表
    // 参考https://quickref.cn/docs/iso-639-1.html来修改语言列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    console.log('options inputContent:', options.inputContent)
    console.log('options outputContent:',options.outputContent)
    if (options.inputContent&&options.outputContent) {
      this.setData({
        inputContent: options.inputContent,
        outputContent:options.outputContent
      })
    }
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

  // 获取输入框的内容
  onInput: function (e) {
    this.setData({
      inputContent: e.detail.value
    })
    console.log("这是在函数onInput里面的输出：输入数据是", this.data.inputContent, "  source:", this.data.sourceLanguage, "  target:", this.data.targetLanguage);
  },

  // 清空输入框
  clearInput: function () {
    this.setData({
      inputContent: '' // 清空输入框内容
    });
  },

  // 翻译输入框的内容
  translate_input: function()
  {
    console.log("开始翻译")

    if (!this.data.inputContent) {
      this.setData({
        outputContent: "请输入正确的文本"
      });
      return ;
    };

    this.translate_api(this.data.inputContent).then(result => {
      const res = result; // 要在translate_api完成后才能设置数据
      console.log("output:将setData", res)
      this.setData({
        outputContent: res
      });
    });
  },

  // 调用翻译API并更新历史界面
  translate_api: function (inputText)
  {
    // 该函数是全局的翻译api函数
    // 请在调用前判断是否是!inputText
    // :param inputText: [传入]翻译的文本
    // :param sourceLanguage: [内部]应当在每个翻译页面里实现
    // :param targetLanguage: [内部]应当在每个翻译页面里实现

  
    console.log("在函数translate_api里: inputText是：", inputText);
    
    // 情况1：没有输入，给出提示
    // 注：该功能要求在外部实现。
    // if (!inputText) {
    //   return "请在输入框中输入有效的文本";
    // };

    // 情况2：有输入，翻译
    return new Promise((resolve, reject) => {
    console.log("from: " ,this.data.sourceLanguage || 'auto',"to: ", this.data.targetLanguage)
    translate(inputText, {
      from: this.data.sourceLanguage || 'auto',
      to: this.data.targetLanguage
    }).then(res => 
      {
        let src =''  // 原文
        for(let ori of res.trans_result){
          src+= ori.src+'\n'
        }
        let dst=''  // 译文
        for(let target of res.trans_result){
          dst+= target.dst+'\n'
        }
        console.log(src, "->", dst)

        // 更新历史记录
        let history = wx.getStorageSync('history') || []
        history.unshift({
          dst: dst,
          src: src,
          from: res.from,
          to: res.to
        })
        history.length = history.length > 10 ? 10 : history.length
        wx.setStorageSync('history', history)

        console.log("return的结果是：", dst);
        resolve(dst);
      })
    }).catch(error => {
      console.error("翻译失败: ", error);
      reject("翻译失败，请稍后重试");
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


  // 选择源语言
  selectSourceLanguage: function (e) {
    const index = e.detail.value;
    console.log(index);
    const selectedLanguage = this.data.languages[index];
    const selectedLanguage_show = this.data.languages_show[index];
    console.log(selectedLanguage);
    this.setData({
      sourceLanguage: selectedLanguage,
      sourceLanguage_show: selectedLanguage_show
    });
  },

  // 选择目标语言
  selectTargetLanguage: function (e) {
    const index = e.detail.value;
    console.log(index);
    const selectedLanguage = this.data.languages[index];
    const selectedLanguage_show = this.data.languages_show[index];
    console.log(selectedLanguage);
    this.setData({
      targetLanguage: selectedLanguage,
      targetLanguage_show: selectedLanguage_show
    });
  },


  // 导航到图片界面
  navigateToPicture: function () {
    wx.navigateTo({
      url: '/pages/picture/picture' // 跳转到图片页面的路径
    })
  },

  // 导航到语音界面
  navigateToVoice: function () {
    wx.navigateTo({
      url: '/pages/voice/voice' // 跳转到语音页面的路径
    })
  },


  // 导航到历史界面
  navigateToHistory: function () {
    wx.navigateTo({
      url: '/pages/history/history' // 跳转到历史页面的路径
    })
  },










  test_111: function () {
    wx.setClipboardData({
      data: 'data',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  test_out: function (e) {
    this.setData({
      outputContent: e.detail.value
    }
    )
  }

})
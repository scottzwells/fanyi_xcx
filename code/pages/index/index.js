// pages/index/index.js

import { translate } from '../../utils/baidu-translate-api.js';


// 调用翻译API并更新历史界面
function translate_api(inputText, sourceLanguage, targetLanguage) {
  // 该函数是全局的翻译api函数
  // 请在调用前判断是否是!inputText
  // :param inputText: [传入]翻译的文本
  // :param sourceLanguage: [传入]原语言，可选'auto'
  // :param targetLanguage: [传入]目标语言


  console.log("在函数translate_api里: inputText是：", inputText);

  // 情况1：没有输入，给出提示
  // 注：该功能要求在外部实现。
  // if (!inputText) {
  //   return "请在输入框中输入有效的文本";
  // };

  // 情况2：有输入，翻译
  return new Promise((resolve, reject) => {
    console.log("from: ", sourceLanguage, "to: ", targetLanguage)
    translate(inputText, {
      from: sourceLanguage || 'auto',
      to: targetLanguage
    }).then(res => {
      let src = ''  // 原文
      for (let ori of res.trans_result) {
        src += ori.src + '\n'
      }
      let dst = ''  // 译文
      for (let target of res.trans_result) {
        dst += target.dst + '\n'
      }
      console.log(src, "->", dst)
      src = src.trim();  // 去掉最后一个换行符
      dst = dst.trim();  // 去掉最后一个换行符

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
    wx.showToast({
      title: '翻译失败，请稍后重试',
      icon: 'none',
      duration: 2000  // 提示框显示时间，单位为毫秒
    });
    reject("翻译失败，请稍后重试");
  });
}


// 调用语音合成API合成玉输出语音
function Text2Voice(text, language)
{
  // 将languange语种的text变成语音，然后输出语音
  // :param text: 文本
  // :param lauguage: 文本对应的语言
  // 参考文档: https://fuwu.weixin.qq.com/service/detail/0000c6950745e87d6c5a143845c815
  const plugin = requirePlugin("WechatSI")
  console.log("语音合成文本", text)
  if( text == "")
  {
    wx.showToast({
      title: '文本不可以为空',
      icon: 'none',
      duration: 2000  // 提示框显示时间，单位为毫秒
    });
    return ;
  }
  plugin.textToSpeech({
      lang: language,
      tts: true,
      content: text,
      success: function(res)
      {
          // res.filename 是语音文件的临时路径
          console.log("语音文件路径：", res.filename);
          // 播放语音
          let audio = wx.createInnerAudioContext()
          audio.src = res.filename // 设置音频的源
          audio.play() // 播放音频
          audio.onError((res) => {
            this.setData({
              outputContent: res.errMsg + res.errCode
            })
            console.log(res.errMsg)
            console.log(res.errCode)
          })
      },
      fail: function(res)
      {
          console.error("语音转换失败", res);
      }
  });
}




Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent: "",  // 输入文本
    outputContent: "",  // 输出结果
    sourceLanguage: 'auto', // 默认源语言为自动
    targetLanguage: 'en', // 默认目标语言为英语
    sourceLanguage_show: '自动', // 显示的源语言
    targetLanguage_show: '英语', // 显示的目标语言
    source_languages: ['auto', 'zh', 'en', 'jp', 'fra', 'ru', 'it'], // 支持的语言列表
    source_languages_show: ['自动', '中文', '英语', '日语', '法语', '俄语', '意大利'],  // 显示语言列表
    target_languages: ['zh', 'en', 'jp', 'fra', 'ru', 'it'], // 支持的语言列表
    target_languages_show: ['中文', '英语', '日语', '法语', '俄语', '意大利']  // 显示语言列表
    // 参考 https://api.fanyi.baidu.com/doc/21 来修改语言列表，需要注意languages与languages_show的对应顺序
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
    console.log('options outputContent:', options.outputContent)
    if (options.inputContent && options.outputContent) {
      this.setData({
        inputContent: options.inputContent,
        outputContent: options.outputContent
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
  translate_input: function () {
    console.log("开始翻译")

    if (!this.data.inputContent) {
      this.setData({
        outputContent: "请输入正确的文本"
      });
      return;
    };

    translate_api(this.data.inputContent, this.data.sourceLanguage, this.data.targetLanguage).then(result => {
      const res = result; // 要在translate_api完成后才能设置数据
      console.log("output:将setData", res)
      this.setData({
        outputContent: res
      });
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
    const selectedLanguage = this.data.source_languages[index];
    const selectedLanguage_show = this.data.source_languages_show[index];
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
    const selectedLanguage = this.data.target_languages[index];
    const selectedLanguage_show = this.data.target_languages_show[index];
    console.log(selectedLanguage);
    this.setData({
      targetLanguage: selectedLanguage,
      targetLanguage_show: selectedLanguage_show
    });
  },

  output2voice: function(){
    let language = ''  // 只能是zh_CN或en_US
    console.log(this.data.targetLanguage)
    if (this.data.targetLanguage == 'zh')
    {
      language = 'zh_CN'
      // 将待翻译的文本this.data.outputContent(语种是language)转为语音
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

})

module.exports = {
  translate_api: translate_api,
  Text2Voice: Text2Voice
}
// pages/picture/picture.js

import { translate_api } from '../index/index.js'
import {Text2Voice} from '../index/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputImageUrl: '', // 图片的本地路径
    inputContent: '',  // 翻译前的文本
    outputContent: '', // 翻译后的文本
    sourceLanguage: 'auto', // 默认源语言为自动
    targetLanguage: 'en', // 默认目标语言为英语
    sourceLanguage_show: '自动', // 显示的源语言
    targetLanguage_show: '英语', // 显示的目标语言
    source_languages: ['auto', 'zh', 'en', 'jp', 'fra', 'ru', 'it'], // 支持的语言列表
    source_languages_show: ['自动', '中文', '英语', '日语', '法语', '俄语', '意大利'],  // 显示语言列表
    target_languages: ['zh', 'en', 'jp', 'fra', 'ru', 'it'], // 支持的语言列表
    target_languages_show: ['中文', '英语', '日语', '法语', '俄语', '意大利']  // 显示语言列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  /**
   * 生命周期函数--监听页面加载
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

  // 选择图片
  chooseImage: function () {
    wx.chooseMedia({
      count: 1, // 只能选择一张图片
      mediaType: "image",
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 选择成功后将图片路径保存到data中
        const tempFilePath = res.tempFiles[0].tempFilePath;
        console.log("图片地址:", tempFilePath)
        this.setData({
          InputImageUrl: tempFilePath
        });
      },
      fail: (err) => {
        console.log('选择图片失败', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 翻译图片
  tranPic: function () {
    const imageUrl = this.data.InputImageUrl;
    const sourceLanguage = this.data.sourceLanguage;
    const targetLanguage = this.data.targetLanguage
    console.log("获取的图片地址:", imageUrl)
    if (!imageUrl) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    // 获取接口地址，第一个不含位置，第二个含位置
    const OCR_URL = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
    // const OCR_URL = "https://aip.baidubce.com/rest/2.0/ocr/v1/general";
    const token = "24.94deb7dc47383932cd1c247353d0f73a.2592000.1717586926.282335-67532418"; // 百度接口访问令牌


    // 将图片转换成 Base64 格式
    wx.getFileSystemManager().readFile({
      filePath: imageUrl,
      encoding: 'base64',
      success: (res) => {
        const file_content = res.data;
        console.log("转化成功\n")
        // 发起网络请求
        wx.request({
          url: OCR_URL + "?access_token=" + token,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            image: file_content
          },
          success: (res) => {
            let translatedTexts = []; // 用于存储翻译后的文本
            let positions = []; // 用于存储每个文字的位置信息
            // 解析返回结果
            const result_json = res.data;
            console.log("百度API返回值:\n", result_json);
            let origin_text = '';
            for (let words_result of result_json.words_result) {
              origin_text += words_result.words + '\n';
            }
            origin_text = origin_text.trim();  // 去掉最后一个换行符
            // 调用翻译函数，将原始文本翻译为目标语言
            let tran_text = translate_api(origin_text, sourceLanguage, targetLanguage);
            console.log("tran_text:", tran_text)
            // // 创建一个空数组来存储每个Promise的结果
            // let results = [];
            // 使用Promise.all等待所有Promise完成
            tran_text.then((results) => {
              console.log("^^^^^^^^^^^^^^^^^^^^^");
              console.log("Results:", results); // 输出所有Promise的结果
              console.log(origin_text); // 输出识别到的文字

              this.setData(
                {
                  inputContent: origin_text,
                  outputContent: results
                }
              )

            }).catch((error) => {
              console.error("Error:", error);
            });



          },
          fail: (err) => {
            console.error('调用OCR接口失败', err);
            this.setData(
              { outputContent: "调用OCR接口失败", err }
            )
          }
        });
      },

      fail: (err) => {
        console.error('读取图片失败', err);
      }


    });
  },


  // 获取输入框的内容
  onInput: function (e) {
    this.setData({
      inputContent: e.detail.value
    })
    console.log("这是在函数onInput里面的输出：输入数据是", this.data.inputContent, "  source:", this.data.sourceLanguage, "  target:", this.data.targetLanguage);
  },

  tranText: function () {
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

  // 文本转语音
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
})
// pages/picture/picture.js

import {translate_api} from '../index/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputImageUrl: '', // 图片的本地路径
    outputContent: '输出内容' // 翻译后的文本
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


   // 选择图片
   chooseImage: function ()
   {
    wx.chooseMedia ({
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
tranPic: function ()
{
  const imageUrl = this.data.InputImageUrl;
  console.log("获取的图片地址:", imageUrl)
  if (!imageUrl) {
    wx.showToast({
      title: '请先选择图片',
      icon: 'none'
    });
    return;
  }

  // 获取接口地址
  // const OCR_URL = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
  const OCR_URL = "https://aip.baidubce.com/rest/2.0/ocr/v1/general";
  const token = "24.94deb7dc47383932cd1c247353d0f73a.2592000.1717586926.282335-67532418"; // 百度接口访问令牌
  let pic_width = 300
  let pic_height = 200

  // 获取图片信息
  wx.getImageInfo({
    src: imageUrl,
    success (res) {
      console.log(res.width)
      console.log(res.height)
      pic_width = res.width
      pic_height = res.height
    }
  })


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
          for (let words_result of result_json.words_result)
          {
            origin_text += words_result.words;
            console.log(words_result.words, '^^^', origin_text)
            // 调用翻译函数，将原始文本翻译为目标语言
            let tran_text = translate_api(words_result.words, 'zh', 'en');
            console.log(tran_text)
            translatedTexts.push(tran_text);
            // 记录文本的位置信息
            let position = {
                top: words_result.location.top,
                left: words_result.location.left
            };
            positions.push(position);
          }
          
          console.log("-----------------")
          console.log(translatedTexts)
          console.log(positions)

          // 创建一个空数组来存储每个Promise的结果
          let results = [];
          // 使用Promise.all等待所有Promise完成
          Promise.all(translatedTexts).then((results) =>
          {
            console.log("^^^^^^^^^^^^^^^^^^^^^");
            console.log("Results:", results); // 输出所有Promise的结果
            
            console.log(pic_width, pic_height)

            // 获取 canvas 上下文
            const ctx = wx.createCanvasContext('canvasId');
            // 绘制原始图片
            // ctx.drawImage(imageUrl, 0, 0, pic_width, pic_height); // 绘制原始图片
            ctx.drawImage(imageUrl, 0, 0, 250, 150); // 绘制原始图片
            // 设置字体颜色为红色
            ctx.setFillStyle('red');
            // 绘制翻译后的文本
            for (let i = 0; i < results.length; i++) {
              let tran_text = results[i];
              let position = positions[i];
              console.log("--", i, tran_text, position.left, position.top)
              ctx.fillText(tran_text, position.left, position.top);
            }
            // 绘制到 canvas 上
            ctx.draw();
            // ctx.draw(false, () => {
            //   wx.canvasToTempFilePath({
            //     canvasId: 'canvasId',
            //     success: function (res) {
            //       // res.tempFilePath 包含生成的图片文件路径
            //       console.log("翻译后的图片的地址", res.tempFilePath);
            //     }
            //   });
            // });


            console.log(origin_text); // 输出识别到的文字
            this.setData(
              {outputContent: origin_text}
            )

          }).catch((error) => {
            console.error("Error:", error);
          });


          
        },
        fail: (err) => {
          console.error('调用OCR接口失败', err);
          this.setData(
            {outputContent: "调用OCR接口失败", err}
          )
        }
      });
    },

    fail: (err) => {
      console.error('读取图片失败', err);
    }


  });
}

})
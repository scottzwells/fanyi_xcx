// pages/picture/picture.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '' // 图片的本地路径

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
   chooseImage: function () {
    wx.chooseMedia ({
      count: 1, // 只能选择一张图片
      mediaType: "image",
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 选择成功后将图片路径保存到data中
        const tempFilePath = res.tempFiles[0].tempFilePath;
        console.log(tempFilePath)
        this.setData({
          imageUrl: tempFilePath
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
  }

})
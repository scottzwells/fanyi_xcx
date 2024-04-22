// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  // 导航到历史界面
  navigateToHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history' // 跳转到历史页面的路径
    })
  },

  // 清空输入框
  clearInput: function() {
    this.setData({
      inputContent: '' // 清空输入框内容
    });
  },


  // 复制到剪贴板
  copyOutput: function() {
    wx.setClipboardData({
      data: this.data.outputContent, // 设置剪贴板的内容为输入框的文字
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  test_111 : function()
  {
    wx.setClipboardData({
      data: 'data',
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

})
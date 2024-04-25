// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [], // 历史记录数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 加载历史记录
    this.loadHistory();
  },
  
  // 加载历史记录
  loadHistory: function () {
    // 从本地存储获取历史记录
    let history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        historyList: history
      });
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
  onShow: function () {
    // 从本地存储中获取历史记录，并设置到页面数据中
    this.setData({
      history: wx.getStorageSync('history')
    })
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

  }
})
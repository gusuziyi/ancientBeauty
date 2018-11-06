// miniprogram/pages/list/list.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		favArr: [],
		shopData: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.showLoading({
			title: '玩命加载中',
		})
		this.setData({
			shopData: app.globalData.shopData,
		})
		wx.hideLoading()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		this.setData({
			favArr: app.globalData.favArr
		})

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function(e) {
		return {
			title: '美妆小铺古风版',
			path: 'pages/list/list',
			success: function(res) {
				// 转发成功
				console.log("转发成功:" + JSON.stringify(res));
			},
		}
	},
})

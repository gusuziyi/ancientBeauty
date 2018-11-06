// miniprogram/pages/cart/cart.js
let db = require('../component/util/databaseGuide');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		shopsArr: [],
		shopChecked: [],
		favArr: [],
		likeArr: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.cloud.callFunction({
			name: 'login',
			data: {},
			success: res => {
				// console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData.openid = res.result.openid
			},
			fail: err => {
				console.error('[云函数] [login] 调用失败', err)
			}
		})
		this.setData({
			favArr: app.globalData.favArr
		})
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
		// 		if (!app.globalData.openid) {
		// 			wx.switchTab({
		// 				url: '../my/my'
		// 			})
		// 			wx.showToast({
		// 				icon: "none",
		// 				title: '请登录以查看购物车',
		// 				duration:3000
		// 			})
		// 			return
		// 		}
		wx.showLoading({
			title: '玩命加载中',
		})
		let whereInfo = {
			_openid: app.globalData.openid
		}
		let shopChecked = []
		db.onQuery('cart', whereInfo, res => {
			for (let i = 0; i < res.length; i++) {
				shopChecked.push({
					shops: res[i].shops,
					value: false,
					shopList: []
				})
				// console.log(res,shopChecked);
				for (let j = 0; j < res[i].shop.length; j++) {
					shopChecked[i].shopList.push(false)
				}
			}
			this.setData({
				shopsArr: res,
				shopChecked
			})
			wx.hideLoading()
		})
		let likeArr = app.globalData.likeArr
		if (!likeArr) {
			this.likeQuery()
		}else{
			this.setData({likeArr})
			this.cart = this.selectComponent('#cart')
			this.cart.initLike(likeArr)
		}
		
	},
	likeQuery() {
		let _ = wx.cloud.database().command
		let sellRandom = Math.floor(Math.random() * 200) + 150
		let whereInfo = {"sellNum": _.gt(sellRandom)}
		// console.log(sellRandom,whereInfo)
		db.onQuery('shop', whereInfo, res => {
			let sellBestArr = []
			res.forEach(i => {
				sellBestArr.push({
					title: "近期全网热销商品",
					shop: i
				})
			})
			if (sellBestArr.length > 4)
				sellBestArr = sellBestArr.slice(0, 4)
			console.log("[猜你喜欢][匹配三]:热销", sellRandom, sellBestArr)
			this.cart = this.selectComponent('#cart')
			this.cart.initLike(sellBestArr)
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
	onShareAppMessage: function() {

	}
})

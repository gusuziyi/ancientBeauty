// miniprogram/pages/logistics/logistics.js
const app = getApp()
let db = require('../component/util/databaseGuide');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		shopsArr: [],
		favArr: [],
		shopNum: 0,
		empty: "请将商品加入购物车",
		empty2:"即可在地图上绘制物流轨迹",
		likeArr:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		if (!app.globalData.openid) {
			wx.cloud.callFunction({
				name: 'login',
				data: {},
				success: res => {
					console.log('[云函数] [login] user openid: ', res.result.openid)
					app.globalData.openid = res.result.openid
				},
				fail: err => {
					console.error('[云函数] [login] 调用失败', err)
				}
			})
		}
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
		wx.showLoading({
			title: '玩命加载中',
		})
		let whereInfo = {
			_openid: app.globalData.openid
		}
		let shopChecked = []
		db.onQuery('cart', whereInfo, res => {
			let shopNum=0
			if (res.length) {//购物车不为空,计算shop种类
				res.forEach(i=>{
					shopNum+=i.shop.length
				})
			}
			this.setData({
				shopsArr: res,
				shopNum
			})
			wx.hideLoading()
		})
		let likeArr = app.globalData.likeArr 
		if (!likeArr) { //不存在智能推荐,即未查看过商品,推荐全网热销
			this.likeQuery()
		}else{ 
			this.setData({likeArr})
			this.maybeLike = this.selectComponent('#maybeLike')
			this.maybeLike.initLike(likeArr)
		}
	},
	likeQuery() {//查询全网热销
		let _ = wx.cloud.database().command
		let sellRandom = Math.floor(Math.random() * 200) + 50
		//近期销量大于50-250的商品
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
			this.maybeLike = this.selectComponent('#maybeLike')
			this.maybeLike.initLike(sellBestArr)
		})
	},
	goShops(e) {
		let shops = e.currentTarget.dataset.shops
		let area = e.currentTarget.dataset.area
		wx.navigateTo({
			url: "../shops/shops?shops=" + shops + "&area=" + area
		})
	},
	showShop(e) {
		let id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '../shops/shop/shop?id=' + id
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

	},
	queryLogitics(e) {
		let shopsArea=e.currentTarget.dataset.area
		this.logistics = this.selectComponent('#logistics')
		this.logistics.showModal(shopsArea)
	},
	onPay() {
		wx.navigateTo({
			url: '../pay/pay'
		})
	}

})

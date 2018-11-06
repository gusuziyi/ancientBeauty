// miniprogram/pages/list/list.js
const app = getApp()
let db = require('../component/util/databaseGuide');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cutId: '', //一个套餐
		groupId: [], //两个团购商品
		hotId: [], //四个热卖商品
		imgUrls: [], //四个轮播图
		shareUrl: '',
		hasFav:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		//GetOpenid
		this.initFav()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	initData() {//在主页随机推荐商品
		let cutId = Math.floor(Math.random() * 10) + 1
		let groupId = [],
			imgUrls = []
		groupId.push(Math.floor(Math.random() * 5) + 1)
		groupId.push(Math.floor(Math.random() * 5) + 6)
		let hotIdSet = [1, 2, 3, 4, 5, 6, 7, 8, 9,10]
		let hotId = []
		for (let i = 0; i < 4; i++) { //随机四幅图片
			let index = Math.floor(Math.random() * hotIdSet.length)
			hotId.push(hotIdSet[index])
			imgUrls.unshift('cloud://yun-first-47b560.7975-yun-first-47b560/img/car-' + hotIdSet[index] + '.jpg')
			hotIdSet.splice(index, 1)
		}
		// console.log(imgUrls, hotId);
		this.setData({
			cutId,
			groupId,
			hotId,
			imgUrls
		})
		this.cut = this.selectComponent('#buyCut')
		this.cut.initCut(cutId)
		this.group = this.selectComponent('#buyGroup')
		this.group.initGroup(groupId)
		if(this.data.hasFav){
			this.hot = this.selectComponent('#buyHot')
			this.hot.initHot(this.data.hotId)
		}
		 wx.hideLoading()
	},
	initFav() { //初始化本地收藏夹
		let whereInfo = {}
		db.onQuery('shop', whereInfo, res => {
			let that=this
			let shopData = res
			app.globalData.shopData = shopData //shop表数据
			wx.getStorage({
				key: "myfav",
				success(res) {
					app.globalData.favArr = res.data
					console.log("已加载收藏夹:myfav");
					that.setData({hasFav:true})
					that.hot = that.selectComponent('#buyHot')
					that.hot.initHot(that.data.hotId)
				},
				fail(res) {
					let favArr = []
					for (let i = 0; i < shopData.length; i++) {
						favArr.push(false)
					}
					wx.setStorage({ //建立收藏夹缓存
						key: "myfav",
						data: favArr
					})
					app.globalData.favArr = favArr
					console.log("新建收藏夹:myfav");
					that.setData({hasFav:true})
					that.hot = that.selectComponent('#buyHot')
					that.hot.initHot(that.data.hotId)
				}
			})

		})
	},
	onReady: function() {},


	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		wx.showLoading({
			title: '玩命加载中',
		})
		this.initData()
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
			path: 'pages/index/index',
			success: function(res) {
				// 转发成功
				console.log("转发成功:" + JSON.stringify(res));
			},
		}
	},
})

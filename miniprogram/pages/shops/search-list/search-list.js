// miniprogram/pages/shops/search-list/search-list.js
const db = require('../../component/util/databaseGuide')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		searchResult: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let searchResult = []
		let searchStr = options.searchStr
		let database = wx.cloud.database(),
			_ = database.command,
			reg= new RegExp(searchStr,'i'), //该关键字的正则
			searchArr = [{"shops": searchStr}, {"area": searchStr}, {"class": searchStr}, {"shop": searchStr},{"altTypes.value":searchStr},{"altSizes.value":searchStr}]
		let whereInfo = _.or(searchArr)
		// console.log(searchArr, whereInfo);
		db.onQuery('shop', whereInfo, res => {//模糊查询
			let searchResult=[]
			searchResult=res
			if(res.length<4){ //结果少于4,再多匹配不多于4个热销商品
				let	random=Math.floor(Math.random()*200)+30
				db.onQuery('shop', {"sellNum":_.gt(random)}, res2 => {
					let addArr=[]
					res2.length>4?addArr=res2.splice(4,res2.length-4):addArr=res2
					searchResult=searchResult.concat(addArr)
					// console.log(res2,random,searchResult);
					let onlyOne=new Set(searchResult)
					searchResult=new Array(...onlyOne)
					this.setData({searchResult})
					console.log("[数据库][模糊查询]成功:", searchResult);
				})
			}else{
				this.setData({searchResult})
				console.log("[数据库][模糊查询]成功:", searchResult);
			}
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

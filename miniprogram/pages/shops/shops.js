// miniprogram/pages/shops/shops.js
let db = require('../component/util/databaseGuide')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		shopsName:'',
		area:"",
		shopsData:[],
		cutData:[],
		groupData:[],
		hotData:[],
		imgUrls:[], //轮播图
		favArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.setData({
			shopsName:options.shops,
			area:options.area,
			favArr:app.globalData.favArr
		})
		let whereInfo={shops:options.shops}
		db.onQuery('shop',whereInfo,res=>{ //加载该店铺商品
			let shopsData=res
			let imgUrls=[]
			shopsData.forEach((i)=>{
				imgUrls.push(i.imgs.car)
			})
			shopsData.sort((a,b)=>{return b.id-a.id})
			//界面上分别显示1,2,4个,其余放在显示更多中
			let cutData=[],
			groupData=[],
			hotData=[]
			shopsData.length>1?cutData=shopsData.slice(0,1):cutData=shopsData,
			shopsData.length>2?groupData=shopsData.slice(0,2):groupData=shopsData,
			shopsData.length>4?hotData=shopsData.slice(0,4):hotData=shopsData
			groupData.sort((a,b)=>{return a.id-b.id})
			hotData.sort((a,b)=>{return a.id-b.id})
			this.setData({
				shopsData,
				imgUrls,
				cutData,
				groupData,
				hotData
			})
			// console.log( whereInfo ,shopsData,imgUrls);
		})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
  	return {
  		title: '美妆小铺古风版',
  		path: 'pages/shops/shops',
  		success: function(res) {
  			// 转发成功
  			console.log("转发成功:" + JSON.stringify(res));
  		},
  	}
  },
})
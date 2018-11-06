// pages/component/index/buy-hot-inner/hot-inner.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		shopData: Object,
		favArr: Array
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		
	},
	ready() {
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		showShop(e) {
			let id = e.currentTarget.dataset.id
			wx.navigateTo({
				url: '../shops/shop/shop?id=' + id
			})
		},
		myFav(e) {
			let index = e.currentTarget.dataset.index,
				favArr = app.globalData.favArr
			favArr[index] = !favArr[index]
			wx.setStorage({
				key: "myfav",
				data: favArr
			})
			let title = ''
			favArr[index] ? title = '已收藏' : title = '已取消,将减少相关推荐',
				wx.showToast({
					title,
					icon: "none"
				})
			this.setData({
				favArr
			})
			app.globalData.favArr = favArr
			// console.log(favArr, index, favArr[index]);
		},
	}
})

// pages/component/cart/maybe-like/maybe-like.js
// let util= require('../../util/util');
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		likeArr: Array,
		/* {title: "近期全网热销商品",shop: shopData} */
		isInShop:Boolean
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		favArr: [],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
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
			this.setData({favArr})
			app.globalData.favArr = favArr
			// console.log(favArr, index, favArr[index]);
		},
		initLike(likeArr) {
			let favArr = app.globalData.favArr
			this.setData({
				likeArr,
				favArr 
			})
		},
		showShop(e){
			let id=e.currentTarget.dataset.id
			if(this.data.isInShop){
				wx.navigateTo({
					url:'../../shops/shop/shop?id='+id
				})
			}else{
				wx.navigateTo({
					url:'../shops/shop/shop?id='+id
				})
			}
			
		},
	}
})

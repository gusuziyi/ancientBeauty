// pages/component/list/shops-list/shops-list.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		favArr:Array,
		shopData:Array
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		myFav(e) {
			let index = e.currentTarget.dataset.index,
			favArr=this.data.favArr
			favArr[index] = !favArr[index]
			wx.setStorage({
				key: "myfav" ,
				data: favArr
			})
			let title = ''
			favArr[index] ? title = '已收藏' : title = '已取消,将减少相关推荐',
				wx.showToast({
					title,
					icon: "none"
				})
			this.setData({
				favArr:favArr
			})
			app.globalData.favArr=favArr
			// console.log(favArr,index,favArr[index]);
		},
		goShop(e){
			let id=e.currentTarget.dataset.id
			// console.log(id);
			wx.navigateTo({
				url:'../shops/shop/shop?id='+id
			})
		}

	}
})

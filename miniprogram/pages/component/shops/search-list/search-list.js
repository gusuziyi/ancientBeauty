// pages/component/shops/search-list/search-list.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		searchResult: Array,
			
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		activePriceUp:'',
		activePriceDown:'',
		activeSell:''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		showShop(e) {
			let id = e.currentTarget.dataset.id
			wx.navigateTo({
				url: '../shop/shop?id=' + id
			})
		},
		goShops(e) {
			let shops = e.currentTarget.dataset.shops
			let area = e.currentTarget.dataset.area
			wx.navigateTo({
				url: "../shops?shops=" + shops + "&area=" + area
			})
		},
		sortPriceUp(){//价格升序
			let activePriceUp=this.data.activePriceUp,
			searchResult=this.data.searchResult
			if(activePriceUp){
				activePriceUp=''
				searchResult.sort((a,b)=>{
					return a.id-b.id
				})
			}else{
				activePriceUp="q-active"
				searchResult.sort((a,b)=>{
					return a.price-b.price
				})
			}
			this.setData({
				activePriceUp,
				searchResult,
				activePriceDown:'',
				activeSell:''
			})
		},
		sortPriceDown(){//价格降序
			let activePriceDown=this.data.activePriceDown,
			searchResult=this.data.searchResult
			if(activePriceDown){
				activePriceDown=''
				searchResult.sort((a,b)=>{
					return a.id-b.id
				})
			}else{
				activePriceDown="q-active"
				searchResult.sort((a,b)=>{
					return b.price-a.price
				})
			}
			this.setData({
				activePriceDown,
				searchResult,
				activePriceUp:'',
				activeSell:''
			})
		},
		sortSell(){//销量降序
			let activeSell=this.data.activeSell,
			searchResult=this.data.searchResult
			if(activeSell){
				activeSell=''
				searchResult.sort((a,b)=>{
					return a.id-b.id
				})
			}else{
				activeSell="q-active"
				searchResult.sort((a,b)=>{
					return b.sellNum-a.sellNum
				})
			}
			this.setData({
				activeSell,
				searchResult,
				activePriceDown:'',
				activePriceUp:''
			})
		}
	}
})

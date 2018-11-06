Component({
	properties: {
		imgUrls:Array
	},
	data: {
		imgLinks:'../shops/shop/shop?id=',
		indicatorDots: true,
		autoplay: true,
		interval: 5000,
		duration: 1000,
		circular:true
	},
	methods: {
		goNav(e){
			let url=e.currentTarget.dataset.url
			url=url.split('.')[1]
			let idOffset=url.lastIndexOf('-')
			let shopid=url.substr(idOffset+1)
			url = this.data.imgLinks+shopid
			wx.navigateTo({
				url
			})
		}
	},

})

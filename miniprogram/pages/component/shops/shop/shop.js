// pages/component/shops/shop/shop.js
let db = require('../../util/databaseGuide');
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		restTime: '',
		shopData: {},
		fav: false, //fav[id-1] id从1开始
		favArr: [],
		choosedSize: {},
		choosedType: {},
		price: 0,
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		onBuy() { //购买窗口
			let choosedSize = this.data.choosedSize,
				choosedType = this.data.choosedType
			this.modal = this.selectComponent("#modal");
			this.modal.showModal([this.data.shopData], choosedSize, choosedType, 0);
		},
		putInCart() { 
			let shopData = this.data.shopData,
				choosedSize = this.data.choosedSize,
				choosedType = this.data.choosedType
			let price = (shopData.price * choosedType.price * choosedSize.price).toFixed(2)
			let cartShop = {
				"id": shopData.id,
				"name": shopData.shop,
				"imgs": shopData.imgs.sqr,
				"price": price,
				"num": 1,
				"types": choosedType.value,
				"sizes": choosedSize.value
			}
			let whereInfo = {
				shops: shopData.shops
			}
			db.onQuery('cart', whereInfo, res => {
				if (res.length == 0) { //无店铺记录,res为shops数组
					let cartInfo = {
						"shops": shopData.shops,
						"area": shopData.area,
						"class": shopData.class,
						"shop": []
					}
					cartInfo.shop.push(cartShop)
					db.onAdd('cart', cartInfo, res => {
						wx.showToast({
							title: '已加购物车',
							icon: 'success',
							duration: 2000
						})
					})
				} else { //有记录,则更新
					// console.log(res);
					let updateData = {
						"shop": []
					}
					let hasSameShop = false
					let shopList = res[0].shop
					shopList.forEach((shop, index) => {
						if (shop.name == shopData.shop && shop.types == choosedType.value && shop.sizes == choosedSize.value) { //存在相同商品,且大小和类型一样
							hasSameShop = true
							shopList[index].num++ //数量增加
						}
					})
					if (!hasSameShop) { //不存在相同商品,在该店铺增加商品
						shopList.push(cartShop)
					}
					updateData.shop = shopList
					db.onEdit('cart', res[0]._id, updateData)
					wx.showToast({
						title: '已加入购物车',
						icon: 'success',
						duration: 2000
					})
				}
			})
		},
		radioChange(e) { //获取用户选择的type和size
			let radioName = e.currentTarget.dataset.name
			let temps = e.detail.value.split(',')
			let radioArr = {
				'price': temps[0],
				'value': temps[1]
			}
			if (radioName == 'choosedSize') {
				this.setData({
					choosedSize: radioArr
				})
			} else if (radioName == 'choosedType') {
				this.setData({
					choosedType: radioArr
				})
			}
			let price = (this.data.shopData.price * this.data.choosedSize.price * this.data.choosedType.price).toFixed(2)
			this.setData({
				price
			})

		},

		_cancelEvent() {
			this.modal.hideModal();
		},
		//确认事件
		_confirmEvent() {
			this.modal.hideModal();
		},
		helloJas() {
			wx.navigateTo({
				url: '../../jas/jas'
			})
		},
		setShopData(id) { //初始化页面
			let that = this
			wx.showLoading({
				title: '玩命加载中',
			})
			let favArr = app.globalData.favArr,
				fav = favArr[id - 1]
			id = parseInt(id)
			let whereInfo = {
				id
			}
			db.onQuery('shop', whereInfo, res => {
				let shopData = res[0]
				let restTime = shopData.restTime
				let price = (shopData.price * shopData.altSizes[0].price * shopData.altTypes[0].price).toFixed(2)
				that.leftTimer(restTime)
				that.setData({
					shopData,
					price,
					favArr,
					fav,
					choosedSize: shopData.altSizes[0],
					choosedType: shopData.altTypes[0],
				})
				// console.log( id ,shopData);
				wx.hideLoading()
				that.initLike(id, shopData.class)
			})

		},

		leftTimer(restTime = 2) {
			let countdownMinute = restTime * 60 * 60 * 1000 //换算成毫秒
			let startTimes = new Date().getTime(); //当前时间
			let endTimes = startTimes + countdownMinute; //结束时间 
			let surplusTimes = endTimes / 1000 - startTimes / 1000;
			// console.log(surplusTimes,startTimes,endTimes);
			// 进入倒计时 
			let countdowns = setInterval(() => {
				surplusTimes--;
				let hours = parseInt(surplusTimes / 60 / 60, 10); //计算剩余的小时
				let minutes = parseInt(surplusTimes / 60 % 60, 10); //计算剩余的分钟
				let seconds = parseInt(surplusTimes % 60, 10); //计算剩余的秒数
				hours = this.checkTime(hours);
				minutes = this.checkTime(minutes);
				seconds = this.checkTime(seconds);
				let restTime = hours + ":" + minutes + ":" + seconds
				this.setData({
					restTime
				})
				if (surplusTimes <= 0) {
					// console.log('时间到！');
					clearInterval(countdowns);
				}
			}, 1000);
		},

		checkTime(i) { //将0-9的数字前面加上0，例1变为01
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		},
		goShare() {
			this.triggerEvent('onShareAppMessage')
		},
		goFav() {
			let id = this.data.shopData.id,
				favArr = this.data.favArr
			let fav = !this.data.fav,
				title = ''
			fav ? title = '已收藏' : title = '取消收藏',
				wx.showToast({
					icon: 'none',
					title
				})
			this.setData({
				fav
			})
			favArr[id - 1] = fav
			wx.setStorage({
				key: "myfav",
				data: favArr
			})
			app.globalData.favArr = favArr

		},
		goShops() {
			let shops = this.data.shopData.shops
			let area = this.data.shopData.area
			wx.navigateTo({
				url: "../shops?shops=" + shops + "&area=" + area
			})
		},
		initLike(id, likeClass) {//初始化智能推荐
			let likeArr = [],
				_ = wx.cloud.database().command,
				that = this
			db.onQuery('shop', {'class': likeClass,id: _.neq(id)}, res => {//0-2个同类产品
				res.forEach(i => {
					likeArr.push({
						title: likeClass + "类的热销产品",
						shop: i
					})
				})
				likeArr.length > 2 ? likeArr = likeArr.slice(0, 2) : ''
				console.log("[猜你喜欢][匹配一]:同类", likeClass, likeArr)

				let favArr = app.globalData.favArr
				let favName = ["写真", "写真", "旅游", "音乐", "写真", "旅游", "写真", "旅游", "音乐", "美妆"]
				let favLike = [] //用户喜欢的类型,用来生成whereInfo
				favArr.forEach((i, index) => {
					if (i) {
						favLike.push({
							"class": favName[index],
							'id': _.neq(id)
						})
					}
				})
				// console.log(favLike.length)//对数组判断非空必须加length
				if (favLike.length) { //收藏夹有记录,根据收藏夹推荐
					let onlyOne = new Set(favLike)
					favLike = new Array(...onlyOne)
					let whereInfo = _.or(favLike)
					db.onQuery('shop', whereInfo, res2 => {
						let favCbArr = []
						res2.forEach(i => {
							favCbArr.push({
								title: "根据您点赞的商品推荐",
								shop: i
							})
						})
						likeArr = likeArr.concat(favCbArr)
						let newLikeArr = that.onlyOne(likeArr)
						newLikeArr.length >4?newLikeArr = newLikeArr.slice(0, 4):""
						console.log("[猜你喜欢][匹配二]:收藏夹", favLike, newLikeArr)
						if (newLikeArr.length ==4) {
							that.maybeLike = that.selectComponent('#maybeLike')
							that.maybeLike.initLike(newLikeArr)
							app.globalData.likeArr=newLikeArr
							return
						}else if(newLikeArr.length <4) { 
							//显示数量小于4不美观,由热销商品补齐
							that.thirdQuery(newLikeArr,id)
						}
					})
				} else {//收藏夹无记录,直接匹配热销
					that.thirdQuery(likeArr,id)
				}

			})

		},
		
		thirdQuery(likeArr,id) {//查询热销商品
			let that = this,
			_= wx.cloud.database().command
			let sellRandom = Math.floor(Math.random() * 200) + 150
			let whereInfo = {
				"sellNum": _.gt(sellRandom),
				'id': _.neq(id)
			}
			// console.log(sellRandom,whereInfo,likeArr)
			db.onQuery('shop', whereInfo, res3 => {
				let sellBestArr = []
				res3.forEach(i => {
					sellBestArr.push({
						title: "近期全网热销商品",
						shop: i
					})
				})
				likeArr = likeArr.concat(sellBestArr)
				let newLikeArr = that.onlyOne(likeArr)
				if(newLikeArr.length > 4) 
					newLikeArr = newLikeArr.slice(0, 4) 
				console.log("[猜你喜欢][匹配三]:热销", sellRandom, newLikeArr)
				that.maybeLike = that.selectComponent('#maybeLike')
				that.maybeLike.initLike(newLikeArr)
				app.globalData.likeArr=newLikeArr //全局,供购物车和物流界面使用
			})
		},
		onlyOne(likeArr){//对象去重
			let newArr=[]
			for(let i=0;i<likeArr.length;i++){//原对象遍历
				let id =likeArr[i].shop.id
				let flag=false
				if(newArr.length){//初始,直接把likeArr[0]push进newArr
					for(let j=0;j<newArr.length;j++){
						let newId=newArr[j].shop.id
						if(id==newId){//重值则不push
							flag=true
							break 
						}
					}
				}
				!flag?newArr.push(likeArr[i]):""
					
			}
			// console.log(likeArr,newArr)
			return newArr
		}
	}
	
})

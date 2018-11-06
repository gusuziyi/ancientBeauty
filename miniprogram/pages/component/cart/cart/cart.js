// pages/component/cart/cart/cart.js
let db = require('../../util/databaseGuide')
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		shopsArr: Array,
		shopChecked: Array,
		/* 
		 {
		 shops:'XXXXX',
		 value:false,
		 shopList:[true,true,false]
		 }
		 */
		likeArr:Array,
		/* {
			shop:'XXXXX',
			title:"XXXX"
		 }
		 */
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		allCheck: false,
		shopNum: 0,
		tatolPrice: 0,
		empty:'购物车竟然空无一物 ~~o(>_<)o~~'
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		initLike(likeArr){ //父组件初始化该组件
			this.maybeLike = this.selectComponent('#maybeLike')
			this.maybeLike.initLike(likeArr)
		},
		onBuy(e) { //单商品购买
			let shopsArr = this.data.shopsArr,
				index = e.currentTarget.dataset.index,
				findex = e.currentTarget.dataset.findex,
				thisShop = shopsArr[findex].shop[index],
				shopNum = thisShop.num,
				shopData = {
					'shopname': shopsArr[findex].shops,
					'name': thisShop.name,
					'num': thisShop.num,
					'size': thisShop.sizes,
					'type': thisShop.types,
					'totalPrice': (thisShop.price * thisShop.num).toFixed(1),
				}
			this.modal = this.selectComponent("#modal");
			this.modal.showModal([shopData], {}, {}, shopNum);
		},
		onBuyAll(e) {//多商品购买
			let shopsArr = this.data.shopsArr,
				shopChecked = this.data.shopChecked,
				shopNum = this.data.shopNum
			if (!shopNum) { //未选择商品
				wx.showToast({
					icon: "none",
					title: '请选择商品'
				})
				return
			} else {
				let shopsname = '',
					shopname = ''
				for (let i = 0; i < shopChecked.length; i++) { //定位第一个商品
					for (let j = 0; j < shopChecked[i].shopList.length; j++) {
						if (shopChecked[i].shopList[j] == true) {
							shopsname = shopChecked[i].shops + "等"
							shopname = shopsArr[i].shop[j].name + "等"
						}
					}
				}
				let shopData = {
					'shopname': shopsname,
					'name': shopname,
					'num': shopNum,
					'size': "混合",
					'type': "多类型",
					'totalPrice': this.data.tatolPrice.toFixed(1),
				}
				this.modal = this.selectComponent("#modal");
				this.modal.showModal([shopData], {}, {}, shopNum);
			}
		},
		onDel(e) { //删除商品
			let index = e.currentTarget.dataset.index,
				shops = e.currentTarget.dataset.shops,
				_id = e.currentTarget.dataset.id
			let shopsArr = this.data.shopsArr
			for (let i = 0; i < shopsArr.length; i++) {
				if (shopsArr[i].shops == shops) {
					shopsArr[i].shop.splice(index, 1) //删除商品
					if (shopsArr[i].shop.length == 0) {
						shopsArr.splice(i, 1)   //删除店铺
						db.onRemove('cart', _id)
					} else {
						db.onEdit('cart', _id, {
							"shop": shopsArr[i].shop
						})
					}
				}
			}
			this.setData({
				shopsArr
			})
			wx.showToast({
				title: "删除成功"
			})

		},
		changeNum(e) { //改变商品数量
			let index = e.currentTarget.dataset.index,
				shops = e.currentTarget.dataset.shops,
				_id = e.currentTarget.dataset.id,
				choose = e.currentTarget.dataset.choose
			let shopsArr = this.data.shopsArr
			for (let i = 0; i < shopsArr.length; i++) {
				if (shopsArr[i].shops == shops) {
					let num = shopsArr[i].shop[index].num
					if (choose == 'down') {
						num <= 1 ? num = 1 : num = num - 1
					} else if (choose == 'up') {
						num++
					} else if (choose == 'input') {
						num = e.detail.value
					}
					shopsArr[i].shop[index].num = num
					db.onEdit('cart', _id, {
						"shop": shopsArr[i].shop
					})
				}
			}
			this.setData({
				shopsArr
			})
			this.checkNum_Price()
		},
		ifAllCheck() { //检查是否店铺全选
			let allCheck = true
			let shopChecked = this.data.shopChecked
			for (let j = 0; j < shopChecked.length; j++) { //是否店铺全选
				if (shopChecked[j].value == false) {
					allCheck = false
					this.setData({
						allCheck
					})
					return
				}
			}
			this.setData({
				allCheck
			})
		},
		checkNum_Price() { //显示商品总数和总价
			let shopNum = 0,
				tatolPrice = 0,
				shopChecked = this.data.shopChecked,
				shopsArr = this.data.shopsArr
			for (let i = 0; i < shopChecked.length; i++) { //定位所有已选择商品
				for (let j = 0; j < shopChecked[i].shopList.length; j++) {
					if (shopChecked[i].shopList[j] == true) {
						shopNum += shopsArr[i].shop[j].num
						let priceTemp = shopsArr[i].shop[j].num * shopsArr[i].shop[j].price
						tatolPrice += priceTemp
					}
				}
			}
			this.setData({
				shopNum,
				tatolPrice
			})
		},
		checkShops(e) { //选择店铺
			let findex = e.currentTarget.dataset.findex
			let shopChecked = this.data.shopChecked
			shopChecked[findex].value = !shopChecked[findex].value
			for (let i = 0; i < shopChecked[findex].shopList.length; i++) {
				if (shopChecked[findex].value) { //全选
					shopChecked[findex].shopList[i] = true
				} else { //反选
					shopChecked[findex].shopList[i] = false
				}
			}
			this.setData({
				shopChecked
			})
			this.ifAllCheck()
			this.checkNum_Price()
			// console.log(shopChecked);
		},
		checkShop(e) {//选择商品
			let index = e.currentTarget.dataset.index,
				findex = e.currentTarget.dataset.findex
			let shopChecked = this.data.shopChecked
			shopChecked[findex].shopList[index] = !shopChecked[findex].shopList[index] //radio 显示状态
			let allCheckInShop = true
			for (let i = 0; i < shopChecked[findex].shopList.length; i++) {
				if (!shopChecked[findex].shopList[i]) { //全选
					allCheckInShop = false
				}
			}
			shopChecked[findex].value = allCheckInShop
			this.setData({
				shopChecked
			})
			this.ifAllCheck()
			this.checkNum_Price()

		},
		allCheck(e) {
			let allCheck = this.data.allCheck
			let shopChecked = this.data.shopChecked
			allCheck = !allCheck
			for (let i = 0; i < shopChecked.length; i++) {
				if (allCheck) { //店铺全选
					shopChecked[i].value = true
				} else {
					shopChecked[i].value = false
				}
				for (let j = 0; j < shopChecked[i].shopList.length; j++) {
					if (allCheck) { //商品全选
						shopChecked[i].shopList[j] = true
					} else {
						shopChecked[i].shopList[j] = false
					}
				}
			}
			this.setData({
				shopChecked,
				allCheck
			})
			this.checkNum_Price()
		},

		showShop(e){
			let id=e.currentTarget.dataset.id
			wx.navigateTo({
				url:'../shops/shop/shop?id='+id
			})
		},
	}
})

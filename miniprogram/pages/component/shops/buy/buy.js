// pages/component/shops/buy/buy.js
const pageData = require('./pageData')
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		isShow: false,
		columnsData: [],
		shopData: [],
		bankData: [],
		address: '点击选择地址'
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		//隐藏弹框
		hideModal() {
			this.setData({
				isShow: false,
				columnsData: [],
				shopData: {},
				bankData: []
			})
		},
		//展示弹框
		showModal(shopsData, choosedSize = {}, choosedType = {}, shopsNum) {
			if (shopsNum == 0) { //非购物车,由shop页面跳转至
				let shopItem = shopsData[0]
				let shopData = {
					'shopname': shopItem.shops,
					'name': shopItem.shop,
					'num': 1,
					'size': choosedSize.value,
					'type': choosedType.value,
					'totalPrice': (shopItem.price * choosedSize.price * choosedType.price).toFixed(2),
					'address': this.data.address
				}
				this.setData({
					isShow: true,
					columnsData: pageData.columnsData,
					shopData,
					bankData: pageData.bankData
				})
			} else if (shopsNum > 0) { //由购物车里跳转至
				let shopData = {}
				if (shopsData.length == 1) { //单个商品结算
					let shopItem = shopsData[0]
					shopData = {
						'shopname': shopItem.shopname,
						'name': shopItem.name,
						'num': shopsNum,
						'size': shopItem.size,
						'type': shopItem.type,
						'totalPrice': shopItem.totalPrice,
						'address': this.data.address
					}
				} else { //全部结算

				}
				this.setData({
					isShow: true,
					columnsData: pageData.columnsData,
					shopData,
					bankData: pageData.bankData
				})
			}
		},
		_cancelEvent() {
			this.hideModal()
			//触发取消回调
			this.triggerEvent("cancelEvent")
		},
		_confirmEvent() {
			//触发成功回调
			let address = this.data.address
			if (address == '点击选择地址') {
				wx.showToast({
					icon: 'none',
					title: "请选择收货地址"
				})
				return
			}
			wx.navigateTo({
				url: '../../pay/pay'
			})
			this.triggerEvent("confirmEvent");

		},
		chooseCity() {
			this.dialog = this.selectComponent("#chooseCity")
			this.dialog.open()
		},
		checkedCity(e) {
			this.setData({
				address: e.detail
			})
		},
		chooseBank(e) {
			let index = e.target.dataset.index
			let payMethod = ''
			index == 0 ? payMethod = '微信' : index == 1 ? payMethod = '支付宝' : payMethod = '京东',
				wx.showToast({
					icon: "none",
					title: "已选择" + payMethod + "支付"
				})
		}
	}
})

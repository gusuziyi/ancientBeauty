// pages/component/logistics/logistics.js
const cityMap = require('./cityMap')
// console.log(cityMap['海门']);
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
		markers: [{
			iconPath: "icons_18.png",
			id: 0,
			longitude: 0,
			latitude: 0,
			width: 30,
			height: 30
		}],
		polyline: [{
			points: [],//{latitude: ,longitude: }
			color: "#800080",
			width: 2,
			dottedLine: true
		}],
		shopsArea:String,
		longitude:0, //用户位置,用于置中地图
		latitude:0
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		hideModal() {
			this.setData({
				isShow: false,
			})
		},
		//展示弹框
		showModal(shopsArea) {
			this.setData({
				isShow: true,
				shopsArea
			})
			wx.showLoading({
				title: '加载地图中',
			})
			let shopsCoord=this.getShopsCoord(shopsArea)//获得卖家坐标
			let that = this;
			wx.getLocation({ //将自己坐标更新到polyline中
				type: "gcj02",
				success: function(res) {
					let latitude = res.latitude;
					let longitude = res.longitude;
					let polyline = that.data.polyline
					let markers=that.data.markers
					polyline[0].points=[]
					polyline[0].points.push({
						latitude: res.latitude,
						longitude: res.longitude
					})
					polyline[0].points.push({
						latitude: shopsCoord[1],
						longitude: shopsCoord[0]
					})
					markers[0].longitude=shopsCoord[0]
					markers[0].latitude=shopsCoord[1]
					that.setData({
						polyline,
						markers,
						longitude,
						latitude
					})
					wx.hideLoading()
				},
				fail(){
					wx.hideLoading()
					wx.showToast({
						title: '绘制失败,请重试',
						icon:"none"
					})
				}
			})
		},
		_confirmEvent() {
			//触发成功回调
			this.hideModal()
		},
		regionchange(e) {
			// console.log(e.type)
		},
		getShopsCoord(shopsArea){
			const contain=(a,b)=>a.indexOf(b)>-1 //判断函数,返回布尔
			let shopsName=Object.keys(cityMap).find(i=>contain(shopsArea,i))//i代表所有key的值
			let shopsCoord=cityMap[shopsName]
			// console.log(shopsName,shopsCoord);
			return shopsCoord
		},
		markertap(e) {
			let shopsArea=this.data.shopsArea
			console.log('地图起始点:',shopsArea)
			let address='发货地 : '+shopsArea
			wx.showToast({
				title:address ,
				icon:'none',
				duration: 3000
			})
		},
	}
})

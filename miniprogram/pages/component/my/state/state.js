// pages/component/my/state/state.js
const app = getApp()
let db = require('../../util/databaseGuide')
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
		weibos: [],
		editFocus: [], //用于控制修改微博聚焦
		editDisabled: [], //用于控制修改微博可更改状态,
		newWeibo: '',
		height: ''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		newWeibo(e) {
			this.setData({
				newWeibo: e.detail.value
			})
		},
		previewImage: function(e) {
			let cloudImgUrls = e.currentTarget.dataset.urls
			let urls = []
			cloudImgUrls.forEach((i) => {
				urls.push(i.fileID)
			})
			wx.previewImage({
				current: e.currentTarget.id, // 当前显示图片的http链接
				urls // 需要预览的图片http链接列表
			})
		},
		showWeibos() {
			let weibos = app.globalData.weibos,
				editFocus = [],
				editDisabled = []
			for (let i = 0; i < weibos.length; i++) {
				editFocus.push(false)
				editDisabled.push(true)
			}
			this.setData({
				weibos,
				editFocus,
				editDisabled
			})
		},
		updateWeibo(newWeibo) {
			let weibos = app.globalData.weibos
			// console.log(weibos);
			weibos.unshift(newWeibo) //dom添加
			this.setData({ //dom刷新
				weibos
			})
		},
		delWeibo(e) {
			let _id = e.currentTarget.dataset.id;
			let index = e.currentTarget.dataset.index;
			let cloudImgUrls = e.currentTarget.dataset.cloudurl
			if(cloudImgUrls){
				let delList = []
				cloudImgUrls.forEach((i) => {
					delList.push(i.fileID)
				})
				// console.log(delList);
				wx.cloud.deleteFile({
					fileList: delList,
					success: res => {
						console.log('已清除图片数据,下面删除该条微博');
					},
					fail: err => {
					}
				})
			}
			db.onRemove('weibo', _id)
			app.globalData.weibos.splice(index, 1) //dom删除
			let weibos = app.globalData.weibos
			this.setData({ //dom刷新
				weibos
			})
		},
		editWeibo(e) {
			let _id = e.currentTarget.dataset.weibo._id;
			let index = e.currentTarget.dataset.index;
			// let userMsg = e.currentTarget.dataset.weibo.userMsg//这是旧微博
			let editFocus = this.data.editFocus,
				editDisabled = this.data.editDisabled
			if (this.data.editDisabled[index]) { //开始更改

			} else { //保存更改
				let userMsg = this.data.newWeibo
				let newWeibo = {
					userMsg
				}
				console.log('新的微博为:' + newWeibo.userMsg);
				wx.showToast({
					title:"修改成功"
				})
				db.onEdit('weibo', _id, newWeibo)
			}
			editFocus[index] = !editFocus[index]
			editDisabled[index] = !editDisabled[index]
			this.setData({ //dom刷新
				editFocus,
				editDisabled
			})
		},
		fitTextarea() {
			let query = wx.createSelectorQuery(); //创建查询对象
			query.select('#textareaDiv').boundingClientRect(); //获取view的边界及位置信息
			query.exec(function(res) {
				that.setData({
					height: res[0].height + "px"
				});
			});
		}
	},


})

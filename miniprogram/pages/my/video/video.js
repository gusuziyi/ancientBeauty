Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 位置
		devicePosition: 'front',
		// 闪光灯
		flash: 'auto',
		// 位置数组
		devicePositions: [{
				name: '后置',
				value: 'back',
			},
			{
				name: '前置',
				value: 'front',
				checked: 'true'
			}
		],
		// 闪光灯数组
		flashs: [{
				name: '自动',
				value: 'auto',
				checked: 'true'
			},
			{
				name: '打开',
				value: 'on',
			},
			{
				name: '关闭',
				value: 'off',
			}
		],
		// 是否拍照
		isTakePhoto: true,
		// 录制状态
		recordState: 0,
		// 下边预览图数组
		dataList: [],
		// 滚动到的位置
		toView: '',
	},
	takePhoto: function() {
		let that = this
		// 获得相机 Context
		let ctx = wx.createCameraContext()
		// 执行拍照
		ctx.takePhoto({
			quality: 'high', // 高质量/正常/低质量
			success: function(res) { // 成功回调
				// console.log(res)
				// 创建预览 item
				let item = {
					type: 'image',
					thumbPath: res.tempImagePath,
					src: res.tempImagePath
				}
				let dataList = that.data.dataList
				// 滚动到最后一张图
				let toView = 'image' + (dataList.length - 1)
				// 添加数据
				dataList.push(item)
				// 刷新页面数据
				that.setData({
					dataList: dataList,
					toView: toView,
					test: res.tempImagePath,
				})
				console.log(dataList, 'image' + (dataList.length - 1))
			}
		})
	},
	deviceRadioChange: function(e) {
		// console.log(e)
		let that = this
		// 获得摄像头位置
		let devicePosition = e.detail.value
		// 刷新页面, 切换摄像头
		that.setData({
			devicePosition: devicePosition
		})
	},
	flashRadioChange: function(e) {
		// console.log(e)
		let that = this
		let flash = e.detail.value
		that.setData({
			flash: flash
		})
	},
	switchChange: function(e) {
		// console.log(e)
		let that = this
		// 获得开关的值
		let change = e.detail.value
		// 刷新页面
		that.setData({
			isTakePhoto: !change
		})
	},
	moduleRadioChange(){
		this.setData({
			isTakePhoto: !this.data.isTakePhoto
		})
	},
	recordVideo: function(e) {
		let that = this
		// 获得相机 Context
		let ctx = wx.createCameraContext(this)
		// 刷新界面
		that.setData({
			recordState: 1
		})
		// 开始录制
		ctx.startRecord({
			success: function(res) {
				console.log(res)
			},
			timeoutCallback: function(res) { // 30s 超时回调
				// console.log(res)
				// 刷新界面
				that.setData({
					recordState: 2
				})
				// 创建预览 item
				let item = {
					type: 'video',
					thumbPath: res.tempThumbPath,
					src: res.tempVideoPath
				}
				let dataList = that.data.dataList
				dataList.push(item)
				that.setData({
					dataList: dataList,
				})
				// 保存相册
				// wx.saveVideoToPhotosAlbum({
				//   filePath: res.tempVideoPath,
				//   success: function(res) {},
				//   fail: function(res) {},
				//   complete: function(res) {},
				// })
			}
		})
	},
	stopRecord: function(e) {
		let that = this
		let ctx = wx.createCameraContext(this)
		that.setData({
			recordState: 2
		})
		ctx.stopRecord({
			success: function(res) {
				// console.log(res)
				let item = {
					type: 'video',
					thumbPath: res.tempThumbPath,
					src: res.tempVideoPath
				}
				let dataList = that.data.dataList
				dataList.push(item)
				that.setData({
					dataList: dataList,
				})
			},
		})
	},
	reRecord(){
		
	},
	imageClick: function(e) {
		// console.log(e)
		// 获得资源类型
		let resType = e.currentTarget.dataset.type
		// 获得资源的路径
		let src = e.currentTarget.dataset.src
		// 判断是否是图片还是视频
		if (resType == 'image') {
			// 预览图像
			wx.previewImage({
				current: src,
				urls: [src],
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
		} else if (resType == 'video') {
			// 挑转视频页面加载视频
			wx.navigateTo({
				url: './play/play?src=' + src,
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
	}

})

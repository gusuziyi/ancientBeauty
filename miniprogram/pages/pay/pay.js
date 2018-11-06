// miniprogram/pages/pay/pay.js
Page({
	/** 
	 * 预览图片
	 */
	data:{
		diff:'cloud://yun-first-47b560.7975-yun-first-47b560/pay/diff.png',
	},
	
	previewImage: function(e) {//显示付款码
		wx.showToast({
			title: '长按二维码可保存',
			icon: 'none',
			duration: 3000
		})
		setTimeout(() => {
			wx.previewImage({
				current: 'cloud://yun-first-47b560.7975-yun-first-47b560/pay/wxpay.jpg', // 当前显示图片的http链接   
				urls: ['cloud://yun-first-47b560.7975-yun-first-47b560/pay/wxpay.jpg'] // 需要预览的图片http链接列表   
			})
		}, 500)
	},
	previewDiff(){
		wx.previewImage({
			current: 'cloud://yun-first-47b560.7975-yun-first-47b560/pay/diff.png',
			urls: ['cloud://yun-first-47b560.7975-yun-first-47b560/pay/diff.png'] 
		})
	},
	onscan() {//扫一扫
		wx.scanCode({
			success: (res) => {
				console.log(res)
			}
		})
	}
})

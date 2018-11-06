// miniprogram/pages/my/video/play/play.js
function getRandomColor() { //用于弹幕颜色
	let rgb = []
	for (let i = 0; i < 3; ++i) {
		let color = Math.floor(Math.random() * 256).toString(16)
		color = color.length == 1 ? '0' + color : color
		rgb.push(color)
	}
	return '#' + rgb.join('')
}

Page({
	data: {
		src: '',
		inputValue: '',
		danmuList: [{
				text: 'QAQ 画质感人',
				color: '#ff0000',
				time: 1
			},
			{
				text: '我来证明你开了弹幕',
				color: '#ff00ff',
				time: 3
			},
			{
				text: '前方核能,非战斗人员退散',
				color: '#0099ff',
				time:5
			},
			{
				text: '前方高能',
				color: '#0000ff',
				time:4
			}
		]
	},
	onLoad: function(options) {
		this.setData({
			src:options.src
		})
		this.videoContext = wx.createVideoContext('myVideo')
	},
	bindInputBlur: function(e) {
		this.data.inputValue= e.detail.value
	},

	bindSendDanmu: function() {
		this.videoContext.sendDanmu({
			text: this.data.inputValue,
			color: getRandomColor()
		})
		this.setData({
			inputValue:''
		})
	}
})

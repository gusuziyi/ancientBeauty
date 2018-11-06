let adapterSource=require('./autoComplete')
Component({
	properties: {
		isSelf: {
			type: Boolean,
			value: false,
		}
	},
	data: {
		inputShowed: false,
		inputVal: "",//点击结果项之后替换文本值
		adapterSource, //本地匹配源
		bindSource: [] //绑定到页面的数据，根据用户输入动态变化
	},
	methods: {
		showInput: function () {
			this.setData({
				inputShowed: true
			});
		},
		hideInput: function () {
			this.setData({
				inputVal: "",
				inputShowed: false
			});
		},
		clearInput: function () {
			this.setData({
				inputVal: ""
			});
		},
		inputTyping: function (e) {
			let prefix = e.detail.value //用户实时输入值
			this.setData({
				inputVal: prefix
			})
			let newSource = [] //匹配的结果
			if (prefix != "") {
				this.data.adapterSource.forEach(function (i) {
					if (i.indexOf(prefix) != -1) {
						newSource.push(i)
					}
				})
			}
			if (newSource.length != 0) {
				this.setData({
					bindSource: newSource
				})
			} else {
				this.setData({
					bindSource: []
				})
			}
		},
		itemtap: function (e) {
			this.setData({
				inputVal: e.target.id,
				bindSource: []
			})
			this.search()
		},
		search(){
			let searchStr=this.data.inputVal
			// console.log(searchStr,this.data.isSelf);
			if(this.data.isSelf){
				wx.redirectTo({
					url: '../search-list/search-list?searchStr='+searchStr
				})
			}else{
				wx.navigateTo({
					url: '../../../../shops/search-list/search-list?searchStr='+searchStr
				})
			}
		}
	}
})

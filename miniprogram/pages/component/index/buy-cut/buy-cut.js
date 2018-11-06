let db = require('../../util/databaseGuide')
Component({
	properties: {
		inShops:Boolean,
		shopData: Array,
		shopsData:Array
	},
	data: {
		shopsData:[]
	},
	methods: {
		initCut(cutId) {//响应首页初始化
			this.selectDB(cutId)
		},
		selectDB(id) {
			let whereInfo = {id}
			db.onQuery('shop', whereInfo, res => {
				let shopData = res
				this.setData({
					shopData
				})
			})
		},
		goGroup(){
			let inShops=this.data.inShops
			if(inShops){
				let str=JSON.stringify(this.data.shopsData)
				wx.navigateTo({
					url:"../suit/suit?shopData="+str
				})
			}else{
				wx.navigateTo({
					url:"../suit/suit"
				})
			}
		},

	}
})

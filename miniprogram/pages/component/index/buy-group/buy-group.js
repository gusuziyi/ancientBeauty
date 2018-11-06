let db = require('../../util/databaseGuide')
Component({
  properties: {
		inShops:Boolean,
		shopData:Array,
		shopsData:Array
  },
  data: {
		
  },
  methods: {
		initGroup(groupId){
			this.selectDB(groupId)
		},
		selectDB(id) { 
			const database = wx.cloud.database()
			const _= database.command
			let whereInfo = _.or([{id:id[0]},{id:id[1]}])
			db.onQuery('shop', whereInfo, res => {
				let shopData = res
				this.setData({
					shopData
				})
				// console.log(shopData);
			})
		},
		goGroup(){
			let inShops=this.data.inShops
			if(inShops){
				let str=JSON.stringify(this.data.shopsData)
				wx.navigateTo({
					url:"../group/group?shopData="+str
				})
			}else{
				wx.navigateTo({
					url:"../group/group"
				})
			}
		},
  }
})

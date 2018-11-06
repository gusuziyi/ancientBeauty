let db = require('../../util/databaseGuide')
const app = getApp()
Component({
  properties: {
		shopData:Array,
		favArr:Array,
		inShops:Boolean,
		shopsData:Array
  },
  data: {
		
  },
  methods: {
   initHot(hotId){
   	this.selectDB(hotId)
   },
   selectDB(id) { 
   	const database = wx.cloud.database()
   	const _= database.command
		let searchId=[]
		id.forEach(i=>searchId.push({id:i}))
		// console.log(searchId);
   	let whereInfo = _.or(searchId)
   	db.onQuery('shop', whereInfo, res => {
   		let shopData = res
			let favArr=app.globalData.favArr
   		this.setData({
   			shopData,
				favArr
   		})
   		// console.log(shopData,favArr);
   	})
   },
	 goGroup(){
	 	let inShops=this.data.inShops
	 	if(inShops){
	 		let str=JSON.stringify(this.data.shopsData)
	 		wx.navigateTo({
	 			url:"../fashion/fashion?shopData="+str
	 		})
	 	}else{
	 		wx.navigateTo({
	 			url:"../fashion/fashion"
	 		})
	 	}
	 },
  }
})

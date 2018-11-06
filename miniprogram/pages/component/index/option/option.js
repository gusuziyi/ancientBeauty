let optionData=require('optionData')
Component({
  properties: {

  },
  data:optionData ,
  methods: {
   goNav(e){
		 let name=e.currentTarget.dataset.name
		 let url=e.currentTarget.dataset.url
		 // console.log(name);
		 if(name=='mei'||name=='wu'){
			 wx.switchTab({
			   url
			 })
		 }else{
			 	 wx.navigateTo({
			 			 url
			 		 })
		 }
	 }
  }
})

// pages/component/list/aside/aside.js
let optionData=require('optionData')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	
  },

  /**
   * 组件的初始数据
   */
  data:optionData,

  /**
   * 组件的方法列表
   */
  methods: {
		goNav(e){
			let name=e.currentTarget.dataset.name
			let url=e.currentTarget.dataset.url
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

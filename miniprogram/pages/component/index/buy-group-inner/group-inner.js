// pages/component/index/buy-group-inner/group-inner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		shopData:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
		showShop(e){
			let id=e.currentTarget.dataset.id
			wx.navigateTo({
				url:'../shops/shop/shop?id='+id
			})
		},
  }
})

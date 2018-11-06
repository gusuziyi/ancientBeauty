// pages/component/index/buy-cut-inner/cut-inner.js
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
			restTime:''
  },
	ready (){
		let restTime=this.data.shopData.restTime;
		this.leftTimer(restTime)
	},

  /**
   * 组件的方法列表
   */
  methods: {
			leftTimer(restTime = 2) {
				let countdownMinute = restTime * 60 * 60 * 1000 //换算成毫秒
				let startTimes = new Date().getTime(); //当前时间
				let endTimes = startTimes + countdownMinute; //结束时间 
				let surplusTimes = endTimes / 1000 - startTimes / 1000;
				// console.log(surplusTimes,startTimes,endTimes);
				// 进入倒计时 
				let countdowns = setInterval(() => {
					surplusTimes--;
					let hours = parseInt(surplusTimes / 60 / 60, 10); //计算剩余的小时
					let minutes = parseInt(surplusTimes / 60 % 60, 10); //计算剩余的分钟
					let seconds = parseInt(surplusTimes % 60, 10); //计算剩余的秒数
					hours = this.checkTime(hours);
					minutes = this.checkTime(minutes);
					seconds = this.checkTime(seconds);
					let restTime = hours + ":" + minutes + ":" + seconds
					this.setData({
						restTime
					})
					if (surplusTimes <= 0) {
						// console.log('时间到！');
						clearInterval(countdowns);
					}
				}, 1000);
			},
			checkTime(i) { //将0-9的数字前面加上0，例1变为01
				if (i < 10) {
					i = "0" + i;
				}
				return i;
			},
			showShop(e){
				let id=e.currentTarget.dataset.id
				wx.navigateTo({
					url:'../shops/shop/shop?id='+id
				})
			},
  }
})

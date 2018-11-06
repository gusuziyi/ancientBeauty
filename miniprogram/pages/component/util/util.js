const myFav=(e)=> {
	let index = e.currentTarget.dataset.index,
		favArr = app.globalData.favArr
	favArr[index] = !favArr[index]
	wx.setStorage({
		key: "myfav",
		data: favArr
	})
	let title = ''
	favArr[index] ? title = '已收藏' : title = '已取消,将减少相关推荐',
		wx.showToast({
			title,
			icon: "none"
		})
	this.setData({
		favArr
	})
	app.globalData.favArr = favArr
	// console.log(favArr, index, favArr[index]);
}

module.exports={
	myFav
}
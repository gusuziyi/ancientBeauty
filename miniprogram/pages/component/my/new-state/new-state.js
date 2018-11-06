// pages/component/my/new-state/new-state.js
const app = getApp()
let db=require('../../util/databaseGuide')
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		files: [], //图片缓存
		uploder: false, //是否显示上传图片界面
		noMorePic: false, //最多三张图
		userMsg: '', //微博博文,
		userMsgId: '', //id用于按时间排序
		weiboTime:''//写作时间
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		showUploder() {//是否显示上传图片界面
			this.setData({
				uploder: true
			})
		},
		hiddenUploder(){//是否显示上传图片界面
			this.setData({
				uploder: false,
				noMorePic: false,
				files: [],
			})
		},
		chooseImage: function (e) {
			var that = this;
			wx.chooseImage({
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					that.setData({
						files: that.data.files.concat(res.tempFilePaths)
					});
					if (that.data.files.length > 2) {
						that.setData({
							noMorePic: true
						});
					}
				}
			})
		},
		deleteImage(e) {
			let that = this
			let files = this.data.files;
			let index = e.currentTarget.dataset.index; //获取当前长按图片下标
			wx.showModal({
				title: '提示',
				content: '确定要删除此图片吗？',
				success: function (res) {
					if (res.confirm) {
						console.log('del pic');
						files.splice(index, 1);
					} else if (res.cancel) {
						return false;
					}
					that.setData({
						files
					});
				}
			})
		},
		previewImage: function (e) {
			wx.previewImage({
				current: e.currentTarget.id, // 当前显示图片的http链接
				urls: this.data.files // 需要预览的图片http链接列表
			})
		},
		bindKeyInput(e) {
			this.setData({
				userMsg: e.detail.value,
			})
		},
		doUpload: function () {
			const openId = app.globalData.openid
			if(!openId){
				wx.showToast({
					icon: 'none',
					title: '亲,要先登录噢~',
				})
				return
			}
			if (this.data.userMsg == '' && this.data.files == "") {
				wx.showToast({
					icon: 'none',
					title: '亲,要输入内容噢~',
				})
				return
			}
			let that = this
			// 选择图片
			let userMsgId = Date.now()
			let d=new Date(),
				year=d.getFullYear(),
				month=d.getMonth()+1,
				day=d.getDate()
			let weiboTime=year+'/'+month+'/'+day
			this.setData({
				userMsgId,
				weiboTime
			})
			if(this.data.files == ""){ //没有图片,只传文字
				this.addIntoDB()
			} else{ //否则递归传图
				let successUp = 0; //成功
				let failUp = 0; //失败
				let imgPaths = this.data.files
				let length = imgPaths.length; //总数
				let count = 0; //第几张
				let cloudImgUrls = [] //存放云端图片路径
				that.uploadOneByOne(cloudImgUrls, imgPaths, successUp, failUp, count, length);
			}
		},

		uploadOneByOne(cloudImgUrls, imgPaths, successUp, failUp, count, length) {
			let that = this;
			wx.showLoading({
				title: '上传第' + (count+1) + '张',
			})
			const openId = app.globalData.openid,
				userMsgId = that.data.userMsgId
			const filePath = imgPaths[count]
			const cloudPath = 'weibo/'+openId + '-' + userMsgId + '-' + count + filePath.match(/\.[^.]+?$/)[0]
			wx.cloud.uploadFile({
				cloudPath,
				filePath,
				name: count, //使用顺序给文件命名
				success: res => {
					cloudImgUrls.push({
						fileID: res.fileID,
					})
					successUp++; //成功+1
				},
				fail: function (e) {
					failUp++; //失败+1
				},
				complete: function (e) {
					count++; //下一张
					if (count == length) {
						console.log('上传图片成功' + successUp + ',' + '失败' + failUp);
						that.addIntoDB(cloudImgUrls) //上传数据库,更新虚拟dom
						
					} else {
						//递归调用，上传下一张
						that.uploadOneByOne(cloudImgUrls, imgPaths, successUp, failUp, count, length);
						console.log('正在上传第' + count + '张');
					}
				}
			})
		},
		addIntoDB(urls=[]){ //上传数据库,更新虚拟dom
			const openId = app.globalData.openid,
				userMsgId = this.data.userMsgId,
				weiboTime=this.data.weiboTime,
				userMsg=this.data.userMsg,
				cloudImgUrls=urls
			let weibo = {
				openId,
				userMsgId,
				weiboTime,
				userMsg,
				cloudImgUrls
			}
			this.setData({
				files: [],
				uploder: false,
				noMorePic: false,
				userMsg: '',
				userMsgId: ''
			})
			db.onAdd('weibo',weibo,res=>{
				weibo._id=res.id
				wx.showToast({
					title: '发布成功' ,
					icon: 'success',
					duration: 2000
				})
				this.triggerEvent('addweibo',weibo)
			}) //collection,doc
		}
	}
})

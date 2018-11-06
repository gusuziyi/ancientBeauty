// pages/component/my/userinfo/userinfo.js
const app = getApp()
let db= require('../../util/databaseGuide');
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
		avatarUrl: 'user-unlogin.png',
		userInfo: {},
		logged: false,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onGetUserInfo: function (e) {
			if (!wx.cloud) {
				wx.showModal({
					title: '初始化失败',
					content: '基础库错误,无法使用云能力',
					showCancel: false,
					confirmColor: '#ff0000',
					success: function (res) {
						if (res.confirm) {
							console.log('请使用 2.2.3 或以上的基础库以使用云能力')
						}
					}
				});
				return
			}
			let that=this
			if (!this.data.logged && e.detail.userInfo) {
				console.log('[取得用户信息]:',e.detail);
				this.setData({
					logged: true,
					avatarUrl: e.detail.userInfo.avatarUrl,
					userInfo: e.detail.userInfo
				})
			}else{
				this.setData({
					logged: false,
					avatarUrl: 'user-unlogin.png',
					userInfo: {}
				})
				wx.showToast({
					icon: 'success',
					title: '退出登录',
				})
				// app.globalData.openid =null
				return 
			}
			//GetOpenid
			wx.cloud.callFunction({
				name: 'login',
				data: {},
				success: res => {
					console.log('[云函数] [login] user openid: ', res.result.openid)
					app.globalData.openid = res.result.openid
					that.getUserWeibos('oCCgN5OsJd1h4yLW2MTtPIzHRwV0') //此处显示展示微博
					if(res.result.openid!='oCCgN5OsJd1h4yLW2MTtPIzHRwV0'){
						that.getUserWeibos(res.result.openid)//登录成功,获取用户状态
					}
				},
				fail: err => {
					console.error('[云函数] [login] 调用失败', err)
				}
			})
		},
		getUserWeibos(openid){
			let whereInfo={_openid:openid}
			db.onQuery('weibo',whereInfo,res=>{
				let weibos=res
				weibos.sort((a,b)=>{
					return b.userMsgId-a.userMsgId
				})
				let allWeibos=app.globalData.weibos
				if(allWeibos){
					app.globalData.weibos=weibos.concat(allWeibos)
				}else{
					app.globalData.weibos=weibos
				}
				if(weibos){
					this.triggerEvent('getweibos')
				}
			})
		}
	}
})

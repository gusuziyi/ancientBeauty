// util/databaseGuide.js

const onAdd = function (collection, doc, cb) {
	const db = wx.cloud.database()
	db.collection(collection).add({
		data: doc,
		success: res => {
			// 在返回结果中只包含新创建的记录的 _id
			console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
			cb({
				id: res._id
			})
		},
		fail: err => {
			wx.showToast({
				icon: 'none',
				title: '新增记录失败'
			})
			console.error('[数据库] [新增记录] 失败：', err)
		}
	})
}

const onQuery = function (collection, whereInfo, cb) {
	const db = wx.cloud.database()
	// 查询当前用户所有的 counters
	db.collection(collection).where(whereInfo).get({
		success: res => {
			console.log('[数据库] [查询记录] 成功: ', res)
			cb(res.data)
		},
		fail: err => {
			console.error('[数据库] [查询记录] 失败：', err)
			cb(null)
		}
	})
}

const onRemove = function (collection, _id) {
	const db = wx.cloud.database()
	db.collection(collection).doc(_id).remove({
		success: res => {
			wx.showToast({
				title: '删除成功',
			})
		},
		fail: err => {
			wx.showToast({
				icon: 'none',
				title: '删除失败',
			})
			console.error('[数据库] [删除记录] 失败：', err)
		}
	})
}

const onEdit = function (collection, _id, newDoc) {
		const db = wx.cloud.database()
		// const newCount = this.data.count + 1
		db.collection(collection).doc(_id).update({
			data: newDoc,
			success: res => {
				console.log('[数据库] [更新记录] 成功：'+res.errMsg)
			},
			fail: err => {
				icon: 'none',
				console.error('[数据库] [更新记录] 失败：', err)
			}
		})
	}

	module.exports = {
		onAdd,
		onQuery,
		onRemove,
		onEdit
	}

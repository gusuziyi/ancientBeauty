let data = {
	'columnsData': [{
		'title': '产品名称',
		'key': 'name'
	}, {
		'title': '产品数量',
		'key': 'num'
	}, {
		'title': '有效期限',
		'key': 'time'
	}, {
		'title': '产品版本',
		'key': 'version'
	}, {
		'title': '总价',
		'key': 'totalPrice'
	}],
	'testData': {
		'shopname':'爱茉莉小店',
		'name': '动态获取',
		'num': 1,
		'size': '大号',
		'type': '加强版',
		'totalPrice': '22元',
		'address':'四川省成都市锦江区天仙桥路2号'
	},
	'bankData': [{
			'id': 0,
			'name': '微信支付',
			'enname': 'wx',
			'src':'./wx.png'
		},
		{
			'id': 1,
			'name': '支付宝',
			'enname': 'zfb',
			'src':'./zfb.png'
		},
		{
			'id': 2,
			'name': '京东',
			'enname': 'jd',
			'src':'./jd.png'
		}
	]

}
module.exports= data

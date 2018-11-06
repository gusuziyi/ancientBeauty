// miniprogram/pages/jas/jas.js
const QA = require('./QA')
Page({
	//定义初始化数据  每当数据发生变化时，会自动触发页面循环
	data: {
		inputValue: '',
		returnValue: '',
		allContentList: [{
			"value": "客服小茉,陪你到天明~"
		}],
		key: "d13b441029804ee99fc4e3b617a5f557", //机器人秘钥
		num: 0,
		is_wx_qq_taobao: true,
	},
	//绑定键盘按下事件，将输入的值赋给data
	bindKeyInput: function (e) {
		this.setData({
			inputValue: e.detail.value
		})

	},
	//点击发送按钮时触发事件，发送数据给机器人
	submitTo: function (e) {
		let that = this;
		//将输入数据追加到列表里面
		that.data.allContentList.push({
			"value": that.data.inputValue
		});
		if (this.data.is_wx_qq_taobao) {
			//小茉机器人:部署于腾讯云
			// this.xiaomoRobotLocal()//本地测试
			that.xiaomoRobot()
		} else {
			//图灵机器人,无需ssl认证
			that.turingRobot()
		}

	},
	xiaomoRobot() {//小茉机器人 :部署于腾讯云,自定义语料文件QA.js
		let that = this
		wx.cloud.callFunction({
			name: 'jas',
			data: {
				inputValue: that.data.inputValue
			},
			success: res => {
				console.log('[云函数] [jas] 返回客服回复: ', res.result)
				that.data.allContentList.push({
					"value": res.result
				});
				//更新dom，循环聊天信息
				that.setData({
					inputValue: '',
					returnValue: res.result,
					allContentList: that.data.allContentList,
				})
			},
			fail: err => {
				console.error('[云函数] [jas] 调用失败', err)
			}
		})

	},
	turingRobot() { //使用图灵机器人
		let that = this;
		let _url = `http://www.tuling123.com/openapi/api`;
		wx.request({
			url: _url,
			data: {
				key: that.data.key,
				info: that.data.inputValue
			},
			//封装返回数据格式
			header: {
				'Content-Type': 'application/json'
			},
			//请求成功的回调
			success: function (res) {
				let data = res.data;
				if (data.code === 100000) { //100000 表示返回成功
					//将返回值追加到列表
					that.data.allContentList.push({
						"value": data.text
					});
					//更新dom，循环聊天信息
					that.setData({
						inputValue: '',
						returnValue: data.text,
						allContentList: that.data.allContentList,
					})

				} else {
					console.log('机器人初始化失败,错误码:' + data.code);
				}
			}
		})
	},
	xiaomoRobotLocal() { //本地测试
		let bestAnswerIndex = 0; //最佳答案序号
		let bestMatchScore = 0; //最佳匹配程度
		let questionString = this.data.inputValue; //用户输入的问题

		//搜寻最接近的问答
		for (let i = 0; i < QA.length; i++) {
			let answerQ = QA[i].Q;
			let matchScore = this.matchRate(questionString, answerQ);
			//alert(matchScore+":"+bestMatchScore);
			//优选出匹配度最高的
			if (matchScore >= bestMatchScore) {
				bestMatchScore = matchScore;
				bestAnswerIndex = i;
			}
			//如果遇到全匹配则跳出搜索循环
			if (matchScore == 100) {
				break;
			}
			//如果识别率为零则生成一个随机应答索引
			//问答知识库头10条记录是为这种情况设定的
			if (bestMatchScore == 0) {
				bestAnswerIndex = Math.floor(Math.random() * 10);
			}

		}
		//依据所获的索引号提取出问题的最佳答案
		let answerString = QA[bestAnswerIndex].A;
		//不能显示太快，否则机器人的痕迹太明显，所以要延迟显示

		let delayTimer = setTimeout(() => {
			this.showAnswer(answerString)
		}, 1000);

	},
	showAnswer(answerString) { //显示问题的答案到屏幕上
		this.data.allContentList.push({
			"value": answerString
		});
		//更新dom，循环聊天信息
		this.setData({
			inputValue: '',
			returnValue: answerString,
			allContentList: this.data.allContentList,
		})
	},
	matchRate(str1, str2) { //str2为数据库语料
		let matchScore = 0,
			matchDot = 0
		str1 = str1.replace(/^\s+|\s+$/gm, '');
		str2 = str2.replace(/^\s+|\s+$/gm, '');
		if (str1 == '' || str2 == '') {
			return 0
		}
		//去除特殊符号以免后续匹配出错
		str1 = str1.replace(/\^|\.|\*|\?|\!|\/|\\|\$|\#|\&|\||,|\[|\]|\{|\}|\(|\)|\-|\+|\=/g, " ");
		str2 = str2.replace(/\^|\.|\*|\?|\!|\/|\\|\$|\#|\&|\||,|\[|\]|\{|\}|\(|\)|\-|\+|\=/g, " ");

		let regw = /\w+/ //判断英文
		let str1Arr, str2Arr
		if (!regw.test(str1)) { //中文按字展开
			str1Arr = [...str1]
		} else { //英文按词展开
			str1 = str1.replace(/\s{2,}/g, " ") //中间可能有多个空格
			str1Arr = str1.split(' ')
		}
		if (!regw.test(str2)) { //中文按字展开
			str2Arr = [...str2]
		} else { //英文按词展开
			str2Arr = str2.split(' ')
		}
		str1Arr = this.onlyOne(str1Arr)
		str2Arr = this.onlyOne(str2Arr)
		// console.log(str1Arr,str2Arr);
		for (let i = 0; i < str1Arr.length; i++) {
			for (let j = 0; j < str2Arr.length; j++) {
				if (str1Arr[i] == str2Arr[j]) {
					matchDot++
				}
			}
		}
		matchScore = Math.floor(matchDot / str1Arr.length * 100)
		return matchScore;
	},
	onlyOne(arr) { //数组去重
		let tempSet = new Set(arr)
		let tempArr = new Array(...tempSet)
		return tempArr
	},


	onLoad: function () {
		// 设置标题
		wx.setNavigationBarTitle({
			title: '客服小茉',
			success: function () {},
			fail: function () {}
		})
	}

})

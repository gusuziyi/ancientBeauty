// 云函数入口文件
exports.main = (event, context) => {
	let {inputValue} = event
	let answerString = xiaomoRobot(inputValue)
	return answerString
}

const xiaomoRobot = (inputValue) => { //本地测试
	const QA = require('./QA')
	let bestAnswerIndex = 0; //最佳答案序号
	let bestMatchScore = 0; //最佳匹配程度
	let questionString = inputValue; //用户输入的问题

	//搜寻最接近的问答
	for (let i = 0; i < QA.length; i++) {
		let answerQ = QA[i].Q;
		let matchScore = matchRate(questionString, answerQ);
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
	return answerString
}

const matchRate = (str1, str2) => { //str2为数据库语料
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
	str1Arr = onlyOne(str1Arr)
	str2Arr = onlyOne(str2Arr)
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
}

const onlyOne = (arr) => { //数组去重
	let tempSet = new Set(arr)
	let tempArr = new Array(...tempSet)
	return tempArr
}

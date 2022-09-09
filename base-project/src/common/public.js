// import moment from 'moment'
import $system from './system'

const Pub = {

	// ================================= 《 针对项目自定义(小写) 》
	
  // 用户Token
  token: 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdC1hcGkuZmVlZHM2LmNvbVwvYXBpXC9sb2dpbl9jb2RlIiwiaWF0IjoxNjYyNDQ3MjM2LCJleHAiOjE2NjMwNTIwMzYsIm5iZiI6MTY2MjQ0NzIzNiwianRpIjoieElnbVZXemFiQmpLT1U5NCIsInN1YiI6NSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.awC_j-DwzBFh1jPmcmyUQLg0LQt4fL-8Q7A0zcR3z_c',
  // 应用ID
  appid: 'wxe814fe9772dcc6df',
  // 用户信息
  userinfo: {},
  // 虚拟货币名称
	virtual: {},

  // 加载缓存数据
  load () {
    // Token
    // this.ACCESS_TOKEN({
    //   success: (res) => { this.token = res }
    // })
    // 用户信息
    this.USER_INFO({
      success: (res) => { this.userinfo = res }
    })
    // 虚拟货币名称
    this.VIRTUAL({
      success: (res) => { this.virtual = res }
    })
  },

  // 拼接 url 和 参数
  queryString (url, query) {
    let str = []
    for (let key in query) {
      str.push(key + '=' + query[key])
    }
    let paramStr = str.join('&')
    return paramStr ? `${url}?${paramStr}` : url
  },

  // ================================= 《 针对项目自定义(大写) 》

  // (获取 || 设置) token
  ACCESS_TOKEN ({ value, success, fail }) {
    if (value === undefined) {
      $system.get({ key: 'token', def: '', success, fail})
    } else {
      this.token = value
      $system.set({ key: 'token', value: value, success, fail })
    }
  },
	
	// (获取 || 设置) userinfo
	USER_INFO ({ value, success, fail }) {
		if (value === undefined) {
      $system.get({ key: 'userinfo', def: {}, success, fail})
    } else {
      this.userinfo = value
      $system.set({ key: 'userinfo', value: value, success, fail })
    }
	},
	
	// 虚拟货币名称
	VIRTUAL ({ value, success, fail }) {
    if (value === undefined) {
      $system.get({ key: 'virtual', def: {}, success, fail})
    } else {
      this.virtual = value
      $system.set({ key: 'virtual', value: value, success, fail })
    }
	},

  // 域名环境
  IS_DEBUG () {
		// if (window.location.host.includes('test') || window.location.host.includes('localhost')) {
		// 	// 调试环境
		// 	return true
		// } else {
		// 	// 线上环境
		// 	return false
		// }
  },

  // 登录
  LOGIN () {

  },
	
	// 退出登录
	LOGOUT () {
	},

  // ================================= 《 正则效验 》

  // 正则匹配是否存在
  REG_TEST (reg, value) {
    var re = new RegExp(reg)
    if (re.test(value)) {
      return true
    } else {
      return false
    }
  },

  // 删除字符串全部空格
  STRING_SPACE_ALL (str) {
    return str.replace(/\s/g, '')
  },

  // 删除字符串左右空格
  STRING_SPACE_LR (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },

  // 删除字符串左边空格
  STRING_SPACE_L (str) {
    return str.replace(/(^\s*)/g, '')
  },

  // 删除字符串右边空格
  STRING_SPACE_R (str) {
    return str.replace(/(\s*$)/g, '')
  },

  // 判断是否为正数（允许小数点，不能为负数）
  REG_IS_NUMBER (value) {
    return (this.REG_TEST(/^\d+(\.\d+)?$/, value))
  },

  // 判断是否为正整数
  REG_IS_INTEGER (value) {
    return (this.REG_TEST(/^\d+$/, value))
  },

  // 判断是否为手机号
  REG_IS_PHONE (value) {
    return (this.REG_TEST(/^1[3456789]\d{9}$/, value))
  },

  // 判断是否为邮箱
  REG_IS_EMAIL (value) {
    return (this.REG_TEST(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, value))
  },

  // ================================= 《 小数点处理 》
	
	// 计算数值单位
	NUMBER_CONVERT (value) {
		// 单位
		let unit = ''
		// 数值
		let num = Number(value || 0)
		// 校验：先判断大的单位
		if (num > 100000000) {
			// 设置单位
			unit = '亿'
			// 计算数值
			num = this.KEEP_NUMBER_DECIMAL({ value: num / 100000000, decimal: 1 })
		} else if (num > 10000) {
			// 设置单位
			unit = '万'
			// 计算数值
			num = this.KEEP_NUMBER_DECIMAL({ value: num / 10000, decimal: 1 })
		}
		// 返回
		return num + unit
	},

  // 检查小数点是否超过指定个数 true: 超过 false：没超过
  CHECK_NUMBER_DECIMAL (value, maxLength) {
    // 转为字符串
    var valueString = `${(value || '')}`
    // 小数长度
    var decimalLength = 0
    // 是否存在小数点
    if (valueString.includes('.')) {
      // 获取小数长度
      decimalLength = valueString.split('.')[1].length
    }
    return decimalLength > maxLength
  },

  // 保留小数点位数
  // value: 数值，支持字符串
  // decimal：保留小数点位数
  // isNumber：是否转为 Number，默认 String
  // isComplete：小数点不够时，是否用 0 尾部进行补全
  // completeMax：补全最大数限制，0：按实际补全，也就是小数点差几位补几位
  KEEP_NUMBER_DECIMAL ({value, decimal, isNumber, isComplete, completeMax=0}) {
    // 字符串
    var valueString = `${value || 0}`
    // 保留小数点位数
    var decimalCount = Math.max(0, decimal)
    // 补全数量
    var completeMaxCount = Math.max(0, completeMax)
    // 数字
    var numberString = valueString
    var decimalString = ''
    // 是否存在小数点
    if (valueString.includes('.')) {
      // 分割
      var strs = valueString.split('.')
      // 记录
      numberString = strs[0]
      decimalString = strs[1]
    }
    // 分割小数点
    if (decimalString.length > decimalCount) {
      // 截取小数点
      decimalString = decimalString.substring(0, decimalCount)
    }
    // 小数位数不够，是否用 0 补全
    if (isComplete && decimalString.length < decimalCount) {
      // 补全位数
      var completeCount = decimalCount - decimalString.length
      // 检查限制
      if (completeMaxCount) { completeCount = Math.min(completeMaxCount, completeCount) }
      // 进行补全
      if (completeCount) { for (let index = 0; index < completeCount; index++) { decimalString += '0' } }
    }
    // 有小数
    if (decimalString.length) {
      // 组合
      numberString += `.${decimalString}`
    }
    // 返回
    return isNumber ? Number(numberString) : numberString
  },

  // ================================= 《 文件路径处理 》

  // 是否为图片
  FILE_IS_IMAGE (filePath, isFuzzy = true) {
    // 后缀列表（如果缺少自行补充）
    const types = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
    // 返回匹配结果
    return this.FILE_IS_TYPE(filePath, types, isFuzzy)
  },

  // 是否为视频
  FILE_IS_VIDEO (filePath, isFuzzy = true) {
    // 后缀列表（如果缺少自行补充）
    const types = ['mp4', 'mp3', 'avi', 'wmv', 'mpg', 'mpeg', 'mov', 'rm', 'ram', 'swf', 'flv', 'wma', 'avi', 'rmvb', 'mkv']
    // 返回匹配结果
    return this.FILE_IS_TYPE(filePath, types, isFuzzy)
  },

  // 检查文件后缀是否为存在指定格式列表中（isFuzzy：如果正常匹配失败，是否允许使用模糊匹配二次匹配）
  FILE_IS_TYPE (filePath, types, isFuzzy = true) {
    // 匹配结果
    var isResult = false
    // 路径有值 && 格式列表有值
    if (filePath && filePath.length && types.length) {
      // 文件后缀
      const type = this.FILE_EXTENSION(filePath)
      // 精确匹配
      isResult = types.indexOf(type.toLowerCase()) !== -1
      // 匹配失败 && 允许模糊匹配
      if (!isResult && isFuzzy) {
        // 匹配是否存在
        types.some(item => {
          // 匹配规则
          var reg = new RegExp(`\\.${item}\\?`, 'i')
          // 匹配结果
          var results = filePath.match(reg) || []
          // 取得结果
          isResult = Boolean(results.length)
          // 返回
          return isResult
        })
      }
    }
    // 返回
    return isResult
  },

  // 获取路径后缀（不带 '.'）
  FILE_EXTENSION (filePath) {
    // 后缀类型
    var type = ''
    // 路径有值
    if (filePath && filePath.length) {
      // 获取路径中最后一个 '.' 位置
      var index = filePath.lastIndexOf('.')
      // 截取尾部后缀
      type = filePath.substr(index + 1)
    }
    // 返回
    return type
  },

  // ================================= 《 JSON 快捷取值 》

  // 获取指定 key 值（参考：https://blog.csdn.net/zz00008888/article/details/123236599）
  VALUE (obj, key) {
    // 当前值
    var value = undefined
    // 是否有值
    if (obj && key) {
      // 赋值
      value = obj
      // 分析大括号
      if (key.includes('[') || key.includes(']')) {
        // 替换符号
        if (key.includes('[')) {
          key = key.replace(new RegExp('\\[', "gm"), '.')
          key = key.replace(new RegExp('\\]', "gm"), '')
        } else {
          key = key.replace(new RegExp('\\]', "gm"), '.')
        }
      }
      // 拆分
      const keys = key.split('.')
      // 过滤出来可用的 keys
      const newKeys = []
      // 过滤
      keys.forEach(itemKey => {
        // 有值则添加
        if (itemKey.length) { newKeys.push(itemKey) }
      })
      // 取值
      newKeys.some(itemKey => {
        // 直接取值
        if (value) { value = value[itemKey] }
        // 是否停止
        return !value
      })
    }
    // 返回
    return value
  },

  // ================================= 《 时间日期 》
	
	// 秒钟转换时间
	TIME_CONVERT (second) {
		// 组装的时间
		var str = ''
		// 秒数
		var second = Math.trunc(second || 0)
		// 小时
		var hour = 0
		var hourSecond = 60 * 60
		// 分钟
		var minute = 0
		var minuteSecond = 60
		// 是否大于小时
		if (second > hourSecond) {
			hour = Math.trunc(second / hourSecond)
			second = second - hour * hourSecond
		}
		// 是否大于分钟
		if (second > minuteSecond) {
			minute = Math.trunc(second / minuteSecond)
			second = second - minute * minuteSecond
		}
		// 组装
		str += (hour > 0 ? (hour < 10 ? `0${hour}:` : `${hour}:`) : '')
		str += (minute < 10 ? `0${minute}:` : `${minute}:`)
		str += (second < 10 ? `0${second}` : `${second}`)
		// 返回
		return str
	},
	
  // 时间转字符串（今天，昨天，xx月xx日，xxxx年xx月xx日）
  // calendars：用于覆盖配置
  // DATE_STRING (dateString, format = 'YYYY-MM-DD HH:mm:ss', calendars = {}) {
  //   // 配置格式
  //   moment.updateLocale('zh-cn', {
  //     calendar: {
  //       // 格式：[中文内容] YYYY-MM-DD HH:mm:ss
  //       // dddd：星期几
  //       // nextDay: '[明天]',
  //       // sameDay: '[今天]',
  //       // lastDay: '[昨天]',
  //       // nextWeek: '[下周] dddd',
  //       // lastWeek: '[上周] dddd',
  //       // sameElse: 'YYYY-MM-DD HH:mm',
  //       nextDay: '[明天] HH:mm',
  //       sameDay: '[今天] HH:mm',
  //       lastDay: '[昨天] HH:mm',
  //       nextWeek: 'dddd HH:mm',
  //       lastWeek: '[上周] dddd HH:mm',
  //       sameElse: 'YYYY-MM-DD HH:mm',
  //       ...calendars
  //     }
  //   })
  //   // 获取结果
  //   const string = moment(dateString, format).calendar()
  //   // 返回结果
  //   return string
  // },

  // 指定的日期时间是否 <= 今天
  // DATE_COMPARE_TODAY (dateString, format = 'YYYY-MM-DD HH:mm:ss') {
  //   // 将日期转换为 date 格式
  //   const date = moment(dateString, format).format('YYYYMMDD')
  //   // 获取今天 date 格式
  //   const toDay = moment().format('YYYYMMDD')
  //   // 返回比较结果
  //   return date <= toDay
  // },
	
	// 指定的时间是否大于等于当前，对比时间戳（dateString：'YYYY-MM-DD HH:mm:ss'）
	TIME_COMPARE_NOW (dateString) {
		// 当前时间
	  let now = new Date() 
	  // 指定时间：转化成 'YYYY/MM/DD HH:mm:ss'
	  let end = new Date(dateString.replace(/-/g,"/"))
		// 对比时间戳
		if (end.getTime() >= now.getTime()) {
			return true
		} else {
			return false
		}
	}
}

// 初始化缓存数据(不能在这里进行初始化，需要放到 onCreate 生命周期函数中，否者会报错)
// Pub.load()

// 导出
export default Pub
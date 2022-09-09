// 参考：https://doc.quickapp.cn/features/system/device.html
import device from '@system.device'
// 参考：https://doc.quickapp.cn/features/system/storage.html
import storage from '@system.storage'
// 参考：https://doc.quickapp.cn/features/system/prompt.html
import prompt from '@system.prompt'
// 参考：https://doc.quickapp.cn/features/system/router.html
import router from '@system.router'

// 便捷系统配置
const system = {
  
  // 系统接口对象
  device,
  storage,
  prompt,
  router,
	// 设备信息
	deviceInfo: {},
  // 屏幕密度
  screenDensity: 0,
	// 屏幕宽度（屏幕总宽度）
	screenWidth: 0,
	// 屏幕高度（屏幕总高度，包含状态栏、导航栏、页面内容、底部Tabbar）
	screenHeight: 0,
	// 页面宽度
	windowWidth: 0,
	// 页面高度（页面内容高度，不包含状态栏、导航栏，自定义导航栏时，跟 screenHeight 一样高）
	windowHeight: 0,
	// 状态栏高度
	statusBarHeight: 0,
	// 导航栏高度(不包括状态栏，单纯的导航条高度)
	navigationBarHeight: 0,
	// 底部 TabBar 菜单栏高度
	tabBarHeight: 0,
	// 整个导航高度(状态栏 + 导航栏)
	topHeight: 0,
	// 整个底部菜单高度(TabBar)
	bottomHeight: 0,

  // storage 存储
  set ({ key, value, success, fail, obj={} }) {
    storage.set({ key, value, success, fail, ...obj })
  },

  // storage 获取
  get ({ key, def, success, fail, obj={} }) {
    storage.get({ key, default: def, success, fail, ...obj })
  },

  // prompt 显示消息
  toast ({ title, duration=0 }) {
    if (!title) return
    prompt.showToast({
      message: title,
      duration: duration
    })
  },

  // router 跳转页面（可以返回）
  push ({ uri, params }) {
    router.push({ uri, params })
  },

  // router 跳转页面（无法返回，类似小程序的 switchTab，例如：切换 Tabbar）
  replace ({ uri, params }) {
    router.replace({ uri, params })
  },

  // router 返回页面（不传返回上一页）
  back (path) {
    router.back({ path })
  },

	// 同步当前配置信息
	load () {
		
    // ---------------------------------------- 设备信息

		// 参考：https://doc.quickapp.cn/features/system/device.html#devicegetinfoobject
		device.getInfo({
      success: (info) => {
        // 系统信息
        this.deviceInfo = info
        // 屏幕密度
        this.screenDensity = info.screenDensity
        // 屏幕宽度
        this.screenWidth = info.screenWidth
        // 屏幕高度
        this.screenHeight = info.screenHeight
        // 页面宽度
        this.windowWidth = info.windowWidth
        // 页面高度
        this.windowHeight = info.windowHeight
        // 状态栏高度
        this.statusBarHeight = 50
        // 导航栏高度
        this.navigationBarHeight = 100 // info.statusBarHeight
        // 底部 TabBar 菜单栏高度
        this.tabBarHeight = 120
	
        // 整个导航高度(状态栏 + 导航栏)
        this.topHeight = this.navigationBarHeight + this.statusBarHeight
        // 屏幕总高度 - 导航高度 - 页面内容高度 = 0（如果不为 0，说明导航栏高度有偏差）
        // console.log(this.screenHeight - this.topHeight - this.windowHeight)
        // 整个底部菜单高度(TabBar)
        this.bottomHeight = this.tabBarHeight
        
        // 初始化 css var 变量
        // 使用格式：height: var(key);
        // 使用格式：height: var(key, 默认值可选填);
        // const style = `
        //   --statusbar-height: ${this.statusBarHeight}px;
        //   --navigationbar-height: ${this.navigationBarHeight}px;
        //   --tabbar-height: ${this.tabBarHeight}px;
        //   --top-height: ${this.topHeight}px;
        //   --bottom-height: ${this.bottomHeight}px;
        //   --bgcolor: yellow;
        // `
        // 自定义 css var 变量如下：
        // --statusbar-height: 				状态栏高度
        // --navigationbar-height:		导航栏高度
        // --tabbar-height:						TabBar 高度
        // --top-height:							整个导航高度(状态栏 + 导航栏)
        // --bottom-height:						整个底部菜单高度(TabBar)
        console.log('输出 System 信息：', this)
      }
    })

    // ---------------------------------------- 用户唯一标识

    // 参考：https://doc.quickapp.cn/features/system/device.html#devicegetuseridobject-1000
    // device.getUserId({
    //   success: (info) => {
    //     // 用户唯一标识符
    //     this.userID = info.userId
    //   }
    // })
	}
}

// 初始化数据(不能在这里进行初始化，需要放到 onCreate 生命周期函数中，否者会报错)
// system.load()

// 导出
export default system
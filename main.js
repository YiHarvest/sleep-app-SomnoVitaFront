import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
import uView from 'uview-ui'

Vue.use(uView)
// 如此配置即可
uni.$u.config.unit = 'rpx'
//导入封装好的请求数据的方法
import {myRequest}  from './util/api.js'
//挂载到vue原型中
Vue.prototype.$globalData = {
	 token:null
  };
Vue.prototype.$myRequest =myRequest;
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

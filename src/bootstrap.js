// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from '@@/iview/dist/iview'
import {Modal} from '@@/iview/dist/iview'
import i18n from '@/locale'
import config from '@/config'
import axios from '@/libs/api.request'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import VueLocalStorage from 'vue-localstorage'
import loadingDirective from './libs/loading.directive'
import './style/style.less'
import '@/assets/icons/iconfont.css'

// 实际打包时应该不引入mock
/* eslint-disable */
//if (process.env.NODE_ENV !== 'production') require('@/mock')
Vue.use(VueLocalStorage)
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$Modal  = Modal

/**
 * @description 注册admin内置插件
 */
export const reg_plugin = ()=>{
	installPlugin(Vue)
}

/**
 * 配置路由
 */
export const config_router = ()=>{
	Vue.prototype.axios = axios
}
/**
 * 配置HTTP
 */
export const config_http = ()=>{
	Vue.prototype.$http = axios
}
/**
 * 注册指令
 */
export const reg_directives = ()=>{
	importDirective(Vue)
	Vue.directive('clickOutside', clickOutside)
	Vue.directive('per',function(el,binding,vnode){
        let pers = vnode.context.$store.state.user.info.pers
        let index = pers.indexOf(binding.value)
        let arg = binding.arg?binding.arg:'display'
        let tag = el.tagName.toLowerCase()
        if(index == -1){
            if(arg == 'disable' && ['button','input'].indexOf(tag) !== -1){
                el.disabled = true
            }else{
                el.style.display = 'none'
            } 
        }
    })
    
    Vue.directive('loading',loadingDirective)
}
/**
 * 注册过滤器
 */
export const reg_filters = ()=>{
	function translate(value){
		let words = store.state.gvars.words
		if(!words){
			return value
		}
		let word = value
		for(let i=0,l=words.length;i<l;i++){
			if(words[i][0] == value){
				word = words[i][1]
				break
			}
		}
		return word
	}

	Vue.filter('translate',translate)
}
/**
 * 启动
 */
export const start = ()=>{
	/* eslint-disable no-new */
	new Vue({
	  el: '#app',
	  router,
	  i18n,
	  store,
	  render: h => h(App)
	})
}

export default {
	config_router,
	config_http,
	reg_directives,
	reg_filters,
	reg_plugin,
	start
}

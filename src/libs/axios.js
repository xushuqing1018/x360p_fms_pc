import axios from 'axios'
import store from '@/store'
import { getToken } from '@/libs/util'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
		this.baseHeaders = {}
    this.queue = {}
  }
	setHeader(key,val){
		this.baseHeaders[key] = val
	}
	removeHeader(key){
		if(typeof this.baseHeaders[key] !== 'undefined'){
			delete this.baseHeaders[key]
		}
	}
  getInsideConfig () {
		let token = getToken()
		if(token){
			this.setHeader('x-token',token)
		}else{
			this.removeHeader('x-token')
		}
    const config = {
      baseURL: this.baseUrl,
      headers: this.baseHeaders
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  watchReqStart(req) {
    if(req.method == 'get'){
      store.commit('httpRequestStart',req.baseURL+req.url)
    }else{
      store.commit('httpSavingStart',{url:req.url,method:req.method})
    }
  }
  watchResEnd(res) {
    if(res.method == 'get'){
      store.commit('httpRequestEnd',res.url)
    }else{
      store.commit('httpSavingEnd',{url:res.url,method:res.method})
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      this.watchReqStart(config)
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.watchResEnd(res.config)
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      this.watchResEnd(errorInfo.config)
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(errorInfo)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
	get(url,params){
		return this.request({
			url:url,
			method:'get',
			params:params
		})
	}
	post(url,data,options = {}){
		return this.request(Object.assign({
			url:url,
			data:data,
			method:'post'
		},options))
	}
	put(url,data,options = {}){
		return this.request(Object.assign({
			url,
			data,
			method:'put'
		},options))
	}
	delete(url){
		return this.request({
			url,
			method:'delete'
		})
	}
}
export default HttpRequest

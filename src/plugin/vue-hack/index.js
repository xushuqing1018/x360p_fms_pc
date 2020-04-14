import rest from '@/libs/rest'
import xmodal from '@/libs/xmodal'
export default {
  install (Vue, options) {
    //if (options.developmentOff && process.env.NODE_ENV === 'development') return
	  Vue.prototype.$filter = function(id){
		return this._f(id)
	  }
	  Vue.prototype.$rest   = rest
	  Vue.use(xmodal)
  }
}

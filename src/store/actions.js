import Api from '@/api/common'

let RETRY_TIMES = {}
let RETRY_DICT_TIMES = {}
let RETRY_DATAROW_TIMES = {}
let RHC = {}	//ROUTER HELP CACHE
export default {
	getGlobalVars({commit,dispatch}){
		return new Promise((resolve,reject)=>{
			Api.getGlobalVar('all').then(response=>{
				commit('setGlobalVars',response.data.data)
				resolve(response.data.data)
			},msg=>{
				if(!RETRY_TIMES[name]){
					RETRY_TIMES[name] = 1
				}else{
					RETRY_TIMES[name]++
				}
				if(RETRY_TIMES[name] > 3){
					reject(msg)
				}else{
					dispatch('updateGlobalVar','all')
				}
				
			})
		})
	},
	updateGlobalVar({commit,dispatch},name){
		return new Promise((resolve,reject)=>{
			Api.getGlobalVar(name).then(response=>{
				commit('updateGlobalVar',{name:name,data:response.data.data})
				resolve(response.data.data)
			},msg=>{
				if(!RETRY_TIMES[name]){
					RETRY_TIMES[name] = 1
				}else{
					RETRY_TIMES[name]++
				}
				if(RETRY_TIMES[name] > 3){
					reject(msg)
				}else{
					dispatch('updateGlobalVar',name)
				}
				
			})
		})
	},
	updateDictList({commit,dispatch},{url,dname}){
		return new Promise((resolve,reject)=>{
			Api.getDataList(url).then(data=>{
				commit('updateDictList',{name:dname,data:data})
				resolve(data)
			},msg=>{
				if(!RETRY_DICT_TIMES[dname]){
					RETRY_DICT_TIMES[dname] = 1
				}else{
					RETRY_DICT_TIMES[dname]++
				}
				if(RETRY_DICT_TIMES[dname] > 3){
					reject(msg)
				}else{
					dispatch('updateDictList',{url:url,dname:name})
				}
			})
		}) 
	},
	
	//初始化一个id 到 map的数据集合
	initIdMap({commit,dispatch,state},{name,idf,txf}){
		return new Promise((resolve,reject)=>{
			Api.getDataRows(name,3000).then(data=>{
				commit('buildIdTextMap',{
					list:data,
					name:name,
					ifield:idf,
					tfield:txf
				})
				resolve(data)
			},msg=>{
				let k = name
				if(!RETRY_DICT_TIMES[k]){
					RETRY_DICT_TIMES[k] = 1
				}else{
					RETRY_DICT_TIMES[k]++
				}
				if(RETRY_DICT_TIMES[k] > 3){
					reject(msg)
				}else{
					dispatch('initIdMap',{name:name,idf:idf,txf:txf})
				}
			})
		})
	},
	getMapTexts({commit,dispatch,state},{ids,name,idf,txf}){
		return new Promise((resolve,reject)=>{
			if(state.maps[name] && state.maps[name][id]){
				resolve(state.maps[name][id][txf])
			}else{
				Api.getDataRowById(id,name).then(data=>{
					commit('updateIdTextMap',{
						item:data,
						name:name,
						ifield:idf,
						tfield:txf
					})
					resolve(data[txf])
				},msg=>{
					let k = name+'-'+id
					if(!RETRY_DICT_TIMES[k]){
						RETRY_DICT_TIMES[k] = 1
					}else{
						RETRY_DICT_TIMES[k]++
					}
					if(RETRY_DICT_TIMES[k] > 3){
						reject(msg)
					}else{
						dispatch('getMapText',{id:id,name:name,idf:idf,txf:txf})
					}
				})
			}
		})
	},
	getMapText({commit,dispatch,state},{id,name,idf,txf}){
		return new Promise((resolve,reject)=>{
			if(state.maps[name] && state.maps[name][id]){
				resolve(state.maps[name][id])
			}else{
				Api.getDataRowById(id,name).then(data=>{
					commit('updateIdTextMap',{
						item:data,
						name:name,
						ifield:idf,
						tfield:txf
					})
					resolve(data.data.data[txf])
				},msg=>{
					let k = name+'-'+id
					if(!RETRY_DICT_TIMES[k]){
						RETRY_DICT_TIMES[k] = 1
					}else{
						RETRY_DICT_TIMES[k]++
					}
					if(RETRY_DICT_TIMES[k] > 3){
						reject(msg)
					}else{
						dispatch('getMapText',{id:id,name:name,idf:idf,txf:txf})
					}
				})
			}
		})
	},
	getMapObject({commit,dispatch,state},{id,name,idf,txf}){
		return new Promise((resolve,reject)=>{
			name = name+'_object'
			if(state.maps[name] && state.maps[name][id]){
				resolve(state.maps[name][id])
			}else{
				Api.getDataRowById(id,name).then(data=>{
					commit('updateIdTextMap',{
						item:data,
						name:name,
						ifield:idf,
						tfield:txf
					})
					resolve(data[txf])
				},msg=>{
					let k = name+'-'+id
					if(!RETRY_DICT_TIMES[k]){
						RETRY_DICT_TIMES[k] = 1
					}else{
						RETRY_DICT_TIMES[k]++
					}
					if(RETRY_DICT_TIMES[k] > 3){
						reject(msg)
					}else{
						dispatch('getMapText',{id:id,name:name,idf:idf,txf:txf})
					}
				})
			}
		})
	}
}
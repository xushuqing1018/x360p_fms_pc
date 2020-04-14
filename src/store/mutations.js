import Vue from 'vue'

function updateGlobalVar(state,{name,data}){
	if(name == 'areas'){
		try{
			let areas = []
			data.forEach(item=>{
    			if(item.level === 1){
    				areas.push({
    					value: item.area_id,
    					label: item.name,
    					children: []
    				})
    			}
    			if(item.level === 2){
    				let parea = areas.find(child=>child.value === item.parent_id)
    				if(parea && parea.children){
    					parea.children.push({
    						value: item.area_id,
	    					label: item.name,
	    					children: []
    					})
    				}          				            										
    			}
    			if(item.level === 3){  
    				let parent = data.find(di=>di.area_id === item.parent_id)
    				let top    = areas.find(ci=>ci.value === parent.parent_id)  
    				let top_children = top.children.find(si=>si.value === item.parent_id) 
    				if(top_children && top_children.children){
    					top_children.children.push({
    						value: item.area_id,
    						label: item.name
    					})
    				}						
    			}            			
    		})
    		Vue.set(state.gvars,name,areas)
    	}catch(e){
    	}
    }else{	
		Vue.set(state.gvars,name,data)
		let sname = name.substr(0,name.length-1)
		if(typeof state.maps[sname] != 'undefined'){
			state.maps[sname] = {}
			state.maps[sname+'_object'] = {}
		}
	}
}

export default {
	addExportTask(state,task){
		state.export.tasks.push(task)
	},
	clearExportTask(state,task){
		state.export.tasks.splice(0,state.export.tasks.length)
	},
	updateUploadTask(state,list) {
		state.upload.upload_task = list	
	},
	updateLoginExpire(state){
		state.user.login_time = Math.floor((new Date()).getTime()/1000)
		Vue.localStorage.set('user',JSON.stringify(state.user))
	},
	setGlobalVars(state,globals){
		for(let o in globals){
			updateGlobalVar(state,{name:o,data:globals[o]})
		}
	},
	setLayout(state,vm){
		state.layout = vm
	},
	updateCenterParams(state,data){
		state.gvars.configs.center_params.fc = data;
	},
	setClient(state,data){
		state.user.client = data;
	},
	updateGlobalVar,
	updateDictList(state,{name,data}){
		Vue.set(state.gvars.dicts,name,data)
	},
	
	buildIdTextMap(state,{list,name,ifield,tfield}){
		let name_object = name+'_object'
		let map = state.maps[name]||{},
			map_object = state.maps[name_object]||{}
		list.forEach(item=>{
			map[item[ifield]] = item[tfield]
			map_object[item[ifield]] = item
		})
		Vue.set(state.maps,name,map)
		Vue.set(state.maps,name_object,map_object)
	},
	updateIdTextMap(state,{item,name,ifield,tfield}){
		let name_object = name+'_object'
		let map = state.maps[name]||{},
			map_object = state.maps[name_object]||{}
		map[item[ifield]] = item[tfield]
		map_object[item[ifield]] = item
		Vue.set(state.maps,name,map)
		Vue.set(state.maps,name_object,map_object) 
	},
	setCache(state,{key,val}){
		Vue.set(state.cache,key,val)
	},

	httpRequestStart(state,url){
		state.http.request = url
		state.http.response = ''
	},
	httpRequestEnd(state,url){
		state.http.response = url
		if(url == state.http.request){
			state.http.request = ''
		}
	},
	httpSavingStart(state,{url,method}){
		state.http.saving = true
	},
	httpSavingEnd(state,{url,method}){
		state.http.saving = false
	},
	startDrag(state,{field,data}){
		state.drag.field = field
		state.drag.data  = data
	},
	endDrag(state){
		state.drag.field = ''
		state.drag.data  =  null
	},
	setSearchInfo(state,{pk,search,params}) {
		state.search.pk = pk
		state.search.fields = search
		state.search.params = params
	},
	setSearchDetail(state,detail) {
		state.search.detail = detail
	},
	addFollowClient(state,{id,name,photo_url}) {
		state.follow_clients.list.push({
			fc_id: id,
			name: name
		})
	},
	removeFollowClient(state,index) {
		state.follow_clients.list.splice(index,1)
	},
	clearFollowClient(state) {
		let length = state.follow_clients.list.length
		state.follow_clients.cursor = 0
		state.follow_clients.list.splice(0,length)
	},
	prevCursor(state) {
		state.follow_clients.cursor--
	},
	nextCursor(state) {
		state.follow_clients.cursor++
	},
}
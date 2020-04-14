import store from '@/store'
import {_} from './util'
import Vue from 'vue'
export default {
    filters:{
        branch_name(bid,empty){
            if(!store.state.maps.branch){
                store.state.maps.branch = {}
                store.state.maps.branch_object = {}
            }
            if(store.state.maps.branch[bid]){
                return store.state.maps.branch[bid]
            }
            let e  = store.state.gvars.branchs.find(item=>item.bid == bid)
            if(e){
                store.state.maps.branch[bid] = e.short_name || e.branch_name
                store.state.maps.branch_object[bid] = e
                return e.branch_name
            }
            return empty||bid
        },
        dpt_name(dpt_id,empty){
            if(!store.state.maps.department){
                store.state.maps.department = {}
                store.state.maps.department_object = {}
            }
            if(store.state.maps.department[dpt_id]){
                return store.state.maps.department[dpt_id]
            }
            let e  = store.state.gvars.departments.find(item=>item.dpt_id == dpt_id)
            if(e){
                store.state.maps.department[dpt_id] = e.dpt_name
                store.state.maps.department_object[dpt_id] = e
                return e.dpt_name
            }
            return empty||dpt_id
        },
        role_name(rid,empty){
            if(!store.state.maps.role){
                store.state.maps.role = {}
                store.state.maps.role_object = {}
            }
            if(store.state.maps.role[rid]){
                return store.state.maps.role[rid]
            }
            let e  = store.state.gvars.roles.find(item=>item.rid == rid)
            if(e){
                store.state.maps.role[rid] = e.role_name
                store.state.maps.role_object[rid] = e
                return e.role_name
            }
            return empty||rid
        },
        ename(eid,empty){
            if(!store.state.maps.employee){
                store.state.maps.employee = {}
                store.state.maps.employee_object = {}
            }
            if(store.state.maps.employee[eid]){
                return store.state.maps.employee[eid]
            }
            let employees  = store.state.gvars.employees||[]
            let e = employees.find(item=>item.eid == eid)
            if(e){
                store.state.maps.employee[eid] = e.ename
                store.state.maps.employee_object[eid] = e
                return e.ename
            }
            return empty||eid
        },
        enames(eids,empty){
            let text = []
            if(!store.state.maps.employee){
                store.state.maps.employee = {}
                store.state.maps.employee_object = {}
            }
            eids.forEach(eid=>{

                eid = parseInt(eid)
                if(store.state.maps.employee[eid]){
                    text.push(store.state.maps.employee[eid])
                    return;
                }
                let e  = store.state.gvars.employees.find(item=>item.eid == eid)
                if(e){
                    store.state.maps.employee[eid] = e.ename
                    store.state.maps.employee_object[eid] = e
                    text.push(e.ename)
                }
            })
            
            return text.length>0?text.join(','):empty
        },
        
    
        //通用字典翻译
		//调用方式 this.$filter('dict_title')(params.row.sale_role_did,'sale_role')
		//模板调用 {{row.sale_role_did|dict_title('sale_role')}}
		//grade 是使用name作关联要单独处理
        dict_title(v,d,empty){
            let dicts = store.state.gvars.dicts
            if(dicts) {
                let list = dicts[d]
                let info
                if(list){
                    info = list.find(item=>item.did == v)
                    if(d=='grade'){
                        info = list.find(item=>item.name==v)
                    }
                    if(info){
                        return info.title
                    }
                }
            }
            return empty
        },
       
    },
    methods: {
    	initGlobal(name){
            return new Promise((resolve,reject)=>{
                if(typeof this.$store.state.gvars[name] === 'undefined'){
                    this.$store.dispatch('updateGlobalVar',name).then((data)=>{
                        resolve(data)
                    },(msg)=>{
                        reject(msg)
                    })
                }else{
                    resolve(this.$store.state.gvars[name])
                }
            })
		},
        initDictList(url,dname,force){
            return new Promise((resolve,reject)=>{
                if(typeof this.$store.state.dicts[dname] === 'undefined' || force === true){
                    this.$store.dispatch('updateDictList',{url:url,dname:dname}).then((data)=>{
                        resolve(data)
                    },(msg)=>{
                        reject(msg)
                    })
                }else{
                    resolve(this.$store.state.dicts[dname])
                }
            })
        },
        
        getDictList(dname){
            return this.$store.getters.getDictList(dname)
        },
        getGlobalVar(name){
            return this.$store.getters.getGlobalVar(name)
        },
        
        ssqFormat(arg1,arg2,arg3) {
            let province,p_name,city,c_name,d_name
            try {
                province = this.areas.find(item=>item.value==arg1)
                p_name   = province.label
                city     = province.children.find(item=>item.value==arg2)
                c_name   = city.label
                d_name   = city.children.find(item=>item.value==arg3).label
            }
            catch(e) {
                console.log(e)
            }
            return p_name+c_name+d_name
        }
    },
    computed:{
    	areas(){
    		return this.$store.getters.getGlobalVar('areas')
    	},
    	
        roles(){        	
        	return this.$store.getters.getGlobalVar('roles')
        },
        pers(){
            return this.$store.getters.getGlobalVar('pers')
        },
       
        configs(){
            return this.$store.getters.getGlobalVar('configs')
        }
    }
}
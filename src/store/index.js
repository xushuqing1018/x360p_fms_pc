import Vue from 'vue'
import Vuex from 'vuex'

import {params} from '@/config'
import user from './module/user'
import app from './module/app'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const getters = {
    isLogin(state){
        let cur_time = (new Date()).getTime() / 1000
        let expired_time = state.user.login_time + state.user.expire_time
        return state.user.login_time > 0 && expired_time > cur_time
    },
    isLock(){
        let islock = Vue.localStorage.get('islock')
        return String(islock) === 'true'
    },
    getGlobalVar:(state,getter)=>(name)=>{
        return state.gvars[name]
    },
    getDictList:(state,getter)=>(name)=>{
        return state.dicts[name]
    },
    getMapText:(state,getter)=>(id,name)=>{
        let map = state.maps[name]
        return map?map[id]:id
    },
    getMapObject:(state,getter)=>(id,name)=>{
        let map = state.maps[name+'_object']
        return map?map[id]:null
    },
    isCache:(state,getter)=>(ck)=>{
        if(state.cache[ck]){
            return true
        }
        return false
    }
}

export default new Vuex.Store({
    state: {
        layout:null,
        config: params,
        sys_name: '加盟商管理系统',
        login_logo: '',
        copyright: '',
        client:null,
        ui: {
            
        },
        user: {
            login_time: 0,
            login_server_time: 0,
            expire_time: 0,
            token: '',
            bid: 0,
            info: null
        },
        gvars: {

        },
        dicts: {

        },
        maps: {

        },
        cache: {

        },
        guide:false,
        is_submit: false,
        is_get: false,
        is_loading: false,
        is_siderbar_min: false,
        is_aside_min: true,
        card: {
            refresh: false,
            type: 'attendance'
        },
        http:{
            saving:false,
            request:'',
            response:''
        },
        drag:{
            field:'',
            data:null
        },
        upload: {
            upload_task: [] 
        },
        arrange:null,
        router_help:[],
        lesson_standard_file: [],
        app:{
            theme:'theme-default',
            color:'#1c2b36'
        },
        scan_reader:{
            times:0,
            code:''
        },
        follow_clients:{
            list:[],
            cursor:0
        },
        market_channels: [],
        latest_version:{
            ver:'',
            content:'',
            vid:0,
            publish_date:0,
            read:0
        },
        search:{
            fields: {

            },
            params: {

            },
            pk: '',
            detail: false
        },
        export:{
            tasks:[]
        }
    },
    mutations,
    actions,
    modules: {
        user,
        app
    },
    getters
})

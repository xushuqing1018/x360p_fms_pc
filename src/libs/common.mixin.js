import moment from 'moment'
import {_} from './util'
import util from './util'
import table2excel from '@/libs/table2excel'

function form(name,v){
	this._form = v.$refs[name]
	return this
}

form.prototype.check = function(){
	return new Promise((resolve,reject)=>{
		this._form.validate((valid)=>{
			if(valid){
				resolve(this._form)
			}else{
				reject()
			}
		})
	})
}

form.prototype.reset = function(){
	this._form.resetFields()
	return this
}

function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        const name = child.$options.name;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            // todo 如果 params 是空数组，接收到的会是 undefined
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}

const BUSINESS_STATUS_MAP = {0:'未选址',1:'筹备期',2:'预售期',3:'正常营业',4:'停业',5:'已解约'}
const REGION_LEVEL_MAP = {1:'一类',2:'二类',3:'三类',4:'四类',5:'五类',6:'六类'}
const STUDENT_STATUS_MAP = {
    1:{text:'正常',color:'blue'},
    50:{text:'结课',color:'#adc6ff'},
    20:{text:'停课',color:'green'},
    30:{text:'休学',color:'red'},
    90:{text:'退学',color:'default'},
    100:{text:'封存',color:'yellow'}
}

export default {
	filters:{
        business_status(v){
            if(typeof BUSINESS_STATUS_MAP[v] != 'undefined'){
                return BUSINESS_STATUS_MAP[v]
            }
            return '-'
        },
        region_level(v) {
            if(typeof REGION_LEVEL_MAP[v] != 'undefined'){
                return REGION_LEVEL_MAP[v]
            }
            return '-'
        },
        sign_status(v) {
            let map = {0:'未签约',1:'已签约',9:'已解约'}
            return map[v]
        },
        system_status(v) {
            let map = {0:'未开通',1:'待审核',2:'已开通'}
            return map[v]
        },
        duration(d) {
            let duration = Number(d)
            let min = Math.floor(duration / 60)
            let sec = Math.round(duration % 60)
            return `${min}′ ${sec}″`
        },
		int_date(day_int){
			day_int = day_int||''
			let s = day_int.toString(),
                t = [],
                l = s.length;
            if (l == 8) {
                t.push(s.substr(0, 4));
                t.push(s.substr(4, 2));
                t.push(s.substr(6, 2));
            } else if (l == 6) {
                for (let i = 0; i < l; i++) {
                    t.push(s.substr(i, 2));
                    i++;
                }
            }
            return t.join('-');
		},
		int_week(day_int){
			let t = ['日', '一', '二', '三', '四', '五', '六'];
            let dt = util.int_day_to_date(day_int);
            return t[dt.getDay()];
		},
        format_int_day(day_str){
            return day_str.toString().replace(/[^\d]+/g,'')
        },
        format_int_hour(hour_str){
            return hour_str.toString().replace(/[^\d]+/g,'')
        },
		int_hour(hour_int){
			hour_int = hour_int||0
			let s = hour_int.toString(),
                t = [],
                l = s.length;
            switch(l){
                case 0:
                    s = '0000';
                    break;
                case 1:
                    s = '000'+s;
                    break;
                case 2:
                    s = '00'+s;
                    break;
                case 3:
                    s = '0'+s;
                    break;
                default:
                    s = s;
            }
            
            for (let i = 0; i < s.length; i++) {
                t.push(s.substr(i, 2));
                i++;
            }
            return t.join(':');
		},
        date(timestamp,format){
            let date = timestamp
            format = format || 'YYYY-MM-DD'
            if(/^\d{7,12}$/.test(timestamp)){
                date = new Date((parseInt(timestamp)*1000))
            }
            return moment(date).format(format)
        },
        moment(date,format){
            return moment(date).format(format)
        },
        week_day_text(week_day,prefix){
            let wd = ['一','二','三','四','五','六','天']
            if(!prefix){
                prefix = '周'
            }
            return prefix+wd[week_day-1]
        },
        sex(sex){
            let map = {0:'-',1:'男',2:'女'}
            return map[sex]
        },
        date_format(v) {
            return v.toString().replace(/^(\d{4})[-/]?(\d{2})[-/]?(\d{2})$/, "$1-$2-$3")
        }
       
	},
    methods: {
        toString(s){
            return s.toString()
        },
        toInt(s){
            return util.int(s)
        },
    	imgLoadError (e) {
    		e.target.src = this.defaultImg$
    	},
    	$form(name){
    		return new form(name,this)
    	},
        $r(name){
            return this.$refs[name]
        },
    	int_day_to_date (int_day) {
    		return util.int_day_to_date(int_day)
    	},
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        },
        dr(){
            return this.$store.state.layout.$refs['dr']
        },
        refreshData(url){
            return this.$store.state.layout.$refs['dr'].refreshData(url)
        },       
        //获取字典值id:字典id或name，name:字典name
        labelDicts (id,field) {
			let [obj,result] = [this.$store.state.gvars.dicts[field],'']
			if(!_.isEmpty(obj)){
				if(field=='grade'||field=='season'){
					if(result = obj.find(o=>o.name==id)){
						result = obj.find(o=>o.name==id).title						
					}
				}
				
				if(obj.find(o=>o.did===id)){
					result = obj.find(o=>o.did===id).title	
				}					
			}
			return result
		},		
		//获取gvars对应值 obj_name：对象名，idfield：主键名，id：主键值，textfield：取值的字段名
		mapGvarsText(obj_name,idfield,id,textfield) {
			let obj = this.$store.state.gvars[obj_name]
			if(obj&&obj.find(o=>o[idfield]==id)){				
				return obj.find(o=>o[idfield]==id)[textfield]				
			}
			return ''
		},
		mapLabelText (id,map_name) {	            
            return this.$store.getters.getMapText(id,map_name)	            
        },
		dicts (type) {
        	let dicts = this.$store.state.gvars.dicts
            if(dicts) {
                let list = dicts[type]
                if(list&&list.length>0){
                    return list
                }
            }
        	return []
        },
	    yearToDate(year){
            return (new Date()).setFullYear(util.int(year))
        },
        hasPer(per){
            return this.$store.state.user.info.pers.indexOf(per) !== -1
        },
        buildIdMap(list,c){
            let map = {
                classrooms:{id:'cr_id',text:'room_name'}
            }
            this.$store.commit('buildIdTextMap',{
                list:list,
                name:c,
                ifield:map[c].id,
                tfield:map[c].text
            })
        },
        refreshGlobalVar(name){
            this.$store.dispatch('updateGlobalVar',name)
        },
       
		picturePreview (src) {
			if(!/$\s*^/.test(src)){
				this.$store.state.layout.$refs['picturePreview']
				.set('imgSrc',src)
				.show('图片预览','add')
			}			
		},
        confirm(text){
            return new Promise((resolve,reject)=>{
                this.$Modal.confirm({
                    title: '提示',
                    content:text||'您确定要进行删除操作吗?',
                    onOk:()=>{
                        resolve()
                    },
                    onCancel:()=>{
                        reject()
                    }
                })
            })
        },
        error(text,title){
            this.$Modal.error({
                title: title||'操作失败提示',
                content: text
            })
        },
        //全屏加载中组件
        showPageSpin (content) {
        	this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('i', {
                            attrs:{
                            	'class': 'mb-3 demo-spin-icon-load ivu-icon ivu-icon-load-c',
                            },         
                            style:{
                            	fontSize: '40px'
                            }
                        }),
                        h('div', content||'正在加载中...')
                    ])
                }
            })
        },
        hidePageSpin () {
        	this.$Spin.hide()
        },
        format_day(int_day){
            if(/^\d{8}$/.test(int_day)){
                return this.$filter('int_date')(int_day)
            }else if(/^\d{4}-\d{2}-\d{2}$/.test(int_day)){
                return int_day
            }
            return ''
        },
        format_hour(int_hour){
            if(/^\d{3,4}$/.test(int_hour)){
                return this.$filter('int_hour')(int_hour)
            }else if(/^\d{2}:\d{2}$/.test(int_hour)){
                return int_hour
            }
            return ''
        },
        exportExcel (file_name,arg) {				
        	table2excel.transform(this.$refs['tableExcel'], 'hrefToExportTable', file_name,arg);
        },
        isBefore(date1,date2){
        	return moment(date1).isBefore(date2)
        },
        transformDate(res) {
            for(let key in res) {
                if(_.isArray(res[key])) {
                    res[key].forEach(item => {
                        if(item.day) {
                            item.day = moment(item.day).format('MM/DD')
                        }
                    })
                }
            }
            return res
        },
        gvars (type) {
        	let gvars = this.$store.state.gvars
        	return gvars[type]||[]
        },
        replaceFileImage(item) {
            const suffixs = ['txt','doc','pdf','rar','zip','xls','ppt']
            let type = item.file_type
            if(type === 'pptx') {
                type = 'ppt'
            }
            if(type === 'docx') {
                type ='doc'
            }
            if(type === 'xlsx') {
                type = 'xls'
            }
            if(suffixs.indexOf(type) > -1) {
                return `https://sp1.xiao360.com/static/file/icon/${type}.png?imageView2/3/w/63/h/63`
            }else{
                return `https://sp1.xiao360.com/static/file/icon/default.png?imageView2/3/w/63/h/63`
            }
        },
        convertImageToCanvas (image) {
		    var canvas = document.createElement("canvas");
		    canvas.width = image.width;
		    canvas.height = image.height;
		    canvas.getContext("2d").drawImage(image, 0, 0);
		    return canvas;
		}
    },
    computed:{
        sign_map() {
            return {
                9:{label: '已解约',color: 'text-danger'},
                1:{label: '已签约',color: 'text-success'},
                0:{label: '未签约',color: 'text-info'}
            }
        },
        business_status_list(){
            return BUSINESS_STATUS_MAP
        },
        region_level_list() {
            return REGION_LEVEL_MAP
        },
        label_sale() {
            return this.$filter('translate')('渠道销售')
        },
        label_service() {
            return this.$filter('translate')('督导')
        },
        ss_map(){
            return STUDENT_STATUS_MAP
        },
        trial_times () {
            let map = [],
                week_days = ['周一','周二','周三','周四','周五','周六','周日'],
                sections = ['上午','下午','晚上']
            for(let i=0,len=week_days.length;i<len;i++) {
                for(let j=0,len=sections.length;j<len;j++) {
                    let item = week_days[i] + sections[j]
                    map.push({
                        value: (i+1).toString()+(j+1).toString(),
                        label: item
                    })
                }
            }
            return map
        },
        userPers() {
            return this.$store.state.user.info.pers
        },
        org_name(){
            return this.$store.state.gvars.configs.franchisee_params.org_name
        },
    	defaultImg$ () {
    		return 'http://s1.xiao360.com/common_img/avatar.jpg'
    	},
        eid$ () {
        	if(!_.isEmpty(this.$store.state.user.info.employee)){
        		return this.$store.state.user.info.employee.eid
        	}
   			return 0
   		},
        bids_user () {
            if(!_.isEmpty(this.$store.state.user.info.employee)){
                return this.$store.state.user.info.employee.bids
            }
            return []
        },
        //归属校区
        bid_user () {
            if(!_.isEmpty(this.$store.state.user.info.employee)){
                return this.$store.state.user.info.employee.bid
            }
            return 0
        },
        rids_user () {
            if(!_.isEmpty(this.$store.state.user.info.employee)){
                return this.$store.state.user.info.employee.rids
            }
            return []
        },	
        sub_eids() {
            let employee = this.$store.state.user.info.employee
            if(!_.isEmpty(employee)&&employee.sub_eids){
                return employee.sub_eids
            }
            return []
        },
        is_admin () {
            return this.$store.state.user.info.is_admin === 1
        },
        saving(){
            return this.$store.state.http.saving
        },
        current_year(){
            return (new Date()).getFullYear()
        },
        ueconfig(){
            return {
                toolbars: [
                    ['simpleupload', 
                    'insertimage', 
                    'link', 
                    'spechars', 
                    'justifyleft', 
                    'justifyright', 
                    'justifycenter', 
                    'justifyjustify', 
                    'undo', 
                    'redo', 
                    'bold']
                ],
                elementPathEnabled: false,
                wordCount: false,           
                initialFrameHeight: 400,
                initialFrameWidth: 680,
                imagePathFormat: '/upload',
                enableAutoSave: false,
                autoHeightEnabled: true
            }
        } 
    }
}
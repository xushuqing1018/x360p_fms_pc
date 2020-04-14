<template>
	<Modal draggable :mask-closable="false" v-model="modal$.show" :title="modal$.title" width="700">
        <div class="text-center mb-4">
            <RadioGroup v-model="group" type="button">
                <Radio label="system">系统规格</Radio>
                <Radio label="account" v-if="modal$.action!=='edit'">账号信息</Radio>
                <Radio label="basic">基本信息</Radio>
            </RadioGroup>
        </div>

        <system-group :info="info" :modal="modal$" v-if="group=='system'"></system-group>
        <account-group :info="info" v-if="group=='account'&&modal$.action!=='edit'"></account-group>
        <info-group :info="info" :modal="modal$" v-show="group=='basic'"></info-group>
        
    	<div slot="footer">
            <Button type="text" @click="close">关闭</Button>
            <Button type="primary" :loading="saving" @click="save">{{btn_text}}</Button>
        </div>
    </Modal>
</template>

<script>
    import pinyin from '@/libs/pinyin'
	import util,{_} from '@/libs/util'
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
    
    import InfoGroup from './info-group.vue'
    import SystemGroup from './system-group.vue'
    import AccountGroup from './account-group.vue'

	const INFO_NAME = '加盟商'
	const INFO_PK_ID = 'og_id'
	const INFO_URL   = 'orgs'

	const emptyObject = {
        org: {
            og_id: 0,
            parent_og_id: 0,
            org_name: '',
            org_short_name: '',
            areas_arr: [],
	        province_id: 0,
	        city_id: 0,
	        district_id: 0,
	        org_address: '',
	        expire_day: '',
	        account_num_limit: 20,
	        branch_num_limit: 1,
	        student_num_limit: 10,
            account_price: 360,
            branch_price: 3600,
            student_price: 24,
	        mobile: '',
            host: '',
            join_int_day: '',
            open_int_day: '',
            org_type: 2
        },
        user: {
            account: '',
            password: '123456',
            status: 1,
            is_admin: 1                  
        }
	}
	
	export default{
		name:'orgInfo',
		mixins:[modal,common,globals],
        props: {
            franchisee: Object,
            review: {
                type: Boolean,
                defaut: false
            }
        },
        components: {
            InfoGroup,
            AccountGroup,
            SystemGroup
        },
		data () {
			return {
                group: 'system',
				info: util.copy(emptyObject)
			}
		},
		watch: {
			'modal$.show':function(v) {
                if(v) {
                    if(this.modal$.action=='confirm'||this.modal$.action=='apply') {
                        this.initInfo()
                    }
                }
            }
		},
		methods: {
            initInfo() {
                if(_.isEmpty(this.franchisee)) return
                
                let keys = [
                    'org_name',
                    'org_short_name',
                    'mobile',
                    'province_id',
                    'district_id',
                    'city_id',
                    'org_address',
                    'open_int_day',
                    'join_int_day',
                    'expire_day',
                    'account_num_limit',
                    'branch_num_limit',
                    'student_num_limit',
                    'host',

                    'account',
                    'password'
                ]
                let keys2 = [
                    'org_name',
                    'province_id',
                    'district_id',
                    'city_id',
                    'open_int_day',
                    'mobile',
                    'org_address'
                ]
                if(this.modal$.action=='confirm') {
                    keys.forEach(k => {
                        if(k=='account'||k=='password') {
                            this.info.user[k] = this.franchisee['init_'+k]
                        }else{
                             if(k=='expire_day'||k=='open_int_day'||k=='join_int_day') {
                                if(this.franchisee[k]) {
                                    this.info.org[k] = this.$filter('int_date')(this.franchisee[k])
                                }
                            }else{
                                this.info.org[k] = this.franchisee[k]
                            }
                        }
                    })
                }else{
                    keys2.forEach(k => {
                        this.info.org[k] = this.franchisee[k]
                    })
                    this.info.org.org_short_name = this.franchisee.org_name
                    if(this.franchisee.franchisee_contract) {
                        this.info.org.host = 'smart'+this.franchisee.franchisee_contract.contract_no
                        this.info.org.join_int_day = this.franchisee.franchisee_contract.contract_start_int_day
                    }
                    this.info.user.account = this.franchisee.mobile
                }
            },
        	save(){
                if(this.info.org.account_num_limit === '') {
                    this.$Message.error('账号数上限不能为0')
                    return
                }
                if(this.info.org.branch_num_limit === '') {
                    this.$Message.error('机构数上限不能为0')
                    return
                }
                if(this.info.org.student_num_limit === '') {
                    this.$Message.error('学员数上限不能为0')
                    return
                }
                // if(this.info.org.mobile === '') {
                //     this.$Message.error('联系电话不能为空')
                //     return
                // }else{
                //     if(!(/^1\d{10}$/).test(this.info.org.mobile)) {
                //         this.$Message.error('电话号码格式错误')
                //         return
                //     }
                // }
                // if(this.info.org.expire_day==='') {
                //     this.$Message.error('到期日期不能为空')
                //     return
                // }
                if(this.modal$.action == 'add') {
                    if(this.info.user.account == 0) {
                        this.$Message.error('账号不能为空')
                        return
                    }
                    if(this.info.user.password === '') {
                        this.$Message.error('密码不能为空')
                        return
                    }
                }
                if(this.info.org.org_name === '') {
                    this.$Message.error('机构名称不能为空')
                    return
                }
                if(this.info.org.host === '') {
                    this.$Message.error('host域名不能为空')
                    return
                }else{
                    if(!/^[a-zA-Z]/.test(this.info.org.host)) {
                        this.$Message.error('域名只能以字母开头')
                        return
                    }
                    if(!/^[a-zA-Z0-9]{4,10}$/g.test(this.info.org.host)) {
                        this.$Message.error('域名不能包含特殊字符，且只能大于(含)四位小于10位')
                        return
                    }
                }
                if(this.info.org.org_address === '') {
                    this.$Message.error('机构详细地址不能为空')
                    return
                }
                if(this.info.org.join_int_day === '') {
                    this.$Message.error('加盟日期不能为空')
                    return
                }
                let rest = '',
                    method = 'post',
                    message = ''
                if(this.modal$.action=='confirm') {
                    rest = this.$rest('orgs')
                    rest.add_url_param(this.franchisee.og_id,'confirm')
                    message = '校360系统已审核开通'
                }
                else if(this.modal$.action=='apply'){
                    rest = this.$rest('franchisees')
                    rest.add_url_param(this.franchisee.fc_id,'doapply')
                    message = '校360系统已提交审核'
                }
                else if(this.modal$.action=='add') {
                    rest = this.$rest('orgs')
                    message = '校360系统创建成功'
                }
                else{
                    rest = this.$rest('orgs').add_url_param(this.info.org.og_id)
                    message = '校360系统编辑成功'
                    method = 'put'
                }
                
                rest[method](this.info)
                .success(res => {
                    this.$Message.success(message)
                    this.$emit('save')
                    this.close()
                })
                .error(res => {
                    this.$Message.error(res.message)
                })
            }
		},
		computed: {
            btn_text() {
                let map = {'edit':'确定','add':'确定','confirm':'审核并确认','apply':'提交审核'}
                return map[this.modal$.action]
            }
		}
	}
</script>

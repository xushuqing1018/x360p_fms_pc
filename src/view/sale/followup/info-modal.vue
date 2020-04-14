<template>
	<Modal v-model="modal$.show" draggable :title="modal$.title" :width="800" :mask-closable="false">
		<div class="text-center mb-3">
			<RadioGroup v-model="group" type="button">
				<Radio :label="1">沟通信息</Radio>
				<Radio :label="2" v-if="info.fc_id">沟通历史</Radio>
			</RadioGroup>
		</div>
		<template v-if="group==1">
			<Form ref="form" :label-width="120" class="row" :model="info" :rules="rules">
				<Form-item label="选择客户" class="col-sm-6" prop="fc_id">
					<select-franchisee v-model="info.fc_id" clearable v-if="fcId==0" @selected="changeFranchisee"></select-franchisee>
					<span v-else>{{fcName}}</span>
				</Form-item>
				<Form-item label="对方联络人" class="col-sm-6" prop="fcp_id">
					<Select v-model="info.fcp_id">
						<Option :value="item.fcp_id" v-for="item in fcp">{{item.name}}</Option>
					</Select>
				</Form-item>
				<Form-item label="有效性" class="col-sm-6" prop="is_connect">
					<RadioGroup v-model="info.is_connect" type="button" @on-change="connectTypeChange">
						<Radio :label="1">有效沟通</Radio>
						<Radio :label="0">无效沟通</Radio>
					</RadioGroup>
				</Form-item>
				<Form-item label="意向级别" class="col-sm-6" prop="intention_level">
					<Rate v-model="info.intention_level"></Rate>
				</Form-item>
				<Form-item label="沟通类型" class="col-sm-6" v-if="!invalid" prop="followup_did">
					<Select v-model="info.followup_did" :disabled="modal$.action=='edit'">
						<Option 
							:value="item.did" 
							:key="index" 
							v-for="(item,index) in dicts('followup')">
							{{item.title}}
						</Option>
					</Select>
				</Form-item>
				<Form-item label="无效沟通类型" class="col-sm-6" v-else prop="invalid_followup_did">
					<Select v-model="info.invalid_followup_did" :disabled="modal$.action=='edit'">
						<Option 
							:value="item.did" 
							:key="index" 
							v-for="(item,index) in dicts('invalid_followup')">
							{{item.title}}
						</Option>
					</Select>
				</Form-item>
				<Form-item label="客户状态" class="col-sm-6" prop="franchisee_status_did">			
					<Select v-model="info.franchisee_status_did" :disabled="modal$.action=='edit'">
						<Option 
							:value="item.did" 
							:key="index" 
							v-for="(item,index) in dicts('customer_status')">
							{{item.title}}
						</Option>
					</Select>
				</Form-item>
				<Form-item label="跟进人" class="col-sm-6" prop="eid">
					<select-employee v-model="info.eid"></select-employee>
				</Form-item>
				<Form-item label="下次跟进日期" class="col-sm-6" prop="next_follow_time">
					<DatePicker 
						:disabled="next_follow_status==1" 
						:options="disabledOptions"
						type="date" 
						:value="info.next_follow_time?info.next_follow_time:''"
						@on-change="info.next_follow_time=$event"
						placeholder="选择日期" style="width: 180px">
					</DatePicker>
					<Checkbox 
						v-model="next_follow_status" 
						class="ml-3"
						:true-value="1" 
						:false-value="0"
						@on-change="nextChange">待定
					</Checkbox>
				</Form-item>
				<Form-item label="沟通内容" class="col-sm-12" prop="content">
					<Input v-model="info.content" type="textarea" :rows="4"></Input>
				</Form-item>
			</Form>
		</template>
		<template v-else>
			<follow-record :fc-id="info.fc_id" class="follow-list"></follow-record>
		</template>
		<div slot="footer">
			<Button type="text" @click="close">关闭</Button>
			<Button type="primary" @click="submit">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import moment from 'moment'
	import util from '@/libs/util'
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import SelectFranchisee from 'c%/SelectFranchisee.vue'
	import SelectEmployee from 'c%/SelectEmployee.vue'
	import FollowRecord from './record.vue'

	const emptyObject = {
		fc_id: 0,				//客户ID
		fcp_id: 0,				//对方联络人
		is_connect: 1,			//是否有效沟通0：无效， 1：有效
		followup_did: 0,		//跟进方式 字典ID（QQ、电话等）
		invalid_followup_did: 0,//无效跟进类型
		content: '',			//跟进内容
		next_follow_time: '', 	//下次跟进日期  0为待定
		intention_level: 3,		//意向级别
		franchisee_status_did: 0, //客户状态字典ID
		eid: 0,					//跟进人
	}
	export default {
		mixins: [common,globals,modal],
		components: {
			SelectFranchisee,
			SelectEmployee,
			FollowRecord
		},
		props: {
			fcId: {
				type: Number,
				default: 0
			},
			fcName: String
		},
		data() {
			return {
				fcp: [],
				group: 1,
				invalid: false,
				next_follow_status: false,
				info: util.copy(emptyObject),
				rules: {
					content: [
						{ required: true, message: '请输入沟通内容', trigger: 'blur' }
					],
					followup_did: [
						{ required: true, type: 'number', message: '请选择跟进方式', trigger: 'change' }
					],
					franchisee_status_did: [
						{ required: true, type: 'number', message: '请选择客户状态', trigger: 'change' }
					],
					intention_level: [
						{ required: true, type: 'number',min: 1,  message: '请选择意向级别', trigger: 'change' }
					]
				}
			}
		},
		mounted() {
			this.initialize()
		},
		computed: {
			disabledOptions() {
				return {
					disabledDate (date) {
                    	return date && date.valueOf() < Date.now() - 86400000
                	}
                }
			}
		},
		watch: {
			'info.fc_id':function(id) {
				this.getPerson()
			}
		},
		methods: {
			getPerson() {
				this.$rest('franchisee_persons')
				.get({
					fc_id: this.info.fc_id
				})
				.success(res => {
					this.fcp = res.list
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			},
			changeFranchisee(val) {
				this.info.fcp_id = 0
			},
			connectTypeChange(val) {
				if(val == 0) {
					this.invalid = true;
				}
				else {
					this.invalid = false;
				}
			},
			nextChange(v) {
				if(v){
					this.info.next_follow_time = ''
				}
			},
			initialize () {
				this.info.is_connect = 1
				this.info.fc_id = this.fcId
				this.info.eid = this.eid$
				if(this.dicts('followup').length > 0){
					this.info.followup_did = this.dicts('followup')[0].did	
				}
				if(this.dicts('customer_status').length>0){
					this.info.franchisee_status_did = this.dicts('customer_status')[0].did
				}
			},
			isBeforeNow (val) {		
				if(typeof val=='number'&&val>0){
					val = this.$filter('int_date')(val)
				}
				
				if(val!=0&&moment(val).add(1,'days').isBefore(moment(new Date()))){
					this.$Message.error('所选时间不能小于当前时间')
					return true
				}
				return false
			},
			submit (token) {
				let [method,uri,msg] = ['post','franchisees/'+this.info.fc_id+'/followup','添加成功']
				if(this.modal$.action=='edit'){
					[method,uri,msg] = ['put','franchisee_follow_ups/'+this.info.ffu_id,'修改成功']
				}
				
				if(this.isBeforeNow(this.info.next_follow_time)){
					return false
				}
				
				this.check()
				.then(()=>{
					this.$rest(uri)[method](this.info)
					.success(data=>{
						this.$Message.success(msg)
						this.$emit('on-success')
						this.close()
					}).error(response=>{
						this.$Message.error(response.body.message||'添加失败')
					})
				})
			},
			check () {
				return this.$form('form').check()
			},
			reset () {
				this.$form('form').reset()
			}
		}
	}
</script>
<style lang="less">
	.follow-list {
		min-height: 350px;
		overflow: auto;
		padding: 15px;
	}
</style>
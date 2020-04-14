<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" width="600">
		<Form ref="form" :model="info" :label-width="100">
			<Form-item label="加盟商" prop="fc_id" class="ivu-form-item-required">
				<select-franchisee v-model="info.fc_id" clearable :disabled="!is_empty_apply||fcId>0" @selected="setFcogid"></select-franchisee>
			</Form-item>
			<Form-item label="服务类型" prop="fc_service_did" class="ivu-form-item-required">
				<Select v-model="info.fc_service_did" :disabled="!is_empty_apply">
					<Option v-for="item in dicts('fc_service')" :value="item.did">{{item.title}}</Option>
				</Select>
			</Form-item>
			<Form-item label="沟通类型" prop="communicate_type_did" class="ivu-form-item-required">
				<Select v-model="info.communicate_type_did" :disabled="!is_empty_apply">
					<Option v-for="item in dicts('communicate_type')" :value="item.did">{{item.title}}</Option>
				</Select>
			</Form-item>
			<Form-item label="服务内容" prop="content" class="ivu-form-item-required">
				<Input type="textarea" v-model="info.content" :autosize="{minRows:2,maxRows:5}"></Input>
			</Form-item>
			<Form-item label="服务员工" prop="eid" class="ivu-form-item-required">
				<select-employee v-model="info.eid" :limit-per="false"></select-employee>
			</Form-item>
			<Row>
				<Col span="12">
					<Form-item label="完成日期" prop="int_day" class="ivu-form-item-required">
						<DatePicker 
			                :value="info.int_day" 
			                placeholder="完成日期"
			                @on-change="info.int_day = $event"
			                >
			            </DatePicker>
					</Form-item>
				</Col>
				<Col span="12">
					<Form-item label="完成时间" prop="int_hour">
						<Time-picker 
		                    confirm
		                    @on-change="info.int_hour = $event" 
		                    :value="info.int_hour" 
		                    format="HH:mm" 
		                    :steps="[1,15,15]" 
		                    placeholder="00:00">
		                </Time-picker>
					</Form-item>
				</Col>
			</Row>

			<!--<Row v-if="from=='service'">
				<Col span="12">
					<Form-item label="盟商可见" prop="is_show_to_fc">
						<i-switch v-model="info.is_show_to_fc" :true-value="1" :false-value="0"></i-switch>
					</Form-item>
				</Col>
				<Col span="12">
					<Form-item label="需要回复">
						<i-switch v-model="info.is_need_reply" :true-value="1" :false-value="0"></i-switch>
					</Form-item>
				</Col>
			</Row>-->

			<Form-item label="系统情况" class="col-sm-6" prop="system_status">
				<Checkbox v-model="info.system_status" :true-value="1" :false-value="0"></Checkbox>
			</Form-item>

			<template v-if="info.system_status">
				<Form-item label="系统沟通情况" class="col-sm-6" prop="system_status_did">
					<Select v-model="info.system_status_did">
						<Option :value="item.did" :key="index" v-for="(item,index) in dicts('system_status')">{{item.title}}</Option>
					</Select>
				</Form-item>

				<Form-item label="系统未使用原因" class="col-sm-6" prop="unuse_reason_did">
					<Select v-model="info.unuse_reason_did">
						<Option :value="item.did" :key="index" v-for="(item,index) in dicts('unuse_reason')">{{item.title}}</Option>
					</Select>
				</Form-item>
			</template>

			<Form-item label="附加文件">
				<review-upload v-model="info.franchisee_service_record_file" :show-course-file="false">
					<span></span>
				</review-upload>
			</Form-item>
		</Form>
		<div slot="footer">
			<Button type="text" @click="close">关闭</Button>
			<Button type="primary" @click="ok" :loading="saving">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import moment from 'moment'
	import util,{_} from '@/libs/util'
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import ReviewUpload from 'c%/ReviewUpload.vue'
	import SelectFranchisee from 'c%/SelectFranchisee.vue'
	import SelectEmployee from 'c%/SelectEmployee.vue'

	const INFO_NAME = '服务记录'
	const INFO_PK_ID = 'fsr_id'
	const INFO_URL   = 'franchisee_service_records'

	const emptyObject = {
		parent_fsr_id: 0,
		fc_id: 0,
		fc_og_id: 0,
		// og_id: 0,
		fsa_id: 0,
		fsr_type: 0,
		fc_service_did: 0,
		communicate_type_did : 0,
		int_day: moment().format('YYYY-MM-DD'),
		int_hour: moment().format('HH:mm'),
		content: '',
		eid: 0,
		fc_eid: 0,
		is_show_to_fc: 0,
		is_need_reply: 0,
		system_status_did: 0,
		unuse_reason_did : 0,
		franchisee_service_record_file: []
	}

	export default {
		mixins: [modal,common,globals],
		props: {
			apply: {
				type: Object,
				default(){
					return {}
				}
			},
			fsrType: Number,
			fcOgId: {
				type: [Number,String],
				default: 0
			},
			parentId: {
				type: [Number,String],
				default: 0
			},
			fcId: {
				type: [Number,String],
				default: 0
			},
			from: {
				type: String,
				default: 'reply'
			}
		},
		components: {
			SelectEmployee,
			SelectFranchisee,
			ReviewUpload
		},
		data() {
			return {
				info: util.copy(emptyObject)
			}
		},
		watch: {
			'modal$.show':function(val) {
				if(val&&this.modal$.action=='add') {
					this.info.eid = this.eid$
					this.info.fsr_type = this.fsrType
					if(this.fcId) {
						this.info.fc_id = this.fcId
					}
					if(this.fcOgId) {
						this.info.fc_og_id = this.fcOgId
						// this.info.og_id = this.fcOgId
					}
				}
			}
		},
		methods: {
			onModalOpen() {
				if(!this.is_empty_apply) {
					let ids = ['fc_id','fc_og_id','fsa_id','fc_service_did','communicate_type_did']
					ids.forEach(id => {
						this.info[id] = this.apply[id]
					})
					// this.info.og_id = this.info.fc_og_id
					if(this.apply.franchisee_service_records.length) {
						this.info.parent_fsr_id = this.apply.franchisee_service_records[0].fsr_id
					}
					if(this.parentId) {
						this.info.parent_fsr_id = this.parentId
					}
				}
			},
			setFcogid(selected) {
				this.info.fc_og_id = selected.fc_og_id
				// this.info.og_id = selected.fc_og_id
			},
			ok() {
				if(this.info.fc_id==0) {
					this.$Message.error('请选择加盟商')
					return
				}
				if(this.info.fc_service_did===0) {
					this.$Message.error('服务类型不能为空')
					return
				}
                if(this.info.communicate_type_did===0) {
                    this.$Message.error('服务类型不能为空')
                    return
                }
				if(this.info.content==='') {
					this.$Message.error('服务内容不能为空')
					return
				}
				if(this.info.eid==='') {
					this.$Message.error('请选择完成员工')
					return
				}
				if(this.info.int_day==0) {
					this.$Message.error('请选择完成日期')
					return
				}
				this.save()
			}
		},
		computed: {
			info_url$(){
            	return INFO_URL
	        },
	        info_name$(){
	            return INFO_NAME
	        },
	        info_pk_id$(){
	            return INFO_PK_ID
	        },
	        is_empty_apply() {
	        	return _.isEmpty(this.apply)
	        }
		}
	}
</script>
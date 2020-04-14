<template>
	<Modal v-model="modal$.show" draggable :title="modal$.title" :width="800" :mask-closable="false">
		<div class="text-center mb-3">
			<RadioGroup v-model="group" type="button">
				<Radio :label="1">{{fromClient?'补充':''}}基本信息</Radio>
				<Radio :label="2">合同信息</Radio>
			</RadioGroup>
		</div>
		<div v-show="group==1" style="position: relative;">
			<Form ref="form" :model="info" :label-width="90" class="row">			
				<Form-item label="加盟商名称" prop="org_name" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.org_name" placeholder="请输入名称"></Input>
				</Form-item>
				<Form-item label="运营状态" prop="status" class="col-sm-6 ivu-form-item-required">
					<Select v-model="info.status">
						<Option :value="index" v-for="(val,key,index) in business_status_list">{{val}}</Option>
					</Select>
				</Form-item>
				<Form-item label="省/市/区" prop="areas_arr" class="col-sm-6">
		            <Cascader trigger="hover" :data="areas" v-model="org_area" placeholder="请输入位置" v-if="!spinShow"></Cascader>
		        </Form-item>
				<Form-item label="详细地址" prop="org_address" class="col-sm-6 ivu-form-item-required">
		        	<Input v-model="info.org_address" placeholder="请输入地址"></Input>
		        </Form-item>
		        <!-- <Form-item label="联系人" prop="name" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.name" placeholder="请输入联系人"></Input>
				</Form-item>-->
				<Form-item label="中心座机" prop="mobile" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.mobile" placeholder="请输入中心座机"></Input>
				</Form-item>
				<Form-item label="企业邮箱" prop="org_email" class="col-sm-6">
					<Input v-model="info.org_email" placeholder="请输入邮箱"></Input>
				</Form-item>
				<Form-item label="店面性质" prop="address_did" class="col-sm-6 ivu-form-item-required">
					<Select v-model="info.address_did" clearable>
						<Option :value="item.did" v-for="item in dicts('address')">{{item.title}}</Option>
					</Select>
				</Form-item>
				<Form-item label="营业面积" prop="area_size" class="col-sm-3">
					<InputNumber v-model="info.area_size"></InputNumber>
				</Form-item>
				<Form-item label="教室数" prop="room_nums" class="col-sm-3">
					<InputNumber v-model="info.room_nums"></InputNumber>
				</Form-item>
				<Form-item label="员工数" prop="employee_nums" class="col-sm-3">
					<InputNumber v-model="info.employee_nums"></InputNumber>
				</Form-item>

				<Form-item label="会员数" prop="member_nums" class="col-sm-3">
					<InputNumber v-model="info.member_nums"></InputNumber>
				</Form-item>
				<Form-item label="48课时售价" prop="l1_price" class="col-sm-3">
					<InputNumber v-model="info.l1_price"></InputNumber>
				</Form-item>
				<Form-item label="96课时售价" prop="l2_price" class="col-sm-3">
					<InputNumber v-model="info.l2_price"></InputNumber>
				</Form-item>
				<Form-item label="总部装修" prop="is_head_decorate" class="col-sm-3">
					<i-switch v-model="info.is_head_decorate" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</Form-item>
				<Form-item label="装修费用" prop="decorate_fee" class="col-sm-3">
					<InputNumber v-model="info.decorate_fee"></InputNumber>
				</Form-item>
				<Form-item label="主体变更" prop="is_owner_change" class="col-sm-3">
					<i-switch v-model="info.is_owner_change" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</Form-item>
				<Form-item label="授权铜牌" prop="is_authorize_dispatch" class="col-sm-3">
					<i-switch v-model="info.is_authorize_dispatch" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</Form-item>
				<Form-item label="统一社会信用代码" prop="business_license" class="col-sm-6">
					<Input v-model="info.business_license" placeholder="统一社会信用代码"></Input>
				</Form-item>
				<Form-item :label="label_sale" prop="sale_eid" class="col-sm-6">
					<select-employee v-model="info.sale_eid" :rid="101" :limit-per="false" :disabled="modal$.action=='edit'"></select-employee>
				</Form-item>
				<Form-item :label="label_service" prop="service_eid" class="col-sm-6">
					<select-employee v-model="info.service_eid" :rid="102" :limit-per="false" :disabled="modal$.action=='edit'"></select-employee>
				</Form-item>
				<Form-item label="免费培训人数" prop="free_training_nums" class="col-sm-3">
					<InputNumber v-model="info.free_training_nums"></InputNumber>
				</Form-item>
			</Form>
			<Spin size="large" fix v-if="spinShow"></Spin>
		</div>
		<div v-if="group==2">
			<Form ref="form" :model="info.franchisee_contract" :label-width="100" class="row">
				<Form-item label="合同号" prop="contract_no" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.franchisee_contract.contract_no" placeholder="请输入合同号"></Input>
				</Form-item>
				<Form-item label="签约员工" prop="sign_eid" class="col-sm-6 ivu-form-item-required">
					<select-employee v-model="info.franchisee_contract.sign_eid" :rid="101" :limit-per="false"></select-employee>
				</Form-item>
				<Form-item label="合同负责人" prop="charge_eid" class="col-sm-6 ivu-form-item-required">
					<select-employee v-model="info.franchisee_contract.charge_eid" :rid="101" :limit-per="false"></select-employee>
				</Form-item>
				<Form-item label="合同开始日期" prop="contract_start_int_day" class="col-sm-6 ivu-form-item-required">
		            <DatePicker 
		                :value="info.franchisee_contract.contract_start_int_day" 
		                placeholder="请选择合同开始日期"
		                style="width: 100%;"
		                :disabled="modal$.action=='edit'"
		                @on-change="info.franchisee_contract.contract_start_int_day = $event"
		                >
		            </DatePicker>
		        </Form-item>
		        <Form-item label="合同结束日期" prop="contract_end_int_day" class="col-sm-6 ivu-form-item-required">
		            <DatePicker 
		                :value="info.franchisee_contract.contract_end_int_day" 
		                placeholder="请选择合同结束日期"
		                style="width: 100%;"
		                :disabled="modal$.action=='edit'"
		                @on-change="info.franchisee_contract.contract_end_int_day = $event"
		                >
		            </DatePicker>
		        </Form-item>
		        <Form-item label="开业日期" prop="open_int_day" class="col-sm-6">
					<DatePicker 
		                :value="info.franchisee_contract.open_int_day" 
		                placeholder="请选择合同结束日期"
		                style="width: 100%;"
		                @on-change="info.franchisee_contract.open_int_day = $event"
		                >
		            </DatePicker>
				</Form-item>
				<Form-item label="区域性质" prop="region_level" class="col-sm-6">
					<Select v-model="info.franchisee_contract.region_level">
						<Option :value="index+1" v-for="(val,key,index) in region_level_list">{{val}}</Option>
					</Select>
				</Form-item>
				<Form-item label="特许经营费" prop="join_fee1" class="col-sm-6">
					<Input v-model="info.franchisee_contract.join_fee1">
						<span slot="append">元</span>
					</Input>
				</Form-item>
				<Form-item label="履约保证金" prop="join_fee2" class="col-sm-6">
					<Input v-model="info.franchisee_contract.join_fee2">
						<span slot="append">元</span>
					</Input>
				</Form-item>
				<Form-item label="年度使用费" prop="join_fee3" class="col-sm-6">
					<Input v-model="info.franchisee_contract.join_fee3">
						<span slot="append">元</span>
					</Input>
				</Form-item>
				<Form-item label="教育商品款" prop="join_fee4" class="col-sm-6">
					<Input v-model="info.franchisee_contract.join_fee4">
						<span slot="append">元</span>
					</Input>
				</Form-item>
				<Form-item label="合同总金额" prop="contract_amount" class="col-sm-6">
					<Input v-model="info.franchisee_contract.contract_amount">
						<span slot="append">元</span>
					</Input>
				</Form-item>
				<Form-item label="全款到账日期" prop="all_pay_int_day" class="col-sm-6">
					<DatePicker 
		                :value="info.franchisee_contract.all_pay_int_day" 
		                placeholder="请选择到账日期"
		                style="width: 100%;"
		                @on-change="info.franchisee_contract.all_pay_int_day = $event"
		                >
		            </DatePicker>
				</Form-item>
				<Form-item label="转让费用" prop="transfer_fee" class="col-sm-6">
					<Input v-model="info.franchisee_contract.transfer_fee">
					<span slot="append">元</span>
					</Input>
				</Form-item>
				<Form-item label="费用到账日期" prop="transfer_fee_pay_int_day" class="col-sm-6">
					<DatePicker
							:value="info.franchisee_contract.transfer_fee_pay_int_day"
							placeholder="请选择到账日期"
							style="width: 100%;"
							@on-change="info.franchisee_contract.transfer_fee_pay_int_day = $event"
					>
					</DatePicker>
				</Form-item>


				<Form-item label="特殊约定" prop="content" class="col-sm-12">
					<Input type="textarea" v-model="info.franchisee_contract.content" :autosize="{minRows:2,maxRows:5}"></Input>
				</Form-item>
				<Form-item label="合同附件" prop="franchisee_contract_file" class="col-sm-12">
					<review-upload v-model="info.franchisee_contract.franchisee_contract_file"></review-upload>
				</Form-item>
			</Form>
		</div>
		<div slot="footer">
			<Button type="text" @click="close">关闭</Button>
			<Button type="primary" @click="ok" :loading="saving">确定</Button>
		</div>
	</Modal>
</template>

<script>
	import util,{_} from '@/libs/util'
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import ReviewUpload from 'c%/ReviewUpload.vue'
	import SelectEmployee from 'c%/SelectEmployee.vue'

	const emptyObject = {
		fc_id: 0,
		org_name: '',
		province_id: 0,
		city_id: 0,
		district_id: 0,
		org_address: '',
		status: -1,
		address_did: 0,
		decorate_fee: 0.00,
		is_head_decorate: 0,
		is_owner_change: 0,
		business_license: '',
		is_authorize_dispatch: 0,
		org_email: '',
		sale_eid: 0,
		service_eid: 0,
		mobile: '',
		name: '',
		area_size: 0.00,
		room_nums: 0,
		employee_nums: 0,
		free_training_nums:10,
		l1_price: 0,
		l2_price: 0,
		member_nums: 0,
		franchisee_contract: {
			fcc_id: 0,
			fc_id: 0,
			contract_no: '',
			contract_start_int_day: '',
			contract_end_int_day: '',
			open_int_day: '',
			region_level: 0,
			join_fee1: 0.00,
			join_fee2: 0.00,
			join_fee3: 0.00,
			join_fee4: 0.00,
			contract_amount: 0.00,
			all_pay_int_day: '',
			transfer_fee: 0.00,
			transfer_fee_pay_int_day: '',
			content: '',
			sign_eid: 0,
			charge_eid: 0,
			franchisee_contract_file: []
		}
	}
	
	export default{
		mixins: [common,globals,modal],
		props: {
			fromClient: {
				type: Boolean,
				default: false
			},
			row: Object
		},
		components: {
			SelectEmployee,
			ReviewUpload
		},
		data () {
			return {
				group: 1,
				spinShow: true,
				info: util.copy(emptyObject)
			}
		},
		methods: {
			onModalOpen() {
				if(!_.isEmpty(this.row)) {
					for(let key in this.info) {
						if(key == 'franchisee_contract') {
							this.info[key].fc_id = this.row.fc_id
							if(!_.isEmpty(this.row[key])) {
								this.info[key].fcc_id = this.row[key].fcc_id
							}
							continue;
						}
						this.info[key] = this.row[key]
					}
				}
				setTimeout(() => {
					this.spinShow = false
				},100)
			},
			ok () {
				if(this.info.org_name==='') {
					this.$Message.error('加盟商名称不能为空')
					this.group = 1
					return
				}
				if(this.info.status==-1) {
					this.$Message.error('请选择运营状态')
					this.group = 1
					return
				}
				if(this.info.org_address==='') {
					this.$Message.error('请输入详细地址')
					this.group = 1
					return
				}
				if(this.info.mobile==='') {
					this.$Message.error('联系电话不能为空')
					this.group = 1
					return
				}
				if(this.info.address_did===0) {
					this.$Message.error('请选择店面性质')
					this.group = 1
					return
				}
				if(this.info.franchisee_contract.contract_no==='') {
					this.$Message.error('合同号不能为空')
					this.group = 2
					return
				}
				if(this.info.franchisee_contract.sign_eid==0) {
					this.$Message.error('请选择签约员工')
					this.group = 2
					return
				}
				if(this.info.franchisee_contract.charge_eid==0) {
					this.$Message.error('请选择合同负责人')
					this.group = 2
					return
				}
				if(!this.info.franchisee_contract.contract_start_int_day) {
					this.$Message.error('合同开始日期不能为空')
					this.group = 2
					return
				}
				if(!this.info.franchisee_contract.contract_end_int_day) {
					this.$Message.error('合同结束日期不能为空')
					this.group = 2
					return
				}
				this.save()
			},
			save() {
				this.$rest('franchisees').add_url_param('sign_contract')
				.post(this.info)
				.success(res => {
					let msg = ''
					if(this.modal$.action=='add') {
						msg = '盟商及合同创建成功'
						if(this.fromClient) {
							msg = '签约成功'
						}
					}else{
						msg = '盟商及合同编辑成功'
					}

					this.$Message.success(msg)
					this.$emit('on-success')
					this.close()
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			}
		},
		computed: {
	        org_area:{
                get:function(){
                    let arr = [this.info.province_id,this.info.city_id,this.info.district_id]
                    this.info.areas_arr = arr
                    return arr
                },
                set:function(value){
                    if(value.length > 0) {
                        this.info.province_id = value[0]
                        this.info.city_id = value[1]
                        this.info.district_id = value[2]
                        this.info.areas_arr = value
                    }
                }
            }

		}
	}
	
</script>
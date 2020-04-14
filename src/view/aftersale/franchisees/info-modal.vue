<template>
	<Modal v-model="modal$.show" draggable :title="modal$.title" :width="800" :mask-closable="false">
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
	            <Cascader trigger="hover" :data="areas" v-model="org_area" placeholder="请输入位置"></Cascader>
	        </Form-item>
			<Form-item label="详细地址" prop="org_address" class="col-sm-6 ivu-form-item-required">
	        	<Input v-model="info.org_address" placeholder="请输入地址"></Input>
	        </Form-item>
	        <!-- <Form-item label="联系人" prop="name" class="col-sm-6 ivu-form-item-required">
				<Input v-model="info.name" placeholder="请输入联系人"></Input>
			</Form-item> -->
			<Form-item label="中心座机" prop="mobile" class="col-sm-6 ivu-form-item-required">
				<Input v-model="info.mobile" placeholder="请输入联系电话"></Input>
			</Form-item>
			<Form-item label="企业邮箱" prop="org_email" class="col-sm-6">
				<Input v-model="info.org_email" placeholder="请输入邮箱"></Input>
			</Form-item>
			<Form-item label="店面性质" prop="address_did" class="col-sm-6 ivu-form-item-required">
				<Select v-model="info.address_did" clearable>
					<Option :value="item.did" v-for="item in dicts('address')">{{item.title}}</Option>
				</Select>
			</Form-item>
			<Form-item label="意向级别" prop="intention_level" class="col-sm-6">
				<Rate v-model="info.intention_level"></Rate>
			</Form-item>
			<Form-item label="跟进状态" prop="franchisee_status_did" class="col-sm-6">
				<Select v-model="info.franchisee_status_did" clearable>
					<Option :value="item.did" v-for="item in dicts('customer_status')">{{item.title}}</Option>
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
			<Form-item label="营业执照号" prop="business_license" class="col-sm-6">
				<Input v-model="info.business_license" placeholder="请输入营业执照号"></Input>
			</Form-item>
			<Form-item :label="label_sale" prop="sale_eid" class="col-sm-6">
				<select-employee v-model="info.sale_eid" :rid="101" :limit-per="false" clearable></select-employee>
			</Form-item>
			<Form-item :label="label_service" prop="service_eid" class="col-sm-6 ivu-form-item-required">
				<select-employee v-model="info.service_eid" :rid="102" :limit-per="false" clearable></select-employee>
			</Form-item>
		</Form>
		
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
	import SelectEmployee from 'c%/SelectEmployee.vue'

	const INFO_NAME = '加盟商资料'
	const INFO_PK_ID = 'fc_id'
	const INFO_URL   = 'franchisees'

	const emptyObject = {
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
		l1_price: 0,
		l2_price: 0,
		member_nums: 0,
		intention_level: 5,
		franchisee_status_did: 0
	}
	
	export default{
		mixins: [common,globals,modal],
		components: {
			SelectEmployee
		},
		data () {
			return {
				info: util.copy(emptyObject)
			}
		},
		methods: {
			ok () {
				if(this.info.org_name==='') {
					this.$Message.error('加盟商名称不能为空')
					return
				}
				if(this.info.status==-1) {
					this.$Message.error('请选择运营状态')
					return
				}
				if(this.info.org_address==='') {
					this.$Message.error('请输入详细地址')
					return
				}
				if(this.info.mobile==='') {
					this.$Message.error('联系电话不能为空')
					return
				}
				if(this.info.address_did===0) {
					this.$Message.error('请选择店面性质')
					return
				}
				if(this.info.service_eid==0) {
					this.$Message.error('请选择督导员工')
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
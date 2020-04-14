<template>
	<Modal v-model="modal$.show" draggable :title="modal$.title" :width="800" :mask-closable="false">
		<div style="position: relative;">
			<Form ref="form" :model="info" :label-width="90" class="row">			
				<Form-item label="客户名称" prop="org_name" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.org_name" placeholder="请输入名称"></Input>
				</Form-item>
				<Form-item label="省/市/区" prop="areas_arr" class="col-sm-6">
		            <Cascader trigger="hover" :data="areas" v-model="org_area" placeholder="请输入位置" v-if="!spinShow"></Cascader>
		        </Form-item>
				<Form-item label="详细地址" prop="org_address" class="col-sm-6 ivu-form-item-required">
		        	<Input v-model="info.org_address" placeholder="请输入地址"></Input>
		        </Form-item>
		        <Form-item label="联系人" prop="name" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.name" placeholder="请输入联系人"></Input>
				</Form-item>
				<Form-item label="联系电话" prop="mobile" class="col-sm-6 ivu-form-item-required">
					<Input v-model="info.mobile" placeholder="请输入联系电话"></Input>
				</Form-item>
				<Form-item label="企业邮箱" prop="org_email" class="col-sm-6">
					<Input v-model="info.org_email" placeholder="请输入邮箱"></Input>
				</Form-item>
				<Form-item label="意向级别" prop="intention_level" class="col-sm-6">
					<Rate v-model="info.intention_level"></Rate>
				</Form-item>
				<Form-item :label="label_sale" prop="sale_eid" class="col-sm-6">
					<select-employee v-model="info.sale_eid" :rid="101" :limit-per="false" :disabled="modal$.action=='edit'"></select-employee>
				</Form-item>
			</Form>
			<Spin size="large" fix v-if="spinShow"></Spin>
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
	import SelectEmployee from 'c%/SelectEmployee.vue'

	const INFO_NAME = '客户资料'
	const INFO_PK_ID = 'fc_id'
	const INFO_URL   = 'franchisees'

	const emptyObject = {
		org_name: '',
		province_id: 0,
		city_id: 0,
		district_id: 0,
		org_address: '',
		org_email: '',
		sale_eid: 0,
		mobile: '',
		name: '',
		intention_level: 3
	}
	
	export default{
		mixins: [common,globals,modal],
		components: {
			SelectEmployee
		},
		data () {
			return {
				spinShow: true,
				info: util.copy(emptyObject)
			}
		},
		methods: {
			onModalOpen() {
				setTimeout(() => {
					this.spinShow = false
				},500)
			},
			ok () {
				if(this.info.org_name==='') {
					this.$Message.error('客户名称不能为空')
					return
				}
				if(this.info.org_address==='') {
					this.$Message.error('请输入详细地址')
					return
				}
				if(this.info.name==='') {
					this.$Message.error('联系人不能为空')
					return
				}
				if(this.info.mobile==='') {
					this.$Message.error('联系电话不能为空')
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
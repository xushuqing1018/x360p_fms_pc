<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" width="500">
		<Form ref="form" :model="info" :label-width="100">
			<Form-item label="合同开始日期" prop="contract_start_int_day" class="ivu-form-item-required">
	            <DatePicker 
	                :value="info.contract_start_int_day" 
	                placeholder="请选择合同开始日期"
	                style="width: 200px;"
	                @on-change="info.contract_start_int_day = $event"
	                >
	            </DatePicker>
	        </Form-item>
			<Form-item label="合同结束日期" prop="contract_end_int_day" class="ivu-form-item-required">
	            <DatePicker 
	                :value="info.contract_end_int_day" 
	                placeholder="请选择合同结束日期"
	                style="width: 200px;"
	                :disabled="modal$.action=='edit'"
	                @on-change="info.contract_end_int_day = $event"
	                >
	            </DatePicker>
	            <ButtonGroup size="small" class="ml-3">
	            	<Button @click="renew(6)">半年</Button>
	            	<Button @click="renew(12)">一年</Button>
	            	<Button @click="renew(24)">两年</Button> 
	            </ButtonGroup>
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
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'

	export default {
		mixins: [modal,common,globals],
		props: {
			fccId: {
				type: [Number,String],
				default: 0
			},
			row: Object
		},
		data() {
			return {
				info: {
					contract_start_int_day: '',
					contract_end_int_day: ''
				}
			}
		},
		methods: {
			onModalOpen() {
				this.info.contract_start_int_day = this.row.contract_start_int_day
			},
			renew(type) {
				if(this.info.contract_start_int_day) {
					this.info.contract_end_int_day = moment(this.info.contract_start_int_day).add(type,'months').format('YYYY-MM-DD')
				}
			},
			ok() {
				if(this.info.contract_start_int_day=='') {
					this.$Message.error('请选择续约开始日期')
					return
				}
				if(this.info.contract_end_int_day=='') {
					this.$Message.error('请选择续约结束日期')
					return
				}
				if(new Date(this.info.contract_start_int_day).getTime() > new Date(this.info.contract_end_int_day).getTime()) {
					this.$Message.error('开始时间不能大于结束日期')
					return
				}
				this.$rest('franchisees').add_url_param(this.fccId,'renew_contract')
				.post(this.info)
				.success(res => {
					this.$Message.success('续约成功')
					this.$emit('on-success')
					this.close()
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			}
		}
	}
</script>
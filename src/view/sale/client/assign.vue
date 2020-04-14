<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="600">
		<Form :label-width="100">			
			<Form-item :label="'选择'+this.$filter('translate')('渠道销售')">
				<select-employee v-model="info.sale_eid" :rid="101" :limit-per="false" style="width: 300px;"></select-employee>
			</Form-item>
		</Form>
		
		<div slot="footer">
			<Button type="text" @click="close">关闭</Button>
			<Button type="primary" :loading="saving" @click="ok">确定</Button>
		</div>
	</Modal>
</template>

<script>
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import SelectEmployee from 'c%/SelectEmployee.vue'
	
	export default{
		mixins: [ common,modal ],
		components: {
			SelectEmployee
		},
		data () {
			return {
				fc_id: 0,
				info: {
					sale_eid:0,
					fc_ids: []
				}
			}
		},
		methods: {
			ok () {
				if(this.info.sale_eid==0){
					this.$Message.error('请选择责任人')
					return
				}
				this.info.fc_ids = []
				this.info.fc_ids.push(this.fc_id)
				this.$rest('franchisees').add_url_param('assign')
				.post(this.info)
				.success(data=>{
					this.$Message.success('分配成功')
					this.$emit('on-success')
					this.close()
				}).error(response=>{
					this.$Message.error(response.body.message)
				})
			}
		}
	}
</script>

<style>
</style>
<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="600">
		<Form :label-width="100">			
			<Form-item :label="'选择'+this.$filter('translate')('督导')">
				<select-employee v-model="info.service_eid" :rid="102" :limit-per="false" style="width: 300px;"></select-employee>
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
					service_eid:0
				}
			}
		},
		methods: {
			ok () {
				if(this.info.service_eid==0){
					this.$Message.error('请选择督导')
					return
				}
				this.$rest('franchisees').add_url_param(this.fc_id,'assign_eid')
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
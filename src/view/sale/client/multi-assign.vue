<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="600">
		<Form :label-width="100">			
			<Form-item :label="'选择'+this.$filter('translate')('渠道销售')">
				<select-employee v-model="info.sale_eid" style="width: 300px;"></select-employee>
			</Form-item>
			<Form-item label="已选客户">
				<Tag v-for="item in follow_clients" :key="item.id">{{item.name}}</Tag>
			</Form-item>
		</Form>
		
		<div slot="footer">
			<div class="pull-left">
				<span>已选择：
					<span class="text-info">{{follow_clients.length}}人</span>
				</span>
			</div>
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
				info: {
					sale_eid:0,
					fc_id: []
				}
			}
		},
		computed: {
			follow_clients() {
				return this.$store.state.follow_clients.list
			}
		},
		methods: {
			ok () {
				if(this.info.sale_eid==0){
					this.$Message.error('请选择责任人')
					return
				}
				this.info.fc_id = []
				this.follow_clients.forEach(c => {
					this.info.fc_id.push(c.fc_id)
				})
				this.$rest('franchisees').add_url_param('assign')
				.post(this.info)
				.success(data=>{
					this.$Message.success('批量分配成功')
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
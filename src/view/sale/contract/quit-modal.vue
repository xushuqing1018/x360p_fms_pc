<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" width="500">
		<Form ref="form" :model="info" :label-width="100">
			<Form-item label="解约原因" prop="quit_contract_did" class="ivu-form-item-required">
				<Select v-model="info.quit_contract_did" style="width: 250px">
					<Option :value="item.did" v-for="(item,index) in dicts('quit_contract')" :key="index">{{item.title}}</Option>
				</Select>
			</Form-item>
		</Form>
		<div slot="footer">
			<Button type="text" @click="close">关闭</Button>
			<Button type="primary" @click="ok" :loading="saving">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'

	export default {
		mixins: [modal,common,globals],
		props: {
			fccId: {
				type: [Number,String],
				default: 0
			}
		},
		data() {
			return {
				info: {
					quit_contract_did: 0
				}
			}
		},
		methods: {
			ok() {
				if(this.info.quit_contract_did==0) {
					this.$Message.error('请选择解约原因')
					return
				}
				this.$rest('franchisees').add_url_param(this.fccId,'quit_contract')
				.post(this.info)
				.success(res => {
					this.$Message.success('解约成功')
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
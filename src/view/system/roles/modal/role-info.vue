<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="500">
		<Form ref="form" :model="info" :label-width="90" :rules="rules">
			<FormItem label="组名" prop="role_name" style="width: 90%">
				<Input v-model="info.role_name" placeholder="请输入权限组名"/>
			</FormItem>
			<FormItem label="描述" prop="role_desc" style="width: 90%">
				<Input v-model="info.role_desc" placeholder="请输入权限组描述"/>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="close">关闭</Button>
			<Button type="primary" @click="handleSubmit">确定</Button>
		</div>
	</Modal>
</template>

<script>
import modal from '@/libs/modal.mixin'

export default {
	mixins: [modal],
	props: {
		itemInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			info: {
				role_name: '',
				role_desc: '',
				is_fsys: 1
			},
			rules: {
				role_name: [
					{ required: true, message: '组名不能为空', trigger: 'blur' }
				],
				role_desc: [
					{ required: true, message: '描述不能为空', trigger: 'blur' }
				]
			}
		}
	},
	watch: {
		'modal$.show': function(val) {
			if(val&&this.modal$.action == 'edit') {
				this.info = { ...this.itemInfo }
			}
		}
	},
	methods: {
		handleSubmit() {
			this.$refs.form.validate((valid) => {
				if(valid) {
					this.ok();
				}
			})
		},
		ok() {	
			let [method, url, msg] = ['post', 'roles', '添加成功']
			if(this.modal$.action=='edit') {
				[method, url, msg] = ['put', 'roles/' + this.info.rid, '修改成功']
			}

			let params = this.info;

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: params
			})
			.then(res => {
				this.$Message.success(msg);
				this.$emit('update');
				this.close();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		}
	}
	
}
</script>

<style scoped>
</style>

<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="500">
		<Form ref="form" :model="info" :label-width="90" :rules="rules">
			<FormItem label="培训场地" prop="title" style="width: 90%">
				<Input v-model="info.title" placeholder="请输入培训场地名称"/>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="close">关闭</Button>
			<Button type="primary" @click="handleSubmit">确定</Button>
		</div>
	</Modal>
</template>

<script>
import moment from 'moment'
import modal from '@/libs/modal.mixin'
import common from '@/libs/common.mixin'
import SelectFranchisee from 'c%/SelectFranchisee'

export default {
	mixins: [modal, common],
	components: {
		SelectFranchisee
	},
	props: {
		itemInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		const vm = this;

		return {
			info: {
				title: '',
				desc: '',
				display: 1,
				is_fsys: 1,
				pid: 54
			},
			rules: {
				title: [
					{ required: true, message: '收支类型不能为空', trigger: 'blur' }
				],
			}
		}
	},
	watch: {
		'modal$.show': function(val) {
			if(val) {
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
			let [method, url, msg] = ['post', 'dictionarys', '添加成功']
			let params = { ...this.info };
			params.desc = params.title;

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: params
			})
			.then(res => {
				this.$Message.success(msg);
				this.$emit('update', params);
				this.close();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		}
	}
	
}
</script>

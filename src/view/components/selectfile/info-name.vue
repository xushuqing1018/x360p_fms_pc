<template>
	<Modal :title="modal$.title" v-drag-modal v-model="modal$.show" :mask-closable="false" width="400">
		<template v-if="modal$.show">
			<Form :label-width="120" ref="form" :model="info" class="filter-form">
        		<Form-item prop="file_name" label="原文件名：" v-if="info.file_name">
        			<span>{{info.file_name}}</span>
        		</Form-item>
        		<Form-item prop="file_name" label="文件类型：">
        			<span>{{info.file_type}}</span>
        		</Form-item>
        		<Form-item prop="file_name" label="新文件名：">
        			<Input type="text" v-model="new_file_name" style="width:200px"></Input>
        		</Form-item>
        	</Form>
		</template>
		<div slot="footer">
            <Button type="text" @click="close">取消</Button>
            <Button type="primary" @click="ok">确定</Button>
        </div>
	</Modal>	
</template>
<script>
	import modal from '@/libs/modal.mixin'
	export default {
		mixins: [modal],
		data() {
			return {
				info: {},
				new_file_name: ''
			}
		},
		methods: {
			ok() {
				if(this.new_file_name === '') {
					this.$Message.error('新文件名不能为空')
					return false
				}
				let msg = this.modal$.action == 'add'?'添加成功':'编辑成功'
				this.$rest('files')
				.add_url_param(this.info.file_id)
				.put({file_name: this.new_file_name})
				.success(response => {
					this.$Message.success(msg)
					this.$emit('save')
					this.close()
				})
				.error(response => {
					this.$Message.error(response.body.message)
				})
			}
		},
		watch: {
			'modal$.show': function(val) {
            	if(val){
					this.new_file_name = ''
				}	            
	        }
        },
	}
</script>
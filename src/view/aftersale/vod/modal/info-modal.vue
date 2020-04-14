<style lang="less">

</style>
<template>
	<Modal width="400" v-model="modal$.show" :title="modal$.title">
    <Form :model="vod" label-position="right" :label-width="100">
        <FormItem label="分类名称：" prop="cate_name" class="ivu-form-item-required">
            <Input v-model="vod.cate_name" style="width:200px" placeholder="请输入分类标题" />
        </FormItem>
    </Form>
    <div slot="footer">
			<Button type="ghost" @click="close" style="color:#666;">关闭</Button>
			<Button type="primary" :loading="saving" @click="save()">确定</Button>
		</div>
	</Modal>
</template>                      
<script>
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import modal from '@/libs/modal.mixin'
  import common from '@/libs/common.mixin'

	export default {
    mixins: [grid,modal,common],
    components: {
    },
		data() {
			return {
        vod:{
          cate_name: '',
        },
        type_array: [],
        item: {},
        cate_name_list: []
			}
    },
    watch:{
      'modal$.action': function (val) {
        if(val == 'edit'){
          this.vod.cate_name = this.item.cate_name
        }
      },
    },
		mounted() {
      
    },
    methods: {
      save () {
				if(this.vod.cate_name == ""){
					this.$Message.info("分类名称不能为空")
					return false 
        }
	      let method = this.modal$.action == 'add'?'post':'put'
				let action = this.modal$.action == 'add'?'添加':'编辑'
				let $rest = this.$rest("vod_cates")
	      if(this.modal$.action == 'edit') {
						$rest.add_url_param(this.item.vc_id)
				}
	      $rest[method](this.vod)
	        .success(response=>{
	          this.$Message.success(util.sprintf('%s成功!',action))
	          this.$emit('on-success')
	          this.close()
	      	})
	        .error(response=>{
	          this.$Message.error(response.message)
	        })        
      },
    },
    computed: {
      action_type () {
        return this.modal$.action == 'add'
      }
    }
	}
</script>
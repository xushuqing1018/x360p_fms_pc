<template>
	<Modal  width="700" v-model="modal$.show" :title="modal$.title">
	    <Row class="basic">
            <Col span="24" class="mt-2 mb-2">
                <Button type="primary" size="small" class="ml-2" icon="plus" v-per="'vod.add'" @click="addInfo">添加分类</Button>
            </Col>
       </Row>
        

        <div class="content-body">
            <Table
                    v-loading.like="'vod_cates'"
                    :data="data"
                    :stripe="true"
                    :page="pageIndex"
                    :columns="columns"
                    :show-header="true"
                    :page-size="pageSize"
                    :no-data-text="$store.state.config.EMPTY_DATA_TEXT"
                    :no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT"
                    @on-sort-change="sortChange">
            </Table>
        </div>
        <div class="content-footer" style="margin-top:10px;text-align:right;">
            <div class="pagenation">
                <Page
                        :total="total"
                        :current="pageIndex"
                        :show-sizer="true"
                        :page-size="pageSize"
                        :show-total="true"
                        @on-change="pagenation"
                        @on-page-size-change="pagesize">
                </Page>
            </div>
        </div>
  </Modal>
</template>

<script>
  import util from '@/libs/util'
  import grid from '@/libs/grid.mixin'
  import modal from '@/libs/modal.mixin'
  import common from '@/libs/common.mixin'
  import globals from '@/libs/globals.mixin'

  export default {
    mixins: [util, grid, modal, common, globals],
    components: {

    },
    data () {
	    return {
	        rest_api: 'vod_cates',
	        pk: 'vc_id',
	        column_keys: {
				cate_name: {
					title: '分类名称',
		            show: true,
				},
		        create_time: {
		            title: '创建时间',
		            show: true,
		        }
	        },
	        operation_keys: {
				edit: {
					title: '编辑',
					type: 'md-create'
				},
				del: {
					title: '删除',
					type: 'ios-trash'
				}
	        },
	        column_render: {
	            cate_name(h, param) {
					let cate_name =h('span', param.row.cate_name)
	                return h('div', [cate_name])
	            },
			},
			operation_func:{
				edit(param) {
					this.editInfo(param.row)
				},
				del (param) {
					this.delInfo(param.row)
				}
			}
	    }
    },
    mounted () {
        this.init_data()
    },
    computed: {
    },
    methods: {
      addInfo () {
        this.$Modal.open('aftersale/vod/modal/info-modal.vue', {
            on: {
                "on-success": () => {
                    this.$emit('on-success')
                    this.init_data()
                } 
            }
        })
        .then(modal => {
            modal.show('添加分类', 'add')
        })
      },
      editInfo (item) {
        this.$Modal.open('aftersale/vod/modal/info-modal.vue', {
          on: {
            "on-success": () => {
              this.$emit('on-success')
              this.init_data()
            } 
          }
        })
        .then(modal => {
          modal
            .set('item', item)
            .show('编辑内容', 'edit')
        })      
      },
      delInfo (param) {
      	let id = param.vc_id
        this.$rest("vod_cates")
        .delete(id)
        .success((response)=>{
            this.init_data()
            this.$emit('on-success')
            this.$Message.success('删除成功')
        })
        .error((response)=>{
            this.error(response.body.message)
        }) 
      },

    },
    hook_get_param(params) {
        let search_obj = this.search_field;
        for(let o in search_obj) {
            let property = search_obj[o];
            if(o=='int_day'){
                if(property!=','&&property.length>0){
                    params['start_date'] = property[0]
                    params['end_date']   = property[1]
                }
            }
            else if(property){
                params[o] = property;
            }
        }
        delete params['page']
        delete params['pagesize']
    },
            
    watch: {

	},
}
</script>

<style lang="less" scoped>
</style>
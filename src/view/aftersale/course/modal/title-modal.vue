<template>
	<Modal  width="700" v-model="modal$.show" :title="modal$.title">
      <div class="box box-query">
          <Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row" style="margin-left:6px;">
              <Form-item label="课案主题" prop="cct_id" class="">
                  <Select v-model="search_field.cct_id" style="width: 200px;">
                      <Option v-for="(item,index) in course_case_topics" :key="index" :value="item.cct_id">{{item.topic}}</Option>
                  </Select>
              </Form-item>
          </Form>

          <div class="mt-2" style="margin-bottom: 10px;">
              <Button-group>
                  <Button size="small" class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
              </Button-group>
              <Button size="small" type="primary" class="ml-2" icon="md-add" @click="addInfo">添加标题</Button>
              <!-- <export-button class="ml-2" res="course_case_titles" :params="params"></export-button> -->
          </div>
      </div>
      <div class="box box-result">
          <div class="content-body">
              <Table
                      v-loading.like="'course_case_titles'"
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
          
      </div>
  </Modal>
</template>

<script>
  import util from '@/libs/util'
  import grid from '@/libs/grid.mixin'
  import modal from '@/libs/modal.mixin'
  import common from '@/libs/common.mixin'
  import globals from '@/libs/globals.mixin'
  import ExportButton from 'c%/ExportButton.vue'

  export default {
    mixins: [util, grid, modal, common, globals],
    components: {
        ExportButton
    },
    data () {
	    return {
	        rest_api: 'course_case_titles',
          search_field: {
            cct_id:''
          },
	        pk: 'cctit_id',
          course_case_topics: [],
	        column_keys: {
				    title: {
					      title: '标题名称',
		            show: true,
				    },
		        topic: {
		            title: '课案主题',
		            show: true,
		        },
            grade_section: {
                title: '年龄段',
                show: true,
            },
            week_duration: {
                title: '范围',
                show: true,
            },
            course_case_num:{
                title : '上传次数',
                show:true
            },
            course_case_file:{
                title: '附件数量',
                show: true
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
              week_duration (h,params) {
              	let map = {0:'-',1:'周中',2:'周末'}
              	return h('span',map[params.row.week_duration])
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
        this.init_data(),
        this.get_course_case_topics()
    },
    computed: {
    },
    methods: {
      get_course_case_topics(){
        this.$rest('course_case_topics')
        .get()
        .success(res => {
           this.course_case_topics = res.list
        })
      },
      addInfo () {
        this.$Modal.open('aftersale/course/modal/info-modal.vue', {
            on: {
                "on-success": () => {
                    this.$emit('on-success')
                    this.init_data()
                }
            }
        })
        .then(modal => {
            modal.show('添加课标标题', 'add')
        })
      },
      editInfo (item) {
        this.$Modal.open('aftersale/course/modal/info-modal.vue', {
          on: {
            "on-success": () => {
              this.$emit('on-success')
              this.init_data()
            }
          }
        })
        .then(modal => {
          modal
            .set('course', item)
            .show('编辑内容', 'edit')
        })
      },
      delInfo (param) {
      	let id = param.cctit_id
        this.$rest("course_case_titles")
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
      }
    },


    watch: {},
}
</script>

<style lang="less" scoped>
</style>

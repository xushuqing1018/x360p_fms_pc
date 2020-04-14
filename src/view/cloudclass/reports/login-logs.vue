<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				<Form-item label="登录时间" prop="create_time" class="col-md-3 col-sm-6">
					<date-range-picker
						v-model="search_field.create_time"
						@on-change="search"
						label="选择日期"
						placement="bottom"
                        style="width: 310px;">
					</date-range-picker>
				</Form-item>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
				    <Button-group>
					    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
				    </Button-group>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
	        <div class="content">
				<div class="content-body">
			        <Table 
			        v-loading.like="'login_logs'"
			        :page-size="pageSize"
			        :page="pageIndex"
			        :stripe="true"
			        :show-header="true"
			        :data="data"
			        :columns="columns"
			        :no-data-text="$store.state.config.EMPTY_DATA_TEXT"
			        :no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT"
			        @on-sort-change="sortChange"> 
			        </Table>
			    </div>
			    <div class="content-footer">
			        <div class="pagenation">
			            <Page 
			            :total="total" 
			            :current="pageIndex" 
			            :show-sizer="true" 
			            :page-size="pageSize" 
			            :show-total="true" 
			            @on-change="pagenation" 
			            @on-page-size-change="pagesize"
			            >
			            </Page>
			        </div>
			    </div>  
		    </div>
	    </div>
    </div>
</template>

<script>
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import globals from '@/libs/globals.mixin'
	import common from '@/libs/common.mixin'
    import DateRangePicker from 'c%/DateRangePicker.vue'
	
	export default{
		mixins: [grid,common,globals],
		components: {
            DateRangePicker
		},
		data () {
			return {
				rest_api: 'report_cloud_classes/login_logs',
				search_field: {
					create_time: []
				},
				column_keys: {
					org_name:{
                         title:'机构名称',
                         show:true
                    },
					student_name: {
						title: '学员姓名',
						show: true
					},
					mobile: {
						title: '手机号',
						show: true
                    },
                    ip:{
                         title:'IP',
                         show:true
					},
                    create_time: {
						title: '登录时间',
						show: true
					}
				},
				column_render: {
					org_name (h,params) {
                        let ret = ''
                        if(params.row.org){
                            ret = params.row.org.org_name
                        }
						return h('span',ret)
                    },
                    student_name (h,params) {
                        let ret = ''
                        if(params.row.log_params.request){
                            ret = params.row.log_params.request.student_name
                        }
						return h('span',ret)
                    },
                    mobile (h,params) {
                        let ret = ''
                        if(params.row.log_params.request){
                            ret = params.row.log_params.request.mobile
                        }
						return h('span',ret)
					}
				}
			}
		},
		mounted() {
			this.init_data()
		},
		methods: {
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='create_time'){
						if(property!=','&&property.length>0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}
					}
					else{
						if(property&&property!=-1){
							params[o] = property	
						}		
					}									
				}
			},
			resetSearch () {
				this.$form('ref_search').reset()
				this.init_data()
			}
		}
	}
</script>
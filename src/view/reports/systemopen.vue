<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				<Form-item label="机构名称" prop="org_name" class="col-sm-3">
					<Input v-model="search_field.org_name" placeholder="机构名称"></Input>
				</Form-item>
				<Form-item label="机构简称" prop="org_short_name" class="col-sm-3">
					<Input v-model="search_field.org_short_name" placeholder="机构简称"></Input>
				</Form-item>
				<Form-item label="开始日期" prop="start_int_day" class="col-sm-3">
					<date-range-picker
						v-model="search_field.start_int_day" 
						@on-change="search" 
						label="选择开始日期" 
						placement="bottom"
						style="width:100%">
					</date-range-picker>
				</Form-item>
				<Form-item label="结束日期" prop="end_int_day" class="col-sm-3">
					<date-range-picker
						v-model="search_field.end_int_day" 
						@on-change="search" 
						label="选择结束日期" 
						placement="bottom"
						style="width:100%">
					</date-range-picker>
				</Form-item>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
                    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>  
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="org_transfer_logs" :params="params"></export-button>
                	<div class="pull-right">
                        <per-scope per="franchisee.allReport" @on-change="type_report = $event"></per-scope>
                   	</div>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
			<div class="toolbar">
	            <filter-column :keys="column_keys"></filter-column>
	        </div>
	        <div class="content">
				<div class="content-body">
			        <Table 
			        v-loading.like="'org_transfer_logs'"
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
	import common from '@/libs/common.mixin'
	import ExportButton from 'c%/ExportButton.vue'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	export default{
		mixins: [grid,common],
		components: {
			ExportButton,
			DateRangePicker
		},
		data () {
			return {
				rest_api: 'org_transfer_logs',
				search_field: {
					org_name: '',
					org_short_name: '',
					int_day: []
				},
				column_keys: {
					org_name: {
						title: '机构名称',
						width: 200,
						show: true,
						fixed: 'left'	
					},
					org_short_name: {
						title: '机构简称',
						width: 150,
						show: true
					},
					type: {
						title: '系统类型',
						show: true,
					},
					start_int_day: {
						title: '开始时间',
						show: true
					},
					end_int_day: {
						title: '结束时间',
						show: true
					},
					days: {
						title: '使用时长',
						show: true
					},
					
				},
				column_render: {
					org_name(h,params) {
						return h('span',params.row.org.org_name)
					},
					org_short_name(h,params) {
						return h('span',params.row.org.org_short_name)
					},
					type(h,params) {
						return h('span',params.row.type == 1 ? '正式版' : '督导版')
					},
					days(h,params) {
						return h('span',params.row.days+"天")
					}
				}
			}
		},
		mounted() {
			this.init_data()
		},
		methods: {
			// deal_data(res) {
			// 	this.search_field.int_day = [res.params.start_date,res.params.end_date]
			// 	return res.list
			// },
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='start_int_day'){
						if(property!=','&&property.length>0){
							params['start_start_date'] = property[0]
							params['start_end_date']   = property[1]
						}
					}
					else if(o=='end_int_day') {
						if(property!=','&&property.length>0){
							params['end_start_date'] = property[0]
							params['end_end_date']   = property[1]
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
		},
		computed: {
			report_params() {
				let params = {}
				let int_day = this.search_field.int_day
				if(int_day!=','&&int_day.length>0) {
					params = {
						start_date: int_day[0],
						end_date: int_day[1]
					}
				}
				return params
			}
		}
	}
</script>
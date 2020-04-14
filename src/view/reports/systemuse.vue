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
				<Form-item label="运营状态" prop="status" class="col-md-3 col-sm-6">
					<Select v-model="search_field.status">
					    <Option value="">不限</Option>
						<Option :value="index" v-for="(val,key,index) in business_status_list">{{val}}</Option>
					</Select>
				</Form-item>
				<!-- <Form-item label="开始日期" prop="start_int_day" class="col-sm-3">
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
				</Form-item> -->
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
                    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>  
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="report_org_uses" :params="params"></export-button>
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
			        v-loading.like="'report_org_uses/get_formal_org_uses'"
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
					<div class="pull-left">
						<Tag color="blue">学员名单总数：{{total_student_nums}}</Tag>
					</div>
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
	import ExportButton from 'c%/ExportButton.vue'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	export default{
		mixins: [grid,common,globals],
		components: {
			ExportButton,
			DateRangePicker
		},
		data () {
			return {
				rest_api: 'report_org_uses/get_formal_org_uses',
				search_field: {
					org_name: '',
					org_short_name: '',
					// int_day: []
				},
                total_student_nums : 0,
				column_keys: {
					org_name: {
						title: '机构名称',
						width: 200,
						show: true
					},
					org_short_name: {
						title: '机构简称',
						width: 150,
						show: true
					},
					/*type: {
						title: '系统类型',
						show: true,
					},*/
					charge_eid: {
						title: '校区督导',
						show: true
					},
					fc_person:{
                        title:'联系人',
						show:true,
					},
					fc_tel:{
                        title:'联系电话',
						show:true,
					},
					employee: {
						title: '员工数',
						show: true
					},
					market_clue: {
						title: '市场名单数',
						show: true
					},
                    customer: {
                        title: '客户名单数',
                        show: true
                    },
					student: {
						title: '学员名单数',
						show: true
					},
					create_time: {
						title: '开通时间',
						show: true
					},
					last_login_time:{
						title: '最后登录时间',
						show:true
					},
                    expire_day:{
                        title: '到期时间',
                        show:true
                    }
				},
				column_render: {
					type(h,params) {
						return h('span',params.row.org_type == 1 ? '正式版' : '督导版')
					},
					charge_eid(h,params) {
						return h('span', this.$filter('ename')(params.row.charge_eid))
					},
				},
				operation_keys: {
					switch: {
						title: '转换为督导版',
						type: 'ios-undo'
					}
				},
				operation_func: {
					switch(params) {
						let label = '督导沟通版',
						type = 2;
						this.$Modal.confirm({
							title:'确认转化为' + label,
							onOk:() => {
								this.$http.post(`fapi/orgs/${params.row.og_id}/change_org_type`,{
									org_type: type
								})
								.then(res => {
									this.$Message.success('转化成功')
									this.init_data()
								},res => {
									this.$Message.error("审核中，请勿重复提交")
								})
							}
						})
					}
				}
			}
		},
		mounted() {
			this.init_data()
		},
		methods: {
            deal_data (data) {
                this.total_student_nums = data.total_student_nums
                return data.list
            },
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
						if(property!=-1){
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
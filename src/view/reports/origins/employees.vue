<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				
				<Form-item label="校区简称" prop="org_short_name" class="col-sm-3">
					<Input v-model="search_field.org_short_name" placeholder="校区简称"></Input>
				</Form-item>
				<Form-item label="校区模式" prop="branch_mode" class="col-sm-3">
					 <Select v-model="search_field.branch_mode" style="width:100%">
						<Option :value="1">直营</Option>
						<Option :value="2">加盟</Option>
						<Option :value="3">直盟</Option>
					</Select>
				</Form-item>
				<Form-item label="姓名" prop="ename" class="col-sm-3">
					<Input v-model="search_field.ename" placeholder="姓名"></Input>
				</Form-item>
				<Form-item label="手机" prop="mobile" class="col-sm-3">
					<Input v-model="search_field.mobile" placeholder="手机"></Input>
				</Form-item>

				<template v-if="searchExpand">
					<Form-item label="员工状态" prop="is_on_job" class="col-md-3 col-sm-6">
						<Select v-model="search_field.is_on_job">
							<Option value="">不限</Option>
							<Option value="1">在职</Option>
							<Option value="0">离职</Option>
						</Select>
					</Form-item>
					<Form-item label="账号状态" prop="user_status" class="col-md-3 col-sm-6">
						<Select v-model="search_field.user_status">
							<Option value="">不限</Option>
							<Option value="1">已启用</Option>
							<Option value="0">已禁用</Option>
						</Select>
					</Form-item>
					<Form-item label="角色" prop="rid" class="col-md-3 col-sm-6">
						<Select v-model="search_field.rid">
							<Option v-for="item in roles" :value="item.rid" :key="item.rid">{{item.role_name}}</Option>
						</Select>
					</Form-item>
				</template>
				
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
				    <Button-group>
					    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
					    <Button type="primary" @click="toggleSearch"><Icon :type="toggleSearchIcon"></Icon></Button>
				    </Button-group>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="franchisee_employees" :params="params"></export-button>
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
			        v-loading.like="'franchisee_employees'"
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
	import ExportButton from 'c%/ExportButton.vue'
	// import DateRangePicker from 'c%/DateRangePicker.vue'
	export default{
		mixins: [grid,common,globals],
		components: {
			ExportButton,
			// DateRangePicker
		},
		data () {
			return {
				rest_api: 'franchisee_employees',
				search_field: {
					org_short_name: '',
					branch_mode: '',
					ename:'',
					mobile:'',
					rid : '',
					is_on_job:'1',
					user_status:'1',
				},
				column_keys: {
					eid:{
                        title:'员工编号',
                        show:true,
                    },
					org_name:{
                        title:'机构名称',
                        show:true
					},
					org_short_name:{
                        title:'校区简称',
                        show:true,
					},
					branch_name:{
                        title: '所属校区',
                        show: true,
					},
					ename: {
                        title: '姓名',
                        show: true
                    },
                    rid_names: {
                        title: '角色',
                        show: true
                    },
                    mobile: {
                        title: '手机',
                        show: true
                    },
                    email: {
                        title: 'Email',
                        show: true
                    },
                    user_status: {
                        title: '账号状态',
                        show: true
                    },
                    account: {
                        title: '账号名',
                        show: true
                    },
    
				},
				column_render: {
                     user_status(h, params) {
                        let [type,color,label] = ['','',''];
                        [type,color,label] = ( params.row.user_status === 0 ? ['close-circled', '#999999','已禁用'] : ['checkmark-circled','#006600','已启用'])                   
                        
                        return h('div',[
                            h('Icon',{
                                props:{
                                    type: type,
                                    color: color
                                }
                            }),
                            h('span',label)
                        ])
                    },
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
			
		}
	}
</script>
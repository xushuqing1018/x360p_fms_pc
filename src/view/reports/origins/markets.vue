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
				<Form-item label="姓名" prop="name" class="col-sm-3">
					<Input v-model="search_field.name" placeholder="姓名"></Input>
				</Form-item>
				<Form-item label="电话" prop="tel" class="col-sm-3">
					<Input v-model="search_field.tel" placeholder="电话"></Input>
				</Form-item>

				<template v-if="searchExpand">
					<Form-item label="学员年龄" prop="age" class="col-md-3 col-sm-6">
						<select-age v-model="search_field.age"></select-age>
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
                	<export-button res="franchisee_market_clues" :params="params"></export-button>
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
    import SelectAge from 'c%/SelectAge.vue'
	// import DateRangePicker from 'c%/DateRangePicker.vue'
	export default{
		mixins: [grid,common,globals],
		components: {
			ExportButton,
            SelectAge,
			// DateRangePicker
		},
		data () {
			return {
				rest_api: 'franchisee_market_clues',
				search_field: {
					org_short_name: '',
					branch_mode: '',
					name:'',
					tel:'',
				},
				column_keys: {
					org_name:{
                        title:'机构名称',
                        show:true
					},
					org_short_name:{
                        title:'校区简称',
                        show:true
					},
					branch_name:{
                        title: '所属校区',
                        show: true,
					},
					name: {
						title: '姓名',
						show: true,
					},
					sex: {
						title: '性别',
						show: true,
					},
					age:{
                        title:'年龄',
                        show:true
					},
					tel: {
						title: '电话',
						show: true,
					},					
					is_deal: {
						title: '是否成交',
						show: true,
					},
					create_uid: {
						title: '录入人',
						show: true,
					},
					create_time: {
						title: '录入时间',
						show: true,
					},
					get_time: {
						title: '获取时间',
						show: true,
					},
					remark: {
						title: '备注',
						show: true,
					}

				},
				column_render: {
			
					email (h,params) {
						return h('span',params.row.email||'-')
					},
					remark (h,params) {
						return h('span',params.row.remark||'-')
					},
					is_deal (h,params) {
						let map = {0: '未成交', 1: '已成交'}
						return h('span',map[params.row.is_deal])
					},
				},
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
                    else if(o=='age'){
                        let start = util.int(property[0])
                        let end = util.int(property[1])
                        if(start>=0&&end>0&&end>=start){
                            params.age_start = start
                            params.age_end = end
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
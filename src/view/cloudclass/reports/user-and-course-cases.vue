<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				<Form-item label="校区名称" prop="og_id" class="col-md-3 col-sm-6">
					<select-franchisee v-model="search_field.og_id" clearable placeholder="请选择盟商"></select-franchisee>
				</Form-item>
                <Form-item label="姓名" prop="username" class="col-md-3 col-sm-6">
					<Input v-model="search_field.username" placeholder="姓名"></Input>
				</Form-item>
                <Form-item label="手机号" prop="mobile" class="col-md-3 col-sm-6">
					<Input v-model="search_field.mobile" placeholder="手机号"></Input>
				</Form-item>
                <Form-item label="用户来源" prop="user_from" class="col-md-3 col-sm-6">
					<Select v-model="search_field.user_from">
                        <Option :value="0">不限</Option>
                        <Option :value="1">云课堂</Option>
                        <Option :value="2">学习管家</Option>
                    </Select>
				</Form-item>
                <Form-item label="统计日期" prop="int_day" class="col-md-3 col-sm-6">
					<date-range-picker
						v-model="search_field.int_day"
						@on-change="search"
						label="选择日期"
						placement="bottom"
                        style="width: 450px;">
					</date-range-picker>
				</Form-item>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
				    <Button-group>
					    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
				    </Button-group>
                    <Button type="primary" icon="md-refresh" @click="refresh">刷新</Button>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
	        <div class="content">
				<div class="content-body">
			        <Table 
			        v-loading.like="'user_and_course_cases'"
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
    import moment from 'moment'
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import globals from '@/libs/globals.mixin'
    import common from '@/libs/common.mixin'
    import DateRangePicker from 'c%/DateRangePicker.vue'
    import SelectFranchisee from 'c%/SelectFranchisee.vue'
	
	export default{
		mixins: [grid,common,globals],
		components: {
            DateRangePicker,
            SelectFranchisee
		},
		data () {
			return {
				rest_api: 'report_user_and_course_cases',
				search_field: {
                    og_id: 0,
                    username: '',
                    mobile: '',
                    user_from: 0,
                    refresh: 0,
                    int_day: []
				},
				column_keys: {
					org_name:{
                         title:'校区名称',
                         show:true
                    },
                    short_name:{
                         title:'简称',
                         show:true
                    },
					username: {
						title: '学员姓名',
						show: true
					},
					mobile: {
						title: '手机号',
						show: true
                    },
                    upload_nums:{
                         title:'上传数量',
                         show:true,
			                   sortable: 'custom'
                    },
                    file_nums:{
                         title:'文件数量',
                         show:true,
			                   sortable: 'custom'
					          },
                    create_time: {
						title: '创建时间',
						show: true
					}
				}
			}
		},
		mounted() {
            let start_date = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD')
            let end_date = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD')
            this.search_field.int_day = [start_date,end_date]
			this.init_data()
		},
		methods: {
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
                    let property = search_obj[o]
                    if(o=='int_day'){
						if(property!=','&&property.length>0){
							params['start_date'] = property[0]
					     	params['end_date']   = property[1]
						}												
					}else if(property&&property!=-1){
						params[o] = property	
					}								
				}
			},
			search () {
				this.search_field.refresh = 0
				this.init_data()
			},
			refresh () {
                this.search_field.refresh = 1
				this.init_data()
			}
		}
	}
</script>

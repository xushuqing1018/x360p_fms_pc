<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				<Form-item label="姓名" class="col-md-3 col-sm-6" prop="name">
					<Input v-model="search_field.name"></Input>
				</Form-item>
				<Form-item label="电话" class="col-md-3 col-sm-6" prop="name">
					<Input v-model="search_field.tel"></Input>
				</Form-item>
				<Form-item label="分配盟商" class="col-md-3 col-sm-6" prop="assign_og_id">
					<select-org v-model="search_field.assign_og_id"></select-org>
				</Form-item>
				<Form-item label="分配人" class="col-md-3 col-sm-6" prop="assign_og_eid">
					<select-employee v-model="search_field.assign_og_eid"></select-employee>
				</Form-item>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
	            	<Button-group>
                        <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
						<Button type="primary" @click="toggleSearch"><Icon :type="toggleSearchIcon"></Icon></Button>
                    </Button-group>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="market_clues" :params="params"></export-button>
                	<CheckboxGroup v-model="search_field.is_sign" class="ml-3" style="display: inline-block;" @on-change="search">
                        <Checkbox :label="1">
                            <span>已分配</span>
                        </Checkbox>
                        <Checkbox :label="0">
                            <span>未分配</span>
                        </Checkbox>
                    </CheckboxGroup>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Dropdown trigger="click">
					<Button 
						type="primary" 
						icon="more" 
						:disabled="s_list.length==0" 
						title="勾选进行批量操作"
						>
						批量操作&nbsp;{{s_list.length||''}}
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem @click.native="batchAssign"><Icon type="md-archive"></Icon> 分配给盟商</DropdownItem>
					</DropdownMenu>
				</Dropdown>
	            <filter-column :keys="column_keys"></filter-column>
	        </div>
	        <div class="content">
				<div class="content-body">
			        <Table 
				        v-loading.like="'market_clues'" 
				        :page-size="pageSize" 
				        :page="pageIndex" 	
				        :stripe="true" 
				        :show-header="true" 
				        :data="data" 
				        :columns="columns" 
				        :no-data-text="$store.state.config.EMPTY_DATA_TEXT" 
				        :no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT" 
				        @on-sort-change="sortChange"
						@on-selection-change="addSelectData"
				        > 
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
	    <select-org 
	    	ref="ref_org" 
	    	v-model="assign_og_id" 
	    	v-show="false" 
	    	title="分配给盟商"
	    	@selected="assignToOrg"
	    	>
    	</select-org>
    </div>
</template>

<script>
	import Vue from 'vue'
	import moment from 'moment'
	import util,{_} from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import SelectOrg from 'c%/SelectOrg.vue'
	import SelectEmployee from 'c%/SelectEmployee'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	import ExportButton from 'c%/ExportButton.vue'
	import ImportButton from 'c%/ImportButton.vue'
	import ExpandRow from './franchisees/expand-row.vue'

	export default{
		mixins: [grid,common,globals],
		components: {
			SelectOrg,
			DateRangePicker,
			ExportButton,
			ImportButton,
			ExpandRow,
			SelectEmployee
		},
		data () {
			return {
				rest_api: 'market_clues',
				pk: 'mcl_id',
				s_list: [],
				showCheckbox: true,
				search_field: {
					name: '',
					tel: '',
					assign_og_id: 0,
					assign_do_eid: 0,
					is_sign: [0,1]
				},
				assign_og_id: 0,
				option_fields: [],
				assignType: 0,
				currentClue: {},
				column_keys: {
					channel_name: {
						title: '渠道'
					},
					name: {
						title: '姓名'
					},
					tel: {
						title: '电话'
					},
					get_time:{
                        title: '获取时间'
					},
					assign_og_name: {
						title: '分配盟商'
					},
					assign_do_eid: {
						title: '分配人'
					},
					checkout_time: {
						title: '取出状态'
					}
				},
				column_render: {
					assign_do_eid(h,params) {
						if(params.row.assign_do_eid) {
							return h('div',[
							h('p',params.row.assign_do_ename),
							h('p',params.row.assign_og_time),
							])
						}
						else{
							return h('span','-')
						}
					},
					assign_og_name(h,params) {
						if(params.row.assign_og_id) {
							return h('span',params.row.assign_og_name)
						}
						else{
							return h('span',{
								class:'text-danger'
							},'未分配')
						}
					},
					checkout_time(h,params) {
						if(params.row.checkout_eid) {
							return h('div',[
								h('p',{
									class:'text-success'
								},params.row.checkout_ename),
								h('p',params.row.checkout_time)
								])
						}else{
							if(params.row.assign_og_id) {
								return h('span',{
									class:'text-danger'
								},'未取出')
							}else{
								return h('span','-')
							}
						}
					}
				},
				operation_keys: {
					assign: {
						title: '分配给盟商',
						type: 'md-archive',
						condition: 'row.assign_og_id==0'
					},
					cancel: {
						title: '取消分配',
						type: 'md-remove-circle',
						condition: 'row.assign_og_id>0&&row.checkout_eid==0'
					},
					delete: {
						title: '删除',
						type: 'ios-trash',
						condition: 'row.checkout_eid==0'
					}
				},
				operation_func: {
					assign(params) {
						this.assignType = 0
						this.currentClue = params.row
						this.$r('ref_org').openModal()
					},
					cancel(params) {
						this.confirm('确定取消分配吗？')
						.then(() => {
							this.$rest(this.rest_api).add_url_param('cancel')
							.post({
								mcl_ids: [params.row.mcl_id]
							})
							.success(res => {
								this.$Message.success('取消分配成功')
								this.init_data()
							})
							.error(res => {
								this.$Message.error(res.message)
							})
						})
					},
					delete(params) {
						this.confirm('确定删除这个名单吗？')
						.then(() => {
							this.delete(params.row)
						})
					}
				}
			}
		},
		created(){
			this.getMarketOptionField()
		},
		mounted() {
			this.init_data()
		},
		methods: {
			getMarketOptionField() {
				this.$rest('configs?cfg_name=mcl_option_fields','api/')
				.get()
				.success(res => {
					this.option_fields = res.cfg_value
					this.initOptionFieldsColumn()
				})
				.error(res =>{
					this.$Message.error(res.message)
				})
			},
			assignToOrg(selected) {
				this.assign(this.assignType,selected.og_id)
			},
			batchAssign() {
				this.assignType = 1
				this.$r('ref_org').openModal()
			},
			assign(type,og_id) {
				let mcl_ids = []
				if(type) { //批量分配
					mcl_ids = this.s_list.map(s => {
						return s.mcl_id
					})
				}
				else {
					mcl_ids.push(this.currentClue.mcl_id)
				}
				this.$rest(this.rest_api).add_url_param('assign')
				.post({
					mcl_ids: mcl_ids,
					assign_og_id: og_id,
					assign_do_eid: this.eid$
				})
				.success(res => {
					this.$Message.success('分配成功')
					this.init_data()
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			},
			addSelectData(s) {
				this.s_list = s
			},
			resetSearch () {
				this.$form('ref_search').reset()
				this.init_data()
			},
			initOptionFieldsColumn(){
				this.option_fields.forEach(f=>{
					if(f.enable == 1){
						this.$set(this.column_keys,f.name,{title:f.label,show:true,width:160})
					}
				})
				this.column_keys_ready = true
			},
			deal_data (data) {
				let fields = []
				this.option_fields.forEach(f=>{
					if(f.enable == 1){
						fields.push(f.name)
					}
				})
				function get_option_fields_default_value(obj,f){
					if(obj && obj[f]){
						return obj[f]
					}
					return ''
				}
				data.list.forEach(item=>{
					if(item.assign_og_id) {
						item._disabled = true
					} 
					fields.forEach(f=>{
						item[f] = get_option_fields_default_value(JSON.parse(item.option_fields),f)
					})
				})
				
				return data.list
			},
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				params.get_scope = 1
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='contract_end_int_day'){
						if(property!=','&&property.length>0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}												
					}
					else if(o=='is_sign') {
						if(property.length == 1) {
							if(property[0] == 0) {
								params.assign_og_id = 0
							}
							else {
								params.assign_og_id = '[>,0]'
							}
						}
					}
					else{
						if(property&&property!==-1){
							params[o] = property	
						}		
					}									
				}
			}
		}
	}
</script>

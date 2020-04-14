<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form :label-width="70" class="filter-form row" ref="ref_search" :model="search_field">
				<Form-item label="盟商名称" class="col-md-3 mb-0" prop="fc_id">
					<select-franchisee v-model="search_field.fc_id" placeholder="请选择盟商" @selected="search" ></select-franchisee>
				</Form-item>
				<Form-item label="跟进时间" class="col-md-3 mb-0" prop="create_time">					
					<date-range-picker
						v-model="search_field.create_time" 
						@on-change="search" 
						label="选择日期" 
						placement="bottom" 
						style="width:100%">
					</date-range-picker>
				</Form-item>
				<Form-Item label="下次跟进" class="col-md-3 mb-0" prop="next_follow_time">
					<date-range-picker 
						v-model="search_field.next_follow_time" 
						@on-change="search" 
						label="选择日期" 
						placement="bottom" 
						style="width:100%">
					</date-range-picker>
				</Form-Item>
				<Form-Item label="跟进人" class="col-md-3 mb-0" prop="eid" v-if="type_following=='all'">
					<select-employee v-model="search_field.eid" clearable @selected="search" ></select-employee>
				</Form-Item>
				<template v-if="searchExpand">
					<Form-Item label="意向级别" class="col-md-3 mb-0" prop="intention_level">
						<Rate v-model="search_field.intention_level" @on-change="search" ></Rate>
					</Form-Item>
					<Form-item label="客户状态" class="col-md-3 mb-0" prop="franchisee_status_did">
						<Select v-model="search_field.franchisee_status_did" @on-change="search" >
							<Option :value="0">不限</Option>
							<Option :value="item.did" v-for="item in dicts('customer_status')">{{item.title}}</Option>
						</Select>
					</Form-item>
				</template>
			</Form>
			
			<Row class="basic">
	            <Col span="24" class="mt-2" style="margin-left: 0;">
	            	<ButtonGroup>
                        <Button type="primary" @click="search"><Icon type="ios-search"/>查询</Button>     
                        <Button type="primary" @click="toggleSearch"><Icon :type="toggleSearchIcon"></Icon></Button>
                    </ButtonGroup>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="franchisee_follow_ups" :params="params" v-per="'flist.export'"></export-button>
                	
                	<CheckboxGroup v-model="search_field.is_connect" class="ml-3" style="display: inline-block;" @on-change="search">
                        <Checkbox :label="0">
                            <span>无效</span>
                        </Checkbox>
                        <Checkbox :label="1">
                            <span>有效</span>
                        </Checkbox>
                    </CheckboxGroup>
                	<div class="pull-right">
                        <per-scope per="franchisee.follow.all" @on-change="perScopeChange"></per-scope>
                    </div>               	
	            </Col>
	        </Row>    
			
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Button type="primary" icon="md-add" @click="add" v-per="'followups.add'">添加跟进</Button>
				<filter-column :keys="column_keys"></filter-column>
			</div>
			<div class="content">
				<div class="content-body">
		            <Table 
		            	v-loading.like="'franchisee_follow_up'" 
		            	:page="pageIndex" 
		            	:page-size="pageSize" 
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
		                	@on-page-size-change="pagesize">
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
	import modal from '@/libs/modal.mixin'
	import grid from '@/libs/grid.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import SelectEmployee from 'c%/SelectEmployee.vue'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	import SelectFranchisee from 'c%/SelectFranchisee.vue'
	import ExportButton from 'c%/ExportButton.vue'
	
	export default{
		mixins: [grid,common,globals,modal],
		components: {
			SelectEmployee,
			DateRangePicker,
			SelectFranchisee,
			ExportButton
		},
		data () {
			return {
				rest_api: 'franchisee_follow_ups',
				pk: 'ffu_id',
				datakey: 'follow_up',
				type_following: '',
				showEmptyColumn: true,
				search_field:{
					eid: 0,
					fc_id: 0,
					intention_level: 0,
					franchisee_status_did: 0,
					create_time: [],
					next_follow_time:[],
					is_connect: [0,1]
				},
				column_keys: {
					org_name: {
						title: '盟商',
						tooltip: true,
						fixed: 'left',
						width: 250
					},
					mobile: {
						title: '对方联络人',
						width: 180,
						show: true
					},					
					franchisee_status_did: {
						title: '客户状态',
						width: 120,
						show: true
					},
					is_connect: {
						title: '是否有效',
						width: 120,
						show: true
					},
					followup_did: {
						title: '沟通类型',
						width: 120,
						show: true
					},
					content: {
						title: '跟进内容',
						width: 250,
						tooltip: true,
						show: true
					},					
					eid: {
						title: '跟进人',
						width: 120,
						show: true
					},		
					create_time: {
						title: '跟进日期',
						width: 120,
						show: true
					},
					next_follow_time: {
						title: '下次跟进',
						width: 120,
						show: true
					},
					intention_level: {
						title: '意向级别',
						width: 180,
						show: true
					},
				},
				column_render: {
					org_name (h,params) {
						let result = '-'
						let franchisee = params.row.franchisee
						if(franchisee) {
							result = franchisee.org_name
						}
						return h('span',result)
					},
					mobile (h,params) {
						let result = '-'
						let person = params.row.franchisee_person
						if(person) {
							result = person.name+'：'+person.mobile
						}
						return h('span',result)
					},
					eid (h,params) {
						return h('span',this.$filter('ename')(params.row.eid,'-'))
					},
					franchisee_status_did (h,params) {						
						return h('span',this.$filter('dict_title')(params.row.franchisee_status_did,'franchisee_status','-'))
					},
					is_connect (h,params) {
						let map_text = {0:['无效','danger'],1:['有效','success']}
						return h('span',{
							class: 'text-'+map_text[params.row.is_connect][1]
						},map_text[params.row.is_connect][0])
					},
					intention_level (h,params) {
						return h('Rate',{
							props: {
								value: params.row.intention_level,
								disabled: true
							}
						})
					},
					create_time (h,params) {
						return h('span',params.row.create_time.substring(0,10))
					},
					next_follow_time (h,params) {	
						return h('span',params.row.next_follow_time||'待定')
					},
					followup_did (h,params) {
						let result = '-'
						let did = params.row.followup_did
						let invalid_did = params.row.invalid_followup_did
						if(did) {
							result = this.$filter('dict_title')(did,'franchisee_followup')
						}else{
							if(invalid_did) {
								result = this.$filter('dict_title')(invalid_did,'invalid_franchisee_followup')
							}
						}
						return h('span',result)
					}
				},
				operation_keys: {
					edit: {
						title: '编辑',
						type: 'md-create',
						per: 'followups.edit'
					},
					follow_add: {
						title: '跟进',
						type: 'logo-googleplus',
						per: 'followups.add'
					},
					delete: {
						title: '删除',
						type: 'ios-trash',
						per: 'followups.delete'
					}
				},
				operation_func: {
					edit (params) {
						this.editInfo(params.row)
					},
					follow_add (params) {
						this.addInfo(params.row)
					},
					delete (params) {
						this.delInfo(params.row)
					}
				}
			}
		},
		watch: {
			'type_following': function (val) {				
				this.init_data()
			}
		},
		methods: {
			perScopeChange(value) {
	            this.type_following = value
	        },
	        add () {
	        	this.$Modal.open('sale/followup/info-modal.vue',{
					on: {
						'on-success':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.show('添加跟单记录')
				})
	        },
	        addInfo (row) {
				this.$Modal.open('sale/followup/info-modal.vue',{
					props: {
						'fc-id': row.fc_id,
						'fc-name': row.franchisee.org_name
					},
					on: {
						'on-success':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.show('添加跟单记录')
				})
	        },
			editInfo (row) {
				this.$Modal.open('sale/followup/info-modal.vue',{
					props: {
						'fc-id': row.fc_id,
						'fc-name': row.franchisee.org_name
					},
					on: {
						'on-success':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.set('info',row)
					.show('编辑跟单记录','edit')
				})
			},
			delInfo (row) {
				this.confirm('确认删除本次跟进吗？')
				.then(()=>{
					this.delete(row)	
				})
			},
			resetSearch () {
				this.$form('ref_search').reset()
				this.init_data()
			},
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='is_connect'){
						if(property!=','&&property.length > 0){
							params[o] = util.sprintf('[IN,%s]',property.join(','))
						}												
					}
					else if(o=='create_time'||o=='next_follow_time'){
						if(property!=','&&property.length > 0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}												
					}
					else{
						if(property&&property!=-1){
							params[o] = property	
						}		
					}									
				}
				if(this.type_following=='my') {
					params.eid = this.eid$
				}
			}
		}
	}
</script>
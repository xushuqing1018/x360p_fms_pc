<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="100" class="filter-form row">
				<Form-item label="盟商名称/简称" prop="org_name" class="col-md-3 col-sm-6">
					<Input v-model="search_field.org_name" @on-enter="search" placeholder="加盟商名称/简称" onkeypress="if(event.keyCode == 13) return false;"></Input>
				</Form-item>
				<Form-item label="完成日期" prop="int_day" class="col-md-3 col-sm-6">
					<date-range-picker 
						v-model="search_field.int_day" 
						@on-change="search" 
						label="选择完成日期" 
						placement="bottom"
						style="width:100%">
					</date-range-picker>					
				</Form-item>
				<Form-item label="完成员工" prop="eid" class="col-md-3 col-sm-6">
					<select-employee v-model="search_field.eid" clearable></select-employee>
				</Form-item>
				<Form-item label="服务类型" prop="fc_service_did" class="col-md-3 col-sm-6">
					<Select v-model="search_field.fc_service_did">
						<Option :value="-1">不限</Option>
						<Option v-for="item in dicts('fc_service')" :value="item.did">{{item.title}}</Option>
					</Select>
				</Form-item>

				<template v-if="searchExpand">
					<Form-item label="系统沟通状态" prop="system_status_did" class="col-md-3 col-sm-6">
						<Select v-model="search_field.system_status_did">
							<Option value="">不限</Option>
							<Option :value="item.did" v-for="item in franchisee_status_list">{{item.title}}</Option>
						</Select>
					</Form-item>
					<Form-item label="系统类型" prop="org_type" class="col-md-3 col-sm-6">
						<Select v-model="search_field.org_type">
							<Option value="">不限</Option>
							<Option value="0">未开通</Option>
							<Option value="1">正式版</Option>
							<Option value="2">督导版</Option>
						</Select>
					</Form-item>
					<Form-item label="沟通类型" prop="communicate_type_did" class="col-md-3 col-sm-6">
						<Select v-model="search_field.communicate_type_did">
							<Option value="">不限</Option>
							<Option :value="item.did" v-for="item in communicate_type_list">{{item.title}}</Option>
						</Select>
					</Form-item>
					<Form-item label="运营状态" prop="status" class="col-md-3 col-sm-6">
						<Select v-model="search_field.status">
						    <Option value="">不限</Option>
							<Option :value="index" v-for="(val,key,index) in business_status_list">{{val}}</Option>
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
                	<export-button res="franchisee_service_records" :params="params"></export-button>
                	<import-button res="franchisee_service_records" name="督导服务" @on-import-finish="init_data"></import-button>
					<div class="pull-right">
                        <per-scope per="franchisee.service.all" @on-change="type_service = $event"></per-scope>
                   	</div>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Button type="primary" icon="md-add" @click="addService" v-per="'services.add'">添加服务记录</Button>
	            <filter-column :keys="column_keys"></filter-column>
			</div>
	        <div class="content">
				<div class="content-body">
			        <Table 
				        v-loading.like="'franchisee_service_records'" 
				        :page-size="pageSize" 
				        :page="pageIndex" 	
				        :stripe="true" 
				        :show-header="true" 
				        :data="data" 
				        :columns="columns" 
				        :no-data-text="$store.state.config.EMPTY_DATA_TEXT" 
				        :no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT" 
				        @on-sort-change="sortChange"
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
	</div>
</template>
<script>
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import SelectFranchisee from 'c%/SelectFranchisee.vue'
	import SelectEmployee from 'c%/SelectEmployee.vue'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	import ExportButton from 'c%/ExportButton.vue'
	import ImportButton from 'c%/ImportButton.vue'

	export default {
		mixins: [grid,modal,common,globals],
		components: {
			SelectEmployee,
			SelectFranchisee,
			DateRangePicker,
			ExportButton,
			ImportButton
		},
		data() {
			return {
				rest_api: 'franchisee_service_records/all_records',
				pk: 'fsr_id',
				type_service: '',
				search_field: {
					fc_service_did: -1,
					fc_id: 0,
					status: -1,
					eid: 0,
					int_day: [],
					short_name: ''
				},
				showEmptyColumn: true,
				column_keys: {
					franchisee: {
						title: '加盟商',
						width: 250,
						fixed: 'left'
					},
					fc_service_did: {
						title: '服务类型',
						width: 160
					},
					communicate_type_did: {
						title: '沟通类型',
						width: 160
					},
					content: {
						title: '服务内容',
						width: 500
					},
					employee_name: {
						title: '服务员工',
						width: 120
					},
					int_day: {
						title: '完成时间',
						width: 180
					},
					is_show_to_fc: {
						title: '盟商可见',
						width: 120,
						show:false
					},
					is_need_reply: {
						title: '需要回复',
						width: 120,
						show:false,
					},
					is_read: {
						title: '阅读时间',
						width: 200,
						show:false
					}
				},
				column_render: {
					franchisee(h,params) {
						let span = h('span',{
							class: params.row.is_show_to_fc&&params.row.is_need_reply?'text-primary text-cursor':'',
							on:{
								click:() => {
									if(params.row.is_show_to_fc&&params.row.is_need_reply) {
										this.serviceDetail(params.row)
									}
								}
							}
						},params.row.franchisee.org_name)
						let badge = h('Badge',{
							props: {
								count: params.row.unread
							}
						})
						return h('div',[span,badge])
					},
					fc_service_did(h,params) {
						return h('span',this.$filter('dict_title')(params.row.fc_service_did,'fc_service'))
					},
					communicate_type_did(h,params){
                        return h('span',this.$filter('dict_title')(params.row.communicate_type_did,'communicate_type'))
					},
					int_day(h,params) {
						let result = '-'
						if(params.row.int_day!=0) {
							result = params.row.int_day
							if(params.row.int_hour!=0) {
								result = result+' '+params.row.int_hour
							}
						}
						return h('span',result)
					},
					is_show_to_fc(h,params) {
						return h('span',params.row.is_show_to_fc?'是':'否')
					},
					is_need_reply(h,params) {
						return h('span',params.row.is_need_reply?'是':'否')
					},
					is_read(h,params) {
						if(params.row.is_read) {
							return h('span',{class:'text-success'},params.row.read_time+' '+params.row.read_fc_employee_name+'已读')
						}else{
							return h('span',{class:'text-danger'},'未读')
						}
					}
				},
				operation_keys: {
					detail: {
						title: '详情',
						type: 'ios-eye',
						condition: 'row.is_show_to_fc==1&&row.is_need_reply==1'
					},
					edit: {
						title: '编辑',
						type: 'md-create',
						per: 'services.edit'
					},
					view: {
						title: '附件',
						type: 'ios-document',
						condition: 'row.franchisee_service_record_file.length>0'
					},
					del: {
						title: '删除',
						type: 'ios-trash',
						per: 'services.delete'
					}
				},
				operation_func: {
					detail(params) {
						this.serviceDetail(params.row)
					},
					edit(params) {
						this.$Modal.open('aftersale/services/info-modal.vue',{
							props: {
								from: 'service'
							},
							on: {
								save: () => {
									this.init_data()
								}
							}
						})
						.then(modal => {
							modal
							.set('info',params.row)
							.show('编辑服务记录','edit')
						})
					},
					view(params) {
						this.viewFiles(params.row)
					},
					del(params) {
						this.confirm()
						.then(() => {
							this.rest_api = 'franchisee_service_records';
							this.delete(params.row)
						})
					}
				}
			}
		},
		mounted() {
			this.replaceSearchField()
		},

        computed: {
            franchisee_status_list() {
                return this.$store.state.gvars.dicts.system_status
            },
			communicate_type_list() {
                return this.$store.state.gvars.dicts.communicate_type
			}
        },
		
		watch: {
			'type_service': function (val) {
				this.init_data()
			}
		},
		methods: {
			serviceDetail(row) {
				this.readApply(row)
			},
			readApply(row) {
				this.$rest('franchisee_service_records').add_url_param(row.fsr_id,'read')
				.post({
					read_eid: this.eid$
				})
				.success(res => {
					this.setStateSearchInfo()
					this.$router.push({path: `/aftersale/services/${row.fsr_id}`})
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			},
			addService() {
				this.$Modal.open('aftersale/services/info-modal.vue',{
					props: {
						from: 'service'
					},
					on: {
						save: () => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.show('添加服务记录','add')
				})
			},
			viewFiles(row) {
				this.$Modal.open('components/PreviewFile.vue@modal',{
					props: {
						list: row.franchisee_service_record_file
					}
				})
				.then(modal => {
					modal
					.show(util.sprintf('查看服务附件'))
				})
			},
			resetSearch () {
				this.$form('ref_search').reset()
				this.init_data()
			},
			hook_get_param (params) {
				this.rest_api = 'franchisee_service_records/all_records'
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='int_day'){
						if(property!=','&&property.length>0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}												
					}else{
						if(property!=''&&property!==-1){
							params[o] = property	
						}		
					}									
				}
				params.with = 'franchisee,franchisee_service_record_file'

				if(this.type_service=='my') {
					params.eid = this.eid$
				}
			}
		}
	}
</script>
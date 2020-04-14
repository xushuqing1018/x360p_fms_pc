<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				<Form-item label="加盟商" prop="fc_id" class="col-md-3 col-sm-6">
					<select-franchisee v-model="search_field.fc_id" clearable placeholder="请选择盟商"></select-franchisee>
				</Form-item>
				<Form-item label="合同号" prop="contract_no" class="col-md-3 col-sm-6">
					<Input v-model="search_field.contract_no" placeholder="请输入合同号"></Input>
				</Form-item>
				<Form-item label="合同到期日期" :label-width="90" prop="expire" class="col-md-3 col-sm-6">
					<Select v-model="search_field.expire">
						<Option value="1w">一周内到期</Option>
						<Option value="1m">一个月内到期</Option>
						<Option value="3m">三个月内到期</Option>
						<Option value="ex">已到期</Option>
					</Select>					
				</Form-item>
				<Form-item label="签约员工" prop="sign_eid" class="col-md-3 col-sm-6">
					<select-employee v-model="search_field.sign_eid" clearable></select-employee>
				</Form-item>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
	            	<Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="franchisee_contracts" :params="params" v-per="'contracts.export'"></export-button>
                	<div class="pull-right">
                        <per-scope per="franchisee.contract.all" @on-change="type_contract = $event"></per-scope>
                   	</div>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<import-button res="franchisee_contracts" name="加盟商合同" @on-import-finish="init_data" v-per="'contracts.import'"></import-button>
	            <filter-column :keys="column_keys"></filter-column>
	        </div>
	        <div class="content">
				<div class="content-body">
			        <Table 
				        v-loading.like="'franchisee_contracts'" 
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
	import moment from 'moment'
	import util,{_} from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import SelectEmployee from 'c%/SelectEmployee.vue'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	import ExportButton from 'c%/ExportButton.vue'
	import ImportButton from 'c%/ImportButton.vue'
	import SelectFranchisee from 'c%/SelectFranchisee.vue'
	
	export default{
		mixins: [grid,common,globals],
		components: {
			SelectEmployee,
			DateRangePicker,
			ExportButton,
			ImportButton,
			SelectFranchisee
		},
		data () {
			return {
				rest_api: 'franchisee_contracts',
				pk: 'fcc_id',
				type_contract: '',
				search_field: {
					expire: 0,
					contract_no: '',
					sign_eid: 0,
					fc_id: 0
				},
				column_keys: {
					fc_id: {
						title: '加盟商',
						fixed: 'left',
						width: 250,
						show: true
					},
					sign_eid: {
						title: '签约员工',
						width: 150,
						show: true
					},
					contract_no: {
						title: '合同号',
						width: 150,
						show: true
					},
					is_expired: {
						title: '合同状态',
						width: 150,
					},
					contract_start_int_day: {
						title: '合同开始日期',
						width: 150,
						sortable: 'custom',
						show: true
					},
					contract_end_int_day: {
						title: '合同结束日期',
						width: 150,
						sortable: 'custom',
						show: true
					},
					open_int_day: {
						title: '开业日期',
						sortable: 'custom',
						width: 150,
						show: true
					},
					region_level: {
						title: '区域性质',
						width: 120,
						show: true
					},
					join_fee1: {
						title: '特许经营费',
						width: 120,
						show: true
					},
					join_fee2: {
						title: '履约保证金',
						width: 120,
						show: true
					},
					join_fee3: {
						title: '年度使用费',
						width: 120,
						show: true
					},
					join_fee4: {
						title: '教育商品款',
						width: 120,
						show: true
					},
					contract_amount: {
						title: '合同总金额',
						width: 120,
						sortable: 'custom',
						show:true
					},
					all_pay_int_day: {
						title: '全款到账日期',
						width: 150,
						sortable: 'custom',
						show: true
					},
					content: {
						title: '特殊约定',
						width: 500,
						show: true
					}
				},
				column_render: {
					fc_id(h,params) {
						return h('span',params.row.franchisee?params.row.franchisee.org_name:'-')
					},
					join_fee1(h,params) {
						let icon = h('Icon',{
							props: {
								type: 'logo-yen'
							}
						})
						return h('span',[icon,params.row.join_fee1])
					},
					join_fee2(h,params) {
						let icon = h('Icon',{
							props: {
								type: 'logo-yen'
							}
						})
						return h('span',[icon,params.row.join_fee2])
					},
					join_fee3(h,params) {
						let icon = h('Icon',{
							props: {
								type: 'logo-yen'
							}
						})
						return h('span',[icon,params.row.join_fee3])
					},
					join_fee4(h,params) {
						let icon = h('Icon',{
							props: {
								type: 'logo-yen'
							}
						})
						return h('span',[icon,params.row.join_fee4])
					},
					join_fee1(h,params) {
						let icon = h('Icon',{
							props: {
								type: 'logo-yen'
							}
						})
						return h('span',[icon,params.row.join_fee1])
					},
					contract_amount(h,params) {
						let icon = h('Icon',{
							props: {
								type: 'logo-yen'
							}
						})
						return h('span',[icon,params.row.contract_amount])
					},
					region_level(h,params) {
						return h('span',this.$filter('region_level')(params.row.region_level))
					},
					sign_eid(h,params) {
						return h('span',this.$filter('ename')(params.row.sign_eid||'-'))
					},
					open_int_day (h,params) {
						return h('span',params.row.open_int_day || '-')
					},
					all_pay_int_day (h,params) {
						return h('span',params.row.all_pay_int_day || '-')
					},
					is_expired(h,params) {
						let map = {0:['生效中','text-success'],1:['已失效','text-danger']}
						return h('span',{
							class: map[params.row.is_expired][1]
						},map[params.row.is_expired][0])
					}
				},
				operation_keys: {
					edit: {
						title: '编辑',
						type: 'md-create',
						per: 'contracts.edit'
					},
					renew: {
						title: '续约',
						type: 'ios-cafe',
						per: 'franchisee.renew',
						condition: 'row.is_expired==0'
					},
					quit: {
						title: '解约',
						type: 'md-close-circle',
						per: 'contracts.quit',
						condition: 'row.is_expired==0'
					},
					view: {
						title: '附件',
						type: 'md-document',
						condition: 'row.franchisee_contract_file.length>0'
					}
                },
				operation_func: {
					edit(params) {
						this.editInfo(params.row)
					},
					view(params) {
						this.viewFiles(params.row)
					},
					del(params) {
						this.delContract(params.row)
					},
					renew(params) {
						this.$Modal.open('sale/contract/renew-modal.vue',{
							on: {
								'on-success': () => {
									this.init_data()
								}
							},
							props: {
								'fcc-id': params.row.fcc_id,
								row: params.row
							}
						})
						.then(modal => {
							modal
							.show(util.sprintf('续约【%s】',params.row.franchisee.org_name))
						})
					},
					quit(params) {
						this.$Modal.open('sale/contract/quit-modal.vue',{
							on: {
								'on-success': () => {
									this.init_data()
								}
							},
							props: {
								'fcc-id': params.row.fcc_id
							}
						})
						.then(modal => {
							modal
							.show(util.sprintf('解约【%s】',params.row.franchisee.org_name))
						})
					},
				}
			}
		},
		watch: {
			'type_contract': function (val) {
				this.init_data()
			}
		},
		methods: {
			add() {
				this.$Modal.open('sale/contract/info-modal.vue',{
					on: {
						save:() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal.show('创建合同')
				})
			},
			editInfo(row) {
				this.$Modal.open('sale/contract/info-modal.vue',{
					on: {
						save:() => {
							this.init_data()
						}
					},
					props: {
						franchisee: row.franchisee
					}
				})
				.then(modal => {
					modal
					.set('info',row)
					.show(util.sprintf('编辑合同【%s】',row.franchisee.org_name),'edit')
				})
			},
			delContract(row) {
				this.confirm(util.sprintf('确定删除加盟商【%s】的合同吗？',row.franchisee.org_name))
				.then(() => {
					this.delete(row)
				})
			},
			viewFiles(row) {
				this.$Modal.open('components/PreviewFile.vue@modal',{
					props: {
						list: row.franchisee_contract_file
					}
				})
				.then(modal => {
					modal
					.show(util.sprintf('查看合同附件【%s】',row.contract_no))
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
					if(o=='contract_end_int_day'){
						if(property!=','&&property.length>0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}												
					}else{
						if(property!=''&&property!==-1){
							params[o] = property	
						}		
					}									
				}
				params.with = 'franchisee_contract_file,franchisee'
				if(this.type_contract=='my') {
					params.sign_eid = this.eid$
				}
			}
		}
	}
</script>

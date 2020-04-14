<template>
	<div class="c-grid">
		<div class="box box-result">
			<div class="toolbar">
				<Button type="primary" icon="md-add" @click="addService" v-per="'services.add'">添加服务记录</Button>
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
		props: {
			fc_id: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				rest_api: 'franchisee_service_records/all_records',
				pk: 'fsr_id',
				type_service: '',
				search_field: {
					fc_service_did: -1,
					fc_id: this.fc_id,
					eid: 0,
					int_day: [],
					short_name: ''
				},
				showEmptyColumn: true,
				column_keys: {
					franchisee: {
						title: '加盟商',
						width: 250,
					},
					fc_service_did: {
						title: '服务类型',
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
					// is_show_to_fc: {
					// 	title: '盟商可见',
					// 	width: 120
					// },
					// is_need_reply: {
					// 	title: '需要回复',
					// 	width: 120
					// },
					// is_read: {
					// 	title: '阅读时间',
					// 	width: 200
					// }
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
			this.init_data()
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
						from: 'service',
						fcId: this.fc_id
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
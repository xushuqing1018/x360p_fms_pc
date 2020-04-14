<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
				<Form-item label="盟商名称" prop="org_name" class="col-md-3 col-sm-6">
					<Input v-model="search_field.org_name" placeholder="加盟商名称" @on-enter="search"></Input>
				</Form-item>
                <Form-item label="客户状态" class="col-md-3 col-sm-6" prop="franchisee_status_did">
                   <Select v-model="search_field.franchisee_status_did" clearable @on-change="search">
                   		<Option :value="item.did" v-for="(item,index) in dicts('customer_status')" :key="index">{{item.title}}</Option>
                   </Select>                           
                </Form-item>
				<Form-item label="下次跟进" class="col-md-3 col-sm-6" prop="next_follow_time">
                    <date-range-picker 
                    	v-model="search_field.next_follow_time" 
                    	@on-change="search"  
                    	label="选择日期" 
                    	placement="bottom"
                    	style="width:100%">
					</date-range-picker>
                </Form-item>
                <Form-item label="未跟进天数" class="col-md-3 col-sm-6" prop="un_follow_days">
                   <Select v-model="search_field.un_follow_days" clearable @on-change="search">
                   		<Option :value="-2">不限</Option>
                   		<Option :value="-1">从未跟进</Option>
                   		<Option :value="7">一周未跟进</Option>
                   		<Option :value="14">两周未跟进</Option>
                   		<Option :value="21">三周未跟进</Option>
                   </Select> 
              	</Form-item>
              	<template v-if="searchExpand">
	                <Form-item label="意向级别" class="col-md-3 col-sm-6" prop="intention_level">
	                   <Rate v-model="search_field.intention_level" @on-change="search"></Rate>
	                </Form-item>
	                <Form-item label="录入时间" class="col-md-3 col-sm-6" prop="create_time">
	                    <date-range-picker 
	                    	v-model="search_field.create_time" 
	                    	@on-change="search"  
	                    	label="选择日期" 
	                    	placement="bottom"
	                    	style="width:100%">
						</date-range-picker>
	                </Form-item>
	            </template>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
	            	<Button-group>
                        <Button type="primary" @click="search"><Icon type="ios-search"/> 查询</Button>     
                        <Button type="primary" @click="toggleSearch"><Icon :type="toggleSearchIcon"></Icon></Button>
                    </Button-group>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                	<export-button res="franchisees" :params="params" v-per="'clients.export'"></export-button>

                	<CheckboxGroup v-model="search_field.is_distribution" class="ml-3" style="display: inline-block;" @on-change="search">                        
                        <Checkbox :label="0">
                            <span>未分配</span>
                        </Checkbox>
                        <Checkbox :label="1">
                            <span>已分配</span>
                        </Checkbox>
                    </CheckboxGroup>

                    <span>|</span>

                    <CheckboxGroup v-model="search_field.is_sign" class="ml-3" style="display: inline-block;" @on-change="search">                        
                        <Checkbox :label="0">
                            <span>未签约</span>
                        </Checkbox>
                        <Checkbox :label="1">
                            <span>已签约</span>
                        </Checkbox>
                        <Checkbox :label="9">
                            <span>已解约</span>
                        </Checkbox>
                    </CheckboxGroup>

                	<div class="pull-right">
                        <per-scope per="franchisee.customer.all" @on-change="perScopeChange"></per-scope>
                   	</div>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Button type="primary" icon="md-add" @click="add" v-per="'clients.add'">添加意向客户</Button> 
				<import-button res="franchisee_customers" name="加盟商" @on-import-finish="init_data" v-per="'clients.import'"></import-button>
				<Dropdown trigger="click">
					<Button 
						type="primary" 
						icon="ios-more" 
						:disabled="follow_clients.length==0" 
						title="先勾选客户，可连续对客户进行操作"
						v-per="'clients.batch'">
						批量操作&nbsp;{{follow_clients.length}}
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem @click.native="assignMulti"><Icon type="ios-contrast"></Icon> 分配</DropdownItem>
						<DropdownItem @click.native="clearFollow"><Icon type="ios-remove-circle"></Icon> 清空勾选</DropdownItem>
					</DropdownMenu>
				</Dropdown>
	            <filter-column :keys="column_keys"></filter-column>
	        </div>
	        <div class="content">
				<div class="content-body">
			        <Table 
				        v-loading.like="'franchisees'" 
				        :page-size="pageSize" 
				        :page="pageIndex" 	
				        :stripe="true" 
				        :show-header="true" 
				        :data="data" 
				        :columns="columns" 
				        :no-data-text="$store.state.config.EMPTY_DATA_TEXT" 
				        :no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT" 
				        @on-select="selectOne"
		            	@on-select-cancel="cancelSelect"
		            	@on-select-all="selectAll"
		            	@on-selection-change="selectChange"
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
	import Vue from 'vue'
	import moment from 'moment'
	import util,{_} from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import SelectOrg from 'c%/SelectOrg.vue'
	import DateRangePicker from 'c%/DateRangePicker.vue'
	import ExportButton from 'c%/ExportButton.vue'
	import ImportButton from 'c%/ImportButton.vue'

	export default{
		mixins: [grid,common,globals],
		components: {
			SelectOrg,
			DateRangePicker,
			ExportButton,
			ImportButton
		},
		data () {
			return {
				rest_api: 'franchisees',
				pk: 'fc_id',
				type_client: '',
				search_field: {
					org_name: '',
					name: '',
					next_follow_time: [],
					create_time: [],
					is_sign: [0],
					un_follow_days: -2,
					franchisee_status_did: 0,
					is_distribution: [0,1]
				},
				showCheckbox: true,
				column_keys: {
					org_name: {
						title: '盟商名称',
						width: 250,
						fixed: 'left',
						show: true
					},
					org_address: {
						title: '详细地址',
						width: 350,
						show: true
					},
					name: {
						title: '联系人',
						width: 120
					},
					mobile: {
						title: '联系电话',
						width: 120,
					},
					last_franchisee_follow_up: {
						title: '最后跟进内容',
						show: true,
						width: 220
					},
					org_email: {
						title: '企业邮箱',
						width: 250,
						show: false
					},
					follow_times: {
						title: '跟进次数',
						width: 110
					},
					franchisee_status: {
						title: '客户状态',
						width: 120
					},
					last_follow_time: {
						title: '最后跟进时间',
						show: true,
						width: 120
					},
					un_follow_days: {
						title: '未跟进天数',
						show: true,
						width: 120
					},
					next_follow_time: {
						title: '下次跟进时间',
						width: 120
					},
					intention_level: {
						title: '意向级别',
						width: 180
					},
					sale_eid: {
						title: this.$filter('translate')('渠道销售'),
						width: 120,
						show: true
					},
					assign_time: {
						title: '分配时间',
						show: true,
						width: 120
					}
				},
				column_render: {
					org_name (h,params) {
						return h('span',{
							class: this.sign_map[params.row.is_sign].color
						},params.row.org_name)
					},
					org_address (h,params) {
                        return h('span',params.row.org_address||'-')
					},
					org_email (h,params) {
						return h('span',params.row.org_email || '-')
					},
					sale_eid (h,params) {
						return h('span',this.$filter('ename')(params.row.sale_eid||'-'))
					},
					intention_level (h,params) {
						return h('Rate',{
							props: {
								count: 5,
								value: params.row.intention_level,
								disabled: true
							}
						})
					},
					franchisee_status (h,params) {
						return h('span',this.$filter('dict_title')(params.row.franchisee_status_did,'franchisee_status','-'))
					},
					assign_time (h,params) {
						let time = params.row.assign_time
						if(time) {
							return h('span',moment(time).format('YYYY-MM-DD'))
						}else{
							return h('span','-')
						}
					},
					last_franchisee_follow_up (h,params) {
						let obj = params.row.franchisee_last_followup,
							result = '-',
							tool_tip = null,
							add_btn = null
						if(obj){
							result = obj.content
						}
						
						add_btn = h('Button',{
							'class': {
								'pull-right': true
							},
							attrs: {
								'title': '添加跟进'								
							},
							props: {
								type: 'text',
								size: 'small',
								icon: 'md-add'
							},
							on: {
								'click': () => {
									this.followup(params)
								}
							}
						})
						
						tool_tip = h('Tooltip',{
							'class':'x-tooltip',
							props: {
								content: result								
							}
						},[
							h('p',{
								'class': 'text-over-elips',
								style: {
									width: '150px',
									lineHeight: '26px',
									display: 'inline-block'
								},
							},result)
						])
						
						return h('div',[tool_tip,add_btn])
						
					},
				},
				operation_keys: {
					edit: {
						title: '编辑',
						type: 'md-create',
						per: 'clients.edit'						
					},
					doassign: {
						title: '分配销售',
						type: 'ios-contrast',
						per: 'clients.doassign',
						condition: 'row.sale_eid==0'
					},
					undoassign: {
						title: '取消销售',
						type: 'ios-contrast',
						per: 'clients.undoassign',
						condition: 'row.sale_eid!==0'
					},
					follow: {
						title: '跟单',
						type: 'logo-googleplus',
						per: 'clients.follow'						
					},
					contact: {
						title: '联系人管理',
						type: 'md-contacts',
						per: 'clients.contact'
					},
					signup: {
						title: '签约',
						type: 'md-checkbox',
						per: 'clients.signup',
						condition: 'row.is_sign==0'
					},
					renew: {
						title: '续约',
						type: 'ios-cafe',
						per: 'clients.renew',
						condition: 'row.is_sign==1'
					},
					quit: {
						title: '解约',
						type: 'md-close-circle',
						per: 'clients.quit',
						condition: 'row.is_sign==1'
					},
					delete: {
						title: '删除',
						type: 'ios-trash',
						per: 'clients.delete'
					}
				},
				operation_func: {
					edit (params) {						
						this.editInfo(params.row)
					},
					doassign (params) {
						this.$Modal.open('sale/client/assign.vue@modal',{
							on: {
								'on-success':() => {
									this.init_data()
								}
							}
						})
						.then(modal => {
							modal
							.set('fc_id',params.row.fc_id)
							.show(util.sprintf('分配%s【%s】',this.label_sale,params.row.org_name))
						})
					},
					undoassign (params) {
						this.confirm(util.sprintf('确定取消分配【%s】的责任人【%s】吗？',params.row.org_name,this.$filter('ename')(params.row.sale_eid)))
						.then(() => {
							this.$rest('franchisees').add_url_param('cancel')
							.post({
								fc_ids: [params.row.fc_id]
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
					follow (params) {
						this.followup(params)
					},
					contact (params) {
						this.$Modal.open('aftersale/franchisees/contact-list-modal.vue',{
							props: {
								franchisee: params.row
							}
						})
						.then(modal => {
							modal
							.show(util.sprintf('盟商联系人【%s】',params.row.org_name))
						})
					},
					signup (params) {
						this.$Modal.open('aftersale/franchisees/info-and-contact-modal.vue',{
							props: {
								'from-client':true,
								'row': params.row
							},
							on: {
								'on-success':() => {
									this.$emit('on-success')
								}
							}
						})
						.then(modal => {
							modal.show(util.sprintf('签订合同【%s】',params.row.org_name),'add')
						})
					},
					renew (params) {
						let contract = params.row.franchisee_contract
						if(contract) {
							this.$Modal.open('sale/contract/renew-modal.vue',{
								on: {
									'on-success': () => {
										this.init_data()
									}
								},
								props: {
									'fcc-id': contract.fcc_id,
									row: contract
								}
							})
							.then(modal => {
								modal
								.show(util.sprintf('续约【%s】',params.row.org_name))
							})
						}else{
							this.$Message.error('合同不存在')
						}
					},
					quit (params) {
						let contract = params.row.franchisee_contract
						if(contract) {
							this.$Modal.open('sale/contract/quit-modal.vue',{
								on: {
									'on-success': () => {
										this.init_data()
									}
								},
								props: {
									'fcc-id': contract.fcc_id
								}
							})
							.then(modal => {
								modal
								.show(util.sprintf('解约【%s】',params.row.org_name))
							})
						}else{
							this.$Message.error('合同不存在')
						}
					},
					delete (params) {						
						this.confirm(util.sprintf('确定删除客户【%s】吗？',params.row.org_name))
						.then(() => {
							this.$rest('franchisees')
							.delete(params.row.fc_id)
							.success(res => {
								this.$Message.success('删除成功')
								this.init_data()
							})
							.error(res => {
								this.$Message.error(res.message)
							})
						})
					}
				},
			}
		},
		watch: {
			'type_client': function (val) {
				this.init_data()
			}
		},
		mounted() {
			this.replaceSearchField()
			this.init_data()
		},
		
	    computed: {
	    	follow_clients () {
	   			return this.$store.state.follow_clients.list
	   		},
	   		label_sale() {
	   			return this.$filter('translate')('渠道销售')
	   		}
	    },
		methods: {
			perScopeChange(v) {
				this.type_client = v
			},
			add() {
				this.$Modal.open('sale/client/info-modal.vue',{
					on: {
						'save':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.show('添加意向盟商')
				})
			},
			editInfo(row) {
				let info = util.copy(row)
				this.$Modal.open('sale/client/info-modal.vue',{
					on: {
						'save':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.set('info',info)
					.show(util.sprintf('编辑意向盟商【%s】',row.org_name),'edit')
				})
			},
			deal_data(data){
				data.list.forEach(item=>{
					if(this.is_in_store(item.fc_id)){
						item._checked = true;
					}
				})
				
				return data.list
			},
			is_in_store(fc_id){
				return !!this.follow_clients.find(item=>item.fc_id==fc_id)
			},
			followup(params) {
				this.$Modal.open('sale/followup/info-modal.vue',{
					props: {
						'fc-id': params.row.fc_id,
						'fc-name': params.row.org_name
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
			assignMulti() {
				this.$Modal.open('sale/client/multi-assign.vue@modal',{
					on: {
						'on-success':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal.show('批量分配'+this.label_sale)
				})
			},
			addFollow(item) {
				const index = this.follow_clients.findIndex(f=>f.fc_id==item.fc_id)
				if(index < 0) {
					this.$store.commit('addFollowClient',{
						id:item.fc_id,
						name:item.org_name
					})
				}
			},
			removeFollow(fc_id) {
				const index = this.follow_clients.findIndex(f=>f.fc_id==fc_id)
				if(index > -1) {
					this.$store.commit('removeFollowClient',index)
				}
			},
			selectOne (selection,row) {
				this.addFollow(row)
			},
			cancelSelect (selection,row) {
				this.removeFollow(row.fc_id)
			},
			selectAll (selection) {
				selection.forEach(item => {
					this.addFollow(item)
				})
			},
			selectChange (selection) {
				if(selection.length == 0){
					this.data.forEach(item => {
						this.removeFollow(item.fc_id)
					})
				}
			},
			clearFollow() {
				this.$store.commit('clearFollowClient')
				this.init_data()
			},
			resetSearch () {
				this.is_distribution = [0,1]
				this.$form('ref_search').reset()
				this.init_data()
			},
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='status'){
						if(property!==-1){
							params[o] = property
						}												
					}
					else if(o=='create_time'||o=='next_follow_time'){
						if(property.length > 0) {
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}
					}
					else if(o=='un_follow_days'){
						if(property!=-2){
							params[o] = property
						}
					}
					else if(o=='is_distribution'){
						if(property.length==1){
	                    	if(property[0]==0){
								params.sale_eid = '0'
							}
	                    	else if(property[0]==1){
	                    		params.sale_eid = '[>,0]'                    		
	                    	}
	                    }
					}
					else if(o=='is_sign') {
						if(property.length > 0) {
							params.is_sign = util.sprintf('[in,%s]',property.join(','))
						}
					}
					else{
						if(property&&property!==-1){
							params[o] = property	
						}		
					}									
				}
				if(this.type_client == 'my') {
					params.sale_eid = this.eid$
				}
			}
		}
	}
</script>

<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="100" class="filter-form row">
				<Form-item label="盟商名称/简称" prop="org_name" class="col-md-3 col-sm-6">
					<Input v-model="search_field.org_name" @on-enter="search" placeholder="加盟商名称/简称" onkeypress="if(event.keyCode == 13) return false;"></Input>
				</Form-item>
				<Form-item label="运营状态" prop="status" class="col-md-3 col-sm-6">
					<Select v-model="search_field.status">
					    <Option value="">不限</Option>
						<Option :value="index" v-for="(val,key,index) in business_status_list">{{val}}</Option>
					</Select>
				</Form-item>
				<Form-item label="合同到期日期" prop="expire" class="col-md-3 col-sm-6">
					<Select v-model="search_field.expire">
						<Option value="1w">一周内到期</Option>
						<Option value="1m">一个月内到期</Option>
						<Option value="3m">三个月内到期</Option>
						<Option value="ex">已到期</Option>
					</Select>
				</Form-item>
				<Form-item label="系统沟通状态" prop="system_status_did" class="col-md-3 col-sm-6">
					<Select v-model="search_field.system_status_did">
						<Option value="">不限</Option>
						<Option :value="item.did" v-for="item in franchisee_status_list">{{item.title}}</Option>
					</Select>
				</Form-item>

				<template v-if="searchExpand">
				

					<Form-item label="系统类型" prop="org_type" class="col-md-3 col-sm-6">
						<Select v-model="search_field.org_type">
							<Option value="">不限</Option>
							<Option value="0">未开通</Option>
							<Option value="1">正式版</Option>
							<Option value="2">督导版</Option>
						</Select>
					</Form-item>
					<Form-item label="完成员工" prop="eid" class="col-md-3 col-sm-6">
						<select-employee v-model="search_field.eid" clearable></select-employee>
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
					<Form-item label="联系人姓名" prop="person_name" class="col-md-3 col-sm-6">
						<Input v-model="search_field.person_name" @on-enter="search" placeholder="联系人"></Input>
					</Form-item>
					<Form-item label="地区" prop="district_id" class="col-md-3 col-sm-6">
						<Select v-model="search_field.district_id">
							<Option value="-1">不限</Option>
							<Option value="0">未设置</Option>
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
                	<export-button res="franchisees" :params="params"></export-button>
                	<import-button res="update_infomations" @on-import-finish="init_data">批量更新</import-button>

                	<CheckboxGroup v-model="search_field.is_sign" class="ml-3" style="display: inline-block;" @on-change="search">                        
                        <Checkbox :label="1">
                            <span>已签约</span>
                        </Checkbox>
                        <Checkbox :label="9">
                            <span>已解约</span>
                        </Checkbox>
                    </CheckboxGroup>

                	<div class="pull-right">
                        <label>权限范围：</label>
				        <ButtonGroup>
				            <Button 
				                :type="type_franch=='my'?'primary':'default'" 
				                size="small" 
				                icon="android-person" 
				                @click="type_franch='my'"
				                >我的
				            </Button>
				            <Button 
				                :type="type_franch=='dpt'?'primary':'default'" 
				                size="small" 
				                icon="home" 
				                @click="type_franch='dpt'"
				                v-if="sub_eids.length>0"
				                >部门
				            </Button>
				            <Button 
				                :type="type_franch=='all'?'primary':'default'" 
				                size="small" 
				                icon="android-people" 
				                :disabled="userPers.indexOf(per)<0" 
				                @click="type_franch='all'"
				                >所有
				            </Button>
				        </ButtonGroup>
                   	</div>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Button type="primary" icon="md-add" @click="add">添加加盟商</Button>
				<Dropdown trigger="click">
					<Button 
						type="primary" 
						icon="more" 
						:disabled="s_list.length==0" 
						title="先勾选加盟商，可对加盟商进行批量操作"
						>
						批量操作&nbsp;{{s_list.length}}
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem @click.native="updateName"><Icon type="android-refresh"></Icon> 更新简称</DropdownItem>
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
	    <select-org ref="ref_org" v-model="link_og_id" v-show="false" @selected="linkOrgSystem"></select-org>
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
	import ExpandRow from './franchisees/expand-row.vue'
	import SelectEmployee from 'c%/SelectEmployee.vue'

	export default{
		mixins: [grid,common,globals],
		components: {
			SelectEmployee,
			SelectOrg,
			DateRangePicker,
			ExportButton,
			ImportButton,
			ExpandRow
		},
		data () {
			return {
				rest_api: 'franchisees',
				pk: 'fc_id',
				type_franch: '',
				s_list: [],
				showCheckbox: true,
				per: 'franchisee.all',
				search_field: {
					org_name: '',
					status: -1,
					system_status: -1,
					is_sign: [1,9],
					expire: 0,
					eid: 0,
					int_day: [],
					short_name: '',
					district_id:-1,
                    //system_status_did:''
					//org_type: '',
				},
				system_status_list: [
					{label: '不限',value: -1},
					{label: '未开通',value: 0},
					{label: '待审核',value: 1},
					{label: '已开通',value: 2},
				],
				link_og_id: 0,
				link_fc_id: 0,
				column_keys: {
					expand: {
						type: 'expand',
						fixed: 'left',
	                    width: 60
					},
					org_name: {
						title: '盟商名称',
						width: 250,
						fixed: 'left',
						show: true
					},
					short_name:{
                        title:'盟商简称',
						width:100,
						fixed:'left',
						show:true,
					},
					district_id:{
						title:'地区',
						width:200,
						show:true
					},
					org_address: {
						title: '详细地址',
						width: 350,
						show: true
					},
					mobile: {
						title: '中心座机',
						width: 160,
					},
					org_email: {
						title: '企业邮箱',
						width: 180
					},
					is_sign: {
						title: '签约',
						width: 120
					},
					contract_end_int_day: {
						title: '合同到期日期',
						width: 160
					},
                    system_status_did: {
                        title: '系统沟通状态',
                        width: 120
                    },
					org_type: {
						title: '系统类型',
						width: 120
					},
                    org_status: {
					    title : '系统状态',
                        width : 120
					},
					unuse_reason: {
						title : '未使用原因',
						width : 120
					},
					sign_eid: {
						title: '签约员工',
						width: 120,
						show: true
					},
					charge_eid: {
						title: '负责人',
						width: 120,
						show: true
					},
					service_eid: {
						title: '督导员工',
						width: 120,
						show: true
					},
					sale_eid: {
						title: '渠道销售',
						width: 120,
						show: true
					},
					status: {
						title: '运营状态',
						sortable: 'custom',
						width: 120,
						show: true
					},
					address_did: {
						title: '店面性质',
						width: 120,
						show: true
					},
					decorate_fee: {
						title: '装修费用',
						sortable: 'custom',
						width: 120,
						show:true
					},

					is_owner_change: {
						title: '主体变更',
						sortable: 'custom',
						width: 120,
						show: true
					},
					business_license: {
						title: '营业执照号',
						width: 150,
						show: true
					},
					is_authorize_dispatch: {
						title: '授权铜牌',
						sortable: 'custom',
						width: 120,
						show: true
					},
					area_size: {
						title: '营业面积',
						width: 120,
						show: false
					},
					room_nums: {
						title: '教室数',
						width: 120,
						show: false
					},
					employee_nums: {
						title: '员工数',
						width: 120,
						show: false
					},
					member_nums: {
						title: '会员数',
						width: 120,
						show: false
					},
                    free_training_nums: {
                        title: '免费培训人数',
                        width: 120,
                        show: true
                    },
					l1_price: {
						title: '48课时售价',
						width: 120,
						show: false
					},
					l2_price: {
						title: '96课时售价',
						width: 120,
						show: false
					}
				},
				column_render: {
					expand (h,params) {
						if(params.row.franchisee_contract) {
							return h(ExpandRow,{
								props: {
									row: params.row.franchisee_contract
								}
							})
						}else{
							return h('span','暂时没有合同')
						}
					},
					org_name (h,params) {
						return h('span',{
							style: {
								cursor: 'pointer'
							},
							class: this.sign_map[params.row.is_sign].color,
							on: {
								click:()=>{
									this.franchiseeDetail(params.row.fc_id)
								}
							}
						},params.row.org_name)
					},
					district_id (h,params) {
						let row = params.row,
							ssq = ''
                        if(row.province_id) {
                            ssq = this.ssqFormat(row.province_id,row.city_id,row.district_id)
						}
						
                        return h('span',ssq)
					},
					org_address (h,params) {
                        return h('span',params.row.org_address||'-')
					},
					status (h,params) {
						return h('span',this.$filter('business_status')(params.row.status))
					},
                    system_status_did (h,params) {
                        return h('span',this.$filter('dict_title')(params.row.system_status_did,'system_status'))
                    },
					org_type (h,params) {
						let map = {
							0:{label: '未开通',color: 'text-danger'},
							1:{label: '正式版',color: 'text-success'},
                            2:{label: '督导版',color: 'text-success'}
						}
						return h('span',{
							class: map[params.row.org_type].color
						},map[params.row.org_type].label)
					},
                    org_status (h,params) {
                        let map = {
                            0:{label: '未开通',color: 'text-danger'},
                            1:{label: '待审核',color: 'text-success'},
                            2:{label: '已开通',color: 'text-success'},
                            3:{label: '已锁定',color: 'text-danger'},
                        }
                        return h('span',{
                            class: map[params.row.org_status].color
                        },map[params.row.org_status].label)
                    },
					address_did (h,params) {
						return h('span',this.$filter('dict_title')(params.row.address_did,'address'))
					},
					decorate_fee (h,params) {
						let result = [],
							decorate = '总部装修：'
						if(params.row.is_head_decorate==1) {
							result.push(decorate)
						}
						if(params.row.decorate_fee) {
							let icon = h('Icon',{
								props: {
									type: 'social-yen'
								}
							})
							result.push(icon)
							result.push(params.row.decorate_fee)
						}else{
							result.push('-')
						}
						return h('span',result)
					},
					is_owner_change (h,params) {
						let map = {1:{label: '已完成',color: 'text-success'},0:{label: '未完成',color: 'text-danger'}}
						return h('span',{
							'class': map[params.row.is_owner_change].color
						},map[params.row.is_owner_change].label)
					},
					business_license (h,params) {
						return h('span',params.row.business_license||'-')
					},
					is_authorize_dispatch (h,params) {
						let map = {1:{label: '已授权',color: 'text-success'},0:{label: '未授权',color: 'text-danger'}}
						return h('span',{
							'class': map[params.row.is_authorize_dispatch].color
						},map[params.row.is_authorize_dispatch].label)
					},
					org_email (h,params) {
						return h('span',params.row.org_email || '-')
					},
					sale_eid (h,params) {
						return h('span',this.$filter('ename')(params.row.sale_eid||'-'))
					},
					charge_eid (h,params) {
						return h('span',this.$filter('ename')(params.row.franchisee_contract.charge_eid||'-'))
					},
					service_eid (h,params) {
						return h('span',this.$filter('ename')(params.row.service_eid||'-'))
					},
					is_sign (h,params) {
						return h('span',{
							class: this.sign_map[params.row.is_sign].color
						},this.sign_map[params.row.is_sign].label)
					},
					/*sign_eid(h,params) {
						return h('span',this.$filter('ename')(params.row.franchisee_contract.sign_eid,'-'))
					},*/
					contract_start_int_day (h,params) {
						return h('span',this.$filter('int_date')(params.row.contract_start_int_day) || '-')
					},
					contract_end_int_day (h,params) {
						return h('span',params.row.contract_end_int_day || '-')
					},
					open_int_day (h,params) {
						return h('span',this.$filter('int_date')(params.row.open_int_day) || '-')
					},
					all_pay_int_day (h,params) {
						return h('span',this.$filter('int_date')(params.row.all_pay_int_day) || '-')
					}
				},
				operation_keys: {
					edit: {
						title: '编辑',
						type: 'md-create',
						per: 'franchisee.edit'						
					},
					doassign: {
						title: '分配督导',
						type: 'ios-contrast',
						per: 'franchisee.doassign',
						condition: 'row.service_eid==0'
					},
					undoassign: {
						title: '取消督导',
						type: 'ios-contrast',
						per: 'franchisee.undoassign',
						condition: 'row.service_eid!==0'
					},
					contact: {
						title: '联系人管理',
						type: 'md-contacts',
						per: 'franchisee.contact'
					},
					renew: {
						title: '续约合同',
						type: 'ios-cafe',
						per: 'franchisee.renew',
						condition: 'row.is_sign==1'
					},
					quit: {
						title: '解约合同',
						type: 'md-close-circle',
						per: 'franchisee.quit',
						condition: 'row.is_sign==1'
					},
					open: {
						title: '开通校360',
						type: 'md-open',
						per: 'franchisee.open',
						condition: 'row.fc_og_id==0'
					},
					close: {
						title: '取消关联校360系统',
						type: 'md-close',
						per: 'franchisee.close',
						condition: 'row.fc_og_id>0'
					},
					link: {
						title: '关联校360系统',
						type: 'md-link',
						per: 'franchisee.link',
						condition: 'row.fc_og_id==0'
					},
					service: {
						title: '添加服务记录',
						type: 'md-crop',
						per: 'franchisee.service'
					},
					delete: {
						title: '删除',
						type: 'ios-trash',
						per: 'franchisee.delete'
					}
				},
				operation_func: {
					edit (params) {
						let row = util.copy(params.row)
						this.$Modal.open('aftersale/franchisees/info-and-contact-modal.vue',{
							props: {
								row: row
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
							.show(util.sprintf('编辑加盟商【%s】',row.org_name),'edit')
						})
					},
					doassign (params) {
						this.$Modal.open('aftersale/franchisees/assign.vue@modal',{
							on: {
								'on-success':() => {
									this.init_data()
								}
							}
						})
						.then(modal => {
							modal
							.set('fc_id',params.row.fc_id)
							.show(util.sprintf('分配%s【%s】',this.label_service,params.row.org_name))
						})
					},
					undoassign (params) {
						this.confirm(util.sprintf('确定取消分配【%s】的督导【%s】吗？',params.row.org_name,this.$filter('ename')(params.row.service_eid)))
						.then(() => {
							this.$rest('franchisees').add_url_param(params.row.fc_id,'cancel_eid')
							.post()
							.success(res => {
								this.$Message.success('取消分配成功')
								this.init_data()
							})
							.error(res => {
								this.$Message.error(res.message)
							})
						})
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
					open (params) {
						this.$Modal.open('aftersale/x360s/info-modal.vue',{
							props: {
								franchisee: params.row
							},
							on: {
								save: () => {
									this.init_data()
								}
							}
						})
						.then(modal => {
							modal.show(util.sprintf('申请开通校360系统【%s】',params.row.org_name),'apply')
						})
					},
					close(params) {
						this.confirm(util.sprintf('确定关闭盟商【%s】的校360系统吗？',params.row.org_name))
						.then(() => {
							this.$rest('franchisees').add_url_param(params.row.fc_id,'docancel')
							.post()
							.success(res => {
								this.$Message.success('关闭成功')
								this.init_data()
							})
							.error(res => {
								this.$Message.error(res.message)
							})
						})
					},
					link (params) {
						this.link_fc_id = params.row.fc_id
						this.$r('ref_org').openModal()
					},
					service(params) {
						this.$Modal.open('aftersale/services/info-modal.vue',{
							props: {
								'fc-id': params.row.fc_id,
								'fc-og-id': params.row.fc_og_id
							},
							on: {
							    save:() => {
							        this.init_data()
								}
							}
						})
						.then(modal => {
							modal.show(util.sprintf('添加服务记录【%s】',params.row.org_name),'add')
						})
					},
					delete (params) {						
						this.confirm(util.sprintf('确定删除盟商【%s】吗？',params.row.org_name))
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
				}
			}
		},
		watch: {
			'type_franch': function (val) {
				this.init_data()
			}
		},
		mounted() {
			this.replaceSearchField()
			this.checkFranchPer()
		},
		computed: {
            franchisee_status_list() {
                return this.$store.state.gvars.dicts.system_status
			}
		},
		methods: {
			updateName() {
				this.$Modal.confirm({
					title: '确认更新所选加盟商简称',
					onOk: () => {
						this.$http.post('fapi/franchisees/multi_update_franchisee_short_name', {
							fc_ids: this.s_list.map(item => {
								return item.fc_id
							})
						})
						.then(res => {
							this.$Message.success('更新成功')
						},res => {
							this.$Message.error(res.body.message)
						})
					}
				})
			},
			addSelectData(s) {
				this.s_list = s;
			},
			checkFranchPer() {
				if(this.userPers.indexOf(this.per) > -1) {
					this.type_franch = 'all'
				}else{
					if(this.sub_eids.length > 0) {
						this.type_franch = 'dpt'
					}else{
						this.type_franch = 'my'
					}
				}
			},
			add() {
				this.$Modal.open('aftersale/franchisees/info-and-contact-modal.vue',{
					on: {
						'on-success':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal
					.show('添加加盟商')
				})
			},
			linkOrgSystem(selected) {
				if(selected.fc_id) {
					this.$Message.error(util.sprintf('校360系统【%s】已关联盟商资料',selected.org_name))
					return
				}
				this.$rest('franchisees').add_url_param(this.link_fc_id,'doconnect')
				.post({
					og_id: selected.og_id
				})
				.success(res => {
					this.$Message.success('关联成功')
					this.init_data()
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			},
			franchiseeDetail(id) {
				this.setStateSearchInfo()
				this.$router.push({path: `/aftersale/franchisees/${id}`})
			},
			perScopeChange(value) {
	            this.type_franch = value
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
					}else if(o=='int_day'){
						if(property!=','&&property.length>0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}												
					}
					else if(o=='is_sign') {
						if(property.length > 0) {
							params.is_sign = util.sprintf('[in,%s]',property.join(','))
						}
					}else{
						if(property!==-1){
							params[o] = property	
						}		
					}									
				}
				if(this.type_franch=='my') {
					params.service_eid = this.eid$
				}
				else if(this.type_franch=='dpt') {
					params.service_eid = this.sub_eids.join(',')
				}
			}
		}
	}
</script>

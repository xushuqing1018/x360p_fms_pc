<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row">
				<Form-item label="机构名称" prop="org_name" class="col-md-3 col-sm-6">
					<Input v-model="search_field.org_name" @on-enter="search" placeholder="机构名称"></Input>
				</Form-item>
				<Form-item label="机构简称" prop="org_short_name" class="col-md-3 col-sm-6">
					<Input v-model="search_field.org_short_name" @on-enter="search" placeholder="机构简称"></Input>
				</Form-item>
				<Form-item label="督导版开通时间" prop="create_time" class="col-md-3 col-sm-6">
					<date-range-picker
						v-model="search_field.create_time"
						@on-change="search"
						label="选择日期"
						placement="bottom"
						style="width:85%;float:right;">
					</date-range-picker>
				</Form-item>
				<Form-item label="到期日期" prop="expire" class="col-md-3 col-sm-6">
					<Select v-model="search_field.expire">
						<Option value="1w">一周内到期</Option>
						<Option value="1m">一个月内到期</Option>
						<Option value="3m">三个月内到期</Option>
						<Option value="ex">已到期</Option>
					</Select>
				</Form-item>
				<template v-if="searchExpand">
					<Form-item label="运营状态" prop="status" class="col-md-3 col-sm-6">
						<Select v-model="search_field.status">
						    <Option value="">不限</Option>
							<Option :value="index" v-for="(val,key,index) in business_status_list">{{val}}</Option>
						</Select>
					</Form-item>
					<Form-item label="账号状态" prop="is_frozen" class="col-md-3 col-sm-6">
						<Select v-model="search_field.is_frozen">
							<Option :value="-1">不限</Option>
							<Option :value="item.value" v-for="item in status_list">{{item.label}}</Option>
						</Select>
					</Form-item>
					<Form-item label="关联盟商资料" :label-width="100" prop="link" class="col-md-3 col-sm-6">
						<Select v-model="search_field.link">
							<Option :value="-1">不限</Option>
							<Option :value="0">未关联</Option>
							<Option :value="1">已关联</Option>
						</Select>
					</Form-item>
					<Form-item label="系统类型" prop="org_type" class="col-md-3 col-sm-6">
						<Select v-model="search_field.org_type">
							<Option :value="-1">不限</Option>
							<Option :value="1">正式版</Option>
							<Option :value="2">督导版</Option>
						</Select>
					</Form-item>
					<Form-item label="最后登录时间" prop="last_login_time" class="col-md-3 col-sm-6">
						<date-range-picker
								v-model="search_field.last_login_time"
								@on-change="search"
								label="选择日期"
								placement="bottom"
								style="width:90%;float:right;">
						</date-range-picker>
					</Form-item>
					<Form-item label="正式版转督导版原因" prop="transfer_reason_did" class="col-md-3 col-sm-6">
						<Select v-model="search_field.transfer_reason_did" style="width: 75%;float:right;">
							<Option value="">不限</Option>
							<Option :value="item.did" v-for="item in transfer_reason_list">{{item.title}}</Option>
						</Select>
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
					        <export-button res="orgs" :params="params"></export-button>
					        <Checkbox class="ml-2" v-model="search_field.is_check" :true-value="1" :false-value="-1" @on-change="init_data">待审核</Checkbox>
                	<div class="pull-right">
                      <per-scope per="franchisee.360s.all" @on-change="type_system = $event"></per-scope>
                  </div>
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
			        v-loading.like="'orgs'"
			        :page-size="pageSize"
			        :page="pageIndex"
			        :stripe="true"
			        :show-header="true"
			        :data="data"
			        :columns="columns"
			        :no-data-text="$store.state.config.EMPTY_DATA_TEXT"
			        :no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT"
					@on-selection-change="addSelectData"
			        @on-sort-change="sortChange">
			        </Table>
			    </div>
			    <div class="content-footer">
			        <div class="pagenation">
			            <Page :total="total"
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
	import dateRangePicker from 'c%/DateRangePicker.vue'
	import ExportButton from 'c%/ExportButton.vue'

	export default{
		mixins: [grid,common,globals],
		components: {
			dateRangePicker,
			ExportButton
		},
		data () {
			return {
				rest_api: 'orgs',
				pk: 'og_id',
				s_list: [],
				showCheckbox: true,
				search_field: {
					org_name: '',
					create_time: [],
					last_login_time: [],
					is_frozen: -1,
					status: -1,
					link: -1,
					org_type: -1,
					is_init: [0,1,2],
					//expire: 0,
					is_check: -1,
					org_short_name: ''
				},
				showEmptyColumn: true,
				type_system: '',
				wait_check_nums: 0,
				status_list: [{value:0,label:'已开启'},{value:1,label:'已锁定'}],
				column_keys: {
					org_name: {
						title: '机构名称',
						fixed: 'left',
						width: 250,
						show: true
					},
					org_type: {
						title: '系统类型',
						width: 90,
						show: true
					},
					service_name:{
                        title:'校区督导',
						width:100,
						show:true
					},
					host:{
						title:'域名',
						width: 250,
						show:true
					},
          admin_account:{
            title:'管理员账号',
            width:150,
            show:true
          },
					fc_person:{
            title:'联系人',
						width:100,
						show:true
					},
					mobile: {
						title: '联系电话',
						width: 120,
						show: true
					},
					org_email:{
            title: '企业邮箱',
            width: 120,
            show: true
					},
					account_num_limit: {
						title: '账号数上限',
						width: 120,
						show: true
					},
					branch_num_limit: {
						title: '校区数上限',
						width: 120,
						show: true
					},
					student_num_limit: {
						title: '学员数上限',
						width: 120,
						show: true,
					},
          student_nums: {
              title: '学员数',
              width: 120,
              show: true,
          },
					is_init: {
						title: '系统状态',
						width: 120,
						show: true
					},
					is_frozen: {
						title: '账号状态',
						width: 120,
						show: true
					},
          frozen_reason_did_value:{
              title:'系统锁定原因',
              width: 160,
              show:true
          },
					is_configed: {
						title: '是否配置',
						width: 120,
						show: true
					},
					expire_day: {
						title: '到期日期',
						width: 120,
						show: true
					},
					create_time:{
					    title:'开通时间',
					    width: 160,
						show:true
					},
          last_login_time:{
              title:'最后登录时间',
              width: 160,
              show:true
          },
          transfer_reason_did_value:{
              title:'正式版转督导版原因',
              width: 160,
              show:false
          },

				},
				column_render: {
					org_name(h,params) {
						return h('span',params.row.org_name)
					},
					org_type(h,params) {
						return h('span',params.row.org_type == 1 ? '正式版' : '督导版')
					},
					host(h,params) {
						return h('span',util.sprintf('http://%s.%s',params.row.host,this.$store.state.user.info.product_url.split('//')[1]))
					},
          transfer_reason_did (h,params) {
              return h('span',this.$filter('dict_title')(params.row.transfer_reason_did,'transfer_reason'))
          },
					open_int_day (h,params) {
						let day = params.row.open_int_day
						if(day) {
							return h('span',this.$filter('int_date')(day))
						}else{
							return h('span','-')
						}
					},
					join_int_day (h,params) {
						let day = params.row.join_int_day
						if(day) {
							return h('span',this.$filter('int_date')(day))
						}else{
							return h('span','-')
						}
					},
					is_init (h,params) {
						let map = {0:['待审核','text-orange'],1:['已开通','text-success'],2:['已锁定','text-danger']}
						return h('span',{
							class: map[params.row.is_init][1]
						},map[params.row.is_init][0])
					},
					is_configed(h,params) {
						if(params.row.is_configed == 1) {
							return h('span', {
								style: {
									color: '#006600'
								}
							}, '已配置')
						}
						else {
							return h('span', '未配置')
						}
					},
					is_frozen (h,params) {
                        let map = {
                        	0:['md-close-circle', '#ef0101','未开启'],
                        	1:['md-close-circle', '#999999','已锁定'],
                        	2:['md-checkmark-circle','#006600','已开启']
                        }
                        let result = 0
                        if(params.row.user) {
                        	if(params.row.user.status === 0) {
                        		result = 1
                        	}else{
                        		result = 2
                        	}
                        }
                        return h('div',[
                            h('Icon',{
                                props:{
                                    type: map[result][0],
                                    color: map[result][1],
                                    size: '14'
                                }
                            }),
                            h('span',{style:{verticalAlign:'middle'}},map[result][2])
                        ])
					},
					org_address (h,params) {
						let row = params.row,
							ssq = ''
                        if(row.province_id) {
                            ssq = this.ssqFormat(row.province_id,row.city_id,row.district_id)
                        }
                        return h('span',ssq+row.org_address)
					},

					expire_day (h,params) {
						let remain_days = moment(util.format_int_day(params.row.expire_day)).diff(moment(new Date()),'days'),
                            remain_days_label = h('p',{
                            'class': remain_days>15?'text-success':'text-danger'
                        },`剩余 ${remain_days} 天`);

						let rst = '';
						if(params.row.expire_day == '2039-12-31') {
							rst = '无限期'
							remain_days_label = ''
						}
						else {
							rst = this.$filter('int_date')(params.row.expire_day)
						}
						let expire_time = h('span',rst)

						if(remain_days<0) {
							remain_days_label = h('p',{
								class: 'text-danger'
							},`已过期 ${-remain_days} 天`)
						}
						if(!params.row.user) {
							return h('span','-')
						}

						if(params.row.expire_day == 20391231) {
							return h('div',[
								expire_time
							])
						}
						else {
							return h('div',[
								expire_time,
								remain_days_label
							])
						}
					}
				},
				operation_keys: {
                    edit: {
                        title: '编辑',
                        type: 'md-create',
                        per: 'x360s.edit'
                    },
                    config: {
                    	title: '配置',
                    	type: 'md-cog',
                    	per: 'x360s.config',
                    	condition: 'row.is_frozen==0&&row.is_init==1'
					},
                    switchType2: {
                    	title: '转换为督导版',
                    	type: 'ios-undo',
                    	condition: 'row.user&&row.is_check == 0&&row.org_type == 1'
					},
                    switchType1: {
                    	title: '转换为正式版',
                    	type: 'ios-undo',
                    	condition: 'row.user&&row.is_check == 0&&row.org_type == 2'
					},
					users_account: {
						title: '员工账号',
						type: 'md-people',
						per: 'x360s.login',
						condition: 'row.is_frozen==0&&row.is_init==1'
					},
                    lock: {
                    	title: '锁定账号',
                    	type: 'md-lock',
                    	condition: 'row.is_frozen==0&&row.is_init==1',
                    	per: 'x360s.lock'
                    },
                    unlock: {
                    	title: '解锁账号',
                    	type: 'md-unlock',
                    	per: 'x360s.unlock',
                    	condition: 'row.is_frozen==1&&row.is_init==2'
                    },
                    edit_account: {
                    	title: '修改账号',
                    	type: 'md-refresh',
                        per: 'x360s.reset',
                        condition: 'row.is_frozen==0&&row.is_init==1'
                    },
                    systemCheck: {
                    	title: '系统审核',
                    	type: 'md-checkmark-circle',
                    	per: 'x360s.check',
                    	condition: 'row.is_check==1'
					},
			// 		<DropdownItem v-per="'franchsystem.check'" @click.native="systemCheck" v-if="info.is_check==1">
			// 	<Icon type="checkmark"></Icon>  系统审核
			// </DropdownItem>
                    // review: {
                    // 	title: '系统审核',
                    // 	type: 'md-checkmark-circle',
                    // 	per: 'x360s.review',
                    // 	condition: 'row.is_init==0'
                    // },
                    del: {
                        title: '删除',
                        type: 'ios-trash',
                        per: 'x360s.delete'
                    }
                },
				operation_func: {
					systemCheck(params) {
						this.$Modal.open('aftersale/x360s/check-modal.vue',{
							on: {
								save: () => {
									this.init_data()
								}
							},
							props: {
								itemInfo: params.row
							}
						})
						.then(modal => {
							modal
							.show('审核系统版本转换申请')
						})
					},
					renew(params) {
						this.$Modal.open('aftersale/x360s/renew.vue@modal',{
							on: {
								save: () => {
									this.init_data()
								}
							}
						})
						.then(modal => {
							modal
							.set('info',params.row)
							.show(util.sprintf('续费延期【%s】',params.row.org_name),'renew')
						})
					},
					edit(params) {
						this.edit(params)
					},
					switchType1(params) {
						this.switchType(1, params.row)
					},
					switchType2(params) {
						this.switchType(2, params.row)
					},
					config(params) {
						this.orgConfig(params.row)
					},
					del(params) {
						this.confirm(util.sprintf('您确定要删除系统【%s】吗?',params.row.org_name))
		                .then(()=>{
		                    this.$rest('orgs')
		                    .delete(params.row.og_id)
		                    .success(res => {
		                    	this.$Message.success('删除成功')
		                    	this.$emit('on-success')
		                    })
		                    .error(res => {
		                    	this.$Message.error(res.message)
		                    })
		                })
					},
					users_account (params) {
						this.$Modal.open('aftersale/x360s/org-users-modal.vue')
						.then(modal=>{
							modal
							.set('og_id',params.row.og_id)
							.show(`【${params.row.org_name}】员工账号`,'add')
						})
					},
					lock(params) {

                        this.frozenOrg(params.row)

						/*this.confirm(util.sprintf('您确定要锁定加盟商【%s】吗?',params.row.org_name))
						.then(()=>{
							this.$rest('orgs/'+params.row.og_id+'/dofreeze')
							.post()
							.success(response=>{
								this.init_data()
								this.$Message.success('锁定成功')
							})
							.error(response=>{
								this.$Message.error(response.message)
							})
						})*/
					},
					unlock(params) {
						this.confirm(util.sprintf('您确定要解锁加盟商【%s】吗?',params.row.org_name))
						.then(()=>{
							this.$rest('orgs/'+params.row.og_id+'/dounfreeze')
							.post()
							.success(response=>{
								this.init_data()
								this.$Message.success('解锁成功')
							})
							.error(response=>{
								this.$Message.error(response.message)
							})
						})
					},
					edit_account(params) {
						if(!params.row.user) {
							this.$Message.error('加盟商账号已被删除')
							return false;
						}
                        let param = {
                            account: params.row.user.account,
                            password: ''
                        }
						this.$Modal.open('aftersale/x360s/account-modal.vue',{
							props: {
								'employee': util.copy(params.row.user),
								'mode': 'org'
							},
							on: {
								save: () => {
									this.init_data()
								}
							}
						})
						.then(modal => {
							modal
							.set('info',param)
							.show(util.sprintf('修改账号:%s',params.row.org_name),'edit')
						})
					},
					review(params) {
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
							modal.show(util.sprintf('审核校360系统【%s】',params.row.org_name),'confirm')
						})
					}
				}
			}
		},
		watch: {
			'type_system': function (val) {
				this.init_data()
			}
		},

        computed: {
            transfer_reason_list() {
                return this.$store.state.gvars.dicts.transfer_reason
            }
        },
		methods: {
			updateName() {
				this.$Modal.confirm({
					title: '确认更新所选加盟商简称',
					onOk: () => {
						this.$http.post('fapi/orgs/multi_update_org_short_name', {
							og_ids: this.s_list.map(item => {
								return item.og_id
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
			frozenOrg(row) {
                this.$Modal.open('aftersale/x360s/frozen-org-modal.vue',{
                    on: {
                        save: () => {
                            this.init_data()
                        }
                    }
                }).then(modal => {
                    modal
                        .set('og_id', row.og_id)
                        .show('锁定账号')
                })
			},
			switchType(num, row) {
				if(num == 2) {

                    this.$Modal.open('aftersale/x360s/to-trial-modal.vue',{
                        on: {
                            save: () => {
                                this.init_data()
                            }
                        }
                    }).then(modal => {
						modal
							.set('og_id', row.og_id)
							.show('转换为督导版')
					})
				}
				else {
					this.$Modal.open('aftersale/x360s/to-formal-modal.vue',{
						on: {
							save: () => {
								this.init_data()
							}
						}
					})
					.then(modal => {
						modal
						.set('og_id', row.og_id)
						.show('转换为正式版')
					})
				}
			},
			add() {
				this.$Modal.open('aftersale/x360s/info-modal.vue',{
					on: {
						save: () => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal.show('创建校360系统','add')
				})
			},
			edit(params) {
				let row = util.copy(params.row)
                let days = ['expire_day','open_int_day','join_int_day']

                days.forEach(d => {
                	if(row[d]) {
                		row[d] = this.$filter('int_date')(row[d])
                	}else{
                		row[d] = ''
                	}
                })
                delete row.create_time
                delete row.users

                this.$Modal.open('aftersale/x360s/info-modal.vue',{
                	on: {
						save: () => {
							this.init_data()
						}
					}
                })
                .then(modal => {
                	modal
                	.set('info',{org:row})
                	.show(util.sprintf('编辑盟商系统【%s】',row.org_name),'edit')
                })
			},
			orgConfig(row) {
				this.$Modal.open('aftersale/x360s/config.vue@modal',{
					props: {
						id: row.og_id,
						name: row.org_name
					},
					on:{
						'success':() => {
							this.init_data()
						}
					}
				})
				.then(modal => {
					modal.show(util.sprintf('校360系统配置【%s】',row.org_name))
				})
			},
			readOnly (val,field) {
				let arr = this.search_field[field]
				if(arr.length===1&&arr[0]===val){
					return true
				}
				return false
			},
			deal_data(data) {
				this.wait_check_nums = data.wait_check_nums
				return data.list
			},
			resetSearch () {
				this.search_field.is_init = [0,1,2]
				this.$form('ref_search').reset()
				this.init_data()
			},
			hook_get_param (params) {
				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='create_time'){
						if(property!=','&&property.length>0){
							params[o] = util.sprintf('[Between,%s]',property.join(','))
						}
					}else if(o == 'last_login_time'){
                        if(property!=','&&property.length>0){
                            params['start_date'] = property[0]
                            params['end_date']   = property[1]
                        }
					}else if(o=='link'){
						if(property==1) {
							params['fc_id'] = '[>,0]'
						}else if(property==0){
							params['fc_id'] = 0
						}
					}else if(o=='is_init'){
						if(property.length>0){
                            params[o] = util.sprintf('[In,%s]',property.join(','))
                        }
					}else{
						if( property!==-1){
							params[o] = property
						}
					}
				}
				if(this.type_system=='my') {
					params.charge_eid = this.eid$
				}
			}
		}
	}
</script>

<style scoped>
.personTable {
	min-height: unset;
}
</style>

<template>
	<div class="franchisee-info">
		<div class="mb-2">
			<Button 
				type="primary" 
				icon="ios-arrow-back" 
				size="small"
				class="mr-2" 
				@click="back"
				>
			</Button>
			<Button 
				type="primary" 
				icon="ios-refresh" 
				size="small" 
				@click="refreshData"
				>
			</Button>
		</div>		
		<data-ready ref="dr" :cache="false" :data="[info_url]" @refresh="refresh" @ready="dataReady">
			<Card dis-hover>
				<div slot="title">
					<Icon type="ios-information-circle-outline" size="18"/><span>基本信息</span>
				</div>
				<Form :label-width="120" class="row">
                    <Form-item label="盟商名称：">{{data.org_name||'-'}}</Form-item>
					<Form-item label="地址：">{{data.org_address||'-'}}</Form-item>
					<Form-item label="中心座机：">{{data.mobile||'-'}}</Form-item>
					<Form-item label="企业邮箱：">{{data.org_email||'-'}}</Form-item>
					<Form-item label="督导员工：">{{data.service_eid|ename('-')}}</Form-item>
					<Form-item label="销售员工：">{{data.sale_eid|ename('-')}}</Form-item>
					<Form-item label="系统状态：">{{data.system_status|system_status}}</Form-item>
					<Form-item label="运营状态：">{{data.status|business_status}}</Form-item>
					<Form-item label="店面性质：">{{data.address_did|dict_title('address','-')}}</Form-item>
					<Form-item label="装修费用：">{{data.decorate_fee}}</Form-item>
					<Form-item label="主体变更：">{{data.is_owner_change?'已变更':'未变更'}}</Form-item>
					<Form-item label="营业执照：">{{data.business_license||'-'}}</Form-item>
					<Form-item label="授权铜牌：">{{data.is_authorize_dispatch?'已授权':'未授权'}}</Form-item>
					<Form-item label="营业面积：">{{data.area_size}}</Form-item>
					<Form-item label="教室数：">{{data.room_nums}}</Form-item>
					<Form-item label="员工数：">{{data.employee_nums}}</Form-item>
					<Form-item label="会员数：">{{data.member_nums}}</Form-item>
					<Form-item label="48课时售价：">{{data.l1_price}}</Form-item>
					<Form-item label="96课时售价：">{{data.l2_price}}</Form-item>
					<Form-item label="免费培训人数：">{{data.free_training_nums}}人</Form-item>
				</Form>
			</Card>
            <Card dis-hover class="mt-2">
				<div slot="title">
					<Icon type="md-people" size="18"/><span>联系人</span>
					<Button type="primary" size="small" class="pull-right" icon="md-add" @click="addContact">添加</Button>
				</div>
				<Table
					class="row personTable"
					:stripe="true"
					:data="personData"
					:columns="personColumns"
					no-data-text="暂无联系人">
				</Table>
			</Card>
            <Card dis-hover class="mt-2">
				<div slot="title">
					<Icon type="md-contract" size="18"/><span>合同信息</span>
				</div>
				<Form :label-width="120" class="row">
					<Form-item label="合同号：">{{data.franchisee_contract.contract_no||'-'}}</Form-item>
					<Form-item label="合同开始日期：">{{data.franchisee_contract.contract_start_int_day||'-'}}</Form-item>
					<Form-item label="合同结束日期：">{{data.franchisee_contract.contract_end_int_day||'-'}}</Form-item>
					<Form-item label="开业日期：">{{data.franchisee_contract.open_int_day||'-'}}</Form-item>
					<Form-item label="区域性质：">{{data.franchisee_contract.region_level|region_level}}</Form-item>
					<Form-item label="特许经营费：">{{data.franchisee_contract.join_fee1}}</Form-item>
					<Form-item label="履约保障金：">{{data.franchisee_contract.join_fee2}}</Form-item>
                    <Form-item label="年度使用费：">{{data.franchisee_contract.join_fee3}}</Form-item>
					<Form-item label="教育商品款：">{{data.franchisee_contract.join_fee4}}</Form-item>
					<Form-item label="合同总金额：">{{data.franchisee_contract.contract_amount}}</Form-item>
                    <Form-item label="全款到账日期：">{{data.franchisee_contract.all_pay_int_day||'-'}}</Form-item>
					<Form-item label="签约员工：">{{data.franchisee_contract.sign_eid|ename('-')}}</Form-item>
					<Form-item label="特殊约定：" class="double">{{data.franchisee_contract.content}}</Form-item>
				</Form>
			</Card>
			<Tabs v-model="tab">
				<TabPane label="服务记录" name="services">
					<services-tab :fc_id="fc_id" v-if="tab == 'services'"/>
				</TabPane>
				<TabPane label="培训人员" name="trainPeople">
					<train-people :fc_id="fc_id" v-if="tab == 'trainPeople'"/>
				</TabPane>
			</Tabs>
		</data-ready>
	</div>
</template>

<script>
	import moment from 'moment'	
	import util,{_} from '@/libs/util'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import dataReady from 'c%/DataReady.vue'
	import RichTel from 'c%/RichTel.vue'
	import ServicesTab from './services.vue'
	import TrainPeople from './train-people.vue'
	
	export default{
		mixins: [globals,common],
		components: {
			dataReady,
			ServicesTab,
			TrainPeople,
			RichTel
		},
		data () {
			let vm = this;
			return {
				data: {
					franchisee_contract: {
					}
				},
				tab: 'services',
				fc_id: Number(this.$route.params.id),
				personColumns: [
					{
                        title: '操作',
						key: 'op',
						render: (h, params) => {
							let editEl =  h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								on: {
									click: () => {
										vm.editPerson(params.row)
									}
								}
							}, '编辑')
							let deleteEl =  h('Button', {
								style: {
									marginLeft: '5px'
								},
								props: {
									type: 'error',
									size: 'small'
								},
								on: {
									click: () => {
										vm.deletePerson(params.row)
									}
								}
							}, '删除')
							return h('span', [editEl, deleteEl])
						}
                    },
					{
                        title: '姓名',
                        key: 'name'
                    },
					{
                        title: '手机号',
						key: 'mobile',
						render: (h, params) => {
							return h(RichTel,{
								props: {
									sence: 'fc',
									row: params.row,
									fcInfo: this.data
								},
								on: {
									'on-success': ()=>{
										this.refreshData()
									}
								}
							})
						}
                    },
					{
                        title: '主联系人',
						key: 'is_main',
						render: (h, params) => {
							if(params.row.is_main) {
								return h('Tag',{
									props: {
										color: 'success'
									}
								},'是')
							}
							else {
								return h('span','否')
							}
							
						}
                    },
					{
                        title: '合伙人',
						key: 'is_partner',
						render: (h, params) => {
							if(params.row.is_partner) {
								return h('span',`是，股权比例：${params.row.partner_percent}%`)
							}else{
								return h('span','否')
							}
						}
                    },
					{
                        title: '合同签约人',
						key: 'is_contract_sign',
						render: (h, params) => {
							return h('span',params.row.is_contract_sign?'是':'否')
						}
                    },
					{
                        title: '邮箱',
						key: 'email',
                    },
					{
                        title: '身份证号',
						key: 'id_card_no',
                    },
					{
                        title: '通讯地址',
						key: 'address',
                    },
				],
				personData: []
			}
		},
		mounted () {			
			
		},
		methods: {
			editPerson(row) {
				this.$Modal.open('aftersale/franchisees/contact-info-modal.vue',{
					on: {
						save: () => {
							this.refreshData()
						}
					}
				})
				.then(modal => {
					let info = util.copy(row)
					info.partner_percent = Number(info.partner_percent)
					modal
					.set('info',info)
					.show(util.sprintf('编辑联系人【%s】',row.name),'edit')
				})
			},
			deletePerson(row) {
				this.confirm(util.sprintf('确定删除联系人【%s】吗？',row.name))
				.then(() => {
					this.$rest('franchisee_persons')
					.delete(row.fcp_id)
					.success(res => {
						this.$Message.success('删除成功')
						this.refreshData()
					})
					.error(res => {
						this.$Message.error(res.message)
					})
				})
			},
			addContact() {
				this.$Modal.open('aftersale/franchisees/contact-info-modal.vue',{
					props: {
						'fc-id': this.data.fc_id
					},
					on: {
						save: () => {
							this.refreshData()
						}
					}
				})
				.then(modal => {
					modal.show(util.sprintf('添加联系人【%s】',this.data.org_name),'add')
				})
			},
			back() {
				this.$store.commit('setSearchDetail',true)
				this.$router.push('/aftersale/franchisees')
			},
			dataReady (rs) {	
				this.data = rs[0];
				this.personData = this.data.franchisee_person;
			},
			refresh (rs) {
				this.data = rs.response 
			},
			refreshData () {
				let obj = this.$r('dr').refreshData(this.info_url)
				obj.then(res => {
					this.personData = res.franchisee_person;
				})
			}
		},
		computed: {
			info_url(){
				return `franchisees/${this.fc_id}`
			}
		}
	}
</script>
<style lang="less">
	.franchisee-info {
		.ivu-card-head {
			span {
				margin-left: 6px;
				vertical-align: middle;
			}
		}
		.ivu-form-item {
			margin-bottom: 0;
			flex: 0 0 25%;
    		max-width: 25%;
    		&.double {
    			flex: 0 0 50%;
    			max-width: 50%;
    		}
		}
	}
</style>


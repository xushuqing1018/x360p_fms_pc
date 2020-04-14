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
					<Icon type="ios-information-circle-outline" size="18"/><span>培训信息</span>
				</div>
				<Form :label-width="120" class="row">
                    <Form-item label="培训名称：">{{data.ft_name||'-'}}</Form-item>
                    <Form-item label="开始日期：">{{data.start_int_day||'-'}}</Form-item>
                    <Form-item label="结束日期：">{{data.end_int_day||'-'}}</Form-item>
                    <Form-item label="培训场地：">{{data.fc_address_id|dict_title('fc_address')}}</Form-item>
                    <Form-item label="培训类型：">{{data.training_type_did|dict_title('training_type')}}</Form-item>
                    <Form-item label="负责人：">{{data.charge_eid|ename}}</Form-item>
                    <Form-item label="参与员工：">{{otherEname(data.other_eids)}}</Form-item>
                    <Form-item label="参与人数：">{{data.training_person_nums}}人</Form-item>
                    <Form-item label="培训费用：">{{data.training_fee}} 元/人</Form-item>
				</Form>
			</Card>
			<Card dis-hover class="mt-2">
				<div slot="title">
					<Icon type="ios-information-circle-outline" size="18"/><span>培训简介</span>
				</div>
				<div style="margin-left: 30px;">{{data.training_intro}}</div>
			</Card>
            <Card dis-hover class="mt-2">
				<div slot="title">
					<Icon type="md-people" size="18"/><span>盟商培训人员</span>
				</div>
				<train-people :ft_id='ft_id'/>
			</Card>
		</data-ready>
	</div>
</template>

<script>
	import moment from 'moment'	
	import util,{_} from '@/libs/util'
	import common from '@/libs/common.mixin'
	import globals from '@/libs/globals.mixin'
	import dataReady from 'c%/DataReady.vue'
	import TrainPeople from './train-people.vue'

	export default {
		mixins: [globals,common],
		components: {
			dataReady,
			TrainPeople
		},
		data () {
			let vm = this;
			return {
				data: {
					franchisee_contract: {
					}
				},
				tab: 'services',
				ft_id: Number(this.$route.params.id),
				personData: []
			}
		},
		methods: {
			otherEname(val) {
				let other_eids = val,
					temp_str = '',
					all_temp_str = '',
					omit_temp_str = '';

				if(other_eids instanceof Array) {
					let index;
					for (index = 0; index < other_eids.length; index++) {
						const item = other_eids[index];
						temp_str += this.$filter('ename')(item);
						temp_str += '，';
						if(index == 2) {
							omit_temp_str = temp_str.substr(0, temp_str.length - 1) + '...';
						}
					}
					all_temp_str = temp_str.substr(0, temp_str.length - 1);
					// if(index <= 3) {
					// 	return 
					// }
					// else {
					// 	return h('Tooltip', {
					// 		props: {
					// 			content: all_temp_str,
					// 			placement: 'right'
					// 		}
					// 	}, [ h('span', omit_temp_str) ])
					// }
				}
				return all_temp_str
			},
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
				this.$router.push('/aftersale/trains')
			},
			dataReady (rs) {	
				this.data = rs[0];
			},
			refresh (rs) {
				this.data = rs.response 
			},
			refreshData () {
				let obj = this.$r('dr').refreshData(this.info_url)
				obj.then(res => {
					this.$Message.success('已刷新')
				})
			},
		},
		computed: {
			info_url(){
				return `franchisee_trainings/${this.ft_id}`
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


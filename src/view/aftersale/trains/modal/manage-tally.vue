<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="1000">
		<div class="c-grid">
			<div class="box box-query">
				<Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row">
					<Form-item label="加盟商" prop="fc_id" class="col-md-4 col-sm-6">
						<SelectFranchisee v-model="search_field.fc_id" @selected="init_data" />
					</Form-item>
					<Form-item label="业务日期" prop="int_day" class="col-md-4 col-sm-6">
						<DatePicker type="date" :value="search_field.int_day" @on-change="search_field.int_day = $event" placeholder="请选择业务日期" style="width: 100%"></DatePicker>
					</Form-item>
					<Form-item label="收支类型" prop="type" class="col-md-4 col-sm-6">
						<RadioGroup v-model="search_field.type" @on-change="init_data">
							<Radio :label="0">全部</Radio>
							<Radio :label="1">进账</Radio>
							<Radio :label="2">出账</Radio>
						</RadioGroup>
					</Form-item>
					<template v-if="searchExpand">
					</template>
				</Form>
				<div class="mt-2">
					<Button-group>
						<Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
						<!-- <Button type="primary" :icon="toggleSearchIcon" @click="toggleSearch"></Button> -->
					</Button-group>
					<Button class="ml-2" type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
					<export-button class="ml-2" res="franchisee_tallys" :params="params"></export-button>
				</div>
			</div>
			<div class="box box-result">
				<div class="toolbar">
					<Button class="ml-2" type="primary" icon="md-add" @click="addInfo">记一笔</Button>
					<Button class="ml-3" @click="manageFeeType">收支类别</Button>
					<filter-column class="mr-2" :keys="column_keys"></filter-column>
				</div>
				<div class="content">
					<div class="content-body">
						<Table
							v-loading.like="'franchisee_tallys'" 
							:data="data"
							:stripe="true"
							:page="pageIndex"
							:columns="columns"
							:show-header="true"
							:page-size="pageSize"
							:no-data-text="$store.state.config.EMPTY_DATA_TEXT"
							:no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT"
							@on-sort-change="sortChange">
						</Table>
					</div>
					<div class="content-footer">
						<span v-if="allData != null">
							收入：<span style="color: #19be6b" class="mr-2">￥{{allData.income_amount}}</span>
							支出：<span style="color: #ed4014" class="mr-2">￥{{allData.payout_amount}}</span>
							总计：<span style="color: #19be6b">￥{{allData.income_amount - allData.payout_amount}}</span>
						</span>
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
		<div slot="footer">
			<Button @click="close">关闭</Button>
		</div>
	</Modal>
</template>

<script>
import grid from '@/libs/grid.mixin'
import common from '@/libs/common.mixin'
import globals from '@/libs/globals.mixin'
import modal from '@/libs/modal.mixin'
import moment from 'moment'
import SelectFranchisee from 'c%/SelectFranchisee.vue'
import ExportButton from 'c%/ExportButton.vue'

const defaultSearchField = {
	fc_id: 0,
	int_day: '',
	type: 0,
}

export default {
	mixins: [grid, common, modal, globals],
	components: {
		SelectFranchisee,
		ExportButton,
	},
	props: {
		ft_id: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			rest_api: 'franchisee_tallys',
			search_field: { ...defaultSearchField },
			column_keys: {
				expand: {
					type: 'expand',
					fixed: 'left',
                    width: 60
				},
				fc_id: {
					title: '加盟商',
					show: true,
					width: 200
				},
				type: {
					title: '收支类型',
					show: true,
					width: 100
				},
				amount: {
					title: '金额',
					show: true,
					width: 60
				},
				remark: {
					title: '备注',
					show: true,
					width: 150
				},
				transaction_id: {
					title: '微信订单号',
					show: true,
					width: 150
				},
				time_end: {
					title: '业务日期',
					show: true,
					width: 100
				},
				file: {
					title: '附件',
					show: true,
					width: 60
				},
				pay_order: {
                    title : '支付凭证',
                    show: true,
                    width: 100
				},
			},
			column_render: {
				fc_id(h, params) {
					return h('span', params.row.franchisee ? params.row.franchisee.org_name : '-')
				},
				type(h, params) {
					return h('span', params.row.type == 1 ? '进账' : '出账')
				},
				time_end(h,params){
                    return h('span', params.row.franchisee_training_order.pay_result.time_end)
				},
				transaction_id(h,params){
                    return h('span', params.row.franchisee_training_order.pay_result.transaction_id)
				},
				amount(h, params) {
					let [label, color] = params.row.type == 1 ? ['+' + params.row.amount, '#19be6b'] : ['-' + params.row.amount, '#ed4014']
					return h('span', {
						style: {
							color: color
						}
					}, label)
				},
				remark(h, params) {
					return h('span', this.$filter('nonEmpty')(params.row.remark))
				},
				int_day(h, params) {
					return h('span', params.row.int_day)
				},
				file(h, params) {
					let franchisee_tally_file = params.row.franchisee_tally_file;
					if(franchisee_tally_file.length > 0) {
						return h('Button', {
							props: {
								size: 'small',
								icon: 'md-eye'
							},
							on: {
								click: () => {
									this.viewFiles(franchisee_tally_file);
								}
							}
						})
					}
					else {
						return h('span', '-')
					}
				},
				pay_order(h,params){
					let franchisee_training_order = params.row.franchisee_training_order;
                    if(franchisee_training_order){
                        return h('Button', {
							props: {
								size: 'small',
								icon: 'md-eye'
							},
							on: {
								click: () => {
									this.viewOrder(franchisee_training_order.pay_result);
								}
							}
						})

                    }else{
                    	return h('span','-');
                    }
				},
			},
			operation_keys: {
				edit: {
					title: '编辑',
					type: 'md-create'
				},
				delete: {
					title: '删除',
					type: 'ios-trash'
				}
			},
			operation_func: {
				edit(params) {
					this.editInfo(params.row);
				},
				delete(params) {
					this.deleteInfo(params.row);
				}
			},
			allData: null
		}
	},
	mounted() {
		this.init_data();
	},
	methods: {
		manageFeeType() {
			this.$Modal.open('aftersale/trains/modal/manage-fee-type.vue@modal', {
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show('收支类别管理')
			})
		},
		addInfo() {
			this.$Modal.open('aftersale/trains/modal/tally-info.vue@modal', {
				on: {
					update: () => {
						this.init_data();
					}
				},
				props: {
					ft_id: this.ft_id
				}
			})
			.then(modal => {
				modal.show('记一笔','add')
			})
		},
		viewFiles(list) {
			this.$Modal.open('components/PreviewFile.vue@modal', {
				props: {
					list: list
				}
			})
			.then(modal => {
				modal.show('查看记一笔附件','view')
			})
		},
		viewOrder(result) {
			this.$Modal.open('components/PreviewOrder.vue@modal', {
				props: {
					result: result,
				}
			})
			.then(modal => {
				modal.show('支付凭证','view')
			})
		},
		editInfo(row) {
			this.$Modal.open('aftersale/trains/modal/tally-info.vue@modal', {
				props: {
					'item-info': row,
					'ft-id': row.ft_id
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`编辑记一笔`,'edit')
			})
		},
		deleteInfo(row) {
			this.$Modal.confirm({
				title: `确认删除该收支记录`,
				onOk:() => {
					this.deleteInfoAction(row);
				}
			})
		},
		deleteInfoAction(row) {
			this.axios.request({
				url: 'fapi/franchisee_tallys/' + row.fty_id,
				method: 'delete'
			})
			.then(res => {
				this.$Message.success('删除成功');
				this.init_data();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		},
		deal_data(data) {
			this.allData = data;
			return data.list
		},
		hook_get_param(params) {
			params.with = 'franchisee,franchisee_tally_file';
			params.ft_id = this.ft_id;

			let search_obj = this.search_field;
			for(let o in search_obj) {
				let property = search_obj[o];
				if(o == 'int_day') {
					if(property != '') {
						params[o] = moment(property, 'YYYY-MM-DD').format('YYYYMMDD');
					}
				}
				else if(property){
					params[o] = property;
				}
			}
		},
		resetSearch() {
			this.search_field = { ...defaultSearchField };
			this.search();
		}
	},
	filters: {
		nonEmpty(value) {
			if(value) {
				return value
			}
			else {
				return '-'
			}
		}
	}
}
</script>
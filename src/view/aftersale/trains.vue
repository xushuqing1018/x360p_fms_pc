<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row">
				<Form-item label="培训名称" prop="ft_name" class="col-md-3 col-sm-6">
					<Input v-model="search_field.ft_name" placeholder="请输入培训名称" @on-enter="search"></Input>
				</Form-item>
				<Form-item label="培训日期" prop="start_int_day" class="col-md-3 col-sm-6">
					<DatePicker type="date" :value="search_field.start_int_day" @on-change="search_field.start_int_day = $event" placeholder="请选择培训日期" style="width: 100%"></DatePicker>
				</Form-item>
				<Form-item label="负责人" prop="charge_eid" class="col-md-3 col-sm-6">
					<SelectEmployee v-model="search_field.charge_eid"/>
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
				<export-button class="ml-2" res="franchisee_trainings" :params="params"></export-button>
				<import-button class="hide" ref="train_persons" res="train_persons" :params="trainParams" name="培训人员" @on-import-finish="init_data"></import-button>	
				<div class="pull-right">
					<per-scope per="franchisee.trains.all" @on-change="perType = $event"></per-scope>
				</div>
			</div>
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Button class="ml-2" type="primary" icon="md-add" @click="addInfo">安排培训</Button>
				<import-button res="franchisee_trainings" name="培训安排" @on-import-finish="init_data"></import-button>
				<filter-column class="mr-2" :keys="column_keys"></filter-column>
			</div>
			<div class="content">
				<div class="content-body">
					<Table
						v-loading.like="'franchisee_trainings'" 
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
import grid from '@/libs/grid.mixin'
import common from '@/libs/common.mixin'
import globals from '@/libs/globals.mixin'
import moment from 'moment'
import SelectEmployee from 'c%/SelectEmployee.vue'
import ExportButton from 'c%/ExportButton.vue'
import ImportButton from 'c%/ImportButton.vue'

const defaultSearchField = {
	ft_name: '',
	start_int_day: '',
	charge_eid: 0
}

export default {
	mixins: [grid, common, globals],
	components: {
		SelectEmployee,
		ExportButton,
		ImportButton
	},
	data() {
		return {
			rest_api: 'franchisee_trainings',
			search_field: { ...defaultSearchField },
			
			column_keys: {
				ft_name: {
					title: '培训名称',
					show: true
				},
				start_int_day: {
					title: '开始日期',
					show: true
				},
				end_int_day: {
					title: '结束日期',
					show: true
				},
				fc_address_id: {
					title: '培训场地',
					show: true
				},
				training_type_did: {
					title: '培训类型',
					show: true
				},
				charge_eid: {
					title: '负责人',
					show: true
				},
				other_eids: {
					title: '参与员工',
					show: true
				},
				join_nums: {
					title: '报名人数',
					show: true
				},
			},
			column_render: {
				ft_name(h, params) {
					return h('router-link', {
						props: {
							to: `/aftersale/trains/`+params.row.ft_id
						}
					}, params.row.ft_name)
				},
				join_nums(h, params) {
					return h('span', params.row.training_person_nums)
				},
				start_int_day(h, params) {
					return h('span', params.row.start_int_day)
				},
				end_int_day(h, params) {
					return h('span', params.row.end_int_day)
				},
				fc_address_id(h, params) {
					return h('span', this.labelDicts(params.row.fc_address_id, 'fc_address'))
				},
				training_type_did(h, params) {
					return h('span', this.labelDicts(params.row.training_type_did, 'training_type'))
				},
				charge_eid(h, params) {
					return h('span', this.$filter('ename')(params.row.charge_eid))
				},
				other_eids(h, params) {
					let other_eids = params.row.other_eids,
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
						if(index <= 3) {
							return h('span', all_temp_str)
						}
						else {
							return h('Tooltip', {
								props: {
									content: all_temp_str,
									placement: 'right'
								}
							}, [ h('span', omit_temp_str) ])
						}
					}
				}
			},
			operation_keys: {
				manageFc: {
					title: '加盟商管理',
					type: 'md-build'
				},
				manageTally: {
					title: '收支管理',
					type: 'logo-yen'
				},
				import: {
					title: '批量导入',
					type: 'ios-cloud-upload'
				},
				qrcode: {
					title: '报名缴费',
					type: 'md-qr-scanner',
				},
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
				manageFc(params) {
					this.manageFc(params.row);
				},
				manageTally(params) {
					this.manageTally(params.row);
				},
				import(params) {
					this.importPerson(params.row);
				},
				qrcode(params) {
					this.qrcode(params.row);
				},
				edit(params) {
					this.editInfo(params.row);
				},
				delete(params) {
					this.deleteInfo(params.row);
				}
			},
			perType: '',
			current_ft_id: 0
		}
	},
	computed: {
		trainParams () {
			return 'ft_id='+this.current_ft_id
		}
	},
	created(){
		if(!this.hasPer('franchisee.trains.all')){
			this.search_field.charge_eid = this.eid$;
		}
	},
	mounted() {

		this.init_data();
	},
	watch: {
		perType(val) {
			if(val == 'my') {
				this.search_field.charge_eid = this.eid$;
			}
			else {
				this.search_field.charge_eid = 0;
			}
			this.init_data();
		}
	},
	methods: {
		qrcode(row) {
			this.$Modal.open('aftersale/trains/modal/qr-modal.vue',{
				on: {
					'on-success': ()=>{
						this.init_data()
					}
				}
			})
			.then(modal=>{
				modal
				.set('info',row)
				.set('ft_id',row.ft_id)
				.show(`【${row.ft_name}】报名的二维码`)
			})
		},
		importPerson(row) {
			this.current_ft_id = row.ft_id
			setTimeout(()=>{
				this.$refs.train_persons.bat_add()					
			},200)
		},
		addInfo() {
			this.$Modal.open('aftersale/trains/modal/trains-info.vue@modal', {
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show('安排培训','add')
			})
		},
		manageFc(row) {
			this.$Modal.open('aftersale/trains/modal/manage-fc.vue@modal', {
				props: {
					ft_id: row.ft_id,
					ft_info:row
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`管理加盟商【${row.ft_name}】`)
			})
		},
		manageTally(row) {
			this.$Modal.open('aftersale/trains/modal/manage-tally.vue@modal', {
				props: {
					ft_id: row.ft_id
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`管理收支【${row.ft_name}】`)
			})
		},
		editInfo(row) {
			this.$Modal.open('aftersale/trains/modal/trains-info.vue@modal', {
				props: {
					itemInfo: row
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`编辑培训【${row.ft_name}】`,'edit')
			})
		},
		deleteInfo(row) {
			this.$Modal.confirm({
				title: `确认删除培训【${row.ft_name}】`,
				onOk:() => {
					this.deleteInfoAction(row);
				}
			})
		},
		deleteInfoAction(row) {
			this.axios.request({
				url: 'fapi/franchisee_trainings/' + row.ft_id,
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
		hook_get_param(params) {
			let search_obj = this.search_field;
			for(let o in search_obj) {
				let property = search_obj[o];
				if(o == 'start_int_day') {
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

<style scoped>

</style>

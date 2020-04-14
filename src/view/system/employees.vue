<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row">
				<Form-item label="员工姓名" prop="ename" class="col-md-3 col-sm-6">
					<Input v-model="search_field.ename" placeholder="请输入员工姓名" @on-enter="search"></Input>
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
				<export-button class="ml-2" res="employees" :params="params"></export-button>
			</div>
		</div>
		<div class="box box-result">
			<div class="toolbar">
				<Tooltip content="请在总部系统中添加员工后转移至加盟商系统"><Button class="ml-2" type="primary" icon="md-add" @click="addInfo" disabled>添加</Button></Tooltip>
				<filter-column class="mr-2" :keys="column_keys"></filter-column>
			</div>
			<div class="content">
				<div class="content-body">
					<Table
						v-loading.like="'employees'" 
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
import globals from '@/libs/globals.mixin'
import ExportButton from 'c%/ExportButton.vue'

const defaultSearchField = {
	ename: '',
	is_fsys: 1
}

export default {
	mixins: [grid, globals],
	components: {
		ExportButton
	},
	data() {
		return {
			rest_api: 'employees',
			search_field: { ...defaultSearchField },
			column_keys: {
				ename: {
					title: '姓名',
					show: true
				},
				role_name: {
					title: '角色',
					show: true
				},
				mobile: {
					title: '手机号',
					show: true
				},
				email: {
					title: '邮箱',
					show: true
				},
				uid: {
					title: '账号',
					show: true
				},
				user_status: {
					title: '账号状态',
					show: true
				},
				account: {
					title: '账号名',
					show: true
				},
			},
			column_render: {
				ename(h, params) {
					let [sexLabel, sexColor] = params.row.sex == '1' ? ['md-male', '#2d8cf0'] : ['md-fmale', '#f893c9'],
						sexEl = h('Icon', {
							props: {
								type: sexLabel,
								color: sexColor
							}
						}, sexLabel),
						nameEl = h('span', ' ' + params.row.ename)
					return h('span', [sexEl, nameEl])
				},
				role_name(h, params) {
					let label = '-';
					if(params.row.rids.length > 0) {
						label = '';
						params.row.rids.forEach(item => {
							label += (this.$filter('role_name')(item) + '，')
						})
						return h('span', label.substring(0,label.length-1))
					}
					return h('span', label)
				},
				email(h, params) {
					return h('span', this.$filter('nonEmpty')(params.row.email))
				},
				uid(h, params) {
					let [iconType, iconColor, label] = params.row.uid ?
						['ios-checkmark-circle', '#006600', '已开启'] :
						['ios-close-circle', '#999999', '未开启']
					let iconEl = h('Icon', {
						props: {
							type: iconType,
							color: iconColor
						},
						style: {
							fontSize: '14px',
							position: 'relative',
							top: '-1px'
						}
					})

					return h('span', [iconEl, label])
				},
				user_status(h, params) {
					if(params.row.uid) {
						let [iconType, iconColor, label] = params.row.user_status ?
							['ios-checkmark-circle', '#006600', '已启用'] :
							['ios-close-circle', '#999999', '已禁用']
						let iconEl = h('Icon', {
							props: {
								type: iconType,
								color: iconColor
							},
							style: {
								fontSize: '14px',
								position: 'relative',
								top: '-1px'
							}
						})
						return h('span', [iconEl, label])
					}
					else {
						return h('span', '-')
					}
				},
				account(h, params) {
					return h('span', params.row.user ? params.row.user.account : '-')
				}
			},
			operation_keys: {
				edit: {
					title: '编辑',
					type: 'md-create'
				},
				pers: {
					title: '额外权限',
					type: 'ios-build'
				},
				// delete: {
				// 	title: '删除',
				// 	type: 'ios-trash'
				// }
			},
			operation_func: {
				edit(params) {
					this.editInfo(params.row);
				},
				pers(params) {
					this.selectPers(params.row);
				},
				// delete(params) {
				// 	this.deleteInfo(params.row);
				// }
			}
		}
	},
	mounted() {
		this.init_data();
	},
	methods: {
		selectPers(row) {
			this.$Modal.open('system/roles/modal/select-pers.vue@modal', {
				props: {
					perList: row.user.pers,
					type: 'user',
					id: row.uid
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`员工额外权限【${row.ename}】`)
			})
		},
		addInfo() {
			this.$Modal.open('system/employees/modal/employee-info.vue@modal', {
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show('添加员工','add')
			})
		},
		editInfo(row) {
			this.$Modal.open('system/employees/modal/employee-info.vue@modal', {
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
				modal.show(`编辑员工【${row.ename}】`,'edit')
			})
		},
		deleteInfo(row) {
			this.$Modal.confirm({
				content: `确认删除员工【${row.ename}】`,
				onOk:() => {
					this.deleteInfoAction(row);
				}
			})
		},
		deleteInfoAction(row) {
			this.axios.request({
				url: 'fapi/employees/' + row.eid,
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
			params.with = 'user';
			let search_obj = this.search_field;
			for(let o in search_obj) {
				let property = search_obj[o];
				if(property){
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

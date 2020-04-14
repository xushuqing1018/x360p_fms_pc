<template>
    <div>
        <div class="toolbar">
            <Button class="ml-1" type="primary" icon="md-add" @click="addInfo">添加权限组</Button>
        </div>
        <div class="content">
            <div class="content-body">
                <Table
					v-loading.like="'roles'" 
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
</template>

<script>
import util from 'util'
import grid from '@/libs/grid.mixin'
import common from '@/libs/common.mixin'

export default {
    mixins: [grid, common],
	data() {
		return {
			rest_api: 'roles',
			column_keys: {
				role_name: {
					title: '权限组',
					show: true
				},
				role_desc: {
					title: '描述',
					show: true
				}
			},
			column_render: {
				role_name(h, params) {
					return h('a', {
                        style: {
                            color: '#39f'
                        },
                        on: {
                            click: () => {
                                this.$emit('setRole', params.row.rid, params.row.role_name)
                            }
                        }
                    }, params.row.role_name)
                }
			},
			operation_keys: {
				edit: {
					title: '编辑',
					type: 'md-create',
					condition: 'row.is_system == 0'
				},
				pers: {
					title: '权限',
					type: 'ios-build'
				},
				delete: {
					title: '删除',
                    type: 'ios-trash',
                    condition: 'row.is_system == 0'
				}
			},
			operation_func: {
				edit(params) {
					this.editInfo(params.row);
				},
				pers(params) {
					this.selectPers(params.row);
				},
				delete(params) {
					this.deleteInfo(params.row);
				}
			}
		}
	},
	mounted() {
        this.init_data();
	},
	methods: {
		addInfo() {
			this.$Modal.open('system/roles/modal/role-info.vue@modal', {
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show('添加权限组','add')
			})
		},
		selectPers(row) {
			this.$Modal.open('system/roles/modal/select-pers.vue@modal', {
				props: {
					perList: row.pers,
					type: 'role',
					id: row.rid
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`修改权限【${row.role_name}】`)
			})
		},
		editInfo(row) {
			this.$Modal.open('system/roles/modal/role-info.vue@modal', {
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
				modal.show(`编辑权限组【${row.role_name}】`,'edit')
			})
		},
		deleteInfo(row) {
			this.confirm(`确认删除权限组【${row.role_name}】`)
            .then(() => {
                this.deleteInfoAction(row);
            })
		},
		deleteInfoAction(row) {
			this.axios.request({
				url: 'fapi/roles/' + row.rid,
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
            let reverseList = data.list.reverse();
            this.$emit('setRole', reverseList[0].rid, reverseList[0].role_name);
            return reverseList
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

<style>

</style>

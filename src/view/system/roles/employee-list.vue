<style scoped>
.list-title {
    font-weight: bold;
    font-size: 14px;
}
</style>


<template>
    <div>
        <div class="toolbar">
            <span class="list-title">[{{roleName}}]成员列表</span>
			<select-employee class="ml-2" v-model="eids" style="width: 30px" @select="addInfo">
				<Button type="primary" icon="md-add">添加成员</Button>
			</select-employee>
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
</template>

<script>
import grid from '@/libs/grid.mixin'
import common from '@/libs/common.mixin'
import SelectEmployee from 'c%/SelectEmployee'

export default {
	mixins: [grid, common],
	components: {
		SelectEmployee
	},
    props: {
        rid: {
            type: Number,
            default: 0
        },
        roleName: {
            type: String,
            default: ''
        }
    },
	data() {
		return {
			rest_api: 'employees',
			column_keys: {
				ename: {
					title: '姓名',
					show: true
				},
				account: {
					title: '用户名',
					show: true
				},
				op: {
					title: '操作',
					show: true
				}
			},
			column_render: {
				account(h, params) {
					return h('span', this.$filter('nonEmpty')(params.row.account))
				},
				op(h, params) {
					return h('Button', {
                        props: {
                            shape: 'circle',
                            icon: 'ios-trash',
                            size: 'small'
                        },
                        attrs: {
                            title: '删除'
                        },
                        on: {
                            click: () => {
                                this.deleteInfo(params.row);
                            }
                        }
                    })
                }
			},
			eids: []
		}
	},
    watch: {
        rid() {
            this.init_data();
		}
    },
	methods: {
		addInfo(eids) {
			let [method, url, msg] = ['post', 'roles/' + this.rid + '/employees', '添加成功'];

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: {
					eids: eids
				}
			})
			.then(res => {
				this.$Message.success(msg);
				this.init_data();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		},
		deleteInfo(row) {
			this.confirm(`确认在${this.roleName}中删除成员【${row.ename}】`)
            .then(() => {
                this.deleteInfoAction(row);
            })
		},
		deleteInfoAction(row) {
			let [method, url, msg] = ['put', 'employees/' + row.eid, '删除成功'];

			let deleteIndex = row.rids.findIndex((value) => {
				return value == this.rid
			})
			
			if(deleteIndex != -1) {
				row.rids.splice(deleteIndex, 1);
			}

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: {
					employee: row
				}
			})
			.then(res => {
				this.$Message.success(msg);
				this.init_data();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
        },
        hook_get_param(params) {
			params.rids = this.rid;
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

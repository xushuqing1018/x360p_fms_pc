<style scoped>
.list-header {
    margin-bottom: 5px;
}

.simple-table {
    min-height: auto;
}

.simple-table >>> .ivu-table-row {
    cursor: pointer;
}

.simple-table >>> .ivu-table-body {
    overflow-x: unset;
}

.add-box {
    text-align: center;
    margin-top: 5px;
}
</style>

<template>
    <div class="simple-list">
        <div class="list-header">
            <Input
                class="fiter"
                v-model="filterWord"
                size="small"
                :placeholder="'请输入' + itemName + '筛选'"
            />
        </div>
        <div class="list-content">
            <Table
                :style="simpleTableStyle"
                class="simple-table"
                :columns="columns"
                :data="filterData"
                size="small"
                :show-header="false"
                highlight-row
                disabled-hover
                :no-data-text="'暂无' + itemName + '数据'"
                :row-class-name="handleRowClassName"
                @on-row-click="handleRowClick"
            >
            </Table>
            <div class="add-box">
                <ButtonGroup size="small">
                    <Button icon="md-add" @click="$emit('on-add')"></Button>
                    <Button icon="md-trash" type="error" @click="handleDelete" :disabled="currentIndex == -1"></Button>
                </ButtonGroup>
            </div>
        </div>
    </div>
</template>

<script>
import common from '@/libs/common.mixin'

export default {
    name: 'SimpleList',
    mixins: [common],
    // 事件
    // on-add 点击添加按钮
    // on-delete 点击删除按钮
    // on-row-change 选中行改变
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        height: {
            type: [Number, String],
            default: 400
        },
        itemName: {
            type: String,
            default: '信息'
        },
        itemField: {
            type: String,
            default: 'name'
        }
    },
    data() {
        const vm = this;

        return {
            filterWord: '',
            columns: [
                {
                    render: (h, params) => {
                        let nameEl = h('span', params.row[this.itemField])
                        let iconEl = h('Icon', {
                            props: {
                                type: 'ios-arrow-forward'
                            },
                            style: {
                                position: 'absolute',
                                right: '0px',
                                top: '3px'
                            }
                        })
                        if(params.index == this.currentIndex) {
                            return h('div', {
                                style: {
                                    position: 'relative',
                                }
                            }, [nameEl, iconEl])
                        }
                        else {
                            return h('div', {
                                style: {
                                    position: 'relative',
                                }
                            }, [nameEl])
                        }
                    }
                }
            ],
            tableData: [],
            firstLoad: true,
            currentIndex: -1,
            currentRow: {},
            simpleTableStyle: {
                maxHeight: this.height + 'px',
                overflowY: 'auto'
            }
        }
    },
    computed: {
        filterData() {
            let filterWord = this.filterWord,
                itemField = this.itemField;
            return this.tableData.filter(item => {
                return item[itemField].indexOf(filterWord) != -1
            })
        }
    },
    created() {
        this.tableData = this.data;
        if(this.data.length > 0) {
            this.currentIndex = 0;
            this.currentRow = this.data[0];
        }
        else {
            this.currentIndex = -1;
            this.currentRow = {};
        }
    },
    watch: {
        data(val) {
            this.tableData = val;
            if(this.data.length > 0) {
                this.currentIndex = 0;
                this.currentRow = this.data[0];
            }
            else {
                this.currentIndex = -1;
                this.currentRow = {};
            }
            this.firstLoad = true;
        },
        filterWord(val) {
            this.firstLoad = false;
            this.currentIndex = -1;
        }
    },
    methods: {
        handleRowClassName(row, index) {
            if(this.firstLoad&&index == 0) {
                return 'ivu-table-row-highlight'
            }
        },
        handleRowClick(row, index) {
            if(this.firstLoad) {
                this.firstLoad = false;
            }
            if(this.currentIndex != index) {
                this.currentIndex = index;
                this.currentRow = row;
                this.$emit('on-row-change', row);
            }
        },
        handleDelete() {
            this.confirm(`确认删除${this.itemName}【${this.currentRow[this.itemField]}】`)
            .then(() => {
                this.$emit('on-delete', this.currentRow);
            })
        }
    }
}
</script>

<template>
    <div class="c-grid">
        <div class="box box-query">
            <Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row">
                <Form-item label="课案主题" prop="topic" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.topic" placeholder="请输入课案主题" @on-enter="search"></Input>
                </Form-item>

                <Form-item label="时间范围" prop="int_day" class="col-md-3 col-sm-6">
                    <date-range-picker
                            v-model="search_field.int_day"
                            @on-change="search"
                            label="选择完成日期"
                            placement="bottom"
                            style="width:100%">
                    </date-range-picker>
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
                <!--<export-button class="ml-2" res="course_cases" :params="params"></export-button>-->
            </div>
        </div>


        <div class="box box-result">
            <div class="toolbar">
                <Button class="ml-2" type="primary" icon="md-add" @click="addInfo">添加课案主题</Button>
                <Button type="ghost" style="color:#666;" @click="lookUpTitle">课案标题</Button>
            </div>
            <div class="content">
                <div class="content-body">
                    <Table
                            v-loading.like="'course_case_topics'"
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
    import ExportButton from 'c%/ExportButton.vue'
    import DateRangePicker from 'c%/DateRangePicker.vue'

    const defaultSearchField = {
        topic: '',
        int_day: '',
    }

    export default {
        mixins: [grid, common, globals],
        components: {
            ExportButton,
            DateRangePicker,
        },
        data() {
            return {
                rest_api: 'course_case_topics',
                search_field: { ...defaultSearchField },

                column_keys: {
                    topic: {
                        title: '课案主题',
                        show: true,
                    },
                    ft_name: {
                        title: '培训安排',
                        show: true,
                    },
                    start_int_day: {
                        title: '开始日期',
                        show: true
                    },
                    end_int_day: {
                        title: '结束日期',
                        show: true
                    },

                },
                column_render: {
                    topic(h, params) {
                        return h('router-link', {
                            props: {
                                to: `/aftersale/course/`+params.row.cct_id
                            }
                        }, params.row.topic)
                    },
                    start_int_day(h, params) {
                        return h('span', params.row.start_int_day)
                    },
                    end_int_day(h, params) {
                        return h('span', params.row.end_int_day)
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
            }
        },
        computed: {

        },
        created(){

        },
        mounted() {
            this.init_data();
        },
        watch: {

        },
        methods: {
            lookUpTitle () {
                let title = '课案标题'
                this.$Modal.open('aftersale/course/modal/title-modal.vue',{
                    on: {
                        'on-success': () => {
                            this.init_data()
                        }
                    }
                })
                .then(modal => {
                    modal.show(title)
                })
            },
            addInfo() {
                this.$Modal.open('aftersale/course/modal/course-info.vue@modal', {
                    on: {
                        update: () => {
                            this.init_data();
                        }
                    }
                })
                    .then(modal => {
                        modal.show('课案集','add')
                    })
            },
            editInfo(row) {
                this.$Modal.open('aftersale/course/modal/course-info.vue@modal', {
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
                        modal.show(`编辑会议主题【${row.topic}】`,'edit')
                    })
            },
            deleteInfo(row) {
                this.$Modal.confirm({
                    title: `确认删除会议主题【${row.topic}】`,
                    onOk:() => {
                        this.deleteInfoAction(row);
                    }
                })
            },
            deleteInfoAction(row) {
                this.axios.request({
                    url: 'fapi/course_case_topics/' + row.cct_id,
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
                    else if(o=='int_day'){
                        if(property!=','&&property.length>0){
                            params['start_date'] = property[0]
                            params['end_date']   = property[1]
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

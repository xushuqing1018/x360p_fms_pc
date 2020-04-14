<template>
    <div class="c-grid">
        <div class="box box-query">
            <Form ref="ref_search" :model="search_field" :label-width="100" class="filter-form row">
                <Form-item label="盟商名称/简称" prop="org_name" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.org_name" @on-enter="search" placeholder="盟商名称/简介"></Input>
                </Form-item>
                <Form-item label="运营状态" prop="status" class="col-md-3 col-sm-6">
                    <Select v-model="search_field.status">
                        <Option value="">不限</Option>
                        <Option :value="index" v-for="(val,key,index) in business_status_list">{{val}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="合同到期日期" prop="expire" class="col-md-3 col-sm-6">
                    <Select v-model="search_field.expire">
                        <Option value="1w">一周内到期</Option>
                        <Option value="1m">一个月内到期</Option>
                        <Option value="3m">三个月内到期</Option>
                        <Option value="ex">已到期</Option>
                    </Select>
                </Form-item>
                <Form-item label="系统沟通状态" prop="system_status_did" class="col-md-3 col-sm-6">
                    <Select v-model="search_field.system_status_did">
                        <Option value="">不限</Option>
                        <Option :value="item.did" v-for="item in franchisee_status_list">{{item.title}}</Option>
                    </Select>
                </Form-item>

                <template v-if="searchExpand">
                    <Form-item label="系统类型" prop="org_type" class="col-md-3 col-sm-6">
                        <Select v-model="search_field.org_type">
                            <Option value="">不限</Option>
                            <Option value="0">未开通</Option>
                            <Option value="1">正式版</Option>
                            <Option value="2">督导版</Option>
                        </Select>
                    </Form-item>

                    <Form-item label="督导版开通" prop="trial_int_day" class="col-md-3 col-sm-6">
                        <date-range-picker
                                v-model="search_field.trial_int_day"
                                @on-change="search"
                                label="选择日期"
                                placement="bottom"
                                style="width: 100%;">
                        </date-range-picker>
                    </Form-item>
                    <Form-item label="正式版开通" prop="formal_int_day" class="col-md-3 col-sm-6">
                        <date-range-picker
                                v-model="search_field.formal_int_day"
                                @on-change="search"
                                label="选择日期"
                                placement="bottom"
                                style="width: 100%;">
                        </date-range-picker>
                    </Form-item>
                </template>
            </Form>
            <Row class="basic">
                <Col span="24" class="mt-2">
                <Button-group>
                    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
                    <Button type="primary" @click="toggleSearch"><Icon :type="toggleSearchIcon"></Icon></Button>
                </Button-group>
                <Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                <export-button res="report_franchisees" :params="params"></export-button>

                </Col>
            </Row>
        </div>


        <div class="box box-result">
            <div class="toolbar">
                <filter-column :keys="column_keys"></filter-column>
            </div>
            <div class="content">
                <div class="content-body">
                    <Table
                            v-loading.like="'report_branch_summarys'"
                            :page-size="pageSize"
                            :page="pageIndex"
                            :stripe="true"
                            :show-header="true"
                            :data="data"
                            :columns="columns"
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
    import util,{_} from '@/libs/util'
    import grid from '@/libs/grid.mixin'
    import common from '@/libs/common.mixin'
    import globals from '@/libs/globals.mixin'
    import ExportButton from 'c%/ExportButton.vue'
    import DateRangePicker from 'c%/DateRangePicker.vue'
    import SelectEmployee from 'c%/SelectEmployee.vue'
    export default{
        mixins: [grid,common,globals],
        components: {
            ExportButton,
            SelectEmployee,
            DateRangePicker
        },
        data () {
            return {
                rest_api: 'franchisees',
                pk: 'fc_id',
                type_franch: '',
                per: 'franchisee.all',

                search_field: {
                    org_name: '',
                    status: -1,
                    expire: 0,
                    eid: 0,
                    int_day: [],
                    short_name: '',
                    trial_int_day: [],
                    formal_int_day:[],
                },
                column_keys: {
                    org_name: {
                        title: '盟商名称',
                        width: 250,
                        show: true,
                    },
                    short_name: {
                        title: '盟商简称',
                        width: 150,
                        show: true,
                    },
                    mobile: {
                        title: '中心座机',
                        show: true,
                    },
                    org_email: {
                        title: '企业邮箱',
                        show: true,
                    },
                    system_status_did: {
                        title: '系统沟通状态',
                        show: true,
                    },
                    org_type: {
                        title: '系统类型',
                        show: true,
                    },
                    status: {
                        title: '运营状态',
                        show: true,
                    },
                    student_nums: {
                        title: '学员名单数',
                        show: true,
                    },
                    last_login_time: {
                        title: '最后登录时间',
                        show: true,
                    },
                },
                column_render: {
                    system_status_did (h,params) {
                        return h('span',this.$filter('dict_title')(params.row.system_status_did,'system_status'))
                    },
                    org_type (h,params) {
                        let map = {
                            0:{label: '未开通',color: 'text-danger'},
                            1:{label: '正式版',color: 'text-success'},
                            2:{label: '督导版',color: 'text-success'}
                        }
                        return h('span',{
                            class: map[params.row.org_type].color
                        },map[params.row.org_type].label)
                    },
                    status (h,params) {
                        return h('span',this.$filter('business_status')(params.row.status))
                    },
                }
            }
        },
        mounted() {
            this.init_data()
        },
        methods: {
            refreshData() {
                this.search_field.refresh = 1;
                this.init_data();
            },
            hook_get_param (params) {
                let search_obj = util.copy(this.search_field)
                for(let o in search_obj) {
                    let property = search_obj[o]
                    if(o=='trial_int_day'){
                        if(property!=','&&property.length>0){
                            params['trial_start_date'] = property[0]
                            params['trial_end_date']   = property[1]
                        }
                    }
                    else if(o=='formal_int_day'){
                        if(property!=','&&property.length>0){
                            params['formal_start_date'] = property[0]
                            params['formal_end_date']   = property[1]
                        }
                    }
                    else{
                        if(property!=-1){
                            params[o] = property
                        }
                    }
                }
            },
            resetSearch () {
                this.$form('ref_search').reset()
                this.init_data()
            }
        },
        computed: {
            franchisee_status_list() {
                return this.$store.state.gvars.dicts.system_status
            },

        }
    }
</script>

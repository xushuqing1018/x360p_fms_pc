<template>
    <div class="c-grid">
        <div class="box box-query">
            <Form ref="ref_search" :model="search_field" :label-width="100" class="filter-form row">
                <Form-item label="盟商名称/简称" prop="org_name" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.org_name" @on-enter="search" placeholder="盟商名称/简介"></Input>
                </Form-item>
                <Form-item label="姓名" prop="name" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.name" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="用户名" prop="account" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.account" placeholder="请输入用户名"></Input>
                </Form-item>
                <Form-item label="手机号" prop="mobile" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.mobile" placeholder="请输入手机号"></Input>
                </Form-item>


                <template v-if="searchExpand">
                    <Form-item label="用户类型" prop="reg_type" class="col-md-3 col-sm-6">
                        <Select v-model="search_field.reg_type">
                            <Option value="">不限</Option>
                            <Option value="1">会员</Option>
                            <Option value="2">非会员</Option>
                            <Option value="3">斯玛特员工</Option>
                            <Option value="4">咨询加盟</Option>
                        </Select>
                    </Form-item>
                    
                    <Form-item label="用户来源" prop="user_from" class="col-md-3 col-sm-6">
                        <Select v-model="search_field.user_from">
                            <Option value="">不限</Option>
                            <Option value="1">云课堂</Option>
                            <Option value="2">学习管家</Option>
                        </Select>
                    </Form-item>

                    <Form-item label="注册日期" prop="create_time" class="col-md-3 col-sm-6">
                        <date-range-picker
                                v-model="search_field.create_time"
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
                <export-button res="users" :params="params"></export-button>
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
                            v-loading.like="'users/cloudclass_users'"
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
    export default{
        mixins: [grid,common,globals],
        components: {
            ExportButton,
            DateRangePicker
        },
        data () {
            return {
                rest_api: 'users/cloudclass_users',
                search_field: {

                },
                column_keys: {
                    account: {
                        title: '用户名',
                        width: 150,
                        show: true,
                    },
                    name: {
                        title: '姓名',
                        show: true,
                    },
                    sex:{
                        title: '性别',
                        show: true,
                    },
                    birth_time:{
                        title:'出生日期',
                        show:true
                    },
                    family_rel:{
                        title:'监护关系',
                        show:true
                    },
                    mobile: {
                        title: '电话',
                        show: true,
                    },
                    reg_area:{
                        title:'地区',
                        show:true
                    },
                    reg_type: {
                        title: '用户类型',
                        show: true,
                    },
                    org_name: {
                        title: '盟商',
                        show: true,
                    },
                    short_name:{
                        title: '简称',
                        show:true
                    },
                    create_time: {
                        title: '注册日期',
                        show: true,
                    },
                    login_times: {
                        title: '登录次数',
                        show: true,
                        sortable:'custom'
                    },
                },
                column_render: {
                    reg_type (h,params) {
                        let map = {
                            1:{label: '会员'},
                            2:{label: '非会员'},
                            3:{label: '斯玛特员工'},
                            4:{label: '咨询加盟'},
                        }
                        return h('span',map[params.row.reg_type].label)
                    },

                },
                operation_keys: {
                  edit: {
                   	title: '编辑',
                   	type: 'md-create',
                   	per: 'cloudclass.edit'
                  },
                  delete: {
                   	title: '删除',
                   	type: 'ios-trash',
                   	per: 'cloudclass.delete'
                  },
                  assign: {
                   	title: '分配',
                   	type: 'md-create',
                   	per: 'cloudclass.assign',
                  },
                  reset: {
                   	title: '重置密码',
                   	type: 'md-create',
                   	per: 'cloudclass.reset'
                  },
                },
                operation_func: {
                  edit(params) {
                      this.editInfo(params.row);
                  },
                  delete(params) {
                      this.deleteInfo(params.row);
                  },
                  assign(params) {
                      this.assignInfo(params.row);
                  },
                  reset(params) {
                      this.resetPwd(params.row);
                  },
                }
            }
        },
        mounted() {
            this.init_data()
        },
        methods: {
            editInfo (row) {
                this.$Modal.open('cloudclass/user/info-modal.vue@modal', {
                  on: {
                    "on-success": () => {
                      this.init_data()
                    }
                  }
                })
                .then(modal => {
                  modal
                    .set('item', row)
                    .show(`编辑用户信息【${row.name}】`, 'edit')
                })
            },
            assignInfo (row) {
                this.$Modal.open('cloudclass/user/assign-modal.vue@modal', {
                  on: {
                    "on-success": () => {
                      this.init_data()
                    }
                  }
                })
                .then(modal => {
                  modal
                    .set('item', row)
                    .show(`重新分配用户【${row.name}】`, 'edit')
                })
            },
            deleteInfo(row) {
                this.$Modal.confirm({
                    title: `确认删除用户【${row.name}】`,
                    onOk:() => {
                        this.deleteInfoAction(row);
                    }
                })
            },
            resetPwd(row) {
                this.$Modal.confirm({
                    title: `确认重置账号为【${row.account}】的密码吗？重置后密码为【123456】`,
                    onOk:() => {
                        this.resetPwdAction(row);
                    }
                })
            },
            deleteInfoAction(row) {
                this.axios.request({
                    url: 'fapi/users/' + row.uid,
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
            resetPwdAction(row) {
                this.axios.request({
                    url: 'fapi/users/' + row.uid + '/reset_pwd',
                    method: 'post'
                })
                    .then(res => {
                        this.$Message.success('重置成功');
                        this.init_data();
                    })
                    .catch(res => {
                        this.$Message.error(res.data.message);
                    })
            },
            refreshData() {
                this.search_field.refresh = 1;
                this.init_data();
            },
            hook_get_param (params) {
                let search_obj = util.copy(this.search_field)
                for(let o in search_obj) {
                    let property = search_obj[o]
                    if(o=='create_time'){
                        if(property!=','&&property.length>0){
                            params[o] = util.sprintf('[Between,%s]',property.join(','))
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

        }
    }
</script>

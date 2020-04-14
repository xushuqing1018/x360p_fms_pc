<template>
    <div class="c-grid">
        <div class="box box-query">
            <Form ref="ref_search" :model="search_field" :label-width="70" class="filter-form row">
                <Form-item label="课标标题" prop="title" class="col-md-3 col-sm-6">
                    <Input v-model="search_field.title" placeholder="请输入课标标题" @on-enter="search"></Input>
                </Form-item>

                <Form-item label="分类" prop="vc_id" class="col-md-3 col-sm-6">
                    <Select v-model="search_field.vc_id">
                        <Option value="">不限</Option>
                        <Option v-for="(item,index) in type_list" :key="index" :value="item.vc_id">{{item.cate_name}}</Option>
                    </Select>
                </Form-item>
                <template v-if="searchExpand">
                </template>
            </Form>
            <div class="mt-2">
                <Button-group>
                    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
                </Button-group>
                <Button class="ml-2" type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
                <!--<export-button class="ml-2" res="course_cases" :params="params"></export-button>-->
            </div>
        </div>
        <div class="box box-result">
            <div class="toolbar">
                <div class="toolbar">
	                <Button class="ml-2" type="primary" icon="md-add" @click="addInfo">添加课标</Button>
	                <Button type="ghost" style="color:#666;" @click="lookUpType">分类设置</Button>
	      		</div>
                <filter-column class="mr-2" :keys="column_keys"></filter-column>
            </div>
            <div class="content">
                <div class="content-body">
                    <Table
                            v-loading.like="'vod_files'"
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
        title: '',
        vc_id: 0,
    }

    export default {
        mixins: [grid, common, globals],
        components: {
            ExportButton,
            DateRangePicker,
        },
        data() {
            return {
                rest_api: 'vod_files',
                search_field: { ...defaultSearchField },
                type_list: [],

                column_keys: {
                    title: {
                        title: '课标标题',
                        show: true,
                    },
                    cate_name :{
                        title: '类型',
                        show: true,
                        width:150
                    },
                    grade_section:{
                        title: '年龄段',
                        show: true,
                        width:80
                    },
                    is_hidden:{
                        title: '状态',
                        show: true,
                        width:80,
                        sortable:'custom'
                    },
                    external_url:{
                        title: '链接地址',
                        show: true,
                        width:250,
                    },
                    view_nums:{
                        title: '观看次数',
                        show: true,
                        width:120,
                        sortable:'custom'
                    },
                    vid: {
                        title: '视频ID',
                        show: true
                    },
                    free_expire_time: {
                        title: '免费有效期',
                        show: true
                    },
                    desc:{
                        title: '描述',
                        show: false
                    }

                },
                column_render: {
                    is_hidden (h,params) {
                    	let map = {
                    		0:{label: '显示',color: 'text-success'},
                    		1:{label: '隐藏',color: 'text-danger'},
                    	}
                    	return h('span',{
                    		class: map[params.row.is_hidden].color
                    	},map[params.row.is_hidden].label)
                    },

                },
                operation_keys: {
                    play:{
                        title: '播放',
                        type: 'md-arrow-dropright-circle'
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
                    edit(params) {
                        this.editInfo(params.row);
                    },
                    delete(params) {
                        this.deleteInfo(params.row);
                    },
                    play(params){
                        this.playVod(params.row)
                    }
                },
            }
        },
        computed: {

        },
        created(){
            this.get_type_list();
        },
        mounted() {
            this.init_data();

        },
        watch: {

        },
        methods: {
            get_type_list(){
                this.$rest('vod_cates')
                .get()
                .success(res => {
                    this.type_list = res.list
                })
            },
        	init_cate_name () {
		        this.$rest("vod_cates")
	            .get()
	            .success((response)=>{
		            let emptyArray = []
		            this.cate_name_list = response.list
	            })
	            .error((response)=>{
	                this.error(response.body.message)
	            })
		    },
        	lookUpType () {
		        let title = '分类类型'
		        this.$Modal.open('aftersale/vod/modal/type-modal.vue',{
		            on: {
		                'on-success': () => {
		                    this.init_cate_name()
		                }
		            }
		        })
		        .then(modal => {
		            modal.show(title)
		        })
		    },
            addInfo() {
                this.$Modal.open('aftersale/vod/modal/vod-info.vue@modal', {
                    on: {
                        "on-success": () => {
                            this.init_data();
                        }
                    }
                })
                    .then(modal => {
                        modal.show('总部课标','add')
                    })
            },

            editInfo (row) {
                this.$Modal.open('aftersale/vod/modal/vod-info.vue@modal', {
                  on: {
                    "on-success": () => {
                      this.init_data()
                    }
                  }
                })
                .then(modal => {
                  modal
                    .set('item', row)
                    .show(`编辑总部课标【${row.title}】`, 'edit')
                })
            },

            playVod (row) {
                this.$rest('vod_files')
                .add_url_param(row.vf_id,'auth')
                .get()
                .success(data=>{
                    this.openVod(data)
                })
                .error(response=>{

                })
            },
            openVod(data){
                this.$Modal.open('aftersale/vod/modal/play-modal.vue@modal',{
                    props:{
                        videoInfo:data
                    }
                })
                .then(modal => {

                    modal.show(data.VideoMeta.Title,'add')
                })
            },
            deleteInfo(row) {
                this.$Modal.confirm({
                    title: `确认删除总部课标【${row.title}】`,
                    onOk:() => {
                        this.deleteInfoAction(row);
                    }
                })
            },
            deleteInfoAction(row) {
                this.axios.request({
                    url: 'fapi/vod_files/' + row.vf_id,
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

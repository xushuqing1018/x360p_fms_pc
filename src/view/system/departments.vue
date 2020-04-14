<style scoped>
.title {
	font-weight: bold;
	font-size: 15px;
	line-height: 50px;
}
</style>


<template>
	<div class="c-grid row">		
		<div class="col-md-12" style="padding-right:0">
	        <div class="box" style="height:99%">
				<span class="title">
					<Icon style="position: relative;top: -2px;" type="md-list" />加盟商管理系统部门列表
				</span>
	            <tree-grid :columns="columns_dept" :items="data" @btn-click="btnClick" empty-text="当前还没有任何部门!"/>
	        </div>
        </div>
        <!-- <branchs ref="branchs" class="col-md-7" @on-success="init_data"></branchs> -->
        <info-modal ref="ref_info" @save="refresh"></info-modal>
	</div>
</template>
<script>
	import Auth from '@/libs/auth'
    import util from '@/libs/util'
    import grid from '@/libs/grid.mixin'
    import directive from '@/libs/directive.mixin'
    import globals from '@/libs/globals.mixin'
    import common from '@/libs/common.mixin'
    import TreeGrid from 'c%/TreeGrid.vue'
	import branchs from './departments/branchs.vue'
    import InfoModal from './departments/info-modal'
	
    export default {
        mixins:[grid,globals,common,directive],
        components: {
        	branchs,
            TreeGrid,
            InfoModal
        },
        data () {
            return {
                rest_api: 'departments',
                datakey: 'dept',
                pk: 'dpt_id',
                showIndex: false,
                dept: {
                    dpt_name: '',
                    dpt_type: '',
                    pid: ''
                },
                dataList: [],
                columns_dept: [
                    {
                        title: '部门名称',
                        key: 'dpt_name'
                    }, 
                    {
                        title: '类型',
                        key: 'dpt_type',
                        width: '80'
                    }, 
                    {
                        title: '操作',
                        type: 'action',
                        actions: [
                            {
                                icon: 'md-add',
                                text: '添加部门',
                                type: 'add',
                                per: 'departments.add'
                            },
                            {
                                icon: 'md-create',
                                text: '编辑',
                                type: 'edit',
                                per: 'departments.edit'
                            }, 
                            {
                                icon: 'ios-trash',
                                text: '删除',
                                type: 'delete',
                                per: 'departments.delete'
                            }
                        ],
                        width: '120'
                    }
                ]
            }
        },
        methods:{
            deal_data(data) {
                this.expandList(data.list)
                return data.list
            },
            expandList(list){
                list.forEach(item=>{
                    item.expanded = true
                    item.isShow   = true
                    if(item.children){
                        this.expandList(item.children)
                    }
                })
            },
            btnClick(data, event, index, type) {
                if(type == 'add') {
                    this.dept.pid = data.dpt_id
                    this.$refs['ref_info'].set('info',this.dept).show('添加部门','add')

                }else if(type == 'edit') {
                    this.$refs['ref_info'].set('info',data).show('编辑部门','edit')

                }else{

                    if(data.children) {
                        this.$Message.error('请先删除下级部门')
                        return false
                    }
                    this.confirm('您确定要删除【'+data.dpt_name+'】吗?')
                    .then(() => {
                        this.delete(data)
                        .then((response) => {
                            this.$store.dispatch('updateGlobalVar','branchs')
                            this.$store.dispatch('updateGlobalVar','departments')
                            this.$refs['branchs'].init_data()
                        })
                    })
                    .catch(() => {
                        
                    })
                }
            },
            refresh() {
                this.init_data()
                this.$refs['branchs'].init_data()
            }
        },
        mounted(){
            this.pageSize = 500
            this.init_data()
        },        
        computed: {
        	
        },
        watch: {
            
        }
    }
</script>

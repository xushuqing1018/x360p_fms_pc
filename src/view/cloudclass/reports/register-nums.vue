<template>
	<div class="c-grid">
		<div class="box box-query">
			<Form ref="ref_search" :model="search_field" :label-width="80" class="filter-form row">
                <Form-item label="校区名称" prop="org_name" class="col-sm-3">
					<Input v-model="search_field.org_name" placeholder="校区名称"></Input>
				</Form-item>
				<Form-item label="日期" prop="int_day" class="col-sm-3">
					<date-range-picker
						v-model="search_field.int_day"
						@on-change="search"
						label="选择日期"
						placement="bottom"
                        style="width: 310px;">
					</date-range-picker>
				</Form-item>
			</Form>
			<Row class="basic">
	            <Col span="24" class="mt-2">
				    <Button-group>
					    <Button class="ml-2" type="primary" @click="search" icon="ios-search">查询</Button>
				    </Button-group>
                	<Button type="primary" icon="md-refresh" @click="resetSearch">重置</Button>
	            </Col>
	        </Row>         
		</div>
		<div class="box box-result">
	        <div class="content">
				<div class="content-body">
			        <table class="modal-table">
	            		<thead>
	            			<tr>
	            				<th><div class="ivu-table-cell">#</div></th>
								<th><div class="ivu-table-cell">校区名称</div></th>
                                <th><div class="ivu-table-cell">合计</div></th>
                                <th v-for="(item,index) in week_section" :key="index">
                                    <div class="ivu-table-cell">第{{item.week}}周</div>
                                </th>
	            			</tr>
	            		</thead>
	            		<tbody>
                            <template v-if="show">
                                <tr>
	            				    <td colspan="10" align="center" style="height:300px;">
                                        <span class="loading-gif"></span>
                                    </td>
	            			    </tr>
                            </template>
                            <template v-else>
                                <tr v-for="(item,index) in data" :key="index">
                                    <td><div class="ivu-table-cell">{{(index + 1) + (pageIndex - 1) * 10}}</div></td>
                                    <td><div class="ivu-table-cell">{{item.org_name}}</div></td>
                                    <td><div class="ivu-table-cell">{{init_total(item.week_section)}}</div></td>
                                    <td v-for="(i,k) in item.week_section" :key="k">
                                        <div class="ivu-table-cell">{{i.reg_nums}}</div>
                                    </td>
                                </tr>
                                <tr v-if="data.length != 0">
                                    <td><div class="ivu-table-cell"></div></td>
                                    <td><div class="ivu-table-cell">合计</div></td>
                                    <td><div class="ivu-table-cell">{{init_sum_total(week_section)}}</div></td>
                                    <td v-for="(item,index) in week_section" :key="index">
                                        <div class="ivu-table-cell">{{item.total_num}}</div>
                                    </td>
                                </tr>
	            			    <tr v-if="data.length == 0">
	            			    	<td colspan="20" align="center"><div class="ivu-table-cell">没有数据哦</div></td>
	            			    </tr>
                            </template>
	            		</tbody>
	            	</table>
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
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import globals from '@/libs/globals.mixin'
	import common from '@/libs/common.mixin'
    import DateRangePicker from 'c%/DateRangePicker.vue'
	
	export default{
		mixins: [grid,common,globals],
		components: {
            DateRangePicker
        },
        props:{
            reg_type:{
                type:Number,
                default:0
            }
        },
		data () {
			return {
				search_field: {
                    org_name:'',
					int_day: []
                },
                data:[],
                week_section:[],
                show:true
			}
        },
        watch: {
            reg_type:{ 
                handler (newV, oldV) {
                    this.init_data()
                },
                deep:true
            }
        },
        computed:{
            init_total(){
                return function(item){
                    let ret = 0

                    item.forEach(x => {
                        ret += x.reg_nums
                    })

                    return ret
                }
            },
            init_sum_total(){
                return function(item){
                    let ret = 0

                    item.forEach(x => {
                        ret += x.total_num
                    })

                    return ret
                }
            }
        },
		mounted() {
			this.init_data()
		},
		methods: {
            init_data(){
                this.show = true
                this.$rest('report_cloud_classes/register_nums')
				.get(this.hook_get_param())
				.success(res => {
                    this.data = res.list
                    this.week_section = res.week_section
                    this.pageSize = res.pagesize
                    this.pageIndex = res.page
                    this.total = res.total
                    this.show = false
				})
				.error(res => {
					this.$Message.error(res.body.message)
				})
            },
            hook_get_param(){
                let params = {}

				let search_obj = util.copy(this.search_field)
				for(let o in search_obj) {
					let property = search_obj[o]
					if(o=='int_day'){
						if(property!=','&&property.length>0){
							params['start_date'] = property[0]
					     	params['end_date']   = property[1]
						}												
					}else{
						if(property&&property!=-1){
							params[o] = property	
						}		
					}									
				}
                
                params.reg_type = this.reg_type
                params.page = this.pageIndex
                params.pagesize = this.pageSize

                return params
            },
			resetSearch () {
				this.$form('ref_search').reset()
				this.init_data()
			}
		}
	}
</script>

<style scoped>
    .loading-gif{
        display: inline-block;
        width: 32px;
        height: 32px;
        background: url(/img/loading.34bbb646.gif) 0 0 no-repeat;
        vertical-align: middle;
    }
</style>
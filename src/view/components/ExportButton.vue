<style lang="less">
.export-button{
	margin-left:5px;
	.dropdown-item-wrap{
		max-height:300px;
		overflow:scroll;
	}
}
</style>
<template>
	<Dropdown class="export-button">
        <Button type="primary">
        	<Icon type="ios-download-outline"></Icon>
            {{text}}
            <div style="display:none;">
				<form :name="form_name" method="post" target="frameName" :action="export_uri">
					<input type="hidden" name="token" :value="token">
		            <input type="hidden" name="resource" :value="res">
		            <input type="hidden" name="export_title" :value="exportTitle">
		            <input type="hidden" name="page" :value="exportPage" v-if="exportPage > 0">
		            <input type="hidden" name="pagesize" :value="exportPageSize" v-if="exportPageSize > 0">
					<input type="hidden" v-for="(val,key) in export_params" :name="key" :value="val">
				</form>
				<iframe src="" frameborder="0" name="frameName"></iframe>
			</div>
        </Button>
        <DropdownMenu slot="list">
        	<DropdownItem @click.native="export_all" v-if="!is_async">导出所有</DropdownItem>
            <DropdownItem @click.native="export_current_page">导出当前页</DropdownItem>
            <div class="dropdown-item-wrap" v-if="split_pages.length > 0">
            <DropdownItem @click.native="export_define_page(item.page,item.pagesize,item.text)" v-for="(item,index) in split_pages">导出{{item.text}}</DropdownItem>
        	</div>
            
        </DropdownMenu>
    </Dropdown>
</template>

<script>
	import util from '@/libs/util'
	import {_} from '@/libs/util'
	export default {
		name:'ExportButton',
		props:{
			text:{
				type:String,
				default:'导出'
			},
			res:{
				type:String,
				required:true
			},
			params:{
				type:Object,
				default:function(){
					return {}
				}
			},
			type:{
				type:String,
				default:'primary'
			},
			errorMsg: {
				type:String,
				default:'参数错误'
			},
			disabled: {
				type:Boolean,
				default:false
			},
			maxSyncNums:{
				type:Number,
				default:3000
			},
			total:{
				type:Number,
				default:0
			},
			splitSize:{
				type:Number,
				default:500
			}
		},
		data(){
			return {
				exportPage:0,
				exportPageSize:0,
				exportTitle:''
			}
		},
		methods:{
			do_export(){
				if(_.isEmpty(this.params)) {
					this.$Message.error(this.errorMsg)
				}else{
					if(this.is_async){
						this.do_async_export()
					}else{
						this.do_sync_export()
					}
					
				}
			},
			do_async_export(){
				let post = util.copy(this.export_params)
				post.res_name = this.res
				this.$rest('data_exports')
				.post(post)
				.success(response=>{
					this.$store.commit('addExportTask',response)
				})
				.error(response=>{
					this.$Message.error(response.body.message)
				})
			},
			do_sync_export(){
				setTimeout(()=>{
					document.forms[this.form_name].submit()
				},1000)
				
			},
			export_current_page(){
				this.exportPage = this.params.page 
				this.exportPageSize = this.params.pagesize
				this.exportTitle = "第"+this.params.page+"页"
				this.do_sync_export()
			},
			
			export_all(){
				//console.log('export_all')
				this.exportPage = 0
				this.exportPageSize = 0
				this.exportTitle = ''
				this.do_sync_export()
			},
			export_define_page(page,pagesize,title){
				//console.log('export_define_page')
				this.exportPage = page
				this.exportPageSize = pagesize
				this.exportTitle = title
				this.do_sync_export()
			}
		},
		computed:{
			is_async(){		//是否异步
				if(this.total >= this.maxSyncNums){
					return true
				}
				return false
			},
			export_params(){
				return Object.assign({},this.params,{
					
				})
			},
			export_uri(){
				
				let host = this.$store.state.user.client.domain
				let product_url = this.$store.state.user.info.product_url
				if(!product_url) return ''
				
				let au = product_url.split('://')
				let base_url = location.protocol+'//'+host+'.'+au[1]
				return base_url+'/fapi/export';
			},
			form_name(){
				return this.res+'_export_form'
			},
			token(){
				return this.$store.state.user.token
			},
			split_pages(){
				let ret = []
				if(!this.is_async || this.total == 0){
					return ret
				}
				
				let start = 0,page = 1
				while(start < this.total){
					let end = start + this.splitSize
					if(this.total < end){
						end = this.total
					}
					ret.push({
						page:page,
						pagesize:this.splitSize,
						text:'第'+(start+1)+'~'+end+'条'
					})
					page++
					start += this.splitSize
				}
				return ret
			}
		}
	}
</script>
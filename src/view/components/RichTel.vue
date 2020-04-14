<template>
	<span :class="hasCallPer?'text-info x-a-link cursor':''" :title="title" @click="handleCall">
		<Icon type="ios-call"></Icon> 
		<slot>{{label}}</slot>			
	</span>
</template>

<script>
	import common from '@/libs/common.mixin'
	
	export default{
		mixins: [ common ],
		props: {			
			row: {
				type: Object,
				default: ()=>{
					return {}
				}
			},
			fcInfo: {
				type: Object,
				default: ()=>{
					return {}
				}
			},
			sence: {
				type: String,
				default: 'customer'
			},
		},
		computed: {
			title () {
				return this.hasCallPer?'点击即可拨打此号码':''
			},
			label () {				
				let field = 'first_tel'
				if(this.sence=='market'){
					field = 'tel'
				}
				else if(this.sence=='fc') {
					field = 'mobile'
				}
				return this.row[field]
			},
			//是否有呼叫中心权限
			hasCallPer () {
				return this.hasPer('app.webcall')
			},
			webcall() {
				return this.$store.state.layout.$refs['webcall']
			},
		},
		methods: {
			handleCall () {
				if(!this.hasCallPer){
					return
				}
				
				this.webcall.setCallParams(this.sence,()=>{
					this.$emit('on-success')
				},this.row)
				this.webcall.setFcInfo(this.fcInfo)
			}
		}
	}
	
</script>

<style>
</style>
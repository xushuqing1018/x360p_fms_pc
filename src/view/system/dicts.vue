<style scoped>
.side-sub-nav {
    position: relative;
    background-color: #fff;
    padding-top: 10px;
    border-radius: 5px;
    min-height: 400px;
}

.side-sub-nav .filter {
    margin: 0 10px;
}

ul {
	list-style: none
}

.side-sub-nav .list li {
    cursor: pointer;
    display: block;
    border-radius: 3px;
}

.side-sub-nav .list li.active {
    background: #3091f2;
    color: #f8f8f9;
}

.side-sub-nav .list li:hover {
    background: #3091f2;
    color: #f8f8f9;
}

.route-sub {
    min-height: 500px;
    background: #fff;
    border-radius: 2px;
    padding: 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,.1);
}

.wrapper >>> .ivu-spin-fix {
	z-index: 1000 !important;
}
</style>

<template>
	<data-ready :data="cateUrl" @ready="dataReady" class="wrapper">
		<div class="padder-xs m-b">
			<Row :gutter="12">
				<Col span="4">
					<div class="side-sub-nav padder-xs">
						<div class="filter" v-if="total > 7">
							<Input size="small" v-model="key" icon="search" placeholder="输入字典名称过滤"></Input>
						</div>
						<ul class="p-2 list">
							<li class="m-lg-1 p-2" :class="{'active':item.did == pid}" v-for="(item,index) in navs" @click="switch_dict(item)">
								{{item.desc}}
								<Icon class="pull-right" type="chevron-right"></Icon>
							</li>
						</ul>
					</div>
				</Col>
				<Col span="20">
					<Affix :offset-top="80">
						<div class="route-sub" v-if="pid > 0">
							<dict-table :pid="pid" :title="title" :is_fsys="is_fsys"></dict-table>
						</div>
					</Affix>
				</Col>
			</Row>
		</div>
	</data-ready>
</template>

<script>
	import globals from '@/libs/globals.mixin'
	import common from '@/libs/common.mixin'
	import store from '@/store'
	import $rest from '@/libs/rest'
	import dictTable from './dicts/dictTable.vue'
	import dataReady from 'c%/DataReady.vue'
    
	export default{
		mixins: [globals,common],
		components:{
            dictTable,
            dataReady
        },
		computed:{
			total(){
				return this.dataList.length
			},
			navs () {
				let navs = this.dataList
				
				if(navs.length > 7 && !/^\s*$/.test(this.key)){
					return navs.filter(n=>n.desc.indexOf(this.key) !== -1)
				}
				return navs
			}
		},
		data () {
			return {
				key:'',
				pid:0,
				title:'',
				is_fsys: 1,
				cateUrl:['dictionarys?pid=0'],
				dataList:[]
			}
		},
		methods:{
			dataReady(rs){
				this.dataList = rs[0].list
				if(rs[0].list[0]) {
					this.$nextTick(()=>{
						this.pid = rs[0].list[0].did
						this.title = rs[0].list[0].desc		
					})
				}
			},
			switch_dict(d){
				this.pid 	= d.did
				this.title 	= d.desc
				this.is_fsys = d.is_fsys
			}
		},
		watch:{
		}
	}
</script>
<style lang="less">
.filter-column{
	.ivu-dropdown-item{
		padding:3px 10px;
	}
	.ivu-checkbox-wrapper{
		margin-bottom:0;
	}
}
</style>
<template>
<div class="filter-column">
    <Dropdown
    placement="bottom-end">
        <Button type="primary" size="small">
    		选择列
            <Icon type="ios-funnel" />
        </Button>
        <DropdownMenu slot="list">
        	<DropdownItem>
        		<Checkbox v-model="selectAll" @on-change="toggleSelect" @click.native.stop="">全选</Checkbox>
        	</DropdownItem>
            <DropdownItem v-for="(item,k) in items">
                <Checkbox v-model="item.show" :disabled="item.disabled" @click.native.stop="setKey(k)">{{item.title}}</Checkbox>
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
</div>
</template>
<script>
import Hash from 'object-hash'
import util from '@/libs/util'
const KC = {}
export default{
	name:'filterColumn',
	props:{
		keys:{
			type:Object,
			default(){
				return {}
			}
		}
	},
	data(){
		return {
			items:{},
			selectAll:false,

		}
	},
	created(){
		let hash = Hash(this.keys)
		if(KC[hash]){
			this.items = KC[hash]
			this.setKeys()
		}else{
			KC[hash] = util.copy(this.keys)
			this.items = KC[hash]
		}
		this.changeAllState()
	},
	methods:{
		toggleSelect(){
			for(let item in this.items){
				if(!this.items[item].disabled){
					this.items[item].show = this.selectAll					
				}
			}
			this.setKeys()
		},
		setKeys(){
			for(let item in this.items){
				this.keys[item].show = this.items[item].show
			}
		},
		setKey(k){
			this.keys[k].show = !this.items[k].show
			this.changeAllState()
		},
		changeAllState() {
			let b = Object.keys(this.keys).length==Object.values(this.keys).filter(item=>item.show==true).length
			if(this.selectAll&&!b) {
				this.selectAll = false
			}
			if(!this.selectAll&&b) {
				this.selectAll = true
			}
		}
	}
}
</script>
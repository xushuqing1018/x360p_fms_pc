<template>
	<div>
		<Menu 
		mode="horizontal" 
		theme="light" 
		active-name="students"
		@on-select="changeTab"
		>
	        <MenuItem name="students">
	            <Icon type="ios-people" />
	            学员数据
	        </MenuItem>
	        <MenuItem name="customers">
	            <Icon type="ios-people" />
	            客户数据
	        </MenuItem>
	        <MenuItem name="markets">
	            <Icon type="ios-people" />
	            市场数据
	        </MenuItem>
	        <MenuItem name="employees">
	            <Icon type="ios-people" />
	            员工数据
	        </MenuItem>
	    </Menu>
	    <students-list v-if="tab=='students'"></students-list>
	    <customers-list v-if="tab=='customers'"></customers-list>
	    <markets-list v-if="tab=='markets'"></markets-list>
	    <employees-list v-if="tab=='employees'"></employees-list>
	</div>
</template>
<script>
	
	import common from '@/libs/common.mixin'

	import studentsList from './origins/students.vue'
	import customersList from './origins/customers.vue'
	import marketsList from './origins/markets.vue'
	import employeesList from './origins/employees.vue'
	export default{
		mixins: [common],
		components: {
			studentsList,
			customersList,
			marketsList,
			employeesList
		},
		data () {
			return {
				tab:'students'
			}
		},
		methods:{
			changeTab(name){
				this.tab = name
			}
		}
	}
</script>

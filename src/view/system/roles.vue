<template>
	<div class="c-grid">
		<Row>
			<Col span="13" class="box box-result" style="margin-right: 30px;">
				<role-list @setRole="setRole" />
			</Col>
			<Col span="10" class="box box-result">
				<employee-list :rid="cRid" :roleName="cRoleName"/>
			</Col>
		</Row>
	</div>
</template>

<script>
import RoleList from './roles/role-list.vue'
import EmployeeList from './roles/employee-list.vue'

export default {
	components: {
		RoleList,
		EmployeeList
	},
	data() {
		return {
			cRid: 0,
			cRoleName: ''
		}
	},
	methods: {
		setRole(rid, role_name) {
			this.cRid = rid;
			this.cRoleName = role_name;
		}
	}
}
</script>

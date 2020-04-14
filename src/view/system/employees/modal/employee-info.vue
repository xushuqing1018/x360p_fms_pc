<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="800">
		<Form ref="form" :model="info" :label-width="90" :rules="rules" inline>
			<Tabs value="1">
				<TabPane label="员工信息" name="1">
					<FormItem label="姓名" prop="ename" class="inline-form-item">
						<Input v-model="info.ename" placeholder="请输入员工姓名"/>
					</FormItem>
					<FormItem label="昵称" prop="nick_name" class="inline-form-item">
						<Input v-model="info.nick_name" placeholder="请输入员工昵称"/>
					</FormItem>
					<FormItem label="性别" prop="sex" class="inline-form-item">
						<RadioGroup v-model="info.sex">
							<Radio label="1">男</Radio>
							<Radio label="2">女</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="手机号码" prop="mobile" class="inline-form-item">
						<Input v-model="info.mobile" placeholder="请输入手机号码"/>
					</FormItem>
					<FormItem label="部门" prop="departmentsIds" class="inline-form-item">
						<SelectDepartment v-model="info.departmentIds" />
					</FormItem>
					<FormItem label="Email" prop="email" class="inline-form-item">
						<Input v-model="info.email" placeholder="请输入邮箱地址"/>
					</FormItem>
					<FormItem label="出生日期" prop="birth_time" class="inline-form-item">
						<DatePicker v-model="info.birth_time" type="date" placeholder="选择出生日期" style="width: 80%"></DatePicker>
					</FormItem>
					<FormItem label="身份证号" prop="id_card_no" class="inline-form-item">
						<Input v-model="info.id_card_no" placeholder="请输入身份证号"/>
					</FormItem>
					<FormItem label="角色" prop="rids" class="inline-form-item">
						<Select v-model="info.rids" transfer multiple style="width: 100%">
							<Option v-for="item in $store.state.gvars.roles" :value="item.rid" :key="item.rid">{{ item.role_name }}</Option>
						</Select>
					</FormItem>
					<FormItem label="备注" prop="remark" class="inline-form-item">
						<Input v-model="info.remark" placeholder="请输入备注"/>
					</FormItem>
				</TabPane>
				<TabPane label="账号信息" name="2" :disabled="modal$.action == 'edit'">
					<template v-if="modal$.action == 'edit'">
						<FormItem label="开启账号" prop="open_account" class="block-form-item">
							<i-switch size="large" v-model="info.open_account" :true-value="1" :false-value="0">
								<span slot="open">ON</span>
								<span slot="close">OFF</span>
							</i-switch>
						</FormItem>
						<template v-if="info.open_account">
							<FormItem label="账号" prop="account" class="inline-form-item">
								<Input v-model="info.account" placeholder="请输入账号"/>
							</FormItem>
							<FormItem label="密码" prop="password" class="inline-form-item">
								<Input v-model="info.password" placeholder="请输入账号"/>
							</FormItem>
							<FormItem label="账号状态" prop="status" class="inline-form-item">
								<RadioGroup v-model="info.status">
									<Radio :label="1">开启</Radio>
									<Radio :label="0">关闭</Radio>
								</RadioGroup>
							</FormItem>
						</template>
					</template>
				</TabPane>
			</Tabs>
		</Form>
		<div slot="footer">
			<Button @click="close">关闭</Button>
			<Button type="primary" @click="handleSubmit">确定</Button>
		</div>
	</Modal>
</template>

<script>
import modal from '@/libs/modal.mixin'
import SelectDepartment from 'c%/SelectDepartment.vue'

export default {
	mixins: [modal],
	components: {
		SelectDepartment
	},
	props: {
		itemInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		const validateMobile = (rule, value, callback) => {
			if(value == '') {
				callback(new Error('手机号不能为空'));
			}
			else if(/1\d{10}/.test(value)) {
				callback();
			}
			else {
				callback(new Error('手机号格式不正确'));
			}
		}

		const validateEmail = (rule, value, callback) => {
			if(value == '') {
				callback();
			}
			else if(/\w+@\w+\.\w+/.test(value)) {
				callback();
			}
			else {
				callback(new Error('邮箱格式不正确'));
			}
		}

		const validateIdCard = (rule, value, callback) => {
			if(value == '') {
				callback();
			}
			else if(/\d{18}/.test(value) || /\d{17}[Xx]/.test(value)) {
				callback();
			}
			else {
				callback(new Error('身份证号格式不正确'));
			}
		}

		return {
			info: {
				is_fsys: 1,
				ename: '',
				nick_name: '',
				sex: '1',
				mobile: '',
				email: '',
				open_account: 0,
				account: "",
				is_admin: 0,
				password: "",
				status: 1,
				departments: -1,
				rids: []
			},
			rules: {
				ename: [
					{ required: true, message: '姓名不能为空', trigger: 'blur' }
				],
				sex: [
					{ required: true, message: '性别不能为空', trigger: 'blur' }
				],
				mobile: [
					{ required: true, validator: validateMobile, trigger: 'blur' },
				],
				email: [
					{ validator: validateEmail, trigger: 'blur' },
				],
				id_card_no: [
					{ validator: validateIdCard, trigger: 'blur' },
				],
				account: [
					{ required: true, message: '账号不能为空', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			}
		}
	},
	watch: {
		'modal$.show': function(val) {
			if(val&&this.modal$.action == 'edit') {
				this.info = { ...this.itemInfo }
				this.info.departmentIds = this.info.departments.map(item => {
					return item.dpt_id
				})
			}
		}
	},
	methods: {
		handleSubmit() {
			this.$refs.form.validate((valid) => {
				if(valid) {
					this.ok();
				}
			})
		},
		ok() {	
			let [method, url, msg] = ['post', 'employees', '添加成功']
			if(this.modal$.action=='edit') {
				[method, url, msg] = ['put', 'employees/' + this.info.eid, '修改成功']
			}

			let params = {
				employee: { ...this.info }
			}
			
			if(this.modal$.action=='add') {
				params.open_account = this.info.open_account,
				params.user = {
					account: this.info.account,
					is_admin: this.info.is_admin,
					password: this.info.password,
					status: this.info.status
				}
			}
			else {
				let array = [];
				params.employee.departmentIds.forEach(item => {
					array.push({
						dpt_id: item,
						is_charge: 0,
						jobtitle_did: 0
					})
				})
				params.employee.departments = array;
			}

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: params
			})
			.then(res => {
				this.$Message.success(msg);
				this.$emit('update');
				this.close();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		}
	}
	
}
</script>

<style scoped>
.inline-form-item {
	width: 45%;
	margin-right: 0px;
}

.block-form-item {
	width: 100%;
}
</style>

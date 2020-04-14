<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="600">
		<Form ref="form" :model="info" :label-width="90" :rules="rules">
			<FormItem label="参与人姓名" prop="person_name" style="width: 80%">
				<Input v-model="info.person_name" placeholder="请输入参与人名称"/>
			</FormItem>
			<FormItem label="性别" prop="person_sex" style="width: 80%">
				<RadioGroup v-model="info.person_sex">
					<Radio :label="0">保密</Radio>
					<Radio :label="1">男</Radio>
					<Radio :label="2">女</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="手机号" prop="person_mobile" style="width: 80%">
				<Input v-model="info.person_mobile" placeholder="请输入参与人手机号"/>
			</FormItem>
			<FormItem label="身份证号" prop="person_id_card" style="width: 80%">
				<Input v-model="info.person_id_card" placeholder="请输入参与人身份证号"/>
			</FormItem>
			<FormItem label="入职日期" prop="join_int_day" style="width: 80%">
				<DatePicker v-model="info.join_int_day" type="date" placeholder="选择入职日期" style="width: 200px"></DatePicker>
			</FormItem>
			<FormItem label="学历" prop="person_education_did" style="width: 80%">
				<Select v-model="info.person_education_did" style="width: 200px">
					<Option v-for="item in dicts('person_education')" :value="item.did" :key="item.did">{{ item.title }}</Option>
				</Select>
			</FormItem>
			<FormItem label="是否签到" prop="is_attendance" style="width: 80%" v-if="modal$.action == 'add'">
				<i-switch size="large" v-model="info.is_attendance" :true-value="1" :false-value="0">
					<span slot="open">YES</span>
					<span slot="close">NO</span>
				</i-switch>
			</FormItem>
			<FormItem label="是否缴费" prop="is_pay" style="width: 80%">
				<i-switch size="large" v-model="info.is_pay" :true-value="1" :false-value="0">
					<span slot="open">YES</span>
					<span slot="close">NO</span>
				</i-switch>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="close">关闭</Button>
			<Button type="primary" @click="handleSubmit">确定</Button>
		</div>
	</Modal>
</template>

<script>
import moment from 'moment'
import modal from '@/libs/modal.mixin'
import common from '@/libs/common.mixin'

export default {
	mixins: [modal, common],
	props: {
		ft_id: {
			type: Number,
			default: 0
		},
		fc_id: {
			type: Number,
			default: 0
		},
		itemInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		const vm = this;

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

		const validateIdCard = (rule, value, callback) => {
			if(value == '') {
				callback(new Error('身份证号不能为空'));
			}
			else if(/\d{18}/.test(value) || /\d{17}[Xx]/.test(value)) {
				callback();
			}
			else {
				callback(new Error('身份证号格式不正确'));
			}
		}

		// const validateDateNonEmpty = (rule, value, callback) => {
		// 	if(value !== "") {
		// 		callback();
		// 	}
		// 	else {
		// 		let message = vm.rules[rule.field][0].message;
		// 		callback(new Error(message));
		// 	}
		// }

		return {
			info: {
				ft_id: 0,
				fc_id: 0,
				person_name: '',
				person_sex: 0,
				person_mobile: '',
				person_id_card: '',
				join_int_day: new Date(),
				person_education_did: 0,
				is_attendance: 0,
				is_pay: 1
			},
			rules: {
				person_name: [
					{ required: true, message: '参与人姓名不能为空', trigger: 'blur' }
				],
				person_sex: [
					{ required: true, type: 'number', min: 0, message: '参与人性别不能为空', trigger: 'blur' },
				],
				person_mobile: [
					{ required: true, validator: validateMobile, trigger: 'blur' },
				],
				person_id_card: [
					{ required: true, validator: validateIdCard, trigger: 'blur' },
				],
				is_attendance: [
					{ required: true, type: 'number', min: 0, message: '是否签到不能为空', trigger: 'blur' },
				]
			}
		}
	},
	watch: {
		'modal$.show': function(val) {
			if(val) {
				if(this.modal$.action == 'edit') {
					this.info = { ...this.itemInfo }
				}
				else {
					this.info.ft_id = this.ft_id;
					this.info.fc_id = this.fc_id;
					this.setDefaultDict();
				}
			}
		}
	},
	methods: {
		setDefaultDict() {
			let personEducation = this.dicts('person_education');
			if(personEducation.length > 0) {
				this.info.person_education_did = personEducation[0].did;
			}
		},
		handleSubmit() {
			this.$refs.form.validate((valid) => {
				if(valid) {
					this.ok();
				}
			})
		},
		ok() {	
			let [method, url, msg] = ['post', 'franchisee_training_persons', '添加成功']
			if(this.modal$.action=='edit') {
				[method, url, msg] = ['put', 'franchisee_training_persons/' + this.info.ftp_id, '修改成功']
			}

			let params = { ...this.info };
			params.join_int_day = Number(moment(params.join_int_day).format('YYYYMMDD'));

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

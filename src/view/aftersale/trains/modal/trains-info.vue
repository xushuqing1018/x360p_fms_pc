<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="500">
		<Form ref="form" :model="info" :label-width="90" :rules="rules">
			<FormItem label="培训名称" prop="ft_name" style="width: 80%">
				<Input v-model="info.ft_name" placeholder="请输入培训名称" />
			</FormItem>
			<Row>
				<Col span="12">
				<FormItem label="开始日期" prop="start_int_day">
					<DatePicker v-model="info.start_int_day" type="date" placeholder="选择开始日期" style="width: 110px"></DatePicker>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="结束日期" prop="end_int_day">
					<DatePicker v-model="info.end_int_day" type="date" placeholder="选择结束日期" style="width: 110px"></DatePicker>
				</FormItem>
				</Col>
			</Row>
			<FormItem label="培训场地" prop="fc_address_id" style="width: 80%">
				<Select v-model="info.fc_address_id" style="width: 200px">
					<Option v-for="item in dicts('fc_address')" :value="item.did" :key="item.did">{{ item.title }}</Option>
				</Select>
				<Button @click="addFtAddress" icon="md-add" class="ml-2"></Button>
			</FormItem>
			<FormItem label="培训类型" prop="training_type_did" style="width: 80%">
				<Select v-model="info.training_type_did" style="width: 200px">
					<Option v-for="item in dicts('training_type')" :value="item.did" :key="item.did">{{ item.title }}</Option>
				</Select>
			</FormItem>
			<FormItem label="负责人" prop="charge_eid" style="width: 80%">
				<select-employee v-model="info.charge_eid" />
			</FormItem>
			<FormItem label="参与员工" prop="other_eids" style="width: 80%">
				<select-employee v-model="info.other_eids" />
			</FormItem>
			<Row>
				<Col span="11">
					<FormItem label="培训费" prop="training_fee">
						<InputNumber :min="0" v-model="info.training_fee" style="width:60px;"></InputNumber> 元/人
					</FormItem>
				</Col>
				<Col span="5">
					<Input v-model="info.extra_fee_name" placeholder="额外费用名称" />
				</Col>
				<Col span="8">
					<InputNumber :min="0" v-model="info.extra_fee" style="width:60px;"></InputNumber> 元/校区
				</Col>
			</Row>

      <Row>
      	<Col span="11">
      		<FormItem label="端口费" prop="port_fee">
      			<InputNumber :min="0" v-model="info.port_fee" style="width:60px;"></InputNumber> 元/校区
      		</FormItem>
      	</Col>
      	<Col span="5">
      		<Input v-model="info.diy_fee_name" placeholder="自定义名称" />
      	</Col>
      	<Col span="8">
      		<InputNumber :min="0" v-model="info.diy_fee" style="width:60px;"></InputNumber> 元/人
      	</Col>
      </Row>

			<FormItem label="培训简介" prop="training_intro">
				<Input v-model="info.training_intro" type="textarea" placeholder="请输入培训简介" />
			</FormItem>
			<FormItem label="培训banner图" prop="banner_img" style="width: 80%">
				<Upload style="cursor: pointer" action="/fapi/upload" :headers="uploadHeader" :show-upload-list="false" :format="['jpg', 'jpeg', 'png']"
				 :max-size="2048" :on-success="finishUpload('success')" :on-error="finishUpload('error')">
					<img :src="info.banner_img" alt="培训banner图" style="width: 300px">
				</Upload>
				像素：400x100
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
	import SelectEmployee from 'c%/SelectEmployee'

	export default {
		mixins: [modal, common],
		components: {
			SelectEmployee
		},
		props: {
			itemInfo: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			const vm = this;

			const validateDateNonEmpty = (rule, value, callback) => {
				if (value !== "") {
					callback();
				} else {
					let message = vm.rules[rule.field][0].message;
					callback(new Error(message));
				}
			}

			return {
				info: {
					ft_name: '',
					start_int_day: new Date(),
					end_int_day: new Date(),
					fc_address_id: 0,
					training_type_did: 0,
					charge_eid: 0,
					other_eids: [],
					extra_fee:150,
					extra_fee_name:'印刷费',
          diy_fee:150,
          diy_fee_name:'自定义',
					join_nums: 1,
					training_fee: 0,
          port_fee:0,
					training_intro: '',
					banner_img: 'https://sp1.xiao360.com/fcm/banner.png'
				},
				rules: {
					ft_name: [{
						required: true,
						message: '培训名称不能为空',
						trigger: 'blur'
					}],
					start_int_day: [{
						required: true,
						validator: validateDateNonEmpty,
						message: '开始日期不能为空',
						trigger: 'blur'
					}, ],
					end_int_day: [{
						required: true,
						validator: validateDateNonEmpty,
						message: '结束日期不能为空',
						trigger: 'blur'
					}, ],
					fc_address_id: [{
						required: true,
						type: 'number',
						min: 1,
						message: '培训场地不能为空',
						trigger: 'blur'
					}, ],
					training_type_did: [{
						required: true,
						type: 'number',
						min: 1,
						message: '培训类型不能为空',
						trigger: 'blur'
					}, ],
					charge_eid: [{
						required: true,
						type: 'number',
						min: 1,
						message: '负责人不能为空',
						trigger: 'blur'
					}],
					other_eids: [{
						required: true,
						type: 'array',
						min: 1,
						message: '参与员工不能为空',
						trigger: 'blur'
					}, ],
					join_nums: [{
						required: true,
						type: 'number',
						min: 1,
						message: '参与人数不能为空',
						trigger: 'blur'
					}, ]
				}
			}
		},
		computed: {
			uploadHeader() {
				return {
					'x-file-key': 'file',
					'x-token': this.$store.state.user.token
				}
			}
		},
		watch: {
			'modal$.show': function(val) {
				if (val) {
					if (this.modal$.action == 'edit') {
						this.info = { ...this.itemInfo
						}
						let other_eids = this.info.other_eids.split(',');
						this.info.other_eids = other_eids;
						this.info.training_fee = Number(this.info.training_fee);
					} else {
						this.setDefaultDict();
					}
				}
			}
		},
		methods: {
			finishUpload(status) {
				let vm = this;
				return function(response) {
					if (status == 'success') {
						let fileUrl = response.data.file_url;
						vm.info.banner_img = fileUrl;

						vm.$Message.success('上传成功');
					} else if (status == 'error') {
						vm.$Message.error('服务器繁忙，请重试');
					}
				}
			},
			addFtAddress() {
				this.$Modal.open('aftersale/trains/modal/add-ft-address.vue@modal', {
						on: {
							update: (info) => {
								this.$store.dispatch('updateGlobalVar', 'dicts');
							}
						}
					})
					.then(modal => {
						modal.show('添加培训场地', 'add')
					})
			},
			setDefaultDict() {
				let ftAddress = this.dicts('fc_address'),
					trainingType = this.dicts('training_type');
				if (ftAddress.length > 0) {
					this.info.fc_address_id = ftAddress[0].did;
					this.info.training_type_did = trainingType[0].did;
				}
			},
			handleSubmit() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.ok();
					}
				})
			},
			ok() {
				let [method, url, msg] = ['post', 'franchisee_trainings', '添加成功']
				if (this.modal$.action == 'edit') {
					[method, url, msg] = ['put', 'franchisee_trainings/' + this.info.ft_id, '修改成功']
				}

				let params = this.info;
				params.start_int_day = Number(moment(params.start_int_day).format('YYYYMMDD'));
				params.end_int_day = Number(moment(params.end_int_day).format('YYYYMMDD'));

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

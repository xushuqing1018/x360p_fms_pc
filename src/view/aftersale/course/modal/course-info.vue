<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="500">
		<Form ref="form" :model="info" :label-width="90" :rules="rules">
			<FormItem label="课案主题" prop="topic" style="width: 80%">
				<Input v-model="info.topic" placeholder="请输入课案主题" />
			</FormItem>
      <Form-item label="培训安排" prop="ft_id" class="ivu-form-item-required" style="width: 80%">
          <Select v-model="info.ft_id">
          	<Option v-for="(item,index) in franchisee_trainings" :key="index" :value="item.ft_id">{{item.ft_name}}</Option>
          </Select>
      </Form-item>
			<FormItem label="开始日期" prop="start_int_day">
				<DatePicker v-model="info.start_int_day" type="date" placeholder="选择开始日期" style="width: 110px"></DatePicker>
      </FormItem>
			<FormItem label="结束日期" prop="end_int_day">
				<DatePicker v-model="info.end_int_day" type="date" placeholder="选择结束日期" style="width: 110px"></DatePicker>
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
		components: {

		},
		props: {
			itemInfo: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},

    mounted() {
    	this.get_franchisee_trainings()
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
					topic: '',
					start_int_day: new Date(),
					end_int_day: new Date(),
          ft_id : ''
				},
        franchisee_trainings:[],
				rules: {
					topic: [{
						required: true,
						message: '会议主题不能为空',
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
				}
			}
		},
		computed: {

		},
		watch: {
			'modal$.show': function(val) {
				if (val) {
					if (this.modal$.action == 'edit') {
						this.info = { ...this.itemInfo
						}
					} else {
						this.setDefaultDict();
					}
				}
			}
		},
		methods: {
      get_franchisee_trainings(){
      	this.$rest('franchisee_trainings')
      	.get()
      	.success(res => {
      		this.franchisee_trainings = res.list
      	})
      },
			handleSubmit() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.ok();
					}
				})
			},
			ok() {
				let [method, url, msg] = ['post', 'course_case_topics', '添加成功']
				if (this.modal$.action == 'edit') {
					[method, url, msg] = ['put', 'course_case_topics/' + this.info.cct_id, '修改成功']
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

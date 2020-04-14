<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="500">
		<Form ref="form" :model="info" :label-width="90" :rules="rules">
			<FormItem label="收支类型" prop="type" style="width: 80%">
				<RadioGroup v-model="info.type">
					<Radio :label="1">进账</Radio>
					<Radio :label="2">出账</Radio>
				</RadioGroup>
			</FormItem>
			<Form-item label="收入类别" v-show="info.type==1" prop="tt_id">
				<Select ref="tallyType1" style="width: 200px" :value="info.tt_id" @on-change="tallyChange" clearable>							
					<template v-for="item in typeList1">
						<OptionGroup :label="item.name" v-if="item.sub.length>0">
							<Option :value="sub.tt_id" v-for="sub in item.sub">{{sub.name}}</Option>
						</OptionGroup>
						<OptionGroup :label="item.name" v-else>
							<Option :value="item.tt_id"	>{{item.name}}</Option>
						</OptionGroup>
					</template>
				</Select>
			</Form-item>		
			<Form-item label="支出类别" v-show="info.type==2" prop="tt_id">
				<Select ref="tallyType2" style="width: 200px" :value="info.tt_id" @on-change="tallyChange" clearable>							
					<template v-for="item in typeList2">
						<OptionGroup :label="item.name" v-if="item.sub.length>0">
							<Option :value="sub.tt_id" v-for="sub in item.sub">{{sub.name}}</Option>
						</OptionGroup>
						<OptionGroup :label="item.name" v-else>
							<Option :value="item.tt_id"	>{{item.name}}</Option>
						</OptionGroup>
					</template>
				</Select>
			</Form-item>
			<FormItem label="加盟商" prop="fc_id" style="width: 80%">
				<SelectFranchisee v-model="info.fc_id" />
			</FormItem>
			<FormItem label="业务日期" prop="int_day" style="width: 80%">
				<DatePicker v-model="info.int_day" type="date" placeholder="选择业务日期" style="width: 200px"></DatePicker>
			</FormItem>
			<FormItem label="金额" prop="amount" style="width: 80%">
				<InputNumber :min="1" v-model="info.amount"></InputNumber>
			</FormItem>
			<FormItem label="备注" prop="remark" style="width: 90%">
				<Input type="textarea" v-model="info.remark" :rows="1" placeholder="请输入备注"/>
			</FormItem>
			<Form-item label="上传附件" prop="tally_file">
				<review-upload v-model="info.franchisee_tally_file"></review-upload>
			</Form-item>
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
import SelectFranchisee from 'c%/SelectFranchisee'
import ReviewUpload from 'c%/ReviewUpload'

export default {
	mixins: [modal, common],
	components: {
		SelectFranchisee,
		ReviewUpload
	},
	props: {
		itemInfo: {
			type: Object,
			default: () => {
				return {}
			}
		},
		ftId: {
			type: Number,
			default: 0
		}
	},
	data () {
		const vm = this;

		const validateDateNonEmpty = (rule, value, callback) => {
			if(value !== "") {
				callback();
			}
			else {
				let message = vm.rules[rule.field][0].message;
				callback(new Error(message));
			}
		}

		return {
			info: {
				fc_id: 0,
				type: 1,
				int_day: new Date(),
				amount: 1,
				remark: '',
				franchisee_tally_file: [],
				tt_id: 0
			},
			rules: {
				type: [
					{ required: true, type: 'number', min: 1, message: '收支类型不能为空', trigger: 'blur' }
				],
				int_day: [
					{ required: true, validator: validateDateNonEmpty, message: '业务日期不能为空', trigger: 'blur' },
				],
				amount: [
					{ required: true, type: 'number', min: 1, message: '金额不能为空', trigger: 'blur' }
				],
			}
		}
	},
	computed: {
		types () {
			return this.$store.state.gvars.tally_types
		},
		typeList1 () {
			let types = this.types,
				result = [],					
				type = 1//parseInt(this.info.cate)
			
			if(types.length>0){
				result = types.filter(t=>t.type===type&&t.pid===0)					
				
				if(result.length){
					result.forEach(r=>{
						r.sub = types.filter(t=>t.type===type&&t.pid===r.tt_id)
					})						
				}
			}
			return result
		},	
		typeList2 () {
			let types = this.types,
				result = [],					
				type = 2//parseInt(this.info.cate)
			
			if(types.length>0){
				result = types.filter(t=>t.type===type&&t.pid===0)					
				
				if(result.length){
					result.forEach(r=>{
						r.sub = types.filter(t=>t.type===type&&t.pid===r.tt_id)
					})						
				}
			}
			return result
		},
	},
	watch: {
		'modal$.show': function(val) {
			if(val) {
				if(this.modal$.action == 'edit') {
					this.info = { ...this.itemInfo }
				}
			}
		}
	},
	methods: {
		tallyChange (val) {
			if(val){
				this.info.tt_id = val					
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
			let [method, url, msg] = ['post', 'franchisee_tallys', '添加成功']
			if(this.modal$.action=='edit') {
				[method, url, msg] = ['put', 'franchisee_tallys/' + this.info.fty_id, '修改成功']
			}

			let params = { ...this.info };
			params.int_day = Number(moment(params.int_day).format('YYYYMMDD'));
			params.tally_file = params.franchisee_tally_file;
			params.ft_id = this.ftId;
			delete params.franchisee_tally_file
			
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

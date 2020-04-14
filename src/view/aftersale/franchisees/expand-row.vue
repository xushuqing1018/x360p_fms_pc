<template>
	<div>
		<Row class="mb-3">
			<Col span="2">
				<span>合同号：</span>
				<span>{{row.contract_no}}</span>
			</Col>
			<Col span="2">
				<span>合同开始日期：</span>
				<span>{{row.contract_start_int_day}}</span>
			</Col>
			<Col span="2" style="margin-left: 30px;">
				<span>合同结束日期：</span>
				<span>{{row.contract_end_int_day}}</span>
			</Col>
			<Col span="2">
				<span>合同状态：</span>
				<span :class="row.is_expired==1?'text-danger':'text-success'">{{row.is_expired?'已失效':'生效中'}}</span>
			</Col>
			<Col span="2">
				<span>开业日期：</span>
				<span>{{row.open_int_day||'-'}}</span>
			</Col>
			<Col span="2">
				<span>区域性质：</span>
				<span>{{$filter('region_level')(row.region_level)}}</span>
			</Col>
		</Row>
		<Row class="mb-3">
			<Col span="2">
				<span>全款到账日期：</span>
				<span>{{row.all_pay_int_day}}</span>
			</Col>
			<Col span="2">
				<span>特许经营费：</span>
				<span>{{row.join_fee1}}</span>
			</Col>
			<Col span="2" style="margin-left: 30px;">
				<span>履约保证金：</span>
				<span>{{row.join_fee2}}</span>
			</Col>
			<Col span="2">
				<span>年度使用费：</span>
				<span>{{row.join_fee3}}</span>
			</Col>
			<Col span="2">
				<span>教育商品款：</span>
				<span>{{row.join_fee4}}</span>
			</Col>
			<Col span="2">
				<span>合同总金额：</span>
				<span>{{row.contract_amount}}</span>
			</Col>
		</Row>
		<Row class="mb-3">
			<Col span="2">
			    <span>转让费用：</span>
			    <span>{{row.transfer_fee}}</span>
			</Col>
			<Col span="2">
			    <span>转让费用到账时间：</span>
			    <span>{{row.transfer_fee_pay_int_day}}</span>
			</Col>
		</Row>
		<Row class="mb-3">
			<Col span="10">
			    <span>特殊约定：</span>
			    <span>{{row.content||'-'}}</span>
			</Col>
		</Row>
	</div>
</template>
<script>
	import common from '@/libs/common.mixin'
	export default {
		mixins: [common],
		props: {
			row: Object
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>
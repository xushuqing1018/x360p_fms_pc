<style lang="less">
.customer-follow-record {
	&.empty {
		background: url(http://s1.xiao360.com/nothing-notice.png) no-repeat 50%;
    	background-color: #f5f5f5;
	}
	.time {
		width: 110px;
		height: 22px;
		font-size: 15px;
		line-height: 22px;
		padding: 0px 6px;
		text-align: center;
		background-color: #3399FF;
		color: white;
		border-radius: 3px;
		position: relative;
		top: -2px;
		.time {
			margin-left: 4px;
			font-size: 12px;
		}
	}

	.chat_box {
		width: 470px;
		border-radius: 8px;
		border: 1px solid #60baff;
		margin-top: 5px;
		background-color: #EFF4F8;
		position: relative;
		margin-left: 18px;
		padding-bottom: 15px;
	}

	.chat_box table {
		width: 95%;
		margin: 0 auto;
		border-collapse: separate;
		border-spacing: 12px;
		margin-top: 10px
	}

	.chat_box td:nth-child(odd){
		text-align: right;
		color: #657180;
	}

	.chat_box td:nth-child(even){
		position: relative;
		left: -10px;
		color: #333333
	}

	.chat_content {
		position: relative;
		top: 5px;
		left: 30px;
		color: #333;
		width: 90%;
	}

	.chat_angle {
		width: 12px;
		height: 12px;
		border-left: 1px solid #35a8ff;
		border-bottom: 1px solid #35a8ff;
		background-color: #EFF4F8;
		position: absolute;
		top: 20px;
		left: -7px;
		transform: rotate(45deg);
	}
}
	
</style>


<template>
	<div :class="['customer-follow-record',{'empty':follow_data.length==0&&!loading}]">
		<div class="box-result box">
			<Timeline>
				<TimelineItem v-for="items in follow_data">
					<p class="time">{{items[0].create_time.split(' ')[0]}}</p>
					<p class="content">
						<div class="chat_box" v-for="item in items">
							<table>
								<tr>
									<td>跟进人：</td>
									<td style="color:#3399FF">{{item.eid|ename}}</td>
									<td>联系人：</td>
									<td>{{item.franchisee_person?item.franchisee_person.name:'-'}}</td>
									<td>有效性：</td>
									<td>{{item.is_connect==1?'有效':'无效'}}</td>
								</tr>
								<tr>
									<td>沟通类型：</td>
									<td>{{labelDicts(item.followup_did,"followup")||labelDicts(item.invalid_followup_did,"invalid_followup")}}</td>
									<td>沟通状态：</td>
									<td>{{labelDicts(item.franchisee_status_did,"customer_status")}}</td>
									<td>下次跟进时间：</td>
									<td>{{item.next_follow_time==0?'待定':nextFollowTime(item.next_follow_time)}}</td>
								</tr>
								<tr>
									<td>沟通内容：</td>
								</tr>
							</table>
							<div class="chat_content">
								{{item.content}}
							</div>
							<div class="chat_angle"></div>
						</div>
					</p>
				</TimelineItem>
			</Timeline>
			<Page 
				v-if="follow_data.length!==0&&!loading"
				:current="pageIndex" 
				:show-sizer="true" 
				:show-total="true" 
				:total="total"
				@on-change="pagesize" 
			/>
        </div>
    </div>
</template>

<script>
	import moment from 'moment'
	import grid from '@/libs/grid.mixin'
	import globals from '@/libs/globals.mixin'
	import common from '@/libs/common.mixin'

	export default{
		mixins: [grid,globals,common],
		props: {
			fcId: {
				type:Number,
				default:0
			}
		},			
		data () {
			return {
				rest_api: '',
				pk: 'ffc_id',
				follow_data: [],
				params: {
					create_time: []
				}
			}
		},
		watch: {
			'fcId': function (val) {
				this.rest_api = 'franchisee_follow_ups?fc_id=' + val
				this.init_data()
			}
		},
		mounted () {
			let id = this.fcId?this.fcId:this.$route.params.id
			this.rest_api = 'franchisee_follow_ups?fc_id=' + id
			this.init_data()
		},
		methods: {
			nextFollowTime(num) {
				return moment(num).format("YYYY-MM-DD");
			},
			deal_data(data){
				var list = data.list;
				if(list.length == 0) {
					return;
				}
				this.total = list.total;
				var rst = [];
				var c_date = '';
				for(var i in list) {
					if(list[i].create_time.split(' ')[0] != c_date) {
						rst.push([list[i]]);
					}
					else {
						rst[rst.length-1].push(list[i])
					}
					c_date = list[i].create_time.split(' ')[0];
				}
				this.follow_data = rst;

				return data.list
			}
		}
	}
</script>

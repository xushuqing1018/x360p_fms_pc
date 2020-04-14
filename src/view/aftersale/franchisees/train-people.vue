<style scoped>
.c-grid {
	padding: 0px;
}

.c-grid .box {
	padding: 0px;
	box-shadow: none;
}

.fc-name {
	font-weight: bold;
	font-size: 14px;
	position: relative;
	top: 2px;
	margin-right: 20px;
}
</style>


<template>
	<div>
		<Row>
			<Col span="24" style="margin-left: 20px" class="c-grid">
				<div class="box box-result">
					<!-- <div class="toolbar">
						<span class="fc-name" v-if="currentFc != ''">【{{currentFc}}】参与人员</span>
						<span class="fc-name" v-else>未选择加盟商</span>
						<RadioGroup v-model="search_field.is_attendance" @on-change="attendanceChange">
							<Radio :label="-1" :disabled="currentFc == ''">所有</Radio>
							<Radio :label="0" :disabled="currentFc == ''">未签到</Radio>
						</RadioGroup>
						<Button class="mr-1 pull-right" type="primary" icon="md-add" @click="addPerson" :disabled="currentFc == ''">添加</Button>
					</div> -->
					<div class="content">
						<div class="content-body">
							<Table
								:loading="loading"
								:data="data"
								:stripe="true"
								:page="pageIndex"
								:columns="columns"
								:show-header="true"
								:page-size="pageSize"
								:no-data-text="$store.state.config.EMPTY_DATA_TEXT"
								:no-filtered-data-text="$store.state.config.EMPTY_FILTER_DATA_TEXT"
								@on-sort-change="sortChange">
							</Table>
						</div>
						<div class="content-footer">
							<div class="pagenation">
								<Page
									:total="total"
									:current="pageIndex"
									:show-sizer="true"
									:page-size="pageSize"
									:show-total="true"
									@on-change="pagenation"
									@on-page-size-change="pagesize">
								</Page>
							</div>
						</div>
					</div>
				</div>
			</Col>
		</Row>
	</div>
</template>

<script>
import modal from '@/libs/modal.mixin'
import common from '@/libs/common.mixin'
import grid from '@/libs/grid.mixin'
import SimpleList from 'c%/SimpleList.vue'

export default {
	mixins: [grid, common],
	components: {
		SimpleList
	},
	props: {
		fc_id: {
			type: Number,
			default: 0
		}
	},
	data () {
		const vm = this;

		return {
			fcList: [],
			currentFc: '',
			currentFcId: 0,
			rest_api: 'franchisee_training_persons',
			search_field: {
				fc_id: this.fc_id,
				is_attendance: -1
			},
			column_keys: {
				person_name: {
					title: '培训人姓名',
					show: true,
				},
				ft_name: {
					title: '培训名称',
					show: true,
				},
				ft_type: {
					title: '培训类型',
					show: true,
				},
				person_sex: {
					title: '性别',
					show: true,
				},
				person_mobile: {
					title: '手机号',
					show: true,
				},
				person_id_card: {
					title: '身份证号',
					show: true,
				},
				join_int_day: {
					title: '入职时间',
					show: true,
				},
				person_education_did: {
					title: '学历',
					show: true,
				},
				is_attendance: {
					title: '是否签到',
					show: true,
				},
				attendance_time: {
					title: '签到时间',
					show: true,
				}
			},
			column_render: {
				person_sex(h, params) {
					let sexLabel = '',
						personSex = params.row.person_sex;
					if(personSex == 0) {
						sexLabel = '保密';
					}
					else if(personSex == 1) {
						sexLabel = '男';
					}
					else if(personSex == 2) {
						sexLabel = '女';
					}
					return h('span', sexLabel)
				},
				ft_name(h, params) {
					return h('span', params.row.frachisee_training.ft_name)
				},
				ft_type(h, params) {
					return h('span', this.labelDicts(params.row.frachisee_training.training_type_did, 'training_type'))
				},
				person_education_did(h, params) {
					return h('span', this.labelDicts(params.row.person_education_did, 'person_education'))
				},
				is_attendance(h, params) {
					let [label, color, textDecoration] = params.row.is_attendance == 1 ? ['已签到', '#19be6b', 'none'] : ['未签到', '#ed4014', 'underline'];

					return h('span', {
						style: {
							color: color,
							textDecoration: textDecoration,
							cursor: 'pointer'
						},
						on: {
							click: () => {
								if(params.row.is_attendance == 0) {
									this.checkIn(params.row);
								}
							}
						}
					}, label)
				},
			},
			// operation_keys: {
			// 	checkIn: {
			// 		title: '签到',
			// 		type: 'md-checkmark',
			// 		condition: 'row.is_attendance == 0'
			// 	},
			// 	edit: {
			// 		title: '编辑',
			// 		type: 'md-create'
			// 	},
			// 	delete: {
			// 		title: '删除',
			// 		type: 'ios-trash'
			// 	}
			// },
			operation_func: {
				checkIn(params) {
					this.checkInAction(params.row);
				},
				edit(params) {
					this.editPerson(params.row);
				},
				delete(params) {
					this.deletePerson(params.row);
				}
			}
		}
	},
	mounted() {
		this.initFcData();
	},
	methods: {
		checkIn(row) {
			this.confirm(`确认签到【${row.person_name}】`)
            .then(() => {
                this.checkInAction(row);
            })
		},
		checkInAction(row) {
			this.axios.request({
				url: `fapi/franchisee_training_persons/${row.ftp_id}/docheck`,
				method: 'post'
			})
			.then(res => {
				this.$Message.success('签到成功');
				this.init_data();
			})
			.catch(res => {
				this.$Message.error(res.message);
			})
		},
		attendanceChange(val) {
			this.init_data();
		},
		addPerson() {
			this.$Modal.open('aftersale/trains/modal/trains-person-info.vue@modal', {
				props: {
					ft_id: this.ft_id,
					fc_id: this.currentFcId
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show('添加培训人员','add')
			})
		},
		editPerson(row) {
			this.$Modal.open('aftersale/trains/modal/trains-person-info.vue@modal', {
				props: {
					ft_id: this.ft_id,
					fc_id: this.currentFcId,
					itemInfo: row
				},
				on: {
					update: () => {
						this.init_data();
					}
				}
			})
			.then(modal => {
				modal.show(`编辑培训人员【${row.person_name}】`,'edit')
			})
		},
		deletePerson(row) {
			this.confirm(`确认删除参与人【${row.person_name}】`)
            .then(() => {
                this.deletePersonAction(row);
            })
		},
		deletePersonAction(row) {
			this.axios.request({
				url: 'fapi/franchisee_training_persons/' + row.ftp_id,
				method: 'delete'
			})
			.then(res => {
				this.$Message.success('删除成功');
				this.init_data();
			})
			.catch(res => {
				this.$Message.error(res.message);
			})
		},
		initFcData() {
			this.axios.request({
				url: 'fapi/franchisee_training_fcs',
				method: 'get',
				params: {
					with: 'franchisee',
					ft_id: this.ft_id
				}
			})
			.then(res => {
				let list = res.data.data.list;
				this.fcList = list.map(item => {
					return {
						ftf_id: item.ftf_id,
						name: item.franchisee.org_name,
						fc_id: item.fc_id
					}
				})
				if(list.length > 0) {
					this.currentFc = list[0].franchisee.org_name;
					this.currentFcId = list[0].fc_id;
					// this.search_field.fc_id = list[0].fc_id;
				}
				else {
					this.currentFc = '';
					this.currentFcId = -1;
					// this.search_field.fc_id = -1;
				}
				this.init_data();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		},
		addFc() {
			this.$Modal.open('components/SelectFranchiseeModal.vue@modal',{
				props:{
					multiple: false
				},
				on:{
					'on-select': (item)=>{
						this.addFcAction(item)
					}
				}
			}).then(modal=>{
				modal.show('选择加盟商')
			})
		},
		addFcAction(item) {
			let [method, url, msg] = ['post', 'franchisee_training_fcs', '添加成功']

			let params = {
				ft_id: this.ft_id,
				fc_id: item.fc_id
			}

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: params
			})
			.then(res => {
				this.$Message.success(msg);
				this.initFcData();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		},
		deleteFc(row) {
			this.axios.request({
				url: 'fapi/franchisee_training_fcs/' + row.ftf_id,
				method: 'delete'
			})
			.then(res => {
				this.$Message.success('删除成功');
				this.initFcData();
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		},
		handleRowChange(row) {
			this.currentFc = row.name;
			this.currentFcId = row.fc_id;
			this.search_field.fc_id = row.fc_id;
			this.init_data();
		},
		hook_get_param(params) {
			let search_obj = this.search_field;
			for(let o in search_obj) {
				let property = search_obj[o];
				if(o == 'is_attendance') {
					if(property != -1) {
						params[o] = property;
					}
				}
				else if(property){
					params[o] = property;
				}
			}
		}
	}
	
}
</script>
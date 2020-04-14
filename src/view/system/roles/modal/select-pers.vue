<style scoped>
.tree-content {
	height: 500px;
	overflow-y: auto;
}

.checkall-box {
	padding: 10px;
	border-bottom: 1px solid #ddd;
	font-size: 14px !important;
}

.check-group-box {
	padding: 0px 10px;
}

.check-group-item {
	display: block;
	margin-top: 10px;
	font-size: 14px;
}
</style>


<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="700">
		<Tabs v-if="modal$.show">
			<TabPane label="功能权限">
				<x-tree
					v-if="treeItems"
					ref="ref_x_tree"
					:data="treeItems"
					text-field-name="title"
					value-field-name="uri"
					:show-checkbox="true"
					:multiple="true"
					:allowBatch="true"
				>
				</x-tree>
			</TabPane>
			<TabPane label="资源权限">
				<div class="checkall-box">
					<Checkbox v-model="isCheckAll" :indeterminate="indeterminate" @on-change="changeCheckAll">全选</Checkbox>
				</div>
				<dir class="check-group-box">
					<CheckboxGroup v-model="checkGroup" @on-change="checkGroupChange">
						<Checkbox :label="item.uri" v-for="item in fmsRes" class="check-group-item">{{item.text}}</Checkbox><br>
					</CheckboxGroup>
				</dir>
			</TabPane>
		</Tabs>
		<div slot="footer">
			<Button @click="close">关闭</Button>
			<Button type="primary" @click="ok">确定</Button>
		</div>
	</Modal>
</template>

<script>
import modal from '@/libs/modal.mixin'
import XTree from 'c%/XTree.vue'

const folder = 'ivu-icon ivu-icon-ios-folder'
const doc = 'ivu-icon ivu-icon-ios-document-outline'

export default {
	mixins: [modal],
	components: {
		XTree
	},
	props: {
		perList: {
			type: Array,
			default: () => {
				return []
			}
		},
		type: {
			type: String,
			default: 'role'
		},
		id: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			treeItems: null,
			isCheckAll: false,
			fmsRes: [],
			checkGroup: [],
			allCheckGroup: [],
		}
	},
	watch: {
		'modal$.show': function(val) {
		},
	},
	mounted() {
		this.buildItems();
		this.initResPer();
	},
	computed: {
		indeterminate() {
			if(this.fmsRes.length == this.checkGroup.length||this.checkGroup.length == 0) {
				return false
			}
			else {
				return true
			}
		}
	},
	methods: {
		changeCheckAll(val) {
			if(val == true) {
				this.checkGroup = this.allCheckGroup
			}
			else {
				this.checkGroup = []
			}
		},
		checkGroupChange() {
			if(this.fmsRes.length == this.checkGroup.length) {
				this.isCheckAll = true;
			}
			else {
				this.isCheckAll = false;
			}
		},
		initResPer() {
			let fms_res = this.$store.state.gvars.fms_res;
			this.fmsRes = fms_res;
			fms_res.forEach(item => {
				if(this.perList.indexOf(item.uri) != -1) {
					this.checkGroup.push(item.uri)
				}
			})
			this.checkGroupChange();
			this.allCheckGroup = fms_res.map(item => {
				return item.uri
			});
		},
		buildItems(){
			let globalPersList = this.$store.state.gvars.pers;
			this.treeItems = this.buildPerItems(globalPersList, this.perList);
		},
		buildPerItems(persList, pers){
			let items = []
			persList.forEach(item=>{
				let opened = false,
					is_selected = pers.indexOf(item.uri) !== -1,
					is_selected_part = false,
					sub_length = 0,
					sub_selected_length = 0

				if(item.sub && item.sub.length > 0){
					sub_length = item.sub.length
					item.sub.forEach(subitem=>{
						if(pers.indexOf(subitem.uri) !== -1){
							sub_selected_length++
						}
					})

					if(sub_selected_length > 0){
						if(sub_selected_length == sub_length){
							is_selected = true
						}else{
							is_selected_part = true
						}
						opened = true
					}
				}

				let child = {
					opened: opened,
					title: item.text,
					uri: item.uri,
					icon: item.sub ? folder : doc,
					selected: is_selected,
					selected_part: is_selected_part,
				}

				if(item.sub && item.sub.length > 0){
					child.children = this.buildPerItems(item.sub,pers)
				}

				items.push(child)
			})
			return items
		},
		ok() {
			let perModels = this.$refs['ref_x_tree'].getSelectedNodes();

			let method = 'put',
				url = '',
				msg = '修改成功';
			if(this.type == 'role') {
				url = 'roles/' + this.id;
			}
			else {
				url = 'users/' + this.id;
			}

			let params = [];
			perModels.forEach((item) => {
				params.push(item.value)
			})
			params.push(...this.checkGroup)

			this.axios.request({
				url: 'fapi/' + url,
				method: method,
				data: {
					pers: params
				}
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
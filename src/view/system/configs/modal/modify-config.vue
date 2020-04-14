<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="600">
		<Form :model="config" :label-width="100" class="config-form">
			<template v-if="type=='system'">
				<FormItem label="机构名称">
					<Input v-model="config.org_name" placeholder="请输入机构名" style="width: 70%"/>
				</FormItem>
				<FormItem label="机构地址">
					<Input v-model="config.address" placeholder="请输入机构地址" style="width: 70%"/>
				</FormItem>
				<FormItem label="联系电话">
					<Input v-model="config.mobile" placeholder="请输入联系电话" style="width: 70%"/>
				</FormItem>
			</template>
			<template v-if="type=='fc_prefix'">
				<FormItem label="前缀名">
					<Input v-model="config.fc_prefix" placeholder="请输入校区简称前缀名" style="width: 70%"/>
				</FormItem>
			</template>
			<template v-if="type=='store_url'">
				<FormItem label="商城域名">
					<Input v-model="config.store_url" placeholder="请输入商城域名" style="width: 70%"/>
				</FormItem>
			</template>
			<template v-if="type=='login_img'">
				<FormItem label="点击图片上传">
					<Upload
						ref="upload"
						action="/api/upload"
						:headers="upload_header"
						:on-success="handleUploadSuccess1()"
						:format="['jpg','jpeg','png']"
						:max-size="2048"
						type="select"
						style="display: inline-block;cursor: pointer"
						>
						<img :src="client.login_img" class="login_img">
					</Upload>
				</FormItem>
			</template>
			<template v-if="type=='big_logo'">
				<FormItem label="点击图片上传">
					<Upload
						ref="upload"
						action="/api/upload"
						:headers="upload_header"
						:on-success="handleUploadSuccess2()"
						:format="['jpg','jpeg','png']"
						:max-size="2048"
						type="select"
						style="display: inline-block;cursor: pointer"
						>
						<img :src="client.big_logo" class="big_logo">
					</Upload>
				</FormItem>
			</template>
			<template v-if="type=='small_logo'">
				<FormItem label="点击图片上传">
					<Upload
						ref="upload"
						action="/api/upload"
						:headers="upload_header"
						:on-success="handleUploadSuccess3()"
						:format="['jpg','jpeg','png']"
						:max-size="2048"
						type="select"
						style="display: inline-block;cursor: pointer"
						>
						<img :src="client.small_logo" class="small_logo">
					</Upload>
				</FormItem>
			</template>
		</Form>
		<div slot="footer">
			<Button @click="close">关闭</Button>
			<Button type="primary" @click="ok">确定</Button>
		</div>
	</Modal>
</template>

<script>
import modal from '@/libs/modal.mixin'

export default {
	mixins: [modal],
	props: {
		type: {
			type: String,
			default: ''
		},
		data: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			config: {},
			client: {}
		}
	},
	computed: {
		upload_header(){
			return {
				'x-token':this.$store.state.user.token,
				'x-file-key':'file'
			}
		}
	},
	mounted() {
		this.config = { ...this.data.cfg_value };
		this.client = { ...this.$store.state.gvars.configs.center_params.fc };
	},
	methods: {
		handleUploadSuccess1() {
			var vm = this;
			return function(res, file) {
				vm.client.login_img = res.data.file_url;
			}
		},
		handleUploadSuccess2() {
			var vm = this;
			return function(res, file) {
				vm.client.big_logo = res.data.file_url;
			}
		},
		handleUploadSuccess3() {
			var vm = this;
			return function(res, file) {
				vm.client.small_logo = res.data.file_url;
			}
		},
		ok() {
			var type = this.type
			if(type == 'login_img' || type == 'big_logo' || type == 'small_logo') {
				this.axios.request({
					url: `fapi/configs/edit_center_params`,
					method: 'post',
					data: {
						cid: this.$store.state.user.client.cid,
						params: {
							fc: this.client
						}
					}
				})
				.then(res => {
					this.$Message.success('修改成功');
					this.$emit('update', this.config);
					this.$emit('updateClient', this.client);
					this.$store.commit('updateCenterParams', this.client);
					this.close();
				})
				.catch(res => {
					this.$Message.error(res.data.message);
				})
			}
			else {
				// 设置接口
				this.axios.request({
					url: `fapi/configs/${this.data.cfg_id}`,
					method: 'put',
					data: {
						cfg_name: this.data.cfg_name,
						cfg_value: this.config
					}
				})
				.then(res => {
					this.$Message.success('修改成功');
					this.$emit('update', this.config);
					this.close();
				})
				.catch(res => {
					this.$Message.error(res.data.message);
				})
			}
		}
	}
	
}
</script>

<style scoped>
.small_logo {
	width: 40px;
	height: 38px;
}

.big_logo {
	width: 174px;
	height: 38px;
}

.login_img {
	width: 200px;
	height: 100px;
}

.config-form >>> .ivu-form-item {
	margin-bottom: 10px;
}
</style>

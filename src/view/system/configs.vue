<template>
	<div class="configs-page">
		<transition name="fade">
			<table v-if="dataReady" class="configs-table" cellspacing="0">
				<!-- 系统相关设置 -->
				<tr class="configs-section">
					<td colspan="4"><Icon type="ios-hammer" class="section-icon" /> 系统相关设置</td>
				</tr>
				<tr class="configs-item">
					<td>系统参数</td>
					<td>
						机构名称：{{config.org_name|nonEmpty}}<br>
						机构地址：{{config.address|nonEmpty}}<br>
						联系电话：{{config.mobile|nonEmpty}}
					</td>
					<td></td>
					<td><a @click="modifyConfig('system')">修改</a></td>
				</tr>
				<tr class="configs-item">
					<td>校区简称前缀</td>
					<td>
						{{config.fc_prefix|nonEmpty}}
					</td>
					<td></td>
					<td><a @click="modifyConfig('fc_prefix')">修改</a></td>
				</tr>
				<tr class="configs-item">
					<td>商城域名</td>
					<td>
						{{config.store_url|nonEmpty}}
					</td>
					<td></td>
					<td><a @click="modifyConfig('store_url')">修改</a></td>
				</tr>
				
				<tr class="configs-section">
					<td colspan="4"><Icon type="md-browsers" class="section-icon" /> 系统界面设置</td>
				</tr>
				<tr class="configs-item">
					<td>登录背景图</td>
					<td>
						<img :src="client.login_img" class="login_img">
					</td>
					<td>像素比例：1920*1080</td>
					<td><a @click="modifyConfig('login_img')">修改</a></td>
				</tr>
				<tr class="configs-item">
					<td>LOGO-大</td>
					<td>
						<img :src="client.big_logo" class="big_logo">
					</td>
					<td>侧边栏展开时的LOGO，像素比例：180*40</td>
					<td><a @click="modifyConfig('big_logo')">修改</a></td>
				</tr>
				<tr class="configs-item">
					<td>LOGO-小</td>
					<td>
						<img :src="client.small_logo" class="small_logo">
					</td>
					<td>侧边栏收起时的LOGO，像素比例：40*40</td>
					<td><a @click="modifyConfig('small_logo')">修改</a></td>
				</tr>
			</table>
		</transition>
	</div>
</template>

<script>
export default {
	data() {
		return {
			data: {},
			config: {},
			cfgTypeMap: {
				'system': '系统参数',
				'fc_prefix': '校区简称前缀',
				'store_url': '商城域名',
				'login_img': '登录背景图',
				'big_logo': 'LOGO-大',
				'small_logo': 'LOGO-小',
			},
			dataReady: false
		}
	},
	mounted() {
		this.initConfig();
	},
	methods: {
		modifyConfig(type) {
			this.$Modal.open('system/configs/modal/modify-config.vue@modal', {
				props: {
					type: type,
					data: this.data
				},
				on: {
					update: (data) => {
						this.initConfig();
						// this.config = data;
						// this.data.cfg_value = data;
					},
					updateClient: (data) => {
						this.client = data
					}
				}
			})
			.then(modal => {
				modal.show(`修改${this.cfgTypeMap[type]}`)
			})
		},
		initConfig() {
			this.axios.request({
				url: 'fapi/configs',
				method: 'get',
				params: {
					cfg_name: 'franchisee_params'
				}
			})
			.then(res => {
				this.data = res.data.data;
				this.config = res.data.data.cfg_value;
				this.dataReady = true;
			})
			.catch(res => {
				this.$Message.error(res.data.message);
			})
		}
	},
	filters: {
		nonEmpty(value) {
			if(value == '') {
				return '-'
			}
			else {
				return value
			}
		}
	},
	computed:{
		client(){
			return this.$store.state.gvars.configs.center_params.fc
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


/* 设置表格 */
.configs-table {
	width: 100%;
	box-sizing: border-box;
	border: 1px solid #DDD;
}

.configs-table tr {
	width: 100%;
}

.configs-table tr:nth-last-child(1) td {
	border-bottom: none;
}

.configs-table td {
	border-bottom: 1px solid #DDD;
}

.configs-section {
	width: 100%;
	height: 50px;
	color: #333;
	font-size: 15px;
	font-weight: bold;
	background-color: #F0F0F0;
}

.configs-section td {
	padding-left: 30px;
}

.configs-item td {
	padding: 15px 0px 15px 30px;
	line-height: 25px;
}

.configs-item td:nth-child(1) {
	width: 12%;
}

.configs-item td:nth-child(2) {
	width: 23%;
}

.configs-item td:nth-child(3) {
	width: 55%;
	color: #777;
}

.configs-item td:nth-child(4) {
	width: 10%;
	text-align: center;
}

.section-icon {
	position: relative;
	top: -2px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
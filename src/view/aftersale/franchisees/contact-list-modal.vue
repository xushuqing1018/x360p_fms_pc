<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" width="750">
		<div class="mb-2">
			<Button type="primary" icon="md-add" @click="addContact">添加联系人</Button>
			<Button type="primary" class="ml-1" icon="md-refresh" @click="getContactList"></Button>
		</div>
		<Table
			v-loading.like="'persons'"
			:stripe="true"
			:data="data"
			:columns="columns"
			no-data-text="没有数据">
		</Table>
		<div slot="footer">
			<Button type="text" @click="close">关闭</Button>
		</div>
	</Modal>
</template>
<script>
	import util from '@/libs/util'
	import grid from '@/libs//grid.mixin'
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	export default {
		mixins: [common,grid,modal],
		props: {
			franchisee: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				rest_api: 'franchisees',
				pk:'fcp_id',
				column_keys: {
					name: {
						title: '姓名',
						fixed: 'left',
						width: 120,
						show: true
					},
					mobile: {
						title: '手机号',
						width: 120,
						show: true
					},
					is_main: {
						title: '主联系人',
						width: 120
					},
					is_partner: {
						title: '合伙人',
						width: 180,
						show: true
					},
					is_contract_sign: {
						title: '合同签约人',
						width: 120,
						show: true
					},
					email: {
						title: '邮箱',
						width: 160,
						show: true
					},
					id_card_no: {
						title: '身份证号',
						width: 180,
						show: true
					},
					address: {
						title: '通讯地址',
						width: 180,
						show: true
					}
				},
				column_render: {
					name(h,params) {
						let map = {1:'md-male',2:'md-female'}
						let icon = h('Icon',{
							props: {
								type: map[params.row.sex]
							}
						})
						return h('span',[params.row.name,' ',icon])
					},
					is_partner(h,params) {
						if(params.row.is_partner) {
							return h('span',`是，股权比例：${params.row.partner_percent}%`)
						}else{
							return h('span','否')
						}
					},
					is_contract_sign(h,params) {
						return h('span',params.row.is_contract_sign?'是':'否')
					},
					is_main(h,params) {
						return h('span',params.row.is_main?'是':'否')
					}
				},
				operation_keys: {
					edit: {
						title: '编辑',
						type: 'md-create',
						per: 'contact.edit'						
					},
					delete: {
						title: '删除',
						type: 'ios-trash',
						per: 'contact.delete'
					}
				},
				operation_func: {
					edit (params) {						
						this.editInfo(params.row)
					},
					delete (params) {
						this.delContact(params.row)
					}
				}
			}
		},
		methods: {
			onModalOpen() {
				this.getContactList()
			},
			getContactList() {
				this.$rest(this.rest_api).add_url_param(this.franchisee.fc_id,'persons')
				.get()
				.success(res => {
					this.data = res.list
				})
				.error(res => {
					this.$Message.error(res.message)
				})
			},
			addContact() {
				this.$Modal.open('aftersale/franchisees/contact-info-modal.vue',{
					props: {
						'fc-id': this.franchisee.fc_id
					},
					on: {
						save: () => {
							this.getContactList()
						}
					}
				})
				.then(modal => {
					modal.show(util.sprintf('添加联系人【%s】',this.franchisee.org_name),'add')
				})
			},
			editInfo(row) {
				this.$Modal.open('aftersale/franchisees/contact-info-modal.vue',{
					on: {
						save: () => {
							this.getContactList()
						}
					}
				})
				.then(modal => {
					let info = util.copy(row)
					info.partner_percent = Number(info.partner_percent)
					modal
					.set('info',info)
					.show(util.sprintf('编辑联系人【%s】',row.name),'edit')
				})
			},
			delContact(row) {
				this.confirm(util.sprintf('确定删除联系人【%s】吗？',row.name))
				.then(() => {
					this.$rest('franchisee_persons')
					.delete(row.fcp_id)
					.success(res => {
						this.$Message.error('删除成功')
						this.getContactList()
					})
					.error(res => {
						this.$Message.error(res.message)
					})
				})
			}
		},
		computed: {

		}
	}
</script>
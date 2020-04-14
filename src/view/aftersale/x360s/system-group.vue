<template>
	<Form :label-width="100" ref="form_org" class="row" :model="info.org">
        <Form-item prop="host" class="col-md-10 pr-4 ivu-form-item-required" label="系统域名">
            <Input v-model="info.org.host">
                <span slot="prepend">http://</span>
                <span slot="append">{{append}}</span>
            </Input>
        </Form-item>
        <Form-item class="col-md-2 pr-4" label="" :label-width="10">
            <Button type="default" size="small" @click="accountInput">拼音</Button>
        </Form-item>
        <Form-item prop="account_num_limit" class="col-md-4 pr-4 ivu-form-item-required" label="账号数上限">
        	<InputNumber :min="0" :step="1" v-model="info.org.account_num_limit"></InputNumber>
        </Form-item>
        <Form-item prop="branch_num_limit" class="col-md-4 pr-4 ivu-form-item-required" label="校区数上限">
        	<InputNumber :min="0" :step="1" v-model="info.org.branch_num_limit"></InputNumber>
        </Form-item>
        <Form-item prop="student_num_limit" class="col-md-4 pr-4 ivu-form-item-required" label="学员数上限">
        	<InputNumber :min="100" :step="1" v-model="info.org.student_num_limit"></InputNumber>
        </Form-item>
        <Form-item prop="org_type" class="col-md-4 pr-4 ivu-form-item-required" label="系统类型">
            督导沟通版
        </Form-item>
        <!-- <Form-item label="到期日期" prop="expire_day" class="col-md-6 pr-4 ivu-form-item-required" v-if="modal.action!=='edit'">
        	<DatePicker 
            	type="date" 
            	:value="info.org.expire_day" 
            	:transfer="true"
            	style="width:210px"
            	:options="options"
            	@on-change="info.org.expire_day = $event"
            	placeholder="请选择到期日期">
            </DatePicker>
        </Form-item> -->
    </Form>
</template>
<script>
    import util from '@/libs/util'
    import pinyin from '@/libs/pinyin'
	import globals from '@/libs/globals.mixin'
	export default {
		mixins: [globals],
		props: {
			info: {
				type: Object,
				default() {
					return {}
				}
			},
			modal: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				options: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                }
			}
		},
        methods: {
            accountInput(){
                let host = ''
                host = pinyin.getFirstFull(this.info.org.org_name)
                this.info.org.host = host
            }
        },
		computed: {
            product_url() {
                return this.$store.state.user.info.product_url.split('//')[1]
            },
            append() {
                return util.sprintf('.%s',this.product_url)
            }
		}
	}
</script>
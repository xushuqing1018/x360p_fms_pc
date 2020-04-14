<template>
    <div style="position: relative;">
    	<Form :label-width="100" ref="form_org" class="row" :model="info.org">
            <Form-item label="机构名称" class="col-md-6 pr-4 ivu-form-item-required" prop="org_name">
            	<Input type="text" v-model="info.org.org_name" placeholder="请输入机构名称"></Input>
            </Form-item>
            <Form-item label="机构简称" class="col-md-6 pr-4" prop="org_short_name">
            	<Input type="text" v-model="info.org.org_short_name" placeholder="请输入机构简称"></Input>
            </Form-item>
            <Form-item prop="areas_arr" class="col-md-6 pr-4" label="机构位置">
                 <Cascader trigger="hover" :data="areas" v-model="org_area" placeholder="请输入机构位置" v-if="!spinShow"></Cascader>
            </Form-item>
            <Form-item prop="address" class="col-md-6 pr-4 ivu-form-item-required" label="详细地址">
            	<Input type="text" v-model="info.org.org_address" placeholder="请输入详细地址" ></Input>
            </Form-item>
            <Form-item prop="mobile" class="col-md-6 pr-4 ivu-form-item-required" label="联系电话">
                <Input type="text" v-model="info.org.mobile" placeholder="请输入联系电话" ></Input>
            </Form-item>
            <Form-item prop="join_in_day" class="col-md-6 pr-4 ivu-form-item-required" label="加盟日期">
                <DatePicker 
                    :value="info.org.join_int_day" 
                    style="width:210px"
                    @on-change="info.org.join_int_day = $event"
                    placeholder="请选择加盟日期"
                    >
                </DatePicker>
            </Form-item>
            <Form-item prop="open_in_day" class="col-md-6 pr-4" label="开业日期">
                <DatePicker 
                    :value="info.org.open_int_day" 
                    style="width:210px"
                    @on-change="info.org.open_int_day = $event"
                    placeholder="请选择开业日期"
                    >
                </DatePicker>
            </Form-item>
        </Form>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
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
                spinShow: true
            }
        },
		computed: {
	        org_area:{
                get:function(){
                    let arr = [this.info.org.province_id,this.info.org.city_id,this.info.org.district_id]
                    this.info.org.areas_arr = arr
                    return arr
                },
                set:function(value){
                    if(value.length > 0) {
                        this.info.org.province_id = value[0]
                        this.info.org.city_id = value[1]
                        this.info.org.district_id = value[2]
                        this.info.org.areas_arr = value
                    }
                }
            }
		},
        watch: {
            'modal.show': function(val) {
                if(val) {
                    if(this.modal.action=='add') {
                        this.org_area.splice(0,this.org_area.length)
                    }
                    setTimeout(() => {
                        this.spinShow = false
                    },100)
                }
            }
        }
	}
</script>
<template>
    <div>
        <Tabs>
            <TabPane label="云课堂顶部轮播图">
                <top-banner :info="data.clesson_top_banner"></top-banner>
            </TabPane>
            <TabPane label="作品集顶部轮播图">
                <top-banner :info="data.cimage_top_banner"></top-banner>
            </TabPane>
            <!--
            <TabPane label="个人中心顶部背景图">
                <div style="display: flex;">
                    <img :src="data.my_top_bg" width="300" height="200">
                    <i class="ivu-icon ivu-icon-ios-close" @click="delImage" v-if="data.my_top_bg != ''" style="font-weight: bold;font-size: 24px;"></i>
		        	<c-upload v-model="data.my_top_bg" btn-text="更换" style="margin-left: 10px;"></c-upload>
                </div>
            </TabPane>
            -->
        </Tabs>
        <div class="mt-4">
            <Button type="primary" @click="ok">保存</Button>
            <Button type="primary" @click="init_data" style="margin-left: 10px;">撤销改动</Button>
        </div>
    </div>
</template>

<script>
    import TopBanner from './setting/top-banner.vue'
    import cUpload from "c%/cUpload.vue"

    export default {
        components:{
            TopBanner,
            cUpload
        },
        data(){
            return {
                data:{
                    clesson_top_banner:[],
                    cimage_top_banner:[],
                    my_top_bg:''
                }
            }
        },
        mounted(){
            this.init_data()
        },
        methods:{
            init_data(){
                this.$rest('appconfigs?app=cloudclass')
                .get()
                .success(data => {
                    this.data = data
                })
                .error(res => {
                    this.$Message.error(res.message)
                })
            },
            delImage(){
                this.data.my_top_bg = ''
            },
            ok(){
                this.$rest('appconfigs')
                .post({
                    app:'cloudclass',
                    config:this.data
                })
                .success(res => {
                    this.$Message.success('保存成功')
                    this.init_data()
                })
                .error(res => {
                    this.$Message.error(res.message)
                })
            }
        }
    }
</script>

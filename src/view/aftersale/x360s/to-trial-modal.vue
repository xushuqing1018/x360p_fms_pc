<template>
    <Modal draggable v-model="modal$.show" :mask-closable="false" :title="modal$.title" width="600">
        <Form :label-width="100">
            <Form-item label="原因" prop="transfer_reason_did" class="ivu-form-item-required">
                <Select v-model="info.transfer_reason_did" style="width: 50%;">
                    <Option :value="item.did" v-for="item in transfer_reason_list">{{item.title}}</Option>
                </Select>
            </Form-item>
        </Form>
        <div slot="footer">
            <Button @click="close">关闭</Button>
            <Button type="primary" :loading="saving" @click="ok">确定</Button>
        </div>
    </Modal>
</template>
<script>
    import modal from '@/libs/modal.mixin'
    import common from '@/libs/common.mixin'
    import moment from 'moment'

    export default {
        mixins: [modal,common],
        data() {
            return {
                info: {
                    transfer_reason_did: ''
                },
                og_id: 0
            }
        },

        computed: {
            transfer_reason_list() {
                return this.$store.state.gvars.dicts.transfer_reason
            }
        },
        methods: {
            ok() {
                if(!this.info.transfer_reason_did) {
                    this.$Message.error('原因不能为空')
                    return
                }
                this.$http.post(`fapi/orgs/${this.og_id}/change_org_type`, {
                    org_type: 2,
                    transfer_reason_did: this.info.transfer_reason_did
                })
                    .then(res => {
                        this.$Message.success('转化成功')
                        this.$emit('save')
                        this.close();
                    },res => {
                        this.$Message.error(res.body.message)
                    })
            },
        }
    }
</script>
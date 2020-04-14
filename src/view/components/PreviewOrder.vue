<template>
    <Modal draggable v-model="modal$.show" :title="modal$.title" width="500" :mask-closable="false">        
        <div style="overflow: auto">
            <div class="pd-10">
                <div class="pd-10">
                    <div class="voice-item">
                        <table style="width:100%;">
                            <thead>
                                <tr>
                                    <th width="30%" align="left">业务名称</th>
                                    <th width="70%" align="left">业务值</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>appid</td>
                                    <td>{{result.appid}}</td>
                                </tr>
                                <tr>
                                    <td>bank_type</td>
                                    <td>{{result.bank_type}}</td>
                                </tr>
                                <tr>
                                    <td>cash_fee</td>
                                    <td>{{result.cash_fee}}</td>
                                </tr>

                                <tr>
                                    <td>fee_type</td>
                                    <td>{{result.fee_type}}</td>
                                </tr>
                                <tr>
                                    <td>is_subscribe</td>
                                    <td>{{result.is_subscribe}}</td>
                                </tr>
                                <tr>
                                    <td>mch_id</td>
                                    <td>{{result.mch_id}}</td>
                                </tr>
                                <tr>
                                    <td>nonce_str</td>
                                    <td>{{result.nonce_str}}</td>
                                </tr>
                                <tr>
                                    <td>openid</td>
                                    <td>{{result.openid}}</td>
                                </tr>
                                <tr>
                                    <td>out_trade_no</td>
                                    <td>{{result.out_trade_no}}</td>
                                </tr>
                                <tr>
                                    <td>result_code</td>
                                    <td>{{result.result_code}}</td>
                                </tr>
                                <tr>
                                    <td>return_code</td>
                                    <td>{{result.return_code}}</td>
                                </tr>
                                <tr>
                                    <td>sign</td>
                                    <td>{{result.sign}}</td>
                                </tr>
                                <tr>
                                    <td>time_end</td>
                                    <td>{{result.time_end}}</td>
                                </tr>
                                <tr>
                                    <td>total_fee x 100</td>
                                    <td>{{result.total_fee}}</td>
                                </tr>
                                <tr>
                                    <td>trade_type</td>
                                    <td>{{result.trade_type}}</td>
                                </tr>
                                <tr>
                                    <td>transaction_id</td>
                                    <td>{{result.transaction_id}}</td>
                                </tr>
                            </tbody>
                        </table>                         
                    </div> 
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button @click="close">关闭</Button>
        </div>
    </Modal>
</template>
<script>
    import modal from '@/libs/modal.mixin'
    import common from '@/libs/common.mixin'
    export default {
        mixins: [common,modal],
        components: {
           
        },
        props: {
            result: {
                type : Object,
                default: () => {
                    return []
                }
            }

        },
        data () {
            return {
                
            }
        },
        methods: {
            
        }
        
    }
</script>
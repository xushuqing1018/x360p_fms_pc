<template>
    <div>
        <table class="modal-table" style="background-color: white;">
            <thead>
                <tr>
                    <th>
                        <div class="ivu-table-cell">链接地址</div>
                    </th>
                    <th>
                        <div class="ivu-table-cell">图片</div>
                    </th>
                    <th>
                        <div class="ivu-table-cell">操作</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in info" :key="index">
                    <td>
                        <div class="ivu-table-cell">
                            <Input
                                v-model="item.url"
                                size="small"
                                placeholder="链接地址"
                            ></Input>
                        </div>
                    </td>
                    <td>
                        <div class="ivu-table-cell" style="display: flex;">
                            <img :src="item.img" style="width: 200px;height: 100px;" />
                            <c-upload 
                            v-model="item.img" 
                            btn-text="设置" 
                            :upload-way="[0,3]"
                            style="margin-left: 10px;"></c-upload>
                        </div>
                    </td>
                    <td>
                        <div class="ivu-table-cell">
                            <Button type="text" icon="ios-trash" @click="del(item,index)"></Button>
                        </div>
                    </td>
                </tr>
                <tr v-if="info.length < 5">
                    <td colspan="4">
                        <div class="text-center">
                            <Button type="default" long icon="plus" @click="add()">添加</Button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import cUpload from "c%/cUpload.vue"

    export default {
        components:{
            cUpload
        },
        props:{
            info:{
                type:Array,
                default() {
					return []
				}
            }
        },
        methods:{
            add() {
                let item = {
                    img: '',
                    url: ''
                }
                this.info.push(item)
            },
            del(item, index) {
                this.info.splice(index, 1)
            }
        }
    }
</script>

<style scoped>
    table thead tr th,table tbody tr{
        background-color: white !important;
    }
</style>
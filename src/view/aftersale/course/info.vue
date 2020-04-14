<style scoped>
</style>

<template>
    <div class="franchisee-info">
        <div class="c-grid">
            <div class="box box-query">
                <Form
                    ref="ref_search"
                    :model="search_field"
                    :label-width="90"
                    class="filter-form row"
                >
                    <Form-item label="机构名称/简称" prop="org_name" class="col-md-3 col-sm-6">
                        <Input
                            v-model="search_field.org_name"
                            @on-enter="search"
                            placeholder="机构名称/简称"
                        ></Input>
                    </Form-item>
                    <FormItem label="年龄段" prop="grade_section" class="col-md-3 col-sm-6">
                        <Select v-model="search_field.grade_section">
                            <Option
                                v-for="(item,index) in age_sections"
                                :key="index"
                                :value="item.value"
                            >{{item.title}}</Option>
                        </Select>
                    </FormItem>
                    <Form-item label="创建时间" prop="create_time" class="col-md-3 col-sm-6">
                        <DatePicker
                            :value="search_field.create_time"
                            @on-change="search_field.create_time=$event"
                            placeholder="创建时间"
                        ></DatePicker>
                    </Form-item>
                </Form>

                <Row class="basic">
                    <Col span="24">
                        <Button
                            type="primary"
                            icon="ios-arrow-back"
                            size="small"
                            class="mr-2"
                            @click="back"
                        >返回</Button>
                        <Button type="primary" icon="ios-search" @click="search">查询</Button>
                        <Button type="primary" icon="refresh" @click="resetSearch">重置</Button>
                    </Col>
                </Row>
            </div>

            <div class="content">
                <div class="content-body">
                    <div class="text-center" v-if="loading">正在加载数据...</div>
                    <template v-else>
                        <div class="empty" v-if="list.length == 0">
                            <p>无数据...</p>
                        </div>
                        <csf-list :list="list"></csf-list>
                    </template>
                </div>
                <div class="content-footer" style="text-align: right;">
                    <div class="pagenation">
                        <Page
                            :total="total"
                            :current="pageIndex"
                            :page-size="pageSize"
                            :show-total="true"
                            @on-change="pagenation"
                            @on-page-size-change="pagesize"
                        ></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import util, { _ } from '@/libs/util'
import grid from '@/libs/grid.mixin'
import common from '@/libs/common.mixin'
import globals from '@/libs/globals.mixin'
import CsfList from 'c%/CsfList.vue'

export default {
    mixins: [grid, globals, common],
    components: {
        CsfList
    },
    data() {
        let vm = this
        return {
            rest_api: 'course_cases?cct_id=' + Number(this.$route.params.id),
            cct_id: Number(this.$route.params.id),
            search_field: {
                cctit_id: 0,
                org_name: '',
                create_time: '',
                grade_section:''
            },
            list: [],
            age_sections: [
                { title: '2-3', value: '2-3' },
                { title: '4-5', value: '4-5' },
                /* { title: '5-6', value: '5-6' },
                { title: '7-8', value: '7-8' },
                { title: '9-10', value: '9-10' }, */
                { title: '4-6', value: '4-6' },
                { title: '6-7', value: '6-7' },
                { title: '7-12', value: '7-12' },
                { title: '8-9', value: '8-9' },
                { title: '2-12', value: '2-12' },
                { title: '10-12', value: '10-12' },
                { title: '不限', value: '0' }
            ]
        }
    },
    methods: {
        back() {
            this.$store.commit('setSearchDetail', true)
            this.$router.push('/aftersale/course')
        },
        refresh(rs) {
            this.data = rs.response
        },
        resetSearch() {
            this.$form('ref_search').reset()
            this.init_data()
        },
        deal_data(data) {
            var list = data.list
            this.list = list
        },
        hook_get_param(params) {
            let search_obj = util.copy(this.search_field)
            for (let o in search_obj) {
                let property = search_obj[o]
                if (property && property!=0) {
                    params[o] = property
                }
            }
        }
    },
    computed: {},
    mounted() {
        this.init_data()
    }
}
</script>

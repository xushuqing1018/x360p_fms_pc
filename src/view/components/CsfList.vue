<template>
    <div>
        <div v-for="(item, index) in list" :key="index" style="margin-bottom: 20px">
            <div class="cs-bg">
                <div class="cs-img">
                    <h2>{{item.course_case_title.grade_section}} <span v-if="item.course_case_title.week_duration == 1">周中</span><span v-else-if="item.course_case_title.week_duration == 2">周末</span> {{item.course_case_title.title}}</h2>
                    <h3>{{item.user.name}} <span>{{item.org ? item.org_name : ''}}</span></h3>
                    <p style="color: rgb(55, 102, 195); margin-top: 5px;">{{item.create_time}}</p>
                    <file-item :list="item.course_case_file"></file-item>
                    <p style="color: rgb(55, 102, 195);">{{item.course_case_topic.topic}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import util from '@/libs/util'
import grid from '@/libs/grid.mixin'
import common from '@/libs/common.mixin'
import globals from '@/libs/globals.mixin'
import FileItem from 'c%/FileItem.vue'
export default {
    mixins: [grid, common, globals],
    name: 'CsfList',
    components:{
      FileItem
    },
    props: {
        list: {
            type: Array
        }
    },
    data () {
        return {
            imgArray: [] // 图片唯一标识
        }
    },
    filters:{

    },
    methods: {

    }
}
</script>
<style scoped>
  .cs-img h3{
      margin-top: 10px;font-weight: normal;
  }
    .cs-img h3 span{display: inline-block;border: 1px solid #1890FF;color: #1890FF;padding: 0 5px;margin-left: 10px;}
.cs-bg {
    background-color: #fff;
    transition: all 0.2s;
    min-height: 150px;
    width: 100%;
    padding: 15px 10px;
    position: relative;
    margin: 10px auto;
    border-bottom: 1px solid #f2f2f2;
}

.cs-bg:hover {
    box-shadow: 0px 0px 10px #DDD;
}

.cs-img {
    height: 100%;
    display: inline-block;
    vertical-align: top;
}

.cs-img img {
    width: 70px;
    height: 70px;
    max-width: 100%;
    max-height: 100%;
    margin-top: 20px;
    margin-right: 20px;
}


.cs-title {
    position: absolute;
    top: 0px;
    left: 10px;
}

.cs-desc {
    margin-top: 20px;
}


.cs-desc>span {
    margin-right: 20px;
}

.cs-status {
    font-size: 13px;
    position: absolute;
    top: 5px;
    right: 15px;
}

.cs-op {
    position: absolute;
    bottom: 5px;
    right: 10px;
}

.cs-check-active {
    border: 1px solid #3399ff;
}

.cs-check-mode {
    cursor: pointer;
}

.cs-check-wrap {
    position: absolute;
    right: 5px;
    top: 45px;
}

.cs-check {
    margin-top: 2px;
}
</style>

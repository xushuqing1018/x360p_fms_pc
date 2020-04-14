<style lang="less">

</style>
<template>
	<Modal width="400" v-model="modal$.show" :title="modal$.title">
    <Form :model="course" label-position="right" :label-width="100">
        <FormItem label="课案标题" prop="title" class="ivu-form-item-required">
            <Input v-model="course.title" style="width:200px" placeholder="请输入课案标题" />
        </FormItem>
        <FormItem label="课案主题" prop="cct_id" class="" style="width: 82%">
            <Select v-model="course.cct_id">
            	<Option v-for="(item,index) in course_case_topics" :key="index" :value="item.cct_id">{{item.topic}}</Option>
            </Select>
        </FormItem>
        <FormItem label="年龄段" prop="grade_section" class="ivu-form-item-required">
            <Select v-model="course.grade_section">
            	<Option v-for="(item,index) in age_sections" :key="index" :value="item.value">{{item.title}}</Option>
            </Select>
        </FormItem>
        <FormItem label="上课时间" prop="week_duration" class="">
            <RadioGroup v-model="course.week_duration">
                <Radio :label="1">周中</Radio>
                <Radio :label="2">周末</Radio>
            </RadioGroup>
        </FormItem>
    </Form>
    <div slot="footer">
			<Button type="ghost" @click="close" style="color:#666;">关闭</Button>
			<Button type="primary" :loading="saving" @click="save()">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import modal from '@/libs/modal.mixin'
  import common from '@/libs/common.mixin'

	export default {
    mixins: [grid,modal,common],
    components: {
    },
		data() {
			return {
        course:{
          title: '',
          cct_id: '',
          grade_section: '',
          week_duration: 0
        },
        age_sections:[
          {title:'2-3',value:'2-3'},
          {title:'4-5',value:'4-5'},
          {title:'4-6',value:'4-6'},
          {title:'6-7',value:'6-7'},
          {title:'7-12',value:'7-12'},
          {title:'8-9',value:'8-9'},
          //{title:'9-10',value:'9-10'},
          {title:'10-12',value:'10-12'},
          {title:'2-12',value:'2-12'}
        ],
        type_array: [],
        item: {},
        course_case_topics: []
			}
    },
    watch:{

    },
		mounted() {
			this.get_course_case_topics()
		},
    methods: {
      get_course_case_topics(){
        this.$rest('course_case_topics')
        .get()
        .success(res => {
           this.course_case_topics = res.list
        })
      },
      save () {
	      let method = this.modal$.action == 'add'?'post':'put'
				let action = this.modal$.action == 'add'?'添加':'编辑'
				let $rest = this.$rest("course_case_titles")
	      if(this.modal$.action == 'edit') {
						$rest.add_url_param(this.course.cctit_id)
				}
	      $rest[method](this.course)
	        .success(response=>{
	          this.$Message.success(util.sprintf('%s成功!',action))
	          this.$emit('on-success')
	          this.close()
	      	})
	        .error(response=>{
	          this.$Message.error(response.message)
	        })
      },
    },
    computed: {
      action_type () {
        return this.modal$.action == 'add'
      }
    }
	}
</script>

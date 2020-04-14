<template>
	<div>
		<Menu 
		mode="horizontal" 
		theme="light" 
		active-name="user_nums"
		@on-select="changeTab"
		>
	        <MenuItem name="user_nums">
	            <Icon type="ios-people" />
	            用户数据
	        </MenuItem>
	        <MenuItem name="course_case_nums">
	            <Icon type="ios-people" />
	            作品
	        </MenuItem>
	        <MenuItem name="register_nums_1">
	            <Icon type="ios-people" />
	            会员数据
	        </MenuItem>
	        <MenuItem name="register_nums_2">
	            <Icon type="ios-people" />
	            非会员数据
	        </MenuItem>
            <MenuItem name="vod_files">
	            <Icon type="ios-people" />
	            课程
	        </MenuItem>
            <!-- <MenuItem name="login_logs">
	            <Icon type="ios-people" />
	            用户登录日志
	        </MenuItem> -->
          <MenuItem name="login_ip">
              <Icon type="ios-people" />
              用户登录IP统计
          </MenuItem>
	  <MenuItem name="user_and_course_cases">
	            <Icon type="ios-people" />
	            用户作品上传统计
	        </MenuItem>
	    </Menu>
        <user-nums v-if="tab=='user_nums'"></user-nums>
        <course-case-nums v-if="tab=='course_case_nums'"></course-case-nums>
        <register-nums v-if="tab=='register_nums_1'" :reg_type="1"></register-nums>
        <register-nums v-if="tab=='register_nums_2'" :reg_type="2"></register-nums>
        <vod-files v-if="tab=='vod_files'"></vod-files>
	    <login-logs v-if="tab=='login_logs'"></login-logs>
      <login-ip v-if="tab=='login_ip'"></login-ip>
      <user-and-course-cases v-if="tab=='user_and_course_cases'"></user-and-course-cases>
	</div>
</template>
<script>

	import common from '@/libs/common.mixin'
    import LoginLogs from './reports/login-logs.vue'
    import VodFiles from './reports/vod-files.vue'
    import RegisterNums from './reports/register-nums.vue'
    import CourseCaseNums from './reports/course-case-nums.vue'
    import UserNums from './reports/user-nums.vue'
    import LoginIp from './reports/login-ip.vue'
    import UserAndCourseCases from './reports/user-and-course-cases.vue'

	export default{
		mixins: [common],
		components: {
            LoginLogs,
            VodFiles,
            RegisterNums,
            CourseCaseNums,
            UserNums,
            LoginIp,
	    UserAndCourseCases
		},
		data () {
			return {
				tab:'user_nums'
			}
		},
		methods:{
			changeTab(name){
                this.tab = name
			}
		}
	}
</script>

<style lang="less">
  @import '../style/login.less';
</style>

<template>
  <div class="login" :style="{backgroundImage: loginBg}">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="true" :dis-hover="true">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入账号和密码登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  computed: {
    loginBg() {
      if(window.CLIENT_PARAMS.fc) {
        return `url('${window.CLIENT_PARAMS.fc.login_img}')`
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password })
			.then(res => {
					this.$store.dispatch('getGlobalVars')
          this.$router.push({
            name: this.$config.homeName
          })
      },res=>{
				let msg = '',
						msg_map = {
						'captcha_error':'验证码错误',
						'password_is_wrong':'密码错误',
						'account_does_not_exists':'账号不存在',
						'user_is_disabled':'账号被禁用',
						'client_time_not_correct':'您的电脑系统日期不对,请先将电脑日期设置正确!'
					}
				if(res.error == 500){
					msg = '服务器忙'
				}else{
					msg = msg_map[res.data.message]
          if(!msg) {
            msg = res.data.message;
          }
				}
				
				this.$Message.error(msg)
			})
    }
  }
}
</script>


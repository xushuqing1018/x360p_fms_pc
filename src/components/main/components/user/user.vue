<style lang="less">
  .user-avator-dropdown {
    .ivu-badge {
      span{
        vertical-align: middle;
        margin-left: 4px;
      }
    }
    .dropdown-account {
      text-align: center;
      background: #f0f3f5;
      border-bottom: 1px solid #c2cfd6;
    }
  }
</style>
<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userInfo.avatar"/>
      <Badge :dot="!!messageUnreadCount">
        <span>{{userInfo.name}}</span>
      </Badge>
      <Icon :size="16" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <li class="ivu-dropdown-item dropdown-account"><strong>{{userInfo.account}}</strong></li>
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userInfo: Object,
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_index'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>

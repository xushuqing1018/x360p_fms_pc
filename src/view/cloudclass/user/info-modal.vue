<style>
.ivu-select-dropdown {
  z-index: 9999 !important;
}
</style>
<template>
  <Modal width="650" v-model="modal$.show" :title="modal$.title">
    <Form label-position="right" :label-width="100" class="row">
      <FormItem label="用户名：" prop="account" class="col-md-12 ivu-form-item-required">
        <Input v-model="info.account" placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="姓名：" prop="name" class="col-md-12 ivu-form-item-required">
        <Input v-model="info.name" placeholder="请输入姓名" />
      </FormItem>
      <FormItem label="电话：" class="col-md-12 ivu-form-item-required">
        <Input v-model="info.mobile" placeholder="请输入电话" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="close" style='color:#666'>关闭</Button>
      <Button type="primary" :loading="saving" @click="save()">提交</Button>
    </div>
  </Modal>
</template>
<script>
import util from "@/libs/util";
import modal from "@/libs/modal.mixin";
import common from "@/libs/common.mixin";
import globals from '@/libs/globals.mixin'

const emptyObject = {
  name: "",
  mobile: ""
};

export default {

  mixins: [modal, common,globals],
  components: {

  },
  data() {
    return {
      info: util.copy(emptyObject),
      item: {},
    };
  },
  mounted() {

  },

  watch: {
    "modal$.action": function(val) {
      if (val == "edit") {
        this.info = this.item;
      }
    },
  },

  methods: {

    save() {
      let method = this.modal$.action == "add" ? "post" : "put";
      let action = this.modal$.action == "add" ? "添加" : "编辑";
      let $rest = this.$rest("users");
      if (this.modal$.action != "add") {
        $rest.add_url_param(this.item.uid);
      }
      $rest[method](this.info)
        .success(response => {
          this.$Message.success(util.sprintf("%s成功!", action));
          this.$emit("on-success");
          this.close();
        })
        .error(response => {
          this.$Message.error(response.message);
        });
    }
  }

};
</script>

<style>
.ivu-select-dropdown {
  z-index: 9999 !important;
}
</style>
<template>
  <Modal width="650" v-model="modal$.show" :title="modal$.title">

    <Form label-position="right" :label-width="100" class="row">

      <Form-item label="分类：" prop="vc_id" class="col-md-12 ivu-form-item-required">
          <Select v-model="info.vc_id">
          	<Option v-for="(item,index) in type_list" :key="index" :value="item.vc_id">{{item.cate_name}}</Option>
          </Select>
      </Form-item>

      <FormItem label="是否隐藏" prop="is_hidden" class="col-md-12 ivu-form-item-required">
          <RadioGroup v-model="info.is_hidden">
              <Radio :label="1">隐藏</Radio>
              <Radio :label="0">显示</Radio>
          </RadioGroup>
      </FormItem>

       <FormItem label="年龄段：" prop="grade_section" class="ivu-form-item-required">
            <Select v-model="info.grade_section">
            	<Option v-for="(item,index) in age_sections" :key="index" :value="item.value">{{item.title}}</Option>
            </Select>
        </FormItem>


      <FormItem label="标题：" prop="title" class="col-md-12 ivu-form-item-required">
        <Input v-model="info.title" placeholder="请输入课标标题" />
      </FormItem>

      <FormItem label="描述：" prop="title" class="col-md-12">
        <Input type="textarea" v-model="info.desc" placeholder="请输入课标描述" />
      </FormItem>

      <FormItem label="观看次数：" prop="title" class="col-md-12">
        <InputNumber :max="10000000000" :min="0" v-model="info.view_nums"></InputNumber>
      </FormItem>

      <FormItem label="封面图：" prop="cover_img_url" class="col-md-12 ivu-form-item-required">
        <div class="img-upload">
          <div class="img-thumb" style="width: 159px;height: 88px;line-height: 88px;text-align:center;border: 1px dotted #ccc;">
            <Icon
              type="ios-camera"
              size="30"
              v-if="info.cover_image_url == ''"
              style="line-height: inherit;"
            ></Icon>
            <img
              class="cursor"
              width="159px"
    		      height="88px"
              :src="info.cover_image_url"
              @click="picturePreview(info.cover_image_url)"
              v-else
            />
          </div>
        </div>
        <c-upload v-model="info.cover_image_url" btn-text="上传"></c-upload>
      </FormItem>

      <FormItem label="链接地址：" class="col-md-12">
        <Input v-model="info.external_url" placeholder="请输入链接地址" />
      </FormItem>

      <FormItem label="视频ID：" class="col-md-12">
        <Input v-model="info.vid" placeholder="请输入视频ID" />
      </FormItem>

      <FormItem label="免费有效期：" class="col-md-12 ivu-form-item-required">
      	  <DatePicker :value="info.free_expire_time" type="datetime" @on-change="info.free_expire_time=$event" placeholder="选择日期和时间"></DatePicker>
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

import cUpload from "c%/cUpload.vue";
import Umeditor from "c%/Umeditor";

const emptyObject = {
  title: "",
  vf_id: 0,
  cover_image_url: "",
  vid: "",
  is_hidden: 0,
  external_url: "",
  grade_section:"2-12",
  desc:"",
  view_nums:0
};

export default {

  mixins: [modal, common,globals],
  components: {
    cUpload,
    Umeditor,
  },
  data() {
    return {
      info: util.copy(emptyObject),
      upload_percent: 0,
      type_list: [],
      item: {},
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
    };
  },
  mounted() {
  	this.get_type_list()
  },

  watch: {
    "modal$.action": function(val) {
      if (val == "edit") {
        this.info = this.item;
      }
    },
  },

  methods: {
  	get_type_list(){
  		this.$rest('vod_cates')
  		.get()
  		.success(res => {
  			this.type_list = res.list
  		})
  	},
    save() {
      let method = this.modal$.action == "add" ? "post" : "put";
      let action = this.modal$.action == "add" ? "添加" : "编辑";
      let $rest = this.$rest("vod_files");
      if (this.modal$.action != "add") {
        $rest.add_url_param(this.item.vf_id);
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

<template>
	<div>
		<div class="p-3" v-if="file_list('voice').length>0">
			<div class="pd-10 file-list-container">
				<div :class="index>0?'ml-3':''" v-for="(item,index) in file_list('voice')" align="center" :key="index">
					<div class="review-upload-list">
						<play-voice class="voice-s" :src="item.file_url" :active="index===active_voice" @click.native="active_voice = index">
							<span class="image-close" @click.stop="delFile(item)" v-if="clearable">X</span>
						</play-voice>
					</div>
				</div>
			</div>
		</div>
		<div class="p-3" v-if="file_list('image').length>0">
			<div class="pd-10 file-list-container">
				<div :class="index>0?'ml-3':''" v-for="(item,index) in file_list('image')" align="center" :key="index">
					<a class="review-upload-list" @click="show_ref_picture(item.file_url)">
			            <img :src="item.file_url">
			            <span class="image-close" @click.stop="delFile(item)" v-if="clearable">X</span>
				    </a>
				</div>
			</div>
		</div>
		<div class="p-3" v-if="file_list('video').length>0">
			<div class="pd-10 file-list-container">
				<div :class="index>0?'ml-3':''" v-for="(item,index) in file_list('video')" align="center" :key="index">
					<div class="video video-item" @click="previewVideo(item)" style="position: relative;">
			            <img :src="item.file_url+'?vframe/jpg/offset/1/w/130/h/130'">
			            <span class="ivu-icon ivu-icon-ios-play"></span>
			            <span class="image-close" @click.stop="delFile(item)" v-if="clearable">X</span>
				    </div>
				</div>
			</div>
		</div>
		<div class="p-3" v-if="file_list('file').length>0">
			<div class="pd-10 file-list-container">
				<div :class="index>0?'ml-3':''" v-for="(item,index) in file_list('file')" align="center" :key="index">
					<div class="review-upload-list">
						<a :href="item.file_url" :title="item.file_name" target="_blank">
				            <img :src="replaceFileImage(item)">
				            <span class="image-close" @click.stop="delFile(item)" v-if="clearable">X</span>
					    </a>
				    </div>
				</div>
			</div>
		</div>
        <video-preview ref="videoPreview"></video-preview>
        <picture-pre ref="ref_picture"></picture-pre>
	</div>
</template>

<script>
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import PlayVoice from 'c%/playVoice.vue'
	import VueVideo from 'c%/vueVideo.vue'
	import VideoPreview from 'c%/VideoPreview.vue'
  import PicturePre from 'c%/PicturePreview.vue'

	export default{
		mixins: [ common, modal ],
		components: {
			PlayVoice,
			VueVideo,
			VideoPreview,
      PicturePre
		},
		props: {
			list: {
				type: Array,
				default: ()=>{
					return []
				}
			},
			clearable: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				active_voice: -1
			}
		},
		methods: {
      show_ref_picture(imgSrc){
        this.$refs.ref_picture
        .set('imgSrc',imgSrc)
        .show('图片预览','add')
      },
			file_list (type) {
            	let [result,uploadList] = [[],this.list]
            	if(uploadList.length>0){
            		//console.log('type:'+type)
            		result = uploadList.filter(u=>u.media_type==type)
            		//console.log(result)
            	}
            	return result
			},
			previewVideo(item) {
				this.$refs.videoPreview
				.set('video',item)
				.show('播放视频')
			},
			delFile (item) {
				let index = this.list.indexOf(item)
				if(index > -1){
					this.list.splice(index,1)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.file-list-container{
		div{
			display: inline-block;
		}
	}
  a.review-upload-list{
    width: 120px;
    height: 120px;
  }
  .ivu-icon-ios-play{
        font-size: 35px;
        position: absolute;
        top: 45px;
        left: 50px;
        color: #fff;
        z-index: 3;
  }
</style>

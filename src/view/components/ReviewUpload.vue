<style lang="less">
    .image-close{
        position: absolute;
        display: inline-block;
        right: -6px;
        top: -6px;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 12px;
        background-color: #FF5053;
        color: #f3f3f3;
        border: solid 1px #FF5053;
        font-size: 9px;
        font-weight: 200;
        z-index: 1;
    }
    .space{
    	border: none !important;	    
	}
	.voice-item{
	    width: 65px;
	    height: 65px;
	    padding: 3px;
	    text-align: left;
	    border-radius: 10px;
	    position: relative;
	    border: 1px solid #ccc;
	    background: #fff;
	}
	.video-item{
		position: relative;
		width: 65px;
		height: 65px;
		img{
			width: 100%;
			border-radius: 5px;
		}
		.ivu-icon-play{
		    font-size: 25px;
		    position: absolute;
		    top: 20px;
		    left: 0;
		    width: 65px;
		    color: #FFF;
		    z-index: 3;
		}
		&:after{
		    top: 0;
		    left: 0;
		    z-index: 1;
		    content: '';
		    width: 100%;		    
		    height: 100%;
		    border-radius: 5px;
		    position: absolute;		    
		   	background-color: #000000;
		    opacity: .3;
		    -webkit-opacity: .3;
		    -moz-opacity: .3;
		}
	}
</style>

<template>
	<Card dis-hover>
		<div slot="title">
			<slot>附件</slot>
			<div class="pull-right" v-if="mode=='add'">
				<Tooltip placement="bottom">	
					<!--:format="['jpg','jpeg','png','ppt','pptx','doc','docx','xls','xlsx','pdf']"-->
					<x-upload 
						ref="handupload"
						multiple
						:format="format"
						:show-upload-list="false"
						:headers="upload_header"						
						:on-format-error="handleFormatError"
						:on-progress="handleProgress"
						:data="upload_post"     
						:on-success="handleSuccess"
						:before-upload="handleBeforeUpload">						
						<Button type="default" size="small" icon="md-desktop">本机上传</Button>
					</x-upload>      					
					<span slot="content">从本机选择文件上传<!--<br>(支持图片、word、ppt、pdf 等文档)--></span>
				</Tooltip>
				<Tooltip placement="bottom">
					<Button type="default" size="small" icon="md-document" @click="selectFromMyFile">我的文件</Button>
					<span slot="content">通过历史上传记录选择文件上传<br>(语音、视频等文件)</span>
				</Tooltip>
			</div>
			<div style="clear: both;"></div>
		</div>
		<div class="mt-2">	
			<div v-if="mode=='add'" class="row">							
				<div class="col-md-2" v-for="(item,index) in uploadList" :key="index">
					<div class="review-upload-list">
						<play-voice class="voice-s" v-if="isVoice(item.file_type)" :src="item.file_url"></play-voice>
						<a :class="{['video']:isVideo(item.file_type)}" :href="item.file_url" target="_blank" :title="item.file_url" v-else style="position: relative;">
							<img :src="item.file_url+'?imageView2/3/w/63/h/63'" v-if="isImage(item.file_type)">
							<template v-if="isVideo(item.file_type)" >
								<img :src="item.file_url+'?vframe/jpg/offset/1/w/160/h/160'">
								<span class="video-play">
									<Icon type="play" size="35"></Icon>
								</span>
							</template>
							<img :src="replaceFileImage(item)" v-if="item.media_type=='file'">
						</a>
						<span class="image-close" @click.stop="handleRemove(item)">X</span>
					</div>
				</div>
				<template v-for="item in currentFileList" v-if="currentFileList.length">					
					<div class="col-md-2" v-if="item.status !== 'finished'">
						<div class="review-upload-list">
							<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
						</div>
					</div>
				</template>	
			</div>
			<div v-else>
				<div class="pb-3" v-if="file_list('voice').length>0">
					<div class="row">
						<div class="col-md-2" v-for="(item,index) in file_list('voice')" align="center" :key="index">
							<div class="voice-item">
								<play-voice 
									:src="item.file_url" 
									:active="index===active_voice" 
									@click.native="active_voice = index" 
									style="background-position:0 58px;">
								</play-voice>								
							</div>
						</div>				
					</div>
				</div>
				<div class="pb-3" v-if="file_list('image').length>0">
					<div class="row">
						<div class="col-md-2" v-for="(item,index) in file_list('image')" align="center" :key="index">
							<div class="review-upload-list" @click="picturePreview(item.file_url)">					      
					            <img :src="item.file_url+'?imageView2/3/w/63/h/63'">						            
						    </div>
						</div>					
					</div>
				</div>
				<div class="pb-3" v-if="file_list('video').length>0">
					<div class="row">
						<div class="col-md-2" v-for="(item,index) in file_list('video')" align="center" :key="index">
							<div class="video-item" @click="previewVideo(item)">
					            <img :src="item.file_url+'?vframe/jpg/offset/1/w/130/h/130'">
					            <i class="ivu-icon ivu-icon-play" style="font-size:25px"></i>
						    </div>
						</div>					
					</div>
				</div>
				<div class="" v-if="file_list('file').length>0">
					<div class="row">
						<div class="col-md-2" v-for="(item,index) in file_list('file')" align="center" :key="index">
							<div class="review-upload-list">
								<a :href="item.file_url" target="_blank">
					            	<img :src="replaceDefaultImage(item)">	
					            </a>
						    </div>
						</div>					
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>

<script>
	import common from '@/libs/common.mixin'
	import playVoice from 'c%/playVoice.vue'
	import XUpload from 'c%/xupload/index'
	
	export default{
		mixins: [common],
		components:{
			XUpload,
			playVoice
		},
		props: {
			value: {
				type: Array,
				default(){
					return []
				}
			},
			mode: {
				type: String,
				default: 'add'
			},
			selType: {
				type: String,
				default: ''
			},
			showCourseFile: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				uploadList: this.value,
				loading: false,
				currentFileList: [],
				active_voice: -1
			}
		},
		watch: {
			value: function (val) {
				this.uploadList = val
			}
		},
		mounted () {
			if(this.mode=='add'){
				this.currentFileList = this.$refs.handupload.fileList				
			}
		},
		methods: {
			replaceDefaultImage(item) {
				const suffixs = ['txt','doc','pdf','rar','zip','xls','ppt']
				let type = item.file_type
				if(type === 'pptx') {
					type = 'ppt'
				}
				if(type === 'docx') {
					type ='doc'
				}
				if(type === 'xlsx') {
					type = 'xls'
				}
				if(suffixs.indexOf(type) > -1) {
					return `https://sp1.xiao360.com/static/file/icon/${type}.png?imageView2/3/w/100/h/100`
				}else{
					return `https://sp1.xiao360.com/static/file/icon/default.png?imageView2/3/w/100/h/100`
				}
			},
			selectCourseFile () {
				this.$refs.course_standard_file.show('选择课标','add')
			},
			addCourseFile (list) {
				list.forEach(l=>{
					this.uploadList.push(l)					
				})
				
			},
			previewVideo(item) {
				this.$Modal.open('components/VideoPreview.vue@modal')
				.then(modal => {
					modal
					.set('video',item)
					.show('播放视频')
				})
			},
			selectFromMyFile() {
	        	this.$Modal.open('components/SelectFile.vue@modal',{
					props: {
						selType: this.selType,
						multiple: true
					},
					on: {
						'selected':(data)=>{
							this.selectFile(data)
						}
					}
				})
				.then(modal => {
					modal.vuec.show('我的文件框','list')
				})
	        },
	        selectFile(data) {
	        	data.forEach(item => {
        			this.uploadList.push({
		        		file_id: item.file_id,
		        		file_url: item.file_url,
		        		file_type: item.file_type,
		        		media_type: item.media_type
		        	})
        		})
	        	this.$emit('on-change',this.uploadList)
	        },
			handleRemove (file) {
            	// 从 upload 实例删除数据
	            const fileList = this.uploadList;
	            this.uploadList.splice(fileList.indexOf(file), 1)
	            this.$emit('on-change',this.uploadList)
	        },
	        handleProgress (event, file, fileList) {
	        	console.log(event,file,FileList)
	        },
	        handleSuccess (res, file) {	        	
	        	file.url = res.data.file_url
	        	
	            // 上传成功   添加到list
	            this.uploadList.push({
	            	file_id: res.data.file_id,
	        		file_url: res.data.file_url,
	        		file_type: res.data.file_type,
	        		media_type: res.data.media_type
            	})
	            this.$emit('on-change',this.uploadList)
	        },
	        handleFormatError (file) {
	        	let file_list = this.format.join(',')
	        	
	            this.$Notice.warning({
	                title:'文件格式不正确',
	                desc:'文件 ' + file.name + ' 格式不正确，请上传 '+file_list+' 格式的文件。'
	            });            
	        },
	        handleMaxSize (file) { 
	            this.$Notice.warning({
	                title: '超出文件大小限制',
	                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
	            });
	        },
	        handleBeforeUpload (postFiles,file) {
	            const check = this.uploadList.length < 10;
	            if (!check) {
	                this.$Notice.warning({
	                	title: '上传错误',
	                	desc:'最多只能上传 9  张图片。'
	                });
	            }
	            return check;
	        },
	        isVoice (type) {
				let voice_type = 'voice,amr,mp3,wav'
				return voice_type.indexOf(type)>-1
			},
			isVideo (type) {
				let voice_type = 'video,rm,rmvb,mpeg1－4,mov,mtv,dat,wmv,avi,3gp,amv,dmv,flv,mp4'
				return voice_type.indexOf(type)>-1
			},
			isImage (type) {
				let img_type = 'image,jpg,jpeg,png,gif,bmp'
				
				return img_type.indexOf(type)>-1
			},
	        file_list (type) {
            	let [result,uploadList] = [[],this.uploadList]
            	if(uploadList.length > 0){
            		let filter = (item)=>{
            			if(typeof item.media_type == 'string'){
            				return item.media_type == type
            			}else{
            				type = this.getFileTypes(type)
            				
            				return type.indexOf(item.file_type)>-1
            			}
            		}
            		
            		result = uploadList.filter(filter)
            	}
            	return result 
            },
            getFileTypes (type) {
           		if(type=='image'){
            		type = ['image','gif','jpg','jpeg','png','bmp','webp']
            	}else if(type=='voice'){
            		type = ['voice','mp3','wav','wma','ogg','aac','flac']
            	}else if(type=='video'){
            		type = ['video','mp4','m3u8','rmvb','avi','swf','3gp','mkv','flv']
            	}else{
            		type = ['numbers','csv','xls','xlsx','keynote','ppt','pptx']
            	}
            	return type
            }
		},
		computed: {
			format () {
				let selType = this.selType,
					format = []
				if(selType=='image'){
					format = ['image','jpg','jpeg','png','gif','bmp']
				}else if(selType=='video'){
					format = ['video','rm','rmvb','mpeg1－4','mov','mtv','dat','wmv','avi','3gp','amv','dmv','flv','mp4']
				}else if(selType=='voice'){
					format = ['voice','amr','mp3','wav']
				}else if(selType=='file'){
					format = ['doc','txt','docx','pages','epub','pdf','numbers','csv','xls','xlsx','keynote','ppt','pptx']
				}
				return format
			},
			upload_header () {
                return {
                    'x-token':this.$store.state.user.token,
                    'x-file-key':'file'
                }
            },
            upload_post () {
                return {
                    mod:'correct_upload'
                }
            },
		}
	}
</script>

<style lang="less" scoped>
	.video{
		&:before{
			content:'';
		    width: 65px;
		    height: 65px;
		    position: absolute;
		    background: rgba(0,0,0,0.6);
		}
		span.video-play {
	        position: absolute;
		    left: calc(~"50% - 10px");
		    top: calc(~"50% - 17px");		    
		}
	}
</style>
<template>
	<Modal v-model="modal$.show" draggable :mask-closable="false" width="340">
		<div slot="header">
			<span>{{modal$.title}}</span>
		</div>
		
		<qrcode ref="qrcode" :size="300" :value="url" type="img"></qrcode>
		
		<div slot="footer" class="text-center">
			<p class="x-code">
				<code :title="url">{{url}}</code>
			</p>
			<span>
				您可以 
				<span class="cursor text-info" @click="download">下载二维码</span> 
				或点击
				<span class="cursor text-info copy-btn" :data-clipboard-text="url">复制</span>
				将链接发送给盟商
			</span>			
		</div>
		<a ref="downloadhref"></a>
	</Modal>
</template>

<script>
	import modal from '@/libs/modal.mixin'
	import common from '@/libs/common.mixin'
	import qrcode from 'c%/qrcode'
	import Clipboard from 'clipboard'
	var clipboard = null
	
	export default{
		mixins: [ common, modal ],
		components: {
			qrcode
		},
		data () {
			return {
				info: {},
				ft_id: 0,
			}
		},
		mounted () {		
			//dom加载完毕后绑定事件
			clipboard = new Clipboard('.copy-btn')
			clipboard.on('success', (e)=> {
			    this.$Message.success('复制成功！')			
			    e.clearSelection()
			})
		},
		methods: {
			download () {
				var sampleImage = this.$refs.qrcode.$el.querySelector("img"),
			    	canvas = this.convertImageToCanvas(sampleImage),
			    	url = canvas.toDataURL("image/png"),
			    	downloadhref = this.$refs.downloadhref
			    
			    //以下代码为下载此图片功能
			    downloadhref.setAttribute("href",url)
			    downloadhref.setAttribute("download","qrcode.png")
			    			    
			    downloadhref.click()
			},
			showSetting () {
				this.$Modal.open('recruiting/market/qr-setting-modal.vue',{
					on:{
						'on-success': ()=>{
							this.$emit('on-success')
						}
					}
				})
				.then(modal=>{
					modal
					.set('info',this.info)
					.show(`${this.modal$.title}界面设置`)
				})
			}
		},
		destroyed () {			
			//离开页面时销毁
			clipboard.destroy()
		},
		computed: {
			url () {
				let user = this.$store.state.user
				
				return `${user.info.base_url}/fapi/open/training_apply?ft_id=${this.ft_id}`
			}
		}
	}
	
</script>

<style lang="less" scoped>
.x-code{
	code{
	    width: 100%;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: block;
	    margin-bottom: 1em;
	}
}
</style>
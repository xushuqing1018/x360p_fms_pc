<template>
	<div class="modal-view"></div>
</template>

<script>
	import xmodal from '@/libs/xmodal'
	export default {
		name: 'ModalView',
		props: {
		  name: {
		    type: String,
		    default: 'default'
		  }
		},
		created(){
		   xmodal.regPlaceHolder(this)
		}
	}
</script>

<template>
	<Modal width="830" :draggable="true" v-model="modal$.show" :title="modal$.title">
    <ali-vodplayer
      v-if="videoInfo.PlayAuth != ''"
      :vid ="videoInfo.VideoMeta.VideoId"
      :play-auth="videoInfo.PlayAuth"
      :cover="videoInfo.VideoMeta.CoverURL"
    >
    </ali-vodplayer>
    <div slot="footer">
			
		</div>
	</Modal>
</template>                      
<script>
	import util from '@/libs/util'
	import grid from '@/libs/grid.mixin'
	import modal from '@/libs/modal.mixin'
  import common from '@/libs/common.mixin'
  import aliVodplayer from 'c%/AliVodplayer.vue'

	export default {
    mixins: [grid,modal,common],
    components: {
      aliVodplayer
    },
    props: {
      videoInfo: {
        type: Object,
        default: () => ({
          PlayAuth:''
        })
      }
    },
		data() {
			return {
        
			}
    },
    watch:{
    },
		mounted() {
      
    },
    methods: {
      
    },
    computed: {
      
    }
	}
</script>
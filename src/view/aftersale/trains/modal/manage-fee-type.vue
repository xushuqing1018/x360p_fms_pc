<template>
	<Modal draggable v-model="modal$.show" :title="modal$.title" :mask-closable="false" :width="1000">
		<fee-type-page/>
		<div slot="footer">
			<Button @click="close">关闭</Button>
		</div>
	</Modal>
</template>

<script>
import common from '@/libs/common.mixin'
import globals from '@/libs/globals.mixin'
import modal from '@/libs/modal.mixin'
import moment from 'moment'
import FeeTypePage from './fee-type.vue'


export default {
	mixins: [common, modal, globals],
	components: {
		FeeTypePage
	},
	filters: {
		nonEmpty(value) {
			if(value) {
				return value
			}
			else {
				return '-'
			}
		}
	}
}
</script>
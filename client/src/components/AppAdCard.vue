<template lang="pug">
el-row.card
	el-col(:span="18")
		router-link(:to="url")
			el-row
				el-col(:span="10")
					img(:src="imgSrc").img
				el-col(:span="14").text
					el-row.name {{ top }}
					el-row.price {{ md }}
					el-row {{ btm }}
	el-col(:span="6")
		slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AppAdCard',

	props: {
		url: { type: [String, Object], required: true, default: '' },
		top: { type: String, required: true, default: '' },
		md: { type: String, required: true, default: '' },
		btm: { type: String, required: true, default: '' },
		imgSrc: { type: String, required: true, default: '' },
	},
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';
@import '@/assets/scss/_mixins.scss';

.card {
	@extend %hover-card;
}

.card + .card {
	margin-top: 30px;
}

.img {
	width: 100%;
	display: block;
	object-fit: cover;
	border-radius: $lg-radius;
	height: 178px;
}

.text {
	padding-left: 30px;
}

.name,
.price {
	font-weight: bold;
	margin-bottom: 5px;
}

.name {
	color: $accent-color;
	font-size: 16px;
	margin-right: 50px;
}

.date {
	color: $opacity-color;
}
</style>

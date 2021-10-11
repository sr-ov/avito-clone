<template lang="pug">
.help
	ul.help__list
		li(v-for="text in ['Реклама на сайте', 'Вакансии', 'Помощь']" :key="text").help__list-item
			a(href="#") {{ text }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'TheHelp',
})
</script>

<style scoped lang="scss">
.help {
	margin-top: 16px;
}

.help__list-item + .help__list-item {
	margin-top: 5px;
}
</style>

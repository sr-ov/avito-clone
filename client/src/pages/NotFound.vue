<template lang="pug">
el-empty(description="Страница не найдена")
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NotFound',
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';
</style>

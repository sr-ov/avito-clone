<template lang="pug">
button.btn
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'AppButton',
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.btn {
    background-color: $accent-color;
    color: #fff;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    line-height: 16px;
}

.btn.primary-color {
    background-color: inherit;
    color: $primary-color;
}
</style>

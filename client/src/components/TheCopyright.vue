<template lang="pug">
.copyright
    .copyright__item © ООО «Абито», 2011–2021
    a(href="#").copyright__link.copyright__item Политика конфиденциальности
    a(href="#").copyright__link.copyright__item Обработка данных
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TheCopyright',
})
</script>

<style scoped lang="scss">
.copyright {
    color: #c4c4c4;
    margin-top: 17px;
}

.copyright__item + .copyright__item {
    margin-top: 5px;
}

.copyright__link {
    display: inline-block;
    color: inherit;
    text-decoration: underline;
}
</style>

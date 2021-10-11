<template lang="pug">
main.main.container.grid
    .center
        slot(v-if="!isLoading" name="center")
        .loading(v-else v-loading="isLoading")
    .right
        slot(name="right")
            the-services
        the-copyright
        the-help
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'TheMain',

    setup() {
        const store = useStore()

        return {
            isLoading: computed(() => store.state.loading),
        }
    },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.loading {
    height: 250px;
}

.main {
    padding-top: 25px;
    padding-bottom: 68px;
}

.center {
    grid-column: 9 span;
}

.right {
    grid-column: 3 span;
}
</style>

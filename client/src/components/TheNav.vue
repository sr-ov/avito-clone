<template lang="pug">
nav
    ul.nav-list
        li(
            v-for="category in categories"
            :key="category._id"
        ).nav-list__item
            router-link(
                :to="`/${category._id}`"
                exact
            ).nav-list__link {{ category.nameRu }}
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { categoryModule } from '../store/category'

export default defineComponent({
    name: 'TheNav',

    setup() {
        return {
            categories: computed(() => categoryModule.state.categories),
        }
    },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.nav-list {
    display: flex;
}

.nav-list__item + .nav-list__item {
    margin-left: 14px;
}

.nav-list__link {
    padding: 5px;
    transition: background-color 0.2s;
    border-radius: $sm-radius;

    &:hover {
        background-color: darken(#fff, 5%);
    }
}
</style>

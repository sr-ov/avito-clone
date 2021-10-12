<template lang="pug">
.search
    input(
        v-model="search"
        @keyup.enter="onSearch"
        placeholder="поиск по объявлениям"
    ).search__input
    app-button(@click="onSearch")
        span.search__icon Найти
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adModule } from '../store/ad'

export default defineComponent({
    name: 'TheSearch',

    setup() {
        const search = ref('')
        const router = useRouter()
        const route = useRoute()
        const onSearch = () => {
            const value = search.value.trim()
            if (value) {
                router
                    .push(`advertisement/search?search=${value}`)
                    .then(adModule.actions.getFirstAdsBySearch)
                    .catch(console.error)
            }
        }

        onMounted(() => {
            const searchQuery = route.query.search
            if (searchQuery) {
                search.value = searchQuery as string
            }
        })

        watch(
            () => route.name,
            () => {
                if (route.name !== 'Search') {
                    search.value = ''
                }
            }
        )

        return {
            search,
            onSearch,
        }
    },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.search {
    padding: 3px;
    display: flex;
    grid-column: 12 span;
    background-color: $accent-color;
    border-radius: $sm-radius;
}

.search__input {
    flex-grow: 1;
    border-radius: $sm-radius;
    border: none;
    padding: 0 22px;

    &::placeholder {
        color: $primary-color;
        opacity: 0.4;
    }
}

.search__icon {
    background-image: url(~@/assets/images/search-icon.svg);
    background-repeat: no-repeat;
    padding-left: 20px;
    position: relative;
    z-index: 5;
}
</style>

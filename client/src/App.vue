<template lang="pug">
main-layout
    router-view
the-auth(
    :is-open="isOpen"
    @close="toggle(false)"
)
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoryModule } from './store/category'
import { adModule } from './store/ad'
import { useAuthModal } from './hooks'
import { useStore } from 'vuex'

export default defineComponent({
    setup() {
        const route = useRoute()
        const store = useStore()

        watch(route, async () => {
            try {
                store.state.loading = true
                switch (route.name) {
                    case 'MyAds':
                        await adModule.actions.getMyAds()
                        break
                    case 'Advertisement':
                        await adModule.actions.getAd()
                        break
                    case 'Favorites':
                        await adModule.actions.getMyFavorites()
                }
            } catch (error) {
                console.error(error)
            } finally {
                store.state.loading = false
            }
        })

        onMounted(categoryModule.actions.getCategories)

        return {
            ...useAuthModal(),
        }
    },
})
</script>

<style lang="scss">
@import '@/assets/scss/_vars.scss';

* {
    box-sizing: border-box;
}

html,
body,
a {
    font-family: Roboto;
    color: $primary-color;
    font-size: 14px;
}

body,
h1,
h2,
h3,
h4,
p {
    margin: 0;
}

button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
}

a {
    text-decoration: none;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

li {
    padding: 0;
}

img {
    display: inline-block;
    height: auto;
}

.container {
    max-width: 1175px;
    padding: 0 15px;
    margin: 0 auto;
}

.grid,
.grid-sm {
    display: grid;
    gap: 30px;
}

.grid {
    grid-template-columns: repeat(12, 1fr);
}

.grid-sm {
    grid-template-columns: repeat(9, 1fr);
}

.page-title {
    margin-bottom: 50px;
}

.router-link-exact-active {
    color: $accent-color;
}
</style>

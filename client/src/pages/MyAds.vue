<template lang="pug">
the-main
    template(#center)
        h1.page-title Мои объявления
        template(v-if="advertisements.length")
            app-ad-card(
                v-for="(ad, i) in advertisements"
                :key="ad._id"
                :imgSrc="ad.images.url"
                :url="`/${ad.categoryId}/${ad._id}`"
                :top="ad.name"
                :md="`${ad.price} ₽`"
                :btm="ad.address"
            )
                el-row.wrapper
                    icon-views.icon
                    span {{ ad.views }}
                el-row.wrapper
                    icon-favorite.icon
                    span {{ ad.inFavorite }}
        el-empty(v-else description="Пусто")
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { adModule } from '../store/ad'

export default defineComponent({
    name: 'MyAds',

    setup() {
        return {
            advertisements: computed(() => adModule.state.ads),
            images: computed(() => adModule.state.images),
        }
    },
})
</script>

<style scoped>
.icon {
    width: 18px;
    margin-right: 10px;
}

.wrapper {
    align-items: center;
}

.wrapper + .wrapper {
    margin-top: 5px;
}
</style>

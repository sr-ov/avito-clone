<template lang="pug">
the-main
    template(#center)
        h2.title {{ title }}
        .main-cards(
            v-infinite-scroll="moreLoad"
            :infinite-scroll-distance="0"
            :infinite-scroll-disabled="isLoading"
        )
            ul(v-if="ads.length").list.grid-sm
                li(v-for="(ad, i) in ads" :key="ad._id").list__item
                    router-link(:to="`/${ad.categoryId}/${ad._id}`").list__link
                        img(:src="ad.images.url").list__img
                        .list__text
                            .list__title
                                span.list__name {{ ad.name }}
                                app-button-favorite(
                                    v-if="curUserId !== ad.userId"
                                    :id="ad._id"
                                )
                            .list__price {{ ad.price }} ₽
                            .list__address {{ ad.address }}
                            .list__date {{ adCreatedDate(ad.createdAt) }}
            el-row(v-loading="isLoading").loading
    template(#right)
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { adCreatedDate } from '../utils/date'
import { adModule } from '../store/ad'
import { userModule } from '../store/user'
import { categoryModule } from '../store/category'

export default defineComponent({
    name: 'Home',

    setup() {
        const ads = computed(() => adModule.state.ads)
        const curUserId = computed(() => userModule.getters.curUserId)
        const route = useRoute()
        const isLoading = ref(false)
        const homeOrSearch = async (
            homeFn: () => Promise<void>,
            searchFn: () => Promise<void>
        ) => {
            if (route.name === 'Home') await homeFn()
            if (route.name === 'Search') await searchFn()
        }

        const firstLoad = () => {
            homeOrSearch(
                adModule.actions.getFirstAds,
                adModule.actions.getFirstAdsBySearch
            )
        }

        const moreLoad = async () => {
            isLoading.value = true
            await homeOrSearch(
                adModule.actions.getMoreAds,
                adModule.actions.getMoreAdsBySearch
            )

            isLoading.value = false
        }

        watch(() => route.path, firstLoad)

        onMounted(firstLoad)

        return {
            title: computed(() => {
                if (route.name === 'Home') {
                    return categoryModule.getters.title
                }

                const { search } = route.query
                return ads.value.length
                    ? `По запросу ${search} найдено`
                    : `По запросу ${search} ничего найдено`
            }),
            isLoading,
            moreLoad,
            ads,
            adCreatedDate,
            curUserId,
        }
    },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';
@import '@/assets/scss/_mixins.scss';

.title {
    font-weight: bold;
    font-size: 24px;
    line-height: 28px;
    color: $primary-color;
    margin-bottom: 25px;
}

.main-cards {
    min-height: 100vh;
}

.list__item {
    grid-column: 3 span;
}

.list__link {
    overflow: hidden;
    display: block;

    @extend %hover-card;
}

.list__img {
    width: 100%;
    height: 178px;
    border-radius: $lg-radius;
    object-fit: cover;
}

.list__title {
    display: flex;
    align-items: center;
}

.list__name {
    color: $accent-color;
    font-size: 16px;
    font-weight: bold;
    flex-grow: 1;
    padding: 5px 0;
}

.list__title,
.list__address {
    margin-bottom: 5px;
}

.list__address,
.list__date {
    color: $opacity-color;
}

.list__price {
    margin-bottom: 10px;
    font-weight: bold;
}

.loading {
    margin: 50px 0;
}
</style>

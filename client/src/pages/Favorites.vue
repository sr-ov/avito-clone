<template lang="pug">
the-main
	template(#center)
		h1.page-title Избранное
		template(v-if="favorites?.length" )
			app-ad-card(
				v-for="ad in favorites"
				:key="ad._id"
				:imgSrc="ad.images.url"
				:url="`/${ad.categoryId}/${ad._id}`"
				:top="ad.name"
				:md="`${ad.price} ₽`"
				:btm="ad.address"
			)
				el-row.wrapper
					app-button-favorite(:id="ad._id")
		el-empty(v-else description="Пусто")
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { adModule } from '../store/ad'

export default defineComponent({
    name: 'Favorites',

    setup() {
        return {
            favorites: computed(() => adModule.state.ads),
        }
    },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.img {
    width: 100%;
    object-fit: cover;
}

.text {
    padding-left: 30px;
}

.name,
.price {
    font-weight: bold;
    margin-bottom: 5px;
}

.name {
    color: $accent-color;
    margin-right: 50px;
}

.date {
    color: $opacity-color;
}
</style>

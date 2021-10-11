<template lang="pug">
the-main
    template(#center)
        h1.page-title Редактирование объявления
        the-post-ad(
            @add-img="addImg"
            @remove-img="removeImg"
            :ad="ad"
            :on-submit="onSubmit"
            :images="images"
            btn-text="Сохранить"
        )
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'

import { adModule } from '../store/ad'
import { Image } from '@/store/types'
import { prop } from '@/utils/prop'
import { useImages } from '@/hooks'

const getImgPaths = (arr: Image[]) => arr.map(prop('path'))

export default defineComponent({
    name: 'EditAd',

    setup() {
        /* STATE */
        const adImages: string[] = []
        const images = ref<Image[]>([])
        const ad = computed(() => adModule.state.ad)
        const setImgs = (imgs: Image[]) => {
            adImages.push(...getImgPaths(imgs))
            images.value.push(...imgs)
        }

        onMounted(async () => {
            const ad = await adModule.actions.getAd()
            setImgs(ad.images)
        })

        /* FNS */
        const { addImg, removeImg, imageService } = useImages(images)

        async function updateAd() {
            if (imageService.toRemove.length) {
                await imageService.remove()
            }

            if (imageService.toSave.length) {
                await imageService.save()
            }

            const payload = {
                images: getImgPaths(images.value),
                adId: ad.value._id,
                name: ad.value.name,
                description: ad.value.description,
                price: ad.value.price,
                address: ad.value.address,
                categoryId: ad.value.categoryId,
                phone: ad.value.phone,
                communicationMethod: ad.value.communicationMethod,
            }

            await adModule.actions.updateAd(payload)
        }

        function rmImg(i: number, path: string) {
            if (adImages.includes(path)) {
                imageService.pushToRemove(path)
            }
            removeImg(i, path)
        }

        return {
            images,
            addImg,
            ad,
            removeImg: rmImg,
            onSubmit: updateAd,
        }
    },
})
</script>

<style lang="scss" scoped></style>

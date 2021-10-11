<template lang="pug">
the-main
    template(#center)
        h1.page-title Подать объявление
        the-post-ad(
            @add-img="addImg"
            @remove-img="removeImg"
            :on-submit="onSubmit"
            :images="images"
            :ad="ad"
            btn-text="Подать объявление"
        )
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'

import { categoryModule } from '../store/category'
import { userModule } from '../store/user'
import { ICreateAd } from '@/store/ad.interface'
import { Image } from '@/store/types'
import { prop } from '@/utils/prop'
import { adModule } from '@/store/ad'
import { useImages } from '@/hooks'

const getImgPath = prop('path')

export default defineComponent({
    name: 'CreateAd',

    setup() {
        const images = ref<Image[]>([])
        const curCategory = computed(
            () => categoryModule.state.categories[0]?._id
        )

        const ad = reactive<ICreateAd>({
            categoryId: curCategory.value,
            phone: userModule.state.user.phone ?? '',
            communicationMethod: 0,
            price: 0,
            name: '',
            description: '',
            address: '',
            images: [],
        })

        const { addImg, removeImg, imageService } = useImages(images)

        async function createAd() {
            if (imageService.toSave.length) {
                await imageService.save()
            }

            ad.images = images.value.map(getImgPath)
            await adModule.actions.createAd(ad)
        }

        return {
            createAd,
            addImg,
            removeImg,
            images,
            ad,
            onSubmit: createAd,
        }
    },
})
</script>

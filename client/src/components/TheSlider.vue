<template lang="pug">
.slider
    .slider-wrapper
        vueper-slides(
            ref="sliderRef"
            :touchable="false"
            :autoplay="false"
            :bullets="false"
            fade
            fixed-height="357px"
            @slide="onChangeSlide"
        ).no-shadow
            vueper-slide(
                v-for="(slide, i) in images"
                :key="slide"
                :image="slide"
                @click="openGallery($event, i)"
            )

    .thumbs-slider-wrapper
        vueper-slides(
            ref="thumbsSliderRef"
            :visible-slides="images.length"
            :bullets="false"
            :touchable="false"
            :gap="2.5"
            fixed-height="53px"
            :arrows="false"
            @slide="onChangeSlide"
        ).no-shadow
            vueper-slide(
                v-for="(slide, i) in images"
                :key="slide"
                :image="slide"
                @click="$refs.thumbsSliderRef.goToSlide(i)"
            ).thumbs-slide
    app-modal(
        v-model="IsOpenGallery"
        custom-class="slider-modal"
    )
        img(:src="currentImg").img-modal
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent, ref } from 'vue'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import { prop } from '../utils/prop'

export default defineComponent({
    name: 'TheSlider',

    props: {
        images: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    setup(props) {
        const sliderRef = ref(null)
        const thumbsSliderRef = ref(null)
        const IsOpenGallery = ref(false)
        const currentImg = ref('')
        const images = props.images.map(prop('url'))

        const openGallery = ({ target }, idx: number): void => {
            if (!target.matches('.vueperslides__arrow')) {
                IsOpenGallery.value = true
                currentImg.value = images[idx]
            }
        }

        const onChangeSlide = ({ currentSlide }): void => {
            sliderRef.value.goToSlide(currentSlide.index, { emit: false })
            thumbsSliderRef.value.goToSlide(currentSlide.index, { emit: false })
        }

        return {
            sliderRef,
            thumbsSliderRef,
            onChangeSlide,
            IsOpenGallery,
            openGallery,
            currentImg,
            images,
        }
    },

    components: {
        VueperSlides,
        VueperSlide,
    },
})
</script>

<style>
.slider-modal {
    text-align: center;
    width: fit-content !important;
    max-width: 90%;
}
</style>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.slider-wrapper {
    border-radius: $lg-radius;
    overflow: hidden;
}

.slider-wrapper + .thumbs-slider-wrapper {
    margin-top: 10px;
}

.img-modal {
    width: 100%;
    object-fit: cover;
}

.slider {
    margin-bottom: 30px;
}

.thumbs-slide {
    max-width: 68px;
    border-radius: 3px;
    transition: opacity 0.3s ease-in-out;
    opacity: 0.7;
    cursor: pointer;

    &.vueperslide--active {
        opacity: 1;
    }
}
</style>

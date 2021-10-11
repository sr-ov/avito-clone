<template lang="pug">
el-form(
    @submit.prevent
    :model="ad"
    ref="formRef"
    label-position="left"
    label-width="150px"
)
    el-form-item(label="Категория")
        el-select(v-model="ad.categoryId")
            el-option(
                v-for="category in categories"
                :key="category._id"
                :value="category._id"
                :label="category.nameRu"
            )
    el-form-item(
        prop="name"
        :rules="rules"
        label="Название"
    )
        el-input(
            v-model="ad.name"
            clearable
        )
    el-form-item(
        prop="description"
        :rules="rules"
        label="Описание"
    )
        el-input(
            v-model="ad.description"
            type="textarea"
            :rows="4"
        )
    el-form-item(
        prop="address"
        :rules="rules"
        label="Адрес"
    )
        el-input(
            v-model="ad.address"
        )
    el-form-item(label="Стоимость")
        el-input-number(
            v-model="ad.price"
            controls-position="right"
            :min="0"
            size="small"
            :controls="false"
            style="width: 148px"
        )
        span(style="margin-left: 10px") ₽
    el-form-item(label="Фотографии")
        p Максимум 5 картинок
        .preview-wrapper
            div(
                v-for="(img, i) in images"
                :key="img.path"
            ).preview-item
                img(:src="img.url").preview
                .delete-wrapper
                    button(@click="$emit('remove-img', i, img.path)")
                        delete(style="height: 20px; width: 20px;" color="#fff")
            image-upload(
                v-if="!isMaxQuantity"
                :value="images"
                @input-filter="onUploadImage"
                accept=".jpg, .jpeg, .png"
                multiple
            ).btn-upload
                i.el-icon-plus.btn-upload-icon
    el-form-item(prop="phone" :rules="phoneRules" label="Телефон")
        app-phone-input(v-model="ad.phone")
    el-form-item(label="Способ связи")
        el-radio-group(v-model="ad.communicationMethod")
            el-radio(
                v-for="(elRadioText, i) in communicationMethods"
                :key="i"
                :label="i"
            ) {{ elRadioText }}
    el-form-item
        el-button(
            :loading="isLoading"
            @click="onSubmit"
            type="primary"
        ) {{ btnText }}
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons'

import VueUploadComponent, {
    VueUploadItem as UploadFile,
} from 'vue-upload-component'

import { rules, phoneRules } from '../utils/formRules'
import { categoryModule } from '../store/category'
import { generateFilePath } from '../utils/generateFilePath'
import { Image } from '@/store/types'
import { ICreateAd, IUpdateAd } from '../store/ad.interface'
import { useSubmit, FnAsyncVoid } from '@/hooks'

export default defineComponent({
    name: 'ThePostAd',
    components: {
        ImageUpload: VueUploadComponent,
        Delete,
    },
    props: {
        images: {
            type: Array as PropType<Image[]>,
            default: () => [],
        },
        ad: {
            type: Object as PropType<ICreateAd | IUpdateAd>,
            default: () => ({}),
        },
        btnText: { type: String },
        onSubmit: {
            type: Function as PropType<FnAsyncVoid>,
            default: async () => {},
        },
    },
    emits: ['add-img', 'remove-img'],

    setup(props, { emit }) {
        const loading = ref(false)
        const isMaxQuantity = computed(() => props.images?.length >= 5)
        const categories = computed(() => categoryModule.state.categories)
        const communicationMethods = [
            'По телефону и в сообщениях',
            'По телефону',
            'В сообщениях',
        ]

        const { elRef: formRef, handler: onSubmit } = useSubmit(async () => {
            loading.value = true
            await props.onSubmit()
            loading.value = false
        })

        const onUploadImage = (newFile: UploadFile) => {
            const file = newFile.file as File

            const isMore2m = file.size / 1024 / 1024 > 2

            if (isMaxQuantity.value) {
                return
            }

            if (isMore2m) {
                ElMessage.error('размер не больше 2 мегабайтов')
            } else {
                const filePath = generateFilePath(newFile.name!)
                emit('add-img', filePath, file)
            }
        }

        return {
            onSubmit,
            formRef,
            isMaxQuantity,
            rules,
            phoneRules,
            communicationMethods,
            onUploadImage,
            categories,
            isLoading: loading,
        }
    },
})
</script>

<style lang="scss" scoped>
.preview-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    gap: 20px;
    line-height: 0;
}

.preview {
    height: 150px;
    width: 150px;
    object-fit: cover;
    border-radius: 6px;
}

.preview-item {
    position: relative;
}

.delete-wrapper {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    transition: opacity 0.3s;
    opacity: 0;

    & button {
        opacity: 0;
        transition: opacity 0.3s;
        padding: 10px;
        margin: auto;
    }

    &:hover,
    &:hover button {
        opacity: 1;
    }
}

.btn-upload {
    display: flex;
    height: 150px;
    width: 150px;
    border: 1px dashed #d9d9d9;
    overflow: hidden;
    border-radius: 6px;
    font-size: 28px;

    &-icon {
        margin: auto;
    }

    &:hover {
        border-color: #409eff;
    }
}
</style>

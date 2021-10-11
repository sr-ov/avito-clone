<template lang="pug">
the-main
	template(v-if="!isEmpty" #center)
		.grid-sm
			.left
				div(v-if="isSame").item-options
					router-link(:to="`/edit-ad/${ad._id}`").item-options__link Редактировать
					button(@click="onRemoveAd").item-options__link Удалить
				h1.title {{ ad.name }}
				the-slider(:images="ad.images" :key="`${ad._id}-${ad.images.length}`")
				.desc {{ ad.description }}
			.right
				.price {{ ad.price }} ₽
				.user
					.user__name {{ owner.name || owner.email }}
					img(
						v-if="owner.avatar"
						:src="owner.avatar"
					).user__avatar
					i(v-else).el-icon-user-solid.user__avatar
				.btns(v-if="!isSame")
					app-button(
						v-if="isVisible(1)"
						@click="showPhone = true"
					).btns__item {{ showPhone ? ad.phone : 'Показать телефон' }}
					app-button(
						v-if="isVisible(2)"
						@click="toChat"
					).btns__item.btns__item--msg Написать сообщение
	template(#right)
		h1 REKLAMA
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ImageService } from '@/services/imageService'
import { useAuthModal, useRemoveMessage } from '../hooks'
import { adModule } from '../store/ad'
import { IAdUser } from '../store/ad.interface'
import { userModule } from '../store/user'
import { prop } from '@/utils/prop'

const imageService = new ImageService()

export default defineComponent({
    name: 'Advertisement',

    setup() {
        const router = useRouter()
        const ad = computed(() => adModule.state.ad)
        const owner = computed(() => ad.value.userId)
        const curUserId = computed(() => userModule.getters.curUserId)
        const isSame = computed(
            () => curUserId.value === (owner.value as IAdUser)?._id
        )
        const showPhone = ref(false)

        const isAuth = computed(() => userModule.state.auth)
        const { toggle } = useAuthModal()

        const toChat = (): void => {
            if (!isAuth.value) {
                toggle(true)
            } else {
                router.push({
                    name: 'Chat',
                    params: { chatId: ad.value._id },
                    query: {
                        cr: curUserId.value,
                        ow: (owner.value as IAdUser)?._id,
                    },
                })
            }
        }

        const isVisible = (n: number) => {
            return [0, n].includes(ad.value.communicationMethod)
        }

        async function removeAd() {
            imageService.pushToRemove(ad.value.images.map(prop('path')))
            await imageService.remove()
            await adModule.actions.remove()
        }

        return {
            showPhone,
            isVisible,
            toChat,
            ad,
            owner,
            isSame,
            onRemoveAd: useRemoveMessage(removeAd),
            isEmpty: computed(() => !Object.keys(ad.value).length),
        }
    },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.left {
    grid-column: 5 span;
}

.item-options {
    display: grid;
    grid-template-columns: min-content min-content;
    gap: 15px;
    margin-bottom: 15px;

    &__link {
        padding: 5px;
        transition: background-color 0.2s;
        border-radius: $sm-radius;
        background-color: darken(#fff, 5%);

        &:hover {
            background-color: darken(#fff, 10%);
        }
    }
}

.desc {
    line-height: 1.4;
}

.title,
.price {
    font-weight: bold;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 25px;
}

.right {
    grid-column: 3 span;
}

.user {
    display: flex;
    margin-bottom: 30px;
}

.user__name {
    font-weight: bold;
    flex-grow: 1;
}

.user__avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    background-color: #515151;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 30px;
}

.btns {
    display: flex;
    flex-direction: column;
}

.btns__item + .btns__item {
    margin-top: 14px;
}

.btns .btns__item {
    padding-top: 18px;
    padding-bottom: 18px;
}

.btns__item.btns__item--msg {
    background-color: #14b4be;
}
</style>

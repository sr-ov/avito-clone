<template lang="pug">
header.header.container
    .grid
        .left
            router-link(to="/").logo
                img(src="@/assets/images/logo.svg" alt="logo")
            the-nav
        .right
            app-button(
                v-if="!isAuth"
                @click="openModal"
            ).primary-color Вход и регистрация
            the-user-menu(v-else)
            app-button(@click="login") Подать объявление
    div(v-if="isVisible" style="margin-top: 24px").grid
        the-search
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthModal } from '../hooks'
import { userModule } from '../store/user'

export default defineComponent({
    name: 'TheHeader',

    setup() {
        const router = useRouter()
        const route = useRoute()
        const isAuth = computed(() => userModule.state.auth)
        const { toggle } = useAuthModal()
        const openModal = () => toggle(true)

        const login = () => {
            if (!isAuth.value) {
                openModal()
            } else {
                router.push('/create-ad')
            }
        }

        return {
            login,
            isAuth,
            isVisible: computed(() =>
                ['Home', 'Search'].includes(route.name as string)
            ),
            openModal,
        }
    },
})
</script>

<style scoped lang="scss">
.header {
    padding-top: 30px;
    padding-bottom: 24px;
}

.logo {
    margin-right: 20px;
}

.right {
    display: flex;
    align-items: center;
    grid-column: 4 span;
    justify-self: end;
}

.left {
    grid-column: 8 span;
    display: flex;
    align-items: center;
}
</style>

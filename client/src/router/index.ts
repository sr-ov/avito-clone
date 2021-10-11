import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { userModule } from '../store/user'
import Home from '@/pages/Home.vue'
import Advertisement from '@/pages/Advertisement.vue'
import CreateAd from '@/pages/CreateAd.vue'
import EditAd from '@/pages/EditAd.vue'
import Settings from '@/pages/Settings.vue'
import Favorites from '@/pages/Favorites.vue'
import MyAds from '@/pages/MyAds.vue'
import Chat from '@/pages/Chat.vue'
import ChatsList from '@/pages/ChatsList.vue'
import NotFound from '@/pages/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:category?',
        component: Home,
        name: 'Home',
        meta: { public: true },
    },
    {
        path: '/search',
        component: Home,
        name: 'Search',
        meta: { public: true },
    },
    {
        path: '/:category/:ad',
        component: Advertisement,
        name: 'Advertisement',
        meta: { public: true },
    },
    {
        path: '/create-ad',
        component: CreateAd,
        name: 'PostAd',
        meta: { public: false },
    },
    {
        path: '/edit-ad/:ad',
        component: EditAd,
        name: 'EditAd',
        meta: { public: false },
    },
    {
        path: '/settings',
        component: Settings,
        name: 'Settings',
        meta: { public: false },
    },
    {
        path: '/favorites',
        component: Favorites,
        name: 'Favorites',
        meta: { public: false },
    },
    {
        path: '/my-ads',
        component: MyAds,
        name: 'MyAds',
        meta: { public: false },
    },
    {
        path: '/chats',
        component: ChatsList,
        name: 'ChatsList',
        meta: { public: false },
    },
    {
        path: '/chats/:chatId',
        component: Chat,
        name: 'Chat',
        meta: { public: false },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { public: true },
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
    await userModule.actions.checkAuthUser()

    if (userModule.state.auth) {
        next()
    } else {
        if (to.meta.public) next()
        else next({ name: 'Home' })
    }
})

export default router

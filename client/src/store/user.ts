import { AxiosError } from 'axios'
import { createModule } from 'vuexok'

import store from '.'
import { apiUser, apiUserWithToken } from '../http'
import router from '../router'
import { IUpdateUser, IUser, IUserAuth } from './user.interface'

export const userModule = createModule('user', {
    namespaced: true,
    state: {
        isAuthModalOpen: false,
        auth: false,
        user: {} as IUser,
    },

    mutations: {
        toggleAuthModal(state, payload: boolean) {
            state.isAuthModalOpen = payload
        },
        setUser(state, user: IUser) {
            state.auth = true
            state.user = user
        },
        logOut(state) {
            localStorage.removeItem('token')
            state.auth = false
            state.user = {} as IUser
        },
        toFavorite(state, favorites: string[]) {
            state.user.favorites = favorites
        },
    },

    actions: {
        async registration(_, user: IUserAuth) {
            const res = await apiUser.post<IUser>('registration', user)
            userModule.mutations.setUser(res.data)
        },
        async login(_, payload: IUserAuth) {
            const res = await apiUser.post<IUser>('login', payload)
            userModule.mutations.setUser(res.data)
        },
        async checkAuthUser() {
            try {
                const res = await apiUserWithToken.get<IUser>('check-auth-user')
                userModule.mutations.setUser(res.data)
            } catch (error) {
                console.error((error as AxiosError).response?.data)
            }
        },
        async updateUser(_, payload: IUpdateUser) {
            const res = await apiUserWithToken.patch<IUser>(
                'update-user',
                payload
            )
            userModule.mutations.setUser(res.data)
        },

        async removeUser() {
            try {
                await apiUserWithToken.delete('remove-user')
                userModule.mutations.logOut()

                router.push('/')
            } catch (error) {
                console.error(error)
            }
        },
    },

    getters: {
        userName(state) {
            return state.user.name || state.user.email
        },
        curUserId(state) {
            return state.user._id
        },
    },
})

userModule.register(store)

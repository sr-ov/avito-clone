import { createModule } from 'vuexok'

import store from '.'
import router from '../router'
import { apiCategory } from '../http'
import { ICategory } from './category.interface'

export const categoryModule = createModule('category', {
    namespaced: true,
    state: {
        categories: [] as ICategory[],
    },

    mutations: {
        setCategories(state, categories: ICategory[]) {
            state.categories = categories
        },
    },

    actions: {
        async getCategories() {
            try {
                const res = await apiCategory.get('')
                categoryModule.mutations.setCategories(res.data)
            } catch (error) {
                console.error(error)
            }
        },
    },

    getters: {
        title(state) {
            return (
                state.categories.filter(
                    (el) => el._id === router.currentRoute.value.params.category
                )[0]?.nameRu ?? 'Рекомендации для вас'
            )
        },
    },
})

categoryModule.register(store)

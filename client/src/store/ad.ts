import { createModule } from 'vuexok'

import store from '.'
import { apiAds, apiAdsWithToken } from '../http'
import { userModule } from './user'
import router from '../router'
import { IAdBase, IAd, ICreateAd, IUpdateAd } from './ad.interface'

export const adModule = createModule('ad', {
    namespaced: true,
    state: {
        ads: [] as IAdBase[],
        ad: {} as IAd,
        limit: 6,
        curPage: 0,
        countPages: 0,
        images: [] as string[],
    },

    mutations: {
        setAds(state, ads: IAdBase[]) {
            state.ads = ads
        },
        setAd(state, ad: IAd) {
            state.ad = ad
        },
        setCurPage(state, page: number) {
            state.curPage = page
        },
        setCountPages(state, count: number) {
            state.countPages = count
        },
        setImages(state, images: string[]) {
            state.images = images
        },
    },

    actions: {
        async getAds(ctx, url?: string) {
            const { category = '' } = router.currentRoute.value.params

            const { headers, data: ads } = await apiAds.get(
                `${url ?? category}`,
                {
                    params: {
                        curPage: ctx.state.curPage,
                        limit: ctx.state.limit,
                    },
                }
            )

            const countPages = Math.ceil(
                headers['x-total-count'] / ctx.state.limit
            )
            adModule.mutations.setCountPages(countPages)

            return ads
        },
        async getFirstAds(ctx, url?: string) {
            adModule.mutations.setCurPage(0)

            const ads = await adModule.actions.getAds(url)

            adModule.mutations.setCurPage(1)
            adModule.mutations.setAds(ads)
        },
        async getMoreAds(ctx, url?: string) {
            const ads = await adModule.actions.getAds(url)

            if (ctx.state.curPage < ctx.state.countPages) {
                adModule.mutations.setAds(ctx.state.ads.concat(ads))
                adModule.mutations.setCurPage(ctx.state.curPage + 1)
            }
        },
        async getFirstAdsBySearch() {
            const query = router.currentRoute.value.query
            adModule.actions.getFirstAds(`search?search=${query.search}`)
        },
        async getMoreAdsBySearch() {
            const query = router.currentRoute.value.query
            adModule.actions.getMoreAds(`search?search=${query.search}`)
        },
        async getMyAds() {
            const { data: ads } = await apiAdsWithToken.get('my-ads')
            adModule.mutations.setAds(ads)
        },
        async getMyFavorites() {
            const res = await apiAdsWithToken.get('favorites')
            adModule.mutations.setAds(res.data)
        },
        async getAd() {
            const params = router.currentRoute.value.params
            const { data: ad } = await apiAds.get<IAd>(`one/${params.ad}`)

            adModule.mutations.setAd(ad)

            return ad
        },
        async createAd(ctx, payload: ICreateAd) {
            const { data: ad } = await apiAdsWithToken.post('create', payload)

            router.push(`/${ad.categoryId}/${ad._id}`)
        },
        async updateAd(ctx, payload: IUpdateAd) {
            const { data: ad } = await apiAdsWithToken.patch('update', payload)

            router.push(`/${ad.categoryId}/${ad._id}`)
        },
        async toFavorite(_, id: string) {
            const res = await apiAdsWithToken.post('to-favorite', { id })

            userModule.mutations.toFavorite(res.data)
        },
        async remove() {
            const adId = router.currentRoute.value.params.ad
            const {
                data: [ads],
            } = await apiAdsWithToken.delete(`remove/${adId}`)

            adModule.mutations.setAds(ads)
            router.push('/')
        },
    },
})

adModule.register(store)

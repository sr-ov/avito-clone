import { Advertisement } from './advertisement.schema'

export type AdsRes = [ads: Advertisement[], countAds: number]

export type PaginationQuery = {
    limit: number
    curPage: number
}

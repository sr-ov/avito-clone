import { Image } from './types'

export interface IAdUser {
    _id: string
    email: string
    name: string
    avatar: string
}

export interface IAdBase {
    _id: string
    userId: IAdUser
    categoryId: string
    name: string
    price: number
    address: string
    images: string[]
    createdAt: string
}

export interface ICreateAd
    extends Omit<IAdBase, '_id' | 'createdAt' | 'userId'> {
    description: string
    phone: string
    communicationMethod: number
}

export interface IUpdateAd extends ICreateAd {
    adId: string
}

export interface IAd
    extends Omit<IAdBase, 'images'>,
        Omit<ICreateAd, 'images'> {
    images: Image[]
    views: number
    inFavorite: number
}

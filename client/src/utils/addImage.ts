import { IAdBase, IAdUser } from '@/store/ad.interface'
import { ImageService } from '../services/imageService'

const imageService = new ImageService()

export const transformImage = async (path: string) => {
    try {
        return {
            path,
            url: path && (await imageService.getImage(path)),
        }
    } catch (error) {
        console.error(error)
    }
}

export const addImgToAds = async (ads: IAdBase[]) => {
    try {
        return Promise.all(
            ads.map(async (el) => {
                const path = el.images![0]
                return {
                    ...el,
                    images: await transformImage(path),
                }
            })
        )
    } catch (error) {
        console.error(error)
    }
}

export const addImgToAd = async (ad: IAdBase) => {
    try {
        const owner = ad.userId as IAdUser

        owner.avatar = (await transformImage(owner.avatar))!.url
        return Promise.all(
            ad.images!.map(async (path) => await transformImage(path))
        )
    } catch (error) {
        console.error(error)
    }
}

export const addImgToChats = async (chats: any[]) => {
    try {
        for (const chat of chats) {
            const path = chat.ad.images[0]
            chat.ad.images = await transformImage(path)
        }
    } catch (error) {
        console.error(error)
    }
}

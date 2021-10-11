import jwtDecode from 'jwt-decode'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import {
    addImgToAds,
    addImgToAd,
    transformImage,
    addImgToChats,
} from '@/utils/addImage'

const BASE_URL_API = process.env.VUE_APP_URL_API ?? 'http://localhost:4321/api'

const addToken = (config: AxiosRequestConfig) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`

    return config
}

const catchError = (error: Error) => Promise.reject(error)

const addImg = async (response: AxiosResponse<any>) => {
    switch (response.headers['x-flag']) {
        case 'ads':
            response.data = await addImgToAds(response.data)
            break
        case 'ad':
            response.data.images = await addImgToAd(response.data)
            break
        case 'chats':
            await addImgToChats(response.data)
            break
    }

    return response
}

const tokenToUser = async (response: AxiosResponse<any>) => {
    localStorage.setItem('token', response.data.token)

    const user = (({ __v, iat, exp, ...u }) => u)(
        jwtDecode(response.data.token)
    )

    response.data = {
        ...user,
        avatar: user.avatar ? [await transformImage(user.avatar)] : [],
    }
    return response
}

const ADS_URL_API = `${BASE_URL_API}/advertisement/`
export const apiAds = axios.create({
    baseURL: ADS_URL_API,
})
export const apiAdsWithToken = axios.create({
    baseURL: ADS_URL_API,
})
apiAdsWithToken.interceptors.request.use(addToken, catchError)
apiAds.interceptors.response.use(addImg, catchError)
apiAdsWithToken.interceptors.response.use(addImg, catchError)

const CATEGORY_URL_API = `${BASE_URL_API}/category/`
export const apiCategory = axios.create({
    baseURL: CATEGORY_URL_API,
})

const CHAT_URL_API = `${BASE_URL_API}/chat/`
export const apiChatWithToken = axios.create({
    baseURL: CHAT_URL_API,
})
apiChatWithToken.interceptors.request.use(addToken, catchError)
apiChatWithToken.interceptors.response.use(addImg, catchError)

const USER_URL_API = `${BASE_URL_API}/user/`
export const apiUser = axios.create({
    baseURL: USER_URL_API,
})
export const apiUserWithToken = axios.create({
    baseURL: USER_URL_API,
})
apiUserWithToken.interceptors.request.use(addToken, catchError)
apiUser.interceptors.response.use(tokenToUser, catchError)
apiUserWithToken.interceptors.response.use(tokenToUser, catchError)

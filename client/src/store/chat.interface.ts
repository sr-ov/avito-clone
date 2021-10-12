export interface IMessage {
    _id: string
    message: string
    userId: string
    createdAt: string
}

export interface IUser {
    _id: string
    name: string
    email: string
    avatar: string
}

export interface IAd {
    _id: string
    name: string
}

export interface IChat {
    _id: string
    room: string
    messages: IMessage[]
    ad: IAd
    user: IUser
    owner: IUser
}

export interface IUserAuth {
    email: string
    password: string
}

export interface IUser {
    _id: string
    email: string
    name: string
    phone: string
    address: string
    avatar: { path: string; url: string }[]
    advertisements: string[]
    favorites: string[]
}

export interface IUpdateUser
    extends Partial<
        Omit<IUser, 'advertisements' | 'favorites' | '_id' | 'avatar'>
    > {
    oldPassword?: string
    password?: string
    avatar?: string
    rmAvatarPath?: string
}

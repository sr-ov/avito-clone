import { IChat, IUser } from './../store/chat.interface'
import { userModule } from '@/store/user'

export const getInterlocutor = ({ owner, user }: IChat): IUser => {
    return [user, owner].filter(
        (el) => el?._id !== userModule.getters.curUserId
    )[0]
}

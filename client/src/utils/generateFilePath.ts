import { v4 as genFileName } from 'uuid'
import { userModule } from '@/store/user'

export const generateFilePath = (fileName: string) => {
    const fileExt = fileName
        .toLowerCase()
        .split('.')
        .pop()

    return `${userModule.getters.curUserId}/${genFileName()}.${fileExt}`
}

import { ElForm, ElMessageBox } from 'element-plus'
import { ref, Ref, computed, ComputedRef } from 'vue'
import { userModule } from '@/store/user'
import { ImageService } from '../services/imageService'
import { Image } from '../store/types'

export type FormRef = typeof ElForm
export type FnAsyncVoid = () => Promise<void>

export const useAuthModal = (): {
    isOpen: ComputedRef<boolean>
    toggle(payload: boolean): void
} => {
    const isOpen = computed(() => userModule.state.isAuthModalOpen)

    const toggle = (payload: boolean): void => {
        userModule.mutations.toggleAuthModal(payload)
    }

    return { isOpen, toggle }
}

export const useSubmit = (
    cb: FnAsyncVoid
): { elRef: any; handler: FnAsyncVoid } => {
    const elRef = ref<FormRef | null>(null)

    const handler = async () => {
        try {
            await elRef.value!.validate()
            cb()
        } catch (error) {
            console.error(error)
        }
    }

    return {
        elRef,
        handler,
    }
}

export const useRemoveMessage = (
    cb: (arg?: any) => Promise<void>
): ((arg?: any) => Promise<void>) => {
    const handler = async (arg?: any) => {
        try {
            await ElMessageBox.confirm(
                'Все данные будут удалены. Вы уверены!',
                {
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                    type: 'warning',
                }
            )

            cb(arg)
        } catch (error) {
            console.error(error)
        }
    }

    return handler
}

export function useImages(images: Ref<Image[]>) {
    const imageService = new ImageService()

    function addImg(filePath: string, file: File) {
        images.value.push({
            path: filePath,
            url: URL.createObjectURL(file),
        })
        imageService.pushToSave([filePath, file])
    }

    function removeImg(index: number, path: string) {
        imageService.removeFromSave(path)
        images.value.splice(index, 1)
    }

    return {
        addImg,
        removeImg,
        imageService,
    }
}

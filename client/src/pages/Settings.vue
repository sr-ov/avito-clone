<template lang="pug">
the-main
    template(#center)
        h1.page-title Настройки профиля
        el-form(
            :model="userInfo"
            ref="updateUserFormRef"
            label-position="left"
            label-width="150px"
        )
            el-form-item(label="Аватар")
                el-upload(
                    action=""
                    :on-change="onUploadAvatar"
                    accept=".jpg, .jpeg, .png"
                    :auto-upload="false"
                    :show-file-list="false"
                ).avatar-uploader
                    div(v-if="avatar").avatar-wrapper
                        img(:src="avatar" alt="аватар профиля").avatar
                        span(@click.stop).el-upload-list__item-actions
                            button(@click="onRemoveAvatar" type="button").el-upload-list__item-delete
                                i.el-icon-delete
                    i(v-else).el-icon-plus.avatar-uploader-icon
            el-form-item(
                prop="name"
                label="Имя"
                :rules="rules"
            )
                el-input(v-model="userInfo.name" clearable)
            el-form-item(
                prop="email"
                label="Email"
                :rules="rules"
            )
                el-input(v-model="userInfo.email" clearable)
            el-form-item(
                prop="address"
                label="Адрес"
                :rules="rules"
            )
                el-input(v-model="userInfo.address" clearable)
            el-form-item(
                prop="phone"
                label="Телефон"
                :rules="phoneRules"
            )
                app-phone-input(v-model="userInfo.phone")
            hr(style="margin-bottom: 22px")
            el-form-item(
                prop="oldPassword"
                label="Текущий пароль"
                :rules="passwordRules"
            )
                el-input(
                    v-model="userInfo.oldPassword"
                    clearable
                    show-password
                )
            el-form-item(
                prop="password"
                label="Новый пароль"
                :rules="passwordRules"
            )
                el-input(
                    v-model="userInfo.password"
                    clearable
                    show-password
                )
            el-form-item
                el-button(@click="submit" type="primary").btn-remove Сохранить
        hr(style="margin-bottom: 22px")
        el-form(
            :model="{  }"
            label-position="left"
            label-width="150px"
        )
            el-form-item(label="Удаление профиля")
                el-button(@click="onRemoveUser" type="primary") Удалить
</template>

<script lang="ts">
import { IUpdateUser } from '../store/user.interface'
import { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { UploadFile } from 'element-plus/lib/el-upload/src/upload.type'
import { defineComponent, reactive, ref, watchEffect } from 'vue'

import { useRemoveMessage, useSubmit } from '../hooks'
import { userModule } from '../store/user'
import { rules, phoneRules, passwordRules } from '../utils/formRules'
import { ImageService } from '../services/imageService'
import { generateFilePath } from '../utils/generateFilePath'

const imageService = new ImageService()

export default defineComponent({
    name: 'Settings',

    setup() {
        /* STATE */
        const userInfo = reactive<IUpdateUser>({
            oldPassword: '',
            password: '',
            avatar: '',
        })
        const avatar = ref('')
        watchEffect(async () => {
            userInfo.phone = userModule.state.user.phone ?? ''
            userInfo.name = userModule.state.user.name ?? ''
            userInfo.address = userModule.state.user.address ?? ''
            userInfo.email = userModule.state.user.email ?? ''

            if (userModule.state.user.avatar.length) {
                avatar.value = userModule.state.user.avatar[0].url
                userInfo.avatar = userModule.state.user.avatar[0].path
            }
        })

        const validatePassword = {
            validator(): boolean {
                if (
                    (userInfo.oldPassword && !userInfo.password) ||
                    (!userInfo.oldPassword && userInfo.password)
                ) {
                    return false
                }

                updateUserFormRef.value.clearValidate([
                    'oldPassword',
                    'password',
                ])
                return true
            },
            message: 'Введите оба пароля',
        }

        /* FNS */
        const { elRef: updateUserFormRef, handler: submit } = useSubmit(
            async (): Promise<void> => {
                try {
                    if (imageService.toRemove.length) {
                        await imageService.remove()
                    }

                    if (userInfo.avatar) {
                        await imageService.save()
                    }

                    if (!userInfo.password && !userInfo.oldPassword) {
                        delete userInfo.password
                        delete userInfo.oldPassword
                    }

                    await userModule.actions.updateUser(userInfo)
                } catch (error) {
                    if ((error as AxiosError).isAxiosError) {
                        const d = (error as AxiosError).response?.data
                        console.error(d)
                        ElMessage.error(String(d.message))
                    } else {
                        console.error(error)
                    }
                }
            }
        )

        const onUploadAvatar = (file: UploadFile) => {
            const filePath = generateFilePath(file.name)
            userInfo.avatar = filePath
            avatar.value = URL.createObjectURL(file.raw)
            imageService.setToSave(filePath, file.raw)
        }

        const onRemoveAvatar = () => {
            if (!imageService.toRemove.length) {
                imageService.setToRemove(userInfo.avatar!)
            }
            userInfo.avatar = ''
            avatar.value = ''
        }

        return {
            avatar,
            userInfo,
            onRemoveAvatar,
            onUploadAvatar,
            submit,
            name,
            updateUserFormRef,
            rules,
            phoneRules,
            onRemoveUser: useRemoveMessage(userModule.actions.removeUser),
            passwordRules: [passwordRules, validatePassword],
        }
    },
})
</script>

<style lang="scss">
@import '@/assets/scss/_vars.scss';

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    overflow: hidden;
    border-radius: 6px;
}

.avatar-wrapper {
    position: relative;
}

.el-upload-list__item-actions {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    border-radius: 6px;
    transition: opacity 0.5s, background-color 0.5s;
    cursor: auto;

    &:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }
}

.el-upload-list__item-actions:hover .el-upload-list__item-delete {
    position: absolute;
    padding: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    font-size: 20px;
    color: #fff;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
    border-radius: 6px;
}
</style>

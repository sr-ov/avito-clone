<template lang="pug">
app-modal(
    :model-value="isOpen"
    @update:model-value="closeModal"
    width="35%"
)
    template(#title)
        h3 {{ isReg ? 'Регистрация' : 'Вход' }}
    template(#default)
        el-form(:model="formModel" ref="authFormRef")
            el-form-item(
                prop="email"
                :rules="emailRules"
            )
                el-input(
                    v-model="formModel.email"
                    placeholder="email"
                    autocomplete="off"
                    type="email"
                )
            el-form-item(
                prop="password"
                :rules="passwordRules"
            )
                el-input(
                    v-model="formModel.password"
                    placeholder="пароль"
                    autocomplete="off"
                    type="password"
                    show-password
                )
    template(#footer)
        el-button(@click="toggleReg" type="primary"  size="small")
            | {{ isReg ? 'Вход' : 'Регистрация' }}
        el-button(@click="onSubmit" type="success")
            | {{ isReg ? 'Зарегистрироваться' : 'Войти' }}
</template>

<script lang="ts">
import { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, ref } from 'vue'
import { useSubmit } from '../hooks'
import { userModule } from '../store/user'
import { IUserAuth } from '../store/user.interface'
import { rules, passwordRules } from '../utils/formRules'

export default defineComponent({
    name: 'TheAuth',

    props: {
        isOpen: { type: Boolean, required: true },
    },
    emits: ['close'],

    setup(props, { emit }) {
        const formModel: IUserAuth = reactive({
            email: '',
            password: '',
        })
        const isReg = ref(false)

        const toggleReg = (): void => {
            isReg.value = !isReg.value
        }

        const closeModal = (): void => emit('close')

        const { elRef: authFormRef, handler: onSubmit } = useSubmit(
            async (): Promise<void> => {
                try {
                    const method = isReg.value ? 'registration' : 'login'
                    await userModule.actions[method](formModel)

                    closeModal()
                    authFormRef.value.resetFields()
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

        return {
            formModel,
            authFormRef,
            isReg,
            onSubmit,
            toggleReg,
            closeModal,
            emailRules: [
                rules,
                {
                    type: 'email',
                    message: 'Некорректный Email',
                    trigger: 'blur',
                },
            ],
            passwordRules: [rules, passwordRules],
        }
    },
})
</script>

<style scoped lang="scss"></style>

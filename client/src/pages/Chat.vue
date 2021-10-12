<template lang="pug">
the-main
    template(#center)
        el-row(style="margin-bottom: 30px" justify="center").top
            div(v-if="interlocutor && chat.ad").wrapper
                div(:class="{ active: isInterlocutorOnline }").user-name
                    | {{ interlocutor.name || interlocutor.email }}
                .ad-name {{ chat.ad.name }}
        el-row(style="margin-bottom: 30px")
            el-col(ref="dialogRef" :span="24").dialog
                el-row(
                    v-if="messages.length"
                    v-for="el in messages"
                    :key="el.id"
                )
                    el-col
                        el-row(justify="center").date {{ el.date }}
                        div(
                            v-for="item in el.items"
                            :key="item.id"
                            :class="{ right: item.toRight }"
                        ).msg-wrapper
                            .icon-wrapper(v-if="!item.toRight")
                                i(v-if="!interlocutorAvatar").el-icon-user-solid.user__avatar
                                img(
                                    v-else
                                    :src="interlocutorAvatar"
                                ).user__avatar
                            div(
                                v-for="msg in item.messages"
                                :key="msg.id"
                                :class="{ right: item.toRight }"
                            ).msg
                                span.text {{ msg.text }}
                                span {{ msg.date }}
                p(v-else).no-messages нет сообщений
        el-row
            el-col(:span="24")
                el-form(@submit.prevent)
                    el-form-item
                        el-row(:gutter="35")
                            el-col(:span="20")
                                el-input(
                                    v-model="msg"
                                    @keyup.enter="msgToServer"
                                    placeholder="Введите сообщение"
                                )
                            el-col(:span="3")
                                el-button(@click="msgToServer" type="primary") Отправить
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    ref,
    watch,
    nextTick,
    onUnmounted,
} from 'vue'
import { chatModule } from '../store/chat'
import { IMessage } from '../store/chat.interface'
import { userModule } from '../store/user'
import { transformImage } from '@/utils/addImage'
import { ChatService } from '@/services/chatService'

export default defineComponent({
    name: 'Chat',

    setup() {
        const msg = ref('')
        const dialogRef = ref()
        const isInterlocutorOnline = ref(false)
        const chat = computed(() => chatModule.state.chat)
        const room = computed(() => chat.value.room)
        const messages = computed(() => chatModule.getters.messages)
        const curUserId = computed(() => userModule.getters.curUserId)
        const interlocutor = computed(() => chatModule.getters.interlocutor)
        const interlocutorAvatar = ref('')

        let chatService = {} as ChatService

        const msgToServer = () => {
            const value = msg.value.trim()
            if (value) {
                chatService.msgToServer(value)
                msg.value = ''
            }
        }

        const scrollToBottom = () => {
            nextTick(() => {
                const el = dialogRef.value.$el
                el.scrollTop = el.scrollHeight
            })
        }

        watch(messages, scrollToBottom)

        onMounted(async () => {
            await chatModule.actions.getChat()
            interlocutorAvatar.value = (await transformImage(
                interlocutor.value.avatar
            ))!.url

            chatService = new ChatService(
                room.value,
                curUserId.value,
                chat.value._id
            )

            chatService.msgFromServer((messages: IMessage[]) => {
                chatModule.mutations.setMessages(messages)
            })

            chatService.isOnline(() => {
                isInterlocutorOnline.value = true
            })

            chatService.isOffline(() => {
                isInterlocutorOnline.value = false
            })
        })

        onUnmounted(() => {
            chatService.disconnect()
        })

        return {
            interlocutorAvatar,
            isInterlocutorOnline,
            messages,
            chat,
            msgToServer,
            msg,
            interlocutor,
            curUserId,
            dialogRef,
            isSame: (id: string): boolean => curUserId.value === id,
        }
    },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_vars.scss';

.dialog {
    height: 70vh;
    overflow: auto;
}

.msg-wrapper + .msg-wrapper {
    margin-top: 20px;
}

.date {
    padding: 30px 0;
    font-size: 16px;
    font-weight: bold;
}

.top {
    border-bottom: 1px solid $opacity-color;
    padding-bottom: 10px;
}

.msg-wrapper {
    display: grid;
    gap: 10px;
    position: relative;
    justify-items: start;

    &.right {
        justify-items: end;
    }
}

.icon-wrapper {
    position: absolute;
    bottom: -5px;
}

.user-name {
    font-size: 16px;
    font-weight: bold;
    position: relative;

    &.active::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: -10px;
        height: 7px;
        width: 7px;
        background-color: $accent-color;
        border-radius: 50%;
    }
}

.user-name + .ad-name {
    margin-top: 5px;
}

.user__avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    background-color: #515151;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 30px;
}

.msg {
    display: grid;
    grid-template-columns: auto auto;
    gap: 15px;
    max-width: 70%;
    align-items: center;
    margin-left: 60px;

    &.right {
        grid-template-columns: auto auto;
        direction: rtl;
        padding-right: 10px;
        margin-left: 0;
    }
}

.text {
    padding: 10px;
    background-color: darken(#fff, 5%);
    border-radius: $sm-radius;
    line-height: 1.5;
}

.msg.right .text {
    background-color: $accent-color;
    color: #fff;
}

.no-messages {
    text-align: center;
    font-size: 20px;
}
</style>

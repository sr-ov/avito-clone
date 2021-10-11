import { createModule } from 'vuexok'

import { userModule } from './user'
import store from '.'
import { apiChatWithToken } from '../http'
import router from '../router'
import { msgCreatedDate, msgCreatedTime } from '../utils/date'
import { getInterlocutor } from '@/utils/getInterlocutor'
import { IChat, IMessage } from './chat.interface'

export const chatModule = createModule('chat', {
    namespaced: true,
    state: {
        chat: {} as IChat,
        chats: [] as IChat[],
    },

    mutations: {
        setChat(state, chat: IChat) {
            state.chat = chat
        },
        setChats(state, chats: IChat[]) {
            state.chats = chats
        },
        setMessages(state, messages: IMessage[]) {
            state.chat.messages = messages
        },
    },

    actions: {
        async getChat() {
            try {
                const { params, query } = router.currentRoute.value

                const res = await apiChatWithToken.post(
                    `one/${params.chatId}`,
                    {
                        userId: query.cr,
                        ownerId: query.ow,
                    }
                )
                chatModule.mutations.setChat(res.data)
            } catch (error) {
                console.error(error)
            }
        },

        async getChats() {
            try {
                const res = await apiChatWithToken.get('all')
                chatModule.mutations.setChats(res.data)

                return res.data
            } catch (error) {
                console.error(error)
            }
        },

        async removeChat(ctx, chatId: string) {
            try {
                const res = await apiChatWithToken.get(`remove/${chatId}`)
                chatModule.mutations.setChats(res.data)
            } catch (error) {
                console.error(error)
            }
        },
    },

    getters: {
        interlocutor(state) {
            return getInterlocutor(state.chat)
        },
        messages(state) {
            const interlocutor = chatModule.getters.interlocutor
            const newMessages: any[] = []

            state.chat.messages?.forEach((el, i) => {
                const date = msgCreatedDate(el.createdAt)

                let last = newMessages[newMessages.length - 1]

                if (i === 0 || last?.date !== date) {
                    newMessages.push({
                        id: i,
                        date,
                        items: [],
                    })
                }

                last = newMessages[newMessages.length - 1]

                if (
                    i === 0 ||
                    last.items[last.items.length - 1]?.userId !== el.userId
                ) {
                    last.items.push({
                        userId: el.userId,
                        toRight: interlocutor._id !== el.userId,
                        messages: [],
                    })
                }

                last = last.items[last.items.length - 1]

                last.messages.push({
                    text: el.message,
                    id: el._id,
                    date: msgCreatedTime(el.createdAt),
                })
            })

            return newMessages
        },

        chatsList(state) {
            return state.chats.filter(({ owner, messages }) => {
                return !(
                    userModule.getters.curUserId === owner._id &&
                    !messages.length
                )
            })
        },
    },
})

chatModule.register(store)

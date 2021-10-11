<template lang="pug">
the-main
    template(#center)
        h1.page-title Сообщения
        app-ad-card(
                v-if="chatsList.length"
                v-for="chat in chatsList"
                :key="chat._id"
                :imgSrc="chat.ad.images.url"
                :url="getUrl(chat)"
                :top="getInterlocutorName(chat)"
                :md="chat.ad.name"
                :btm="chatCreatedDate(chat.ad.createdAt)"
            )
                button(@click="onRemoveChat(chat._id)" title="Удалить").btn-del
                    i.el-icon-delete-solid.icon-del
        el-empty(v-else description="Пусто")
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { chatModule } from '../store/chat'
import { IChat } from '../store/chat.interface'
import { getInterlocutor } from '../utils/getInterlocutor'
import { chatCreatedDate } from '../utils/date'
import { useRemoveMessage } from '../hooks'

export default defineComponent({
    name: 'ChatsList',

    setup() {
        onMounted(async () => {
            await chatModule.actions.getChats()
        })

        const getInterlocutorName = (chat: IChat) => {
            const interlocutor = getInterlocutor(chat)

            return interlocutor.name || interlocutor.email
        }

        const getUrl = ({ ad, user, owner }: IChat) => {
            return {
                name: 'Chat',
                params: { chatId: ad._id },
                query: { cr: user._id, ow: owner._id },
            }
        }

        return {
            chatsList: computed(() => chatModule.getters.chatsList),
            onRemoveChat: useRemoveMessage(chatModule.actions.removeChat),
            getInterlocutorName,
            getUrl,
            chatCreatedDate,
        }
    },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_vars.scss';

.item + .item {
    margin-top: 30px;
}

.img {
    height: 178px;
    object-fit: cover;
    display: block;
    width: 100%;
    border-radius: 10px;
}

.user-name {
    font-size: 18px;
    font-weight: bold;
}

.user-name + .ad-name {
    margin-top: 5px;
}

.btn-del {
    text-align: center;
}

.text {
    padding-left: 30px;
}

.icon-del {
    font-size: 25px;
    padding: 5px;
}
</style>

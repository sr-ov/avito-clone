<template lang="pug">
el-dropdown(:show-timeout="0")
	span.dropdown-text
		i.el-icon-user-solid.icon
		span {{ userName }}
	template(#dropdown)
		el-dropdown-menu
			el-dropdown-item.dropdown__item
				router-link(to="/settings").dropdown__link Настройки
			el-dropdown-item.dropdown__item
				router-link(to="/my-ads").dropdown__link Объявления
			el-dropdown-item.dropdown__item
				router-link(to="/favorites").dropdown__link Избранное
			el-dropdown-item.dropdown__item
				router-link(to="/chats").dropdown__link Сообщения
			el-dropdown-item.dropdown__item
				router-link(to="/" @click="logOut").dropdown__link Выйти
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { userModule } from '../store/user'

export default defineComponent({
	name: 'TheUserMenu',

	setup() {
		return {
			userName: computed(() => userModule.getters.userName),
			logOut: userModule.mutations.logOut,
		}
	},
})
</script>

<style scoped lang="scss">
.dropdown-text {
	display: flex;
	cursor: pointer;
	padding: 10px 15px;
	align-items: center;
}

.icon {
	font-size: 18px;
	margin-right: 5px;
}

.dropdown__item {
	transition: background-color 0.2s ease-in;

	&:hover {
		background-color: darken(#fff, 5%);
	}
}

.dropdown__link {
	display: block;
}
</style>

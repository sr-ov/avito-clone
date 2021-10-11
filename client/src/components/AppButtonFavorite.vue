<template lang="pug">
button(@click="toFavorite($event, id)").btn-favorite
	icon-favorite(:isActive="isActive")
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { adModule } from '../store/ad'
import { userModule } from '../store/user'

export default defineComponent({
	name: 'AppButtonFavorite',

	props: {
		id: { type: String, default: '' },
	},
	setup(props) {
		return {
			toFavorite(e: Event, id: string) {
				e.preventDefault()
				adModule.actions.toFavorite(id)
			},
			isActive: computed(() =>
				userModule.state.user.favorites?.includes(props.id),
			),
		}
	},
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/_vars.scss';

.btn-favorite {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px;
}
</style>

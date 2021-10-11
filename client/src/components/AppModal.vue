<template lang="pug">
el-dialog(v-model="toggle" append-to-body)
	template(#title)
		slot(name="title")

	template(#default)
		slot(name="default")

	template(#footer)
		slot(name="footer")
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
	name: 'AppModal',

	props: {
		modelValue: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update:modelValue'],

	setup(props, { emit }) {
		return {
			toggle: computed({
				get() {
					return props.modelValue
				},
				set(value) {
					emit('update:modelValue', value)
				},
			}),
		}
	},
})
</script>

<style scoped lang="scss"></style>

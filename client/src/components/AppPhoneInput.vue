<template lang="pug">
el-input(
	v-model="phone"
	size="small"
	clearable
	placeholder="+7 (###) ##-##-##"
	style="width: fit-content"
)
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { mask } from 'maska'

export default defineComponent({
	name: 'AppPhoneInput',

	props: {
		modelValue: {
			type: String,
			required: true,
			default: '',
		},
	},
	emits: ['update:modelValue'],

	setup(props, { emit }) {
		const phone = computed({
			get: () => props.modelValue,
			set: (value) =>
				emit(
					'update:modelValue',
					mask(value, '+7 (###) ##-##-##', undefined),
				),
		})
		return {
			phone,
		}
	},
})
</script>

<style scoped lang="scss"></style>

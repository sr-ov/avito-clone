<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="18"
        height="12"
    >
        <defs>
            <path
                d="M1.24 9.672A9.6 9.6 0 0 1 10.002 4a9.6 9.6 0 0 1 8.763 5.672.8.8 0 0 1 0 .656A9.6 9.6 0 0 1 10.002 16a9.6 9.6 0 0 1-8.762-5.672.8.8 0 0 1 0-.656zM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-1.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                id="a"
            />
        </defs>
        <use fill="#B8B8B8" xlink:href="#a" transform="translate(-1 -4)" />
    </svg>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'IconViews',

    setup() {
        return {}
    },
})
</script>

<style lang="scss" scoped></style>

<template lang="pug">
.services
    h2.services__title Сервисы и услуги
    div(v-for="el in data" :key="el.title").card
        img(:src="el.imgSrc").card__img
        h3.card__title {{ el.title }}
        p.card__desc {{ el.desc }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TheServices',

    setup() {
        const getIcon = (n: number): string =>
            require(`@/assets/images/services-icons/${n}.svg`)

        return {
            data: [
                {
                    imgSrc: getIcon(1),
                    title: 'Доставка',
                    desc: 'Проверка при получении и возможность бесплатно вернуть товар',
                },
                {
                    imgSrc: getIcon(2),
                    title: 'Автотека',
                    desc: 'Отчёт с историей авто: пробег, владельцы, сведения о залоге, ДТП и ремонтах',
                },
                {
                    imgSrc: getIcon(3),
                    title: 'Онлайн-бронирование жилья',
                    desc: 'Посуточная аренда квартир и домов: большой выбор вариантов для поездок по России',
                },
            ],
        }
    },
})
</script>

<style scoped lang="scss">
.services {
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 37px;
}

.services__title {
    margin-bottom: 23px;
    font-size: 18px;
}

.card + .card {
    margin-top: 25px;
}

.card__title {
    font-weight: bold;
    line-height: 21px;
    margin-bottom: 5px;
}

.card__img {
    margin-bottom: 5px;
}
</style>

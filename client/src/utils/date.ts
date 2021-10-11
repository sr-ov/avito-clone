import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import calendar from 'dayjs/plugin/calendar'

dayjs.locale('ru')
dayjs.extend(calendar)

const createDate = ([sameDay, lastDay, sameElse, lastWeek]: string[]) => (
	d: string,
) => dayjs(d).calendar(null, { sameDay, lastDay, sameElse, lastWeek })

export const adCreatedDate = createDate([
	'[сегодня] HH:mm',
	'[вчера] HH:mm',
	...Array(2).fill('DD MMMM HH:mm'),
])

export const msgCreatedTime = createDate(Array(4).fill('HH:mm'))

export const msgCreatedDate = createDate([
	'[сегодня]',
	'[вчера]',
	...Array(2).fill('DD MMMM'),
])

export const chatCreatedDate = createDate([
	'[сегодня]',
	'[вчера]',
	...Array(2).fill('DD MMMM YYYY'),
])

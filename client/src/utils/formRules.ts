export const rules = {
	required: true,
	message: 'Обязательное поле',
	trigger: 'blur',
}
export const phoneRules = [
	rules,
	{
		...rules,
		pattern: /^\+7\s\(\d{3}\)\s\d{2}-\d{2}-\d{2}$/,
		message: 'некорректный номер',
	},
]

export const passwordRules = {
	trigger: 'blur',
	min: 6,
	message: 'Пароль не меньше 6 символов',
}

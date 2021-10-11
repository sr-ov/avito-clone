export const prop = (key: string) => <T>(obj: { [key: string]: T }): T =>
    obj[key]

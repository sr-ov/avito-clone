import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    try {
        const PORT = process.env.PORT ?? 4321

        const app = await NestFactory.create(AppModule, {
            logger: ['error', 'warn'],
        })

        app.setGlobalPrefix('api')
        app.enableCors({ exposedHeaders: 'x-flag, x-total-count' })

        await app.listen(PORT, () => {
            console.log('start server ==>> ', PORT)
        })
    } catch (error) {
        console.error(error)
    }
}
bootstrap()

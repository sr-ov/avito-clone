import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { Response as ExpressResponse } from 'express'

@Injectable()
export class AddTotalCountAdsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const Res: ExpressResponse = context.switchToHttp().getResponse()

        return next.handle().pipe(
            map((data) => {
                Res.setHeader('x-total-count', data[1])

                return data[0]
            })
        )
    }
}

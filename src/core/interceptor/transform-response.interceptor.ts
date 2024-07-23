import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export function TransformResponse<T>(payload: ClassConstructor<T>) {
  return applyDecorators(
    UseInterceptors(new TransformResponseInterceptor(payload)),
  );
}

export class TransformResponseInterceptor<T> implements NestInterceptor {
  constructor(private payload: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => plainToClass(this.payload, data, { excludeExtraneousValues: true })));
  }
}
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Payment } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from './data-base/prisma.service';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('PAYMENTS_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async create(data: PaymentDto): Promise<Payment> {
    const payment = await this.prismaService.payment.create({
      data: {
        ...data,
        status: 'APPROVED',
      },
    });

    await lastValueFrom(this.kafkaClient.emit('payments', payment));
    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.prismaService.payment.findMany();
  }
}

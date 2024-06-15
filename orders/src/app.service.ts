import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Order } from '@prisma/client';
import { Observable, lastValueFrom } from 'rxjs';
import { PrismaService } from './data-base/prisma.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class AppService {
  private requestPatterns = ['findAllPayments'];

  constructor(
    private prismaService: PrismaService,
    @Inject('ORDERS_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.requestPatterns.forEach((pattern) => {
      this.kafkaClient.subscribeToResponseOf(pattern);
    });
    await this.kafkaClient.connect();
  }

  async create(data: OrderDto): Promise<Order> {
    const order = await this.prismaService.order.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
    await lastValueFrom(this.kafkaClient.emit('orders', order));
    return order;
  }

  async all() {
    return await this.prismaService.order.findMany();
  }

  allPayments(): Observable<any> {
    return this.kafkaClient.send('findAllPayments', {});
  }

  async updateStatus(order_id: number, status: string) {
    return await this.prismaService.order.update({
      where: {
        id: order_id,
      },
      data: {
        status,
      },
    });
  }
}

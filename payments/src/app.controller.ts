import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Payment } from '@prisma/client';
import { AppService } from './app.service';

@Controller('payments')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('orders')
  async create(@Payload() message): Promise<Payment> {
    return await this.appService.create({
      amount: message.price,
      order_id: message.id,
      client_id: message.client_id,
    });
  }

  @MessagePattern('findAllPayments')
  async findAll(): Promise<Payment[]> {
    return await this.appService.findAll();
  }
}

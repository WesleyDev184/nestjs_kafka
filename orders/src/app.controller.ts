import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Order } from '@prisma/client';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() data: OrderDto): Promise<Order> {
    return await this.appService.create(data);
  }

  @Get()
  async all(): Promise<Order[]> {
    return await this.appService.all();
  }

  @Get('payments')
  allPayments(): Observable<any> {
    return this.appService.allPayments();
  }

  @MessagePattern('payments')
  async complete(@Payload() message) {
    await this.appService.updateStatus(
      message.order_id,
      message.status === 'APPROVED' ? 'PAYED' : 'CANCELLED',
    );
  }
}

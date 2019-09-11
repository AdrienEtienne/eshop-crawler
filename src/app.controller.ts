import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessBody } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): SuccessBody<string> {
    return {
      result: this.appService.getHello(),
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { SuccessBodyDto } from '../dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): SuccessBodyDto<string> {
    return {
      result: this.appService.getHello(),
    };
  }
}

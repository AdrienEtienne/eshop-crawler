import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { SuccessBodyDto } from '../dtos';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): SuccessBodyDto<string> {
    return {
      result: this.appService.getHello(),
    };
  }

  @Get('ATriggerVerify.txt')
  downloadTriggerVerify(@Res() res: Response) {
    res.download('./ATriggerVerify.txt');
  }
}

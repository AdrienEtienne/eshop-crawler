import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, logger } from './config';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());

  await app.listen(PORT);
  logger.log(`App started on port ${PORT}`);
}
bootstrap();

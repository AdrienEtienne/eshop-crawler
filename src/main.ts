import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, logger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  logger.log(`App started on port ${PORT}`);
}
bootstrap();

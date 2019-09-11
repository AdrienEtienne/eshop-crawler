import { Logger } from '@nestjs/common';

export const logger = new Logger('Main');

export const PORT = process.env.PORT || 3000;

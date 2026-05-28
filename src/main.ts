import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'https://ievgenbilion.developerakademie.net', 'https://ievgenbilion.github.io'], // Specify the exact origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies, authorization headers, etc. (if needed)
  });
  const port = process.env.PORT ?? 4200;
  await app.listen(port, '0.0.0.0');
  console.info(`Server running on port ${port}`);
}
void bootstrap();

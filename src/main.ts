import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("bootstrap");
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix("med");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.enableCors({});
  const config = new DocumentBuilder()
    .setTitle("Apis para las licencias")
    .setDescription(
      "Documentación de las Apis para Medidonor."
    )
    .setVersion("2.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3000;

  await app.listen(process.env.PORT, "0.0.0.0");
  const server = app.getHttpServer();
  const address =
    server.address().address === "0.0.0.0"
      ? "localhost"
      : server.address().address;

  logger.log(`App corriendo en: http://${address}:${port}/gen`);
  logger.log(`Swagger docs en: http://${address}:${port}/docs`);
}
bootstrap();

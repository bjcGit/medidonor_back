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

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("Apis del back Medidonor")
    .setDescription("Documentación de las Apis para Medidonor.")
    .setVersion("1.0")
    .addBearerAuth( 
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "token"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT, "0.0.0.0");
  logger.log(`App corriendo en: ${process.env.HOST_API}/med`);
  logger.log(`Swagger docs en: ${process.env.HOST_API}/docs`);
  logger.log(`Servidor corriendo en: ${process.env.PORT}`);
}
bootstrap();
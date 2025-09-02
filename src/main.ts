/* 
main.ts
Ponto de entrada da aplicação. Sobe o servidor, aplica pipes globais e configurações que valem para toda a app como validação de DTOs
*/
import { NestFactory } from "@nestjs/core"; // classe para criar a aplicação
import { AppModule } from "./app.module"; // agrega todos os outros módulos UserModule..
import { BadRequestException, ValidationPipe } from "@nestjs/common"; // validação automática de DTOs

async function bootstrap() {
  // app é o servidor que vai ouvir requisições HTTP
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove do body qualquer campo que não esteja no DTO
      forbidNonWhitelisted: true, // retorna erro se o body tiver campos extras não previstos
      transform: true, // transforma os tipos do body para o tipo definido no DTO strings para números, datas, etc
      exceptionFactory: (errors) => {
        // personaliza mensagens de erro
        const messages = errors
          .map((err) => Object.values(err.constraints || {}).join(", "))
          .join("; ");
        return new BadRequestException(messages);
      },
    })
  );

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

/* 
main.ts ponto de partida do backend, responsável por iniciar o servidor e aplicar regras globais (como validação de DTOs) 
*/
import { NestFactory } from '@nestjs/core'; // classe para criar a aplicação
import { AppModule } from './app.module'; // agrega todos os outros módulos UserModule..
import { ValidationPipe } from '@nestjs/common'; // validação automática de DTOs

async function bootstrap() {
  // app é o servidor que vai ouvir requisições HTTP
  const app = await NestFactory.create(AppModule);

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove do body qualquer campo que não esteja no DTO
      forbidNonWhitelisted: true, // retorna erro se o body tiver campos extras não previstos
      transform: true, // transforma os tipos do body para o tipo definido no DTO strings para números, datas, etc
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

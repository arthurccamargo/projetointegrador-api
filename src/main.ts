/* 
main.ts
Ponto de entrada da aplicação. Sobe o servidor, aplica pipes globais e configurações que valem para toda a app como validação de DTOs
*/
import { NestFactory } from "@nestjs/core"; // classe para criar a aplicação
import { AppModule } from "./app.module"; // agrega todos os outros módulos UserModule..
import { BadRequestException, ValidationPipe } from "@nestjs/common"; // validação automática de DTOs
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"; // configuração do Swagger

async function bootstrap() {
  // app é o servidor que vai ouvir requisições HTTP
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove do body qualquer campo que não esteja no DTO
      forbidNonWhitelisted: false, // body pode ter campos extras não previstos
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

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("API Projeto Integrador - Voluntariado")
    .setDescription("API para gestão de eventos de voluntariado e candidaturas")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Insira o token JWT",
        in: "header",
      },
      "JWT-auth",
    )
    .addTag("Auth", "Autenticação de usuários")
    .addTag("Users", "Cadastro de voluntários e ONGs")
    .addTag("Events", "Gestão de eventos")
    .addTag("Applications", "Candidaturas de voluntários")
    .addTag("Categories", "Categorias de eventos")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000, '0.0.0.0'); // 3000 é a porta onde a API vai rodar localmente
  console.log('🚀 API rodando em http://localhost:3000');
  console.log('📚 Swagger docs em http://localhost:3000/api/docs');
}
bootstrap();

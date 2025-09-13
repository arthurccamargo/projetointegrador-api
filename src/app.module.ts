/* 
app.module
Módulo raiz do NestJS. Define quais módulos, controllers e providers serão carregados na aplicação. Não sobe o servidor.
*/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule
  ],
})
export class AppModule {}

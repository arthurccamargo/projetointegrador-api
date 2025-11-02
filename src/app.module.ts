/* 
app.module
Módulo raiz do NestJS. Define quais módulos, controllers e providers serão carregados na aplicação. Não sobe o servidor.
*/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { EventModule } from './modules/event/event.module';
import { EventApplicationModule } from './modules/event-application/event-application.module';
import { AdminModule } from './modules/admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    EventModule,
    EventApplicationModule,
    AdminModule,
  ],
})
export class AppModule {}

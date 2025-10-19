import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from "../../../prisma/prisma.module";

// módulo agrega controllers e providers, e decide quais outros módulos ele precisa (imports) para funcionar
@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

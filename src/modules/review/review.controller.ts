import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import { RolesGuard } from "../../common/guard/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserPayload } from "../auth/types/users-payload";

@ApiTags("Reviews")
@ApiBearerAuth("JWT-auth")
@Controller("reviews")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles("VOLUNTEER")
  @ApiOperation({
    summary: "Criar avaliação (apenas voluntários)",
    description:
      "Voluntário avalia ONG após evento. Requer check-in feito e evento IN_PROGRESS ou COMPLETED. Prazo: 48h após check-in.",
  })
  @ApiResponse({
    status: 201,
    description: "Avaliação criada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Prazo expirado ou validação falhou" })
  @ApiResponse({ status: 403, description: "Apenas voluntários podem avaliar" })
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: UserPayload) {
    return this.reviewService.create(dto, user.sub);
  }

  @Get("eligible")
  @Roles("VOLUNTEER")
  @ApiOperation({
    summary: "Listar candidaturas elegíveis para avaliação",
    description:
      "Retorna eventos onde o voluntário fez check-in e ainda pode avaliar (48h após check-in).",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de candidaturas elegíveis",
  })
  findEligible(@CurrentUser() user: UserPayload) {
    return this.reviewService.findEligibleApplications(user.sub);
  }

  @Get("my")
  @Roles("VOLUNTEER")
  @ApiOperation({
    summary: "Listar minhas avaliações",
    description: "Retorna todas as avaliações feitas pelo voluntário logado.",
  })
  @ApiResponse({ status: 200, description: "Lista de avaliações do voluntário" })
  findMyReviews(@CurrentUser() user: UserPayload) {
    return this.reviewService.findMyReviews(user.sub);
  }

  @Get("ong/:ongId")
  @ApiOperation({
    summary: "Listar avaliações de uma ONG (público)",
    description:
      "Retorna avaliações de uma ONG com paginação. Acessível a todos usuários autenticados.",
  })
  @ApiParam({ name: "ongId", description: "ID da ONG", example: "clxy123456789" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: "Lista de avaliações da ONG",
  })
  findByOng(
    @Param("ongId") ongId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.reviewService.findByOng(ongId, pageNumber, limitNumber);
  }

  @Patch(":id")
  @Roles("VOLUNTEER")
  @ApiOperation({
    summary: "Atualizar avaliação (apenas voluntário autor)",
    description: "Voluntário pode editar sua avaliação dentro de 48h após check-in.",
  })
  @ApiParam({ name: "id", description: "ID da avaliação", example: "clxy123456789" })
  @ApiResponse({ status: 200, description: "Avaliação atualizada com sucesso" })
  @ApiResponse({ status: 400, description: "Prazo expirado" })
  @ApiResponse({ status: 403, description: "Sem permissão para editar" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.reviewService.update(id, dto, user.sub);
  }

  @Delete(":id")
  @Roles("VOLUNTEER")
  @ApiOperation({
    summary: "Excluir avaliação (apenas voluntário autor)",
    description: "Voluntário pode excluir sua avaliação dentro de 48h após check-in.",
  })
  @ApiParam({ name: "id", description: "ID da avaliação", example: "clxy123456789" })
  @ApiResponse({ status: 200, description: "Avaliação excluída com sucesso" })
  @ApiResponse({ status: 400, description: "Prazo expirado" })
  @ApiResponse({ status: 403, description: "Sem permissão para excluir" })
  remove(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    return this.reviewService.remove(id, user.sub);
  }
}

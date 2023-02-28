import {Body, Controller, Get, HttpCode, Param, Post, UseInterceptors} from '@nestjs/common';
import { GameApiV1Service } from './game-api-v1.service';
import { GameApiV1ConvertPoolDto } from './dto/game-api-v1.dto';
import { ConvertPoolEntity } from '../repository/convert-pool.entitty';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {ResponseMessage} from "../../decorator/response.decorator";
import {SUCCESS} from "../../decorator/response.constants";

@ApiBearerAuth()
@ApiTags('Game API')
@Controller({
  version: '1',
})
export class GameApiV1Controller {
  constructor(private readonly gameApiService: GameApiV1Service) {}

  @Get('/account/:address')
  @HttpCode(201)
  // @ResponseMessage(SUCCESS)
  @ApiOperation({ summary: 'get a account on blockchain network' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  test(@Param('address') address: string): Promise<any> {
    return this.gameApiService.getAccount(address);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a convert pool' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ConvertPoolEntity,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() gameApiV1ConvertPoolDto: GameApiV1ConvertPoolDto,
  ): Promise<ConvertPoolEntity> {
    return this.gameApiService.create(gameApiV1ConvertPoolDto);
  }
}

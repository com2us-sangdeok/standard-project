import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameApiV1Service } from './game-api-v1.service';
import { GameApiV1ConvertPoolDto } from './dto/game-api-v1.dto';
import { ConvertPoolEntity } from '../repository/convert-pool.entitty';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Game API')
@Controller({
  version: '1',
})
export class GameApiV1Controller {
  constructor(private readonly gameApiService: GameApiV1Service) {}

  @Get('/account/:address')
  @ApiOperation({ summary: 'Create a account on Terra blockchain network' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  test(@Param('address') address: string): Promise<any> {
    return this.gameApiService.createAccount(address);
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

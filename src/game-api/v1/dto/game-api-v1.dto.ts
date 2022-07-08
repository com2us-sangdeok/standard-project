import {ApiProperty} from "@nestjs/swagger";

export class GameApiV1ConvertPoolDto {
  @ApiProperty({ example: 'afkraid', description: 'game app name' })
  appName: string;
  @ApiProperty({ example: 100, description: 'lower game currency' })
  lowerGameCurrency: number;
  @ApiProperty({ example: 0, description: 'game token' })
  gameToken: number;
  @ApiProperty({ example: 100, description: 'upper game currency' })
  upperGameCurrency: number;
  @ApiProperty({ example: 0, description: 'c2x' })
  ctx: number;
}

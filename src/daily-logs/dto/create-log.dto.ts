import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLogDto {
  @IsString()
  userId: string;

  @IsString()
  foodId: string;

  @IsOptional()
  @IsNumber()
  portion?: number;
}

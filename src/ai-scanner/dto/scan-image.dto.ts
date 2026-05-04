import { IsString, IsNotEmpty } from 'class-validator';

export class ScanImageDto {
  @IsString()
  @IsNotEmpty()
  image: string;
}

import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Nama minimal 2 karakter' })
  name: string;

  @IsString()
  @MinLength(6, { message: 'Kata sandi minimal 6 karakter' })
  password: string;

  @IsOptional()
  @IsIn(['WEIGHT_LOSS', 'DIABETES_CARE', 'BODYBUILDING'])
  goal?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsString()
  password: string;
}

import { Controller, Post, Put, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AuthService, ProfileDto } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  google(@Body() dto: { email: string; name: string }) {
    return this.authService.googleLogin(dto.email, dto.name);
  }

  @Post(':userId/goal')
  @HttpCode(HttpStatus.OK)
  updateGoal(
    @Body() dto: { goal: string },
    @Param('userId') userId: string
  ) {
    return this.authService.updateGoal(userId, dto.goal);
  }

  @Put(':userId/profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @Param('userId') userId: string,
    @Body() dto: ProfileDto,
  ) {
    return this.authService.updateProfile(userId, dto);
  }
}


import { Controller, Post, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
  google(@Body() dto: { idToken: string }) {
    return this.authService.googleLogin(dto.idToken);
  }

  @Post(':userId/goal')
  @HttpCode(HttpStatus.OK)
  updateGoal(
    @Body() dto: { goal: string },
    @Param('userId') userId: string
  ) {
    return this.authService.updateGoal(userId, dto.goal);
  }
}


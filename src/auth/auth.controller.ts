import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto, @Body() body, @Body('id') id) {
    return this.auth.refresh(body.id, dto.refreshToken);
  }
}

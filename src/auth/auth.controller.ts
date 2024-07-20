import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto, signUpAuthSchema } from './dto';
import { ZodValidationPipe } from 'src/pipes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signUpAuthSchema))
  @Post('sign-up')
  signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @Post('sign-in')
  signIn(@Body() signInAuthDto: SignInAuthDto) {
    return this.authService.signIn(signInAuthDto);
  }

  @Post('refresh')
  refresh(@Body() refreshToken: string) {
    if (!refreshToken || refreshToken === '') {
      throw new BadRequestException('Token no enviado');
    }

    return this.authService.refresh(refreshToken);
  }
}

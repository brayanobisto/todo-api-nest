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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registra un nuevo usuario y lo autentica',
    description:
      'El usuario se registra con su email, nombre, apellido y contraseña',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              name: { type: 'string', minLength: 1, example: 'John' },
              lastName: { type: 'string', minLength: 1, example: 'Doe' },
              password: { type: 'string', minLength: 6, example: '123456' },
            },
            required: ['email', 'name', 'lastName', 'password'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con tokens de acceso y refresco',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                lastName: { type: 'string' },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(signUpAuthSchema))
  @Post('sign-up')
  signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @ApiOperation({
    summary: 'Inicia sesión con un usuario existente',
    description: 'Las credenciales son el email y la contraseña.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6, example: '123456' },
            },
            required: ['email', 'password'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con tokens de acceso y refresco',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                lastName: { type: 'string' },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  })
  @Post('sign-in')
  signIn(@Body() signInAuthDto: SignInAuthDto) {
    return this.authService.signIn(signInAuthDto);
  }

  @ApiOperation({
    summary: 'Refresca el token de acceso',
    description: 'El token de acceso se refresca con el token de refresco',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: { type: 'string' },
            },
            required: ['refreshToken'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens de acceso y refresco',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  })
  @Post('refresh')
  refresh(@Body() refreshToken: string) {
    if (!refreshToken || refreshToken === '') {
      throw new BadRequestException('Token no enviado');
    }

    return this.authService.refresh(refreshToken);
  }
}

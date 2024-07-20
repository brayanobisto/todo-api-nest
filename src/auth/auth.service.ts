import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateTokensAndUpdate({
    sub,
    email,
  }: {
    sub: string;
    email: string;
  }) {
    const payload = { sub, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { id: sub },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(signUpAuthDto: SignUpAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpAuthDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este email ya está en uso');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signUpAuthDto.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        ...signUpAuthDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
      },
    });

    // Generate JWT tokens
    const { accessToken, refreshToken } = await this.generateTokensAndUpdate({
      sub: newUser.id,
      email: newUser.email,
    });

    return { user: newUser, accessToken, refreshToken };
  }

  async signIn(signInAuthDto: SignInAuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: signInAuthDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(
      signInAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = await this.generateTokensAndUpdate({
      sub: user.id,
      email: user.email,
    });

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Token no válido');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokensAndUpdate({ sub: user.id, email: user.email });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }
}

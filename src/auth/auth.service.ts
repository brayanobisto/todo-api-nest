import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
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

  private async generateToken({ sub, email }: { sub: string; email: string }) {
    const payload = { sub, email };
    const token = this.jwtService.sign(payload);

    return token;
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

    // Generate JWT token
    const token = await this.generateToken({
      sub: newUser.id,
      email: newUser.email,
    });

    return { user: newUser, token };
  }

  async signIn(signInAuthDto: SignInAuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: signInAuthDto.email },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      signInAuthDto.password,
      user.password,
    );

    // Generate JWT token
    const token = await this.generateToken({
      sub: user.id,
      email: user.email,
    });

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}

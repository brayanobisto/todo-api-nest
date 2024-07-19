// TODO: Add prisma service to interact with the database
import { Injectable } from '@nestjs/common';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Injectable()
export class AuthService {
  signUp(signUpAuthDto: SignUpAuthDto) {
    console.log(signUpAuthDto);

    return 'This sign-up action returns a new user';
  }

  signIn(signInAuthDto: SignInAuthDto) {
    console.log(signInAuthDto);

    return 'This sign-in action returns a new token';
  }
}

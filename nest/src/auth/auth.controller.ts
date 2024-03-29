import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/otp.dto';
import { SigninDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';

// ===============================//
//           Auth Controller      //
//================================//
@Controller('nest/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // amdin login
  @Post('admin/login')
  @HttpCode(HttpStatus.CREATED)
  userSignUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  // ======== varify otp ========
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() otp: OtpDto) {
    return this.authService.verifyOtp(otp);
  }
  // ======== Sing with email and password ========
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SigninDto) {
    return this.authService.signIn(data);
  }

  // ======== Get my Information ========
  @Get('myinfo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMyInfo(@Request() req) {
    const user = req.user;
    return this.authService.getMyInfo(user.id);
  }
}

// ===============================//
//          Route for user       //
//================================//
@Controller('nest/auth/user')
export class UserAuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  userSignUp(@Body() data: SignUpDto) {
    return this.authService.userSignUp(data);
  }
}

import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUserByCredentials(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Request() req) {
        return req.user;
    }
}

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(loginDto: LoginDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            fullName: any;
            email: any;
            role: any;
            avatarUrl: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            fullName: any;
            email: any;
            role: any;
            avatarUrl: any;
        };
    }>;
    loginUser(user: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            fullName: any;
            email: any;
            role: any;
            avatarUrl: any;
        };
    }>;
    refreshToken(user: any): Promise<{
        accessToken: string;
    }>;
}

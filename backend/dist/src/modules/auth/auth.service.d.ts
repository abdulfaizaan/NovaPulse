import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
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
    validateOAuthUser(profile: {
        email: string;
        fullName: string;
        googleId?: string;
        microsoftId?: string;
        avatarUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        email: string;
        password: string;
        role: string;
        avatarUrl: string | null;
        googleId: string | null;
        microsoftId: string | null;
        departmentId: string | null;
        managerId: string | null;
    }>;
}

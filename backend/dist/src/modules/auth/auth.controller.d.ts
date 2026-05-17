import express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(): Promise<{
        message: string;
    }>;
    refresh(user: any): Promise<{
        accessToken: string;
    }>;
    getProfile(user: any): any;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: express.Response): Promise<void>;
    microsoftAuth(req: any): Promise<void>;
    microsoftAuthRedirect(req: any, res: express.Response): Promise<void>;
}

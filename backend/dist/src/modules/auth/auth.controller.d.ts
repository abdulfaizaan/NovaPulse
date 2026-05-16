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
    getProfile(user: any): any;
}

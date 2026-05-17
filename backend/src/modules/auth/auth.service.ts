import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.loginUser(user);
  }

  async loginUser(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    };
  }

  // Example of refresh token implementation placeholder
  async refreshToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async validateOAuthUser(profile: { email: string; fullName: string; googleId?: string; microsoftId?: string; avatarUrl?: string }) {
    const { email, fullName, googleId, microsoftId, avatarUrl } = profile;
    
    // Check if user exists by email
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update OAuth IDs if they don't exist
      const updateData: any = {};
      if (googleId && !user.googleId) updateData.googleId = googleId;
      if (microsoftId && !user.microsoftId) updateData.microsoftId = microsoftId;
      if (avatarUrl && !user.avatarUrl) updateData.avatarUrl = avatarUrl;

      if (Object.keys(updateData).length > 0) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    } else {
      // Create new user if they don't exist
      // Note: We use a random password since they are logging in via OAuth
      user = await this.prisma.user.create({
        data: {
          email,
          fullName,
          googleId,
          microsoftId,
          avatarUrl,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          role: 'EMPLOYEE', // Default role
        },
      });
    }

    return user;
  }
}

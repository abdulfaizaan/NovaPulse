import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';
declare const MicrosoftStrategy_base: new (...args: [options: import("passport-microsoft").MicrosoftStrategyOptionsWithRequest] | [options: import("passport-microsoft").MicrosoftStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class MicrosoftStrategy extends MicrosoftStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any>;
}
export {};

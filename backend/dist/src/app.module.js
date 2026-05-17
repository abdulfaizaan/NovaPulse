"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const goals_module_1 = require("./modules/goals/goals.module");
const checkins_module_1 = require("./modules/checkins/checkins.module");
const admin_module_1 = require("./modules/admin/admin.module");
const reports_module_1 = require("./modules/reports/reports.module");
const events_module_1 = require("./events/events.module");
const escalation_module_1 = require("./escalation/escalation.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const goals_gateway_1 = require("./gateways/goals.gateway");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            goals_module_1.GoalsModule,
            checkins_module_1.CheckinsModule,
            admin_module_1.AdminModule,
            reports_module_1.ReportsModule,
            events_module_1.EventsModule,
            escalation_module_1.EscalationModule,
            webhooks_module_1.WebhooksModule,
        ],
        providers: [goals_gateway_1.GoalsGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
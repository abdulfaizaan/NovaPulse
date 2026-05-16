"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinsController = void 0;
const common_1 = require("@nestjs/common");
const checkins_service_1 = require("./checkins.service");
const checkin_dto_1 = require("./dto/checkin.dto");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const roles_guard_1 = require("../../guards/roles.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const current_user_decorator_1 = require("../../decorators/current-user.decorator");
const audit_log_interceptor_1 = require("../../interceptors/audit-log.interceptor");
const enums_1 = require("../../common/enums");
const swagger_1 = require("@nestjs/swagger");
let CheckinsController = class CheckinsController {
    checkinsService;
    constructor(checkinsService) {
        this.checkinsService = checkinsService;
    }
    create(user, createCheckinDto) {
        return this.checkinsService.create(user.id, createCheckinDto);
    }
    findByGoal(goalId, user) {
        return this.checkinsService.findByGoal(goalId, user.id, user.role);
    }
};
exports.CheckinsController = CheckinsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a quarterly check-in' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkin_dto_1.CreateCheckinDto]),
    __metadata("design:returntype", void 0)
], CheckinsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('goal/:goalId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all check-ins for a specific goal' }),
    __param(0, (0, common_1.Param)('goalId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CheckinsController.prototype, "findByGoal", null);
exports.CheckinsController = CheckinsController = __decorate([
    (0, swagger_1.ApiTags)('Check-ins'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_log_interceptor_1.AuditLogInterceptor),
    (0, common_1.Controller)('checkins'),
    __metadata("design:paramtypes", [checkins_service_1.CheckinsService])
], CheckinsController);
//# sourceMappingURL=checkins.controller.js.map
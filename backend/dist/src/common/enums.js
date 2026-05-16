"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInStatus = exports.GoalStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["EMPLOYEE"] = "EMPLOYEE";
    Role["MANAGER"] = "MANAGER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["DRAFT"] = "DRAFT";
    GoalStatus["SUBMITTED"] = "SUBMITTED";
    GoalStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    GoalStatus["APPROVED"] = "APPROVED";
    GoalStatus["REWORK_REQUESTED"] = "REWORK_REQUESTED";
    GoalStatus["LOCKED"] = "LOCKED";
    GoalStatus["COMPLETED"] = "COMPLETED";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
var CheckInStatus;
(function (CheckInStatus) {
    CheckInStatus["NOT_STARTED"] = "NOT_STARTED";
    CheckInStatus["ON_TRACK"] = "ON_TRACK";
    CheckInStatus["COMPLETED"] = "COMPLETED";
    CheckInStatus["DELAYED"] = "DELAYED";
})(CheckInStatus || (exports.CheckInStatus = CheckInStatus = {}));
//# sourceMappingURL=enums.js.map
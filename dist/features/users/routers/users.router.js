"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const create_user_handler_1 = require("./handlers/create-user-handler");
const input_dto_validation_users_middleware_1 = require("../validation/input-dto-validation-users-middleware");
const validation_result_middleware_1 = require("../../../core/middlewares/validation/validation-result-middleware");
const get_user_handler_1 = require("./handlers/get-user-handler");
const get_all_users_handler_1 = require("./handlers/get-all-users-handler");
const admin_guard_middleware_1 = require("../../../core/middlewares/auth/admin.guard-middleware");
const delete_user_handler_1 = require("./handlers/delete-user-handler");
const composition_root_1 = require("../../../composition-root");
const createUserHandler = composition_root_1.container.get(create_user_handler_1.CreateUserHandler);
const getUserHandler = composition_root_1.container.get(get_user_handler_1.GetUserHandler);
const getAllUsersHandler = composition_root_1.container.get(get_all_users_handler_1.GetAllUsersHandler);
const deleteUserHandler = composition_root_1.container.get(delete_user_handler_1.DeleteUserHandler);
exports.userRouter = (0, express_1.Router)();
//create user
exports.userRouter.post("/", admin_guard_middleware_1.adminGuardMiddleware, input_dto_validation_users_middleware_1.validationUserInputMiddleware, validation_result_middleware_1.validationResultMiddleware, createUserHandler.createUserHandler);
//get user by id
exports.userRouter.get("/:id", admin_guard_middleware_1.adminGuardMiddleware, getUserHandler.getUserHandler);
//get all users
exports.userRouter.get("/", admin_guard_middleware_1.adminGuardMiddleware, getAllUsersHandler.getAllUsersHandler);
//delete user by id
exports.userRouter.delete("/:id", admin_guard_middleware_1.adminGuardMiddleware, deleteUserHandler.deleteUserHandler);

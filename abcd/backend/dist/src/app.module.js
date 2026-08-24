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
const motels_module_1 = require("./modules/motels/motels.module");
const rooms_module_1 = require("./modules/rooms/rooms.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const storage_module_1 = require("./modules/storage/storage.module");
const queue_module_1 = require("./modules/queue/queue.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '../.env'],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            motels_module_1.MotelsModule,
            rooms_module_1.RoomsModule,
            contracts_module_1.ContractsModule,
            invoices_module_1.InvoicesModule,
            storage_module_1.StorageModule,
            queue_module_1.QueueModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
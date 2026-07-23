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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationsGateway = class NotificationsGateway {
    jwtService;
    server;
    userSockets = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token?.split(' ')[1] || client.handshake.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('No token');
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'super-secret-jwt-key' });
            const userId = payload.sub;
            client.data.user = payload;
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, []);
            }
            this.userSockets.get(userId)?.push(client.id);
            console.log(`Client connected: ${client.id} (User: ${userId})`);
        }
        catch (e) {
            console.log(`Unauthorized socket connection: ${client.id}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data?.user?.sub;
        if (userId && this.userSockets.has(userId)) {
            const sockets = this.userSockets.get(userId);
            if (sockets) {
                const index = sockets.indexOf(client.id);
                if (index !== -1) {
                    sockets.splice(index, 1);
                }
                if (sockets.length === 0) {
                    this.userSockets.delete(userId);
                }
            }
        }
        console.log(`Client disconnected: ${client.id}`);
    }
    sendNotificationToUser(userId, notification) {
        const sockets = this.userSockets.get(userId);
        if (sockets && sockets.length > 0) {
            sockets.forEach(socketId => {
                this.server.to(socketId).emit('notification', notification);
            });
        }
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map
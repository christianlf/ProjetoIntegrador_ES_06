"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
// src/entities/UserEntity.ts
class UserEntity {
    constructor(id, name, email, password, birthdate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
    }
}
exports.UserEntity = UserEntity;

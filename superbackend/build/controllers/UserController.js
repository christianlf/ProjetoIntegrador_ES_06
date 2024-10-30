"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const database_1 = __importDefault(require("../database/database"));
const UserEntity_1 = require("../entities/UserEntity");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, birthdate } = req.body;
            const userRepository = database_1.default.getRepository(UserEntity_1.UserEntity);
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = userRepository.create({
                name,
                email,
                password: hashedPassword,
                birthdate,
            });
            yield userRepository.save(newUser);
            return res.status(201).json(newUser);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const userRepository = database_1.default.getRepository(UserEntity_1.UserEntity);
            const user = yield userRepository.findOneBy({ email });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Senha incorreta!' });
            }
            return res.status(200).json({ message: 'Login bem-sucedido!', user });
        });
    }
}
exports.UserController = UserController;

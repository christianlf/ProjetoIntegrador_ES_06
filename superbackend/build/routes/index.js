"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const authRoutes_1 = require("./authRoutes");
const eventRoutes_1 = require("./eventRoutes");
const router = (0, express_1.Router)();
exports.routes = router;
// Define as rotas
router.use('/auth', authRoutes_1.authRoutes);
router.use('/eventos', eventRoutes_1.eventRoutes);

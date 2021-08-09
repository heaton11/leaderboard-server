"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let UsersController = class UsersController {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(users) {
        return this.usersRepository.create(users);
    }
    async count(where) {
        return this.usersRepository.count(where);
    }
    async find(filter) {
        console.log(filter);
        return this.usersRepository.find(filter);
    }
    async updateAll(users, where) {
        return this.usersRepository.updateAll(users, where);
    }
    async findById(id, filter) {
        return this.usersRepository.findById(id, filter);
    }
    async updateById(id, users) {
        await this.usersRepository.updateById(id, users);
    }
    async replaceById(id, users) {
        await this.usersRepository.replaceById(id, users);
    }
    async deleteById(id) {
        await this.usersRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    rest_1.post('/users'),
    rest_1.response(200, {
        description: 'Users model instance',
        content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Users) } },
    }),
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Users, {
                    title: 'NewUsers',
                    exclude: ['playerId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.get('/users/count'),
    rest_1.response(200, {
        description: 'Users model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Users)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "count", null);
tslib_1.__decorate([
    rest_1.get('/users'),
    rest_1.response(200, {
        description: 'Array of Users model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: rest_1.getModelSchemaRef(models_1.Users, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Users)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.patch('/users'),
    rest_1.response(200, {
        description: 'Users PATCH success count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Users, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Users)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Users, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "updateAll", null);
tslib_1.__decorate([
    rest_1.get('/users/{id}'),
    rest_1.response(200, {
        description: 'Users model instance',
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Users, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Users, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
tslib_1.__decorate([
    rest_1.patch('/users/{id}'),
    rest_1.response(204, {
        description: 'Users PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Users, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Users]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "updateById", null);
tslib_1.__decorate([
    rest_1.put('/users/{id}'),
    rest_1.response(204, {
        description: 'Users PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Users]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "replaceById", null);
tslib_1.__decorate([
    rest_1.del('/users/{id}'),
    rest_1.response(204, {
        description: 'Users DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "deleteById", null);
UsersController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UsersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UsersRepository])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map
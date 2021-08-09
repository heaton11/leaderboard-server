"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const websocket_decorator_1 = require("../websockets/decorators/websocket.decorator");
const repositories_1 = require("../repositories");
const dummyData_1 = require("../helpers/dummyData");
const leaderboard_1 = tslib_1.__importDefault(require("../helpers/leaderboard"));
const utilities_1 = require("../helpers/utilities");
const Leaderboard = new leaderboard_1.default();
let LeaderBoardController = class LeaderBoardController {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    giveMoney(username, amount) {
        this.usersRepository.updateAll({
            // @ts-ignore
            $inc: { money: amount }
        }, {
            name: username
        });
    }
    async giveMoneyWithDeduction(username, amount) {
        const [realAmount, commission] = utilities_1.deductCommision(amount, 2);
        Leaderboard.increasePrizePool(commission);
        Leaderboard.increase(username, realAmount);
        this.giveMoney(username, realAmount);
    }
    async getUsersWithRank(query, start = 1) {
        let users = await this.usersRepository.find(query);
        return users.map((user, index) => (Object.assign(Object.assign({}, user), { rank: start + index, dailyDiff: user.dailyRank - (start + index) })));
    }
    async getTopUsers(limit = 100) {
        let top = await Leaderboard.getTop(limit);
        let query = utilities_1.convertToUsersQueryObject(top);
        return this.getUsersWithRank(query);
    }
    // Get random user from redis with user's range 
    async getRandomUser() {
        let getRandomUser = await Leaderboard.getRandomUser();
        let users = await this.getUserRange(getRandomUser);
        return {
            user: getRandomUser,
            range: users
        };
    }
    // Get range between (user's rank - 3) and (user's rank + 2)
    async getUserRange(username) {
        let userRank = await Leaderboard.getRank(username);
        let [start, end] = [userRank - 3, userRank + 2];
        let userRange = await Leaderboard.getRange(start, end);
        let query = utilities_1.convertToUsersQueryObject(userRange);
        return this.getUsersWithRank(query, userRank - 3);
    }
    async getLeaderBoard() {
        const limit = 100;
        const topUsers = await this.getTopUsers(limit);
        const randomUserWithRange = await this.getRandomUser();
        return {
            currentUser: randomUserWithRange.user,
            users: [
                ...topUsers,
                ...randomUserWithRange.range.filter((user) => {
                    return (user.rank > limit);
                }) // Filter users who in the top users list
            ]
        };
    }
    async giveRandomMoney(digit) {
        Leaderboard.getAll((users) => {
            // Loop every user for update
            users.forEach((user, index) => {
                this.giveMoneyWithDeduction(user.username, utilities_1.randomInt(digit));
            });
        });
    }
    async closeTheWeek() {
        const total = await Leaderboard.getPrizePool();
        const topUsers = await this.getTopUsers();
        topUsers.forEach((user, index) => {
            let share;
            switch (index) {
                case 0:
                    share = utilities_1.getPercentage(total, 20);
                    break;
                case 1:
                    share = utilities_1.getPercentage(total, 15);
                    break;
                case 2:
                    share = utilities_1.getPercentage(total, 10);
                    break;
                default:
                    share = Math.round(utilities_1.getPercentage(total, 55) / 97);
            }
            this.giveMoney(user.username, share);
        });
        Leaderboard.setPrizePool(0);
        await this.closeTheDay();
    }
    async closeTheDay() {
        Leaderboard.getAll((usersByRank) => {
            usersByRank.forEach((user, index) => {
                this.usersRepository.updateAll({
                    dailyRank: index + 1
                }, {
                    name: user.username
                });
            });
        });
    }
    async generate() {
        this.usersRepository.deleteAll();
        Leaderboard.del();
        const users = dummyData_1.dummyUsers(1000);
        await this.usersRepository.createAll(users);
        const getUsers = await this.usersRepository.find();
        getUsers.forEach((user) => {
            Leaderboard.add(user.name, user.money);
        });
        await this.closeTheDay();
    }
    async leaderboardEmmit(nsp) {
        nsp.emit('notification', `time: ${new Date().getTime()}`);
        console.log('Some event emitted');
    }
};
tslib_1.__decorate([
    rest_1.get('/leaderboard'),
    rest_1.response(200, {
        description: 'Gets top 100 player',
        content: {
            'application/json': {
                schema: {},
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], LeaderBoardController.prototype, "getLeaderBoard", null);
tslib_1.__decorate([
    rest_1.get('/leaderboard/randomMoney/{digit}'),
    rest_1.response(200, {
        description: 'Gives random money to all users',
        content: {
            'application/json': {
                schema: {},
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('digit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], LeaderBoardController.prototype, "giveRandomMoney", null);
tslib_1.__decorate([
    rest_1.get('/leaderboard/closeTheWeek'),
    rest_1.response(200, {
        description: 'Gets top 100 player',
        content: {
            'application/json': {
                schema: {},
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], LeaderBoardController.prototype, "closeTheWeek", null);
tslib_1.__decorate([
    rest_1.get('/leaderboard/closeTheDay'),
    rest_1.response(200, {
        description: 'Gets top 100 player',
        content: {
            'application/json': {
                schema: {},
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], LeaderBoardController.prototype, "closeTheDay", null);
tslib_1.__decorate([
    rest_1.get('/leaderboard/users/generator'),
    rest_1.response(200, {
        description: 'Deletes all users and generates a new database with 10,000 dummy users',
        content: {
            'application/json': {
                schema: {},
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], LeaderBoardController.prototype, "generate", null);
tslib_1.__decorate([
    rest_1.post('/leaderboard'),
    tslib_1.__param(0, websocket_decorator_1.ws.namespace('leaderboard')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], LeaderBoardController.prototype, "leaderboardEmmit", null);
LeaderBoardController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UsersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UsersRepository])
], LeaderBoardController);
exports.LeaderBoardController = LeaderBoardController;
//# sourceMappingURL=leaderboard.controller.js.map
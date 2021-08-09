"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUsersQueryObject = exports.deductCommision = exports.getPercentage = exports.randomInt = exports.countryCode = exports.username = void 0;
const faker = require("faker");
const username = () => faker.internet.userName();
exports.username = username;
const countryCode = () => faker.address.countryCode().toLowerCase();
exports.countryCode = countryCode;
const randomInt = (digit) => Math.round(Math.random() * 10 ** digit);
exports.randomInt = randomInt;
const getPercentage = (total, percent) => Math.round((total / 100) * percent);
exports.getPercentage = getPercentage;
const deductCommision = (amount, percent) => {
    const commission = exports.getPercentage(amount, percent);
    return [
        amount - commission,
        commission,
    ];
};
exports.deductCommision = deductCommision;
const convertToUsersQueryObject = (users) => (users.reduce((query, user) => {
    query.where.name.inq.push(user.username);
    return query;
}, {
    order: ["money DESC", "name DESC"],
    where: { name: { inq: [] } }
}));
exports.convertToUsersQueryObject = convertToUsersQueryObject;
//# sourceMappingURL=utilities.js.map
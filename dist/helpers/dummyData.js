"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyUsers = void 0;
const utilities_1 = require("./utilities");
const dummyUser = () => {
    return {
        name: utilities_1.username(),
        money: utilities_1.randomInt(5),
        country: utilities_1.countryCode()
    };
};
const dummyUsers = (limit) => {
    let arr = [];
    for (let i = 1; i <= limit; i++) {
        arr.push(dummyUser());
    }
    return arr;
};
exports.dummyUsers = dummyUsers;
//# sourceMappingURL=dummyData.js.map
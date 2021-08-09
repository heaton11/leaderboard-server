"use strict";
const redis = require("redis");
const client = redis.createClient();
const { promisify } = require('util');
const getRevRank = promisify(client.zrevrank).bind(client);
const getRevRange = promisify(client.zrevrange).bind(client);
const getRandMember = promisify(client.zrandmember).bind(client);
const get = promisify(client.get).bind(client);
class Leaderboard {
    constructor(key = "leaderboard") {
        this.add = (username, money) => {
            client.zadd([this.key, money, username], function (err) {
                if (err)
                    throw err;
            });
        };
        this.remove = (username) => {
            client.zrem([this.key, username], function (err) {
                if (err)
                    throw err;
            });
        };
        this.del = () => {
            client.del(this.key);
        };
        this.increase = (username, money) => {
            client.zincrby([this.key, money, username], function (err) {
                if (err)
                    throw err;
            });
        };
        this.getRank = async (username) => {
            let rank = await getRevRank([this.key, username]);
            return rank + 1;
        };
        this.getRandomUser = async () => {
            let random = await getRandMember([this.key]);
            return random;
        };
        this.getTop = async (limit = 100) => {
            var list = await this.getRange(1, 100);
            return list;
        };
        this.getAll = async (cb) => {
            client.zrevrange([this.key, 0, -1, 'WITHSCORES'], function (err, range) {
                let list = [], l = range.length;
                for (var i = 0; i < l; i += 2) {
                    list.push({
                        'username': range[i],
                        'money': range[i + 1]
                    });
                }
                cb(list);
            });
        };
        this.getRange = async (start, end) => {
            if (start < 1)
                start = 1;
            let query = [this.key, start - 1, end - 1, 'WITHSCORES'];
            let range = await getRevRange(query);
            let list = [], l = range.length;
            for (let i = 0; i < l; i += 2) {
                list.push({
                    'username': range[i],
                    'money': range[i + 1]
                });
            }
            return list;
        };
        this.key = key;
        this.prizePoolKey = `${this.key}-prizepool`;
    }
    setPrizePool(amount) {
        client.set(this.prizePoolKey, amount);
    }
    increasePrizePool(amount) {
        client.incrby(this.prizePoolKey, amount);
    }
    async getPrizePool() {
        const total = await get(this.prizePoolKey);
        return total;
    }
}
module.exports = Leaderboard;
//# sourceMappingURL=leaderboard.js.map
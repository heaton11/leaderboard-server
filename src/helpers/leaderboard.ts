const redis = require("redis")
const client = redis.createClient()

const { promisify } = require('util');

const getRevRank = promisify(client.zrevrank).bind(client);
const getRevRange = promisify(client.zrevrange).bind(client);
const getRandMember = promisify(client.zrandmember).bind(client);
const get = promisify(client.get).bind(client);

export default class Leaderboard {
  private key: string;
  private prizePoolKey: string;

  constructor(key = "leaderboard") {
    this.key = key;
    this.prizePoolKey = `${this.key}-prizepool`
  }

  add = (username: string, money: number) => {
    client.zadd([this.key, money, username], function (err: unknown) {
      if (err) throw err;
    });
  }

  remove = (username: string) => {
    client.zrem([this.key, username], function (err: unknown) {
      if (err) throw err;
    });
  }

  del = () => {
    client.del(this.key)
  }

  increase = (username: string, money: number) => {
    client.zincrby([this.key, money, username], function (err: unknown) {
      if (err) throw err;
    });
  }

  getRank = async (username: string) => {
    let rank = await getRevRank([this.key, username]);
    return rank + 1;
  }

  getRandomUser = async () => {
    let random = await getRandMember([this.key]);
    return random;
  }

  getTop = async (limit = 100) => {
    var list = await this.getRange(1, 100)
    return list
  }

  getAll = async (cb: any) => {
    client.zrevrange([this.key, 0, -1, 'WITHSCORES'], function(err: unknown, range: any) {
      let list = [], l = range.length;

      for (var i = 0; i < l; i += 2) {
        list.push({
          'username': range[i],
          'money': range[i+1]
        });
      }
      
      cb(list)
    })
  }

  getRange = async (start: number, end: number) => {
    if(start < 1) start = 1

    let query = [this.key, start - 1, end - 1, 'WITHSCORES'];

    let range = await getRevRange(query);

    let list = [], l = range.length;

    for (let i = 0; i < l; i += 2) {
      list.push({
        'username': range[i],
        'money': range[i+1]
      });
    }

    return list
  }

  setPrizePool(amount: number) {
    client.set(this.prizePoolKey, amount)
  }

  increasePrizePool(amount: number) {
    client.incrby(this.prizePoolKey, amount)
  }

  async getPrizePool() {
    const total = await get(this.prizePoolKey)
    return total;
  }
}






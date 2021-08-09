import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';

import { Server } from 'socket.io';
import { ws } from "../websockets/decorators/websocket.decorator";

import {Users} from '../models';
import {UsersRepository} from '../repositories';


import {dummyUsers} from "../helpers/dummyData";
import lb from "../helpers/leaderboard"
import {randomInt, deductCommision, convertToUsersQueryObject, getPercentage} from "../helpers/utilities"

const Leaderboard = new lb()

export class LeaderBoardController {
  constructor(
    @repository(UsersRepository)
    public usersRepository : UsersRepository,
  ) {
  }

  giveMoney(username: string, amount: number) {
    this.usersRepository.updateAll({
      // @ts-ignore
      $inc: {money: amount}
    },
    {
      name: username
    });
  }

  async giveMoneyWithDeduction(username: string, amount: number) {
    const [realAmount, commission] = deductCommision(amount, 2);

    Leaderboard.increasePrizePool(commission);

    Leaderboard.increase(username, realAmount);
    
    this.giveMoney(username, realAmount);
  }

  async getUsersWithRank(query: Object, start: number = 1) {
    let users = await this.usersRepository.find(query as Filter<Users>);

    return users.map((user: any, index: number) => ({
      ...user,
      rank: start + index,
      dailyDiff:  user.dailyRank - (start + index)
    }));
  }

  async getTopUsers(limit: number = 100) {
    let top = await Leaderboard.getTop(limit);

    let query = convertToUsersQueryObject(top);

    return this.getUsersWithRank(query)
  }

  // Get random user from redis with user's range 
  async getRandomUser() {    
    let getRandomUser = await Leaderboard.getRandomUser();

    let users = await this.getUserRange(getRandomUser);

    return {
      user: getRandomUser,
      range: users
    }
  }

  // Get range between (user's rank - 3) and (user's rank + 2)
  async getUserRange(username: string) {
    let userRank: number = await Leaderboard.getRank(username);

    let [start, end]= [userRank - 3, userRank + 2]
    let userRange = await Leaderboard.getRange(start, end);

    let query = convertToUsersQueryObject(userRange);

    return this.getUsersWithRank(query, userRank - 3);
  }

  @get('/leaderboard')
  @response(200, {
    description: 'Gets top 100 player',
    content: {
      'application/json': {
        schema: {
        },
      },
    },
  })
  async getLeaderBoard(
  ) {
    const limit = 100;

    const topUsers = await this.getTopUsers(limit);
    const randomUserWithRange = await this.getRandomUser();

    return {
      currentUser: randomUserWithRange.user,
      users: [
        ...topUsers,
        ...randomUserWithRange.range.filter((user: any) => {
          return (user.rank > limit);
        }) // Filter users who in the top users list
      ]
    }
  }

  @get('/leaderboard/randomMoney/{digit}')
  @response(200, {
    description: 'Gives random money to all users',
    content: {
      'application/json': {
        schema: {
        },
      },
    },
  })
  async giveRandomMoney(
    @param.path.number('digit') digit: number,
  ) {
    Leaderboard.getAll((users: any) => {
      // Loop every user for update
      users.forEach((user: any, index: number) => {
        this.giveMoneyWithDeduction(user.username, randomInt(digit))
      });
    });
  }

  @get('/leaderboard/closeTheWeek')
  @response(200, {
    description: 'Gets top 100 player',
    content: {
      'application/json': {
        schema: {
        },
      },
    },
  })
  async closeTheWeek() {
    const total = await Leaderboard.getPrizePool();
    const topUsers = await this.getTopUsers();

    topUsers.forEach((user: any, index: number) => {
      let share: number;
      switch(index) {
        case 0:
          share = getPercentage(total, 20);
          break;
        case 1:
          share = getPercentage(total, 15);
          break;
        case 2:
          share = getPercentage(total, 10);
          break;
        default:
          share = Math.round(getPercentage(total, 55) / 97);
      }

      this.giveMoney(user.username, share);
    });

    Leaderboard.setPrizePool(0);
    await this.closeTheDay();
  }

  @get('/leaderboard/closeTheDay')
  @response(200, {
    description: 'Gets top 100 player',
    content: {
      'application/json': {
        schema: {
        },
      },
    },
  })
  async closeTheDay() {
    Leaderboard.getAll((usersByRank: any) => {
      usersByRank.forEach((user: any, index: number) => {
        this.usersRepository.updateAll({
          dailyRank: index + 1 
        }, 
        {
          name: user.username
        });
      });
    });
  }

  @get('/leaderboard/users/generator')
  @response(200, {
    description: 'Deletes all users and generates a new database with 10,000 dummy users',
    content: {
      'application/json': {
        schema: {
        },
      },
    },
  })
  async generate(
  ) {
    this.usersRepository.deleteAll();
    Leaderboard.del();

    const users = dummyUsers(1000);
    await this.usersRepository.createAll(users);  

    const getUsers = await this.usersRepository.find();  

    getUsers.forEach((user) => {
      Leaderboard.add(user.name, user.money)
    });

    await this.closeTheDay()
  }

  // Endpoint that subscribes socket.io
  @post('/leaderboard')
  async leaderboardEmmit(
    @ws.namespace('leaderboard') nsp: Server
  ): Promise<any> {
    nsp.emit('notification', `time: ${new Date().getTime()}`);
    console.log('Some event emitted');
  }

}

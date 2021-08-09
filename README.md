# Leaderboard Server 

## Targets

- Store the player's ID, name, country, money on Mongodb 
- Create a leaderboard by players' money with Redis sorted sets
- Have a prize pool on Redis that deduct 2% of every earned money by players
- Store player's daily rank after every day on Mongodb for calculating daily difference in rank
- Have a system that can run based on real time solution and horizontally scalable
- Have a generation endpoint that will create dummy users at certain amount (**I created 1000 players for testing purpose**)
- Have an endpoint that fetches first 100 players followed by a random player with 3 players above and 2 players below that player(**Endpoint: /leaderboard** )
- Have an endpoint that will give all players a random amount of money (**Endpoint: /leaderboard/random/{digit}**)
- Have an endpoint that saves all players rank on daily rank field on mongodb (**Endpoint: /leaderboard/closeTheDay**)
- Have an endpoint that share the prize pool among top 100 players according to their ranks (**Endpoint: /leaderboard/closeTheWeek**)

### Tech Stack & Features
- TypeScript
- Loopback 4
- OpenApi (Swagger) (**Endpoint: /explorer/**)
- Socket.io (Added as a available feature)
- Test
- Mongodb
- Redis
- Eslint

## Run & Test

Node Version -> 14

#### Run
```bash
$ npm install
```
```bash
$ npm run build
$ npm run start
```
#### Test
```bash
$ npm test
```
## Notes

- For client side of this app ( [Laderboard Client](https://github.com/heaton11/leaderboard-client.git) )
- For detailed endpoint descriptions please visit, (**Endpoint: /explorer**)
- The configuration is managed by the **.env** file.

const faker = require("faker")

export const username = () => faker.internet.userName();

export const countryCode = () => faker.address.countryCode().toLowerCase();

export const randomInt = (digit: number) => Math.round(Math.random() * 10**digit);

export const getPercentage = (total:number, percent: number) => Math.round((total/100) * percent);

export const deductCommision = (amount: number, percent: number) => {
    const commission = getPercentage(amount, percent);
    return [
        amount - commission,
        commission,
    ];
}

export const convertToUsersQueryObject = (users: any[]) => (users.reduce((query, user) => {
    query.where.name.inq.push(user.username)
    return query
  }, {
    order: ["money DESC", "name DESC"] as any,
    where: {name: {inq:[] as any}}
}));

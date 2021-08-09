import {username, randomInt, countryCode} from "./utilities"


const dummyUser = () : { name: string; money: number; country: string }  => {
    return {
        name: username(),
        money: randomInt(5),
        country: countryCode()
    }
}

export const dummyUsers = (limit: Number):Array<{ name: string; money: number; country: string }> => {
    let arr = []

    for(let i=1; i<=limit; i++) {
        arr.push(dummyUser())
    }

    return arr
}
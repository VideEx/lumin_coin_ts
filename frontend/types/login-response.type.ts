import {UserDataType} from "./user-data.type";


export type LoginResponseType = {
    tokens: {
        accessToken: string,
        refreshToken: string,
    },
    user: UserDataType
}
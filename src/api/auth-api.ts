import axios, {AxiosResponse} from 'axios'
import {ResponseType} from "./todolists-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'cbd9acf4-8319-464c-ad86-78da9599b7b0'
    }
})

export const authApi = {
    me() {
        return instance.get<ResponseType<MeResponseType>>(`auth/me`)
    },
    login(data: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>(`auth/login`, data);
    },
    logout() {
        return instance.delete<ResponseType<{}>>(`auth/login`)
    }

}


//types

export type MeResponseType = {
    id: number
    email: string
    login: string
}
export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}
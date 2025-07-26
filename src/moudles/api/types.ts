 export interface RegisterModel{
        email?:string,
        password?:string,
        checkCode?:string,
        nickName?:string
}

export type LoginModel = {
    identifier?:string,
    passowrd?:string,
    checkCode?:string
}
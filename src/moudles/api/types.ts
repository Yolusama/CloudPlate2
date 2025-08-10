import { TableProps, type GetProp,type MenuProps } from "antd"

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

export type FileInfo = {
    id?:Number,
    name?:string,
    cover?:string,
    pid?:Number,
    upalodTime?:Date,
    type?:Number,
    userId?:string,
    recycleTime?:Date,
    recoverTime?:Date
}

export type MenuItem = GetProp<MenuProps, "items">[number];

export type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
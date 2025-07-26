import { MessageInstance } from "antd/es/message/interface";
import {  Result } from "../Request";
import { NotificationInstance } from "antd/es/notification/interface";
import { GetTemplate, PostTemplate } from "./template";
import { type RegisterModel,type LoginModel } from "./types";



export class UserApi{
    static login(model:LoginModel,remberPassword?:boolean,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null){
         PostTemplate("/Api/User/Login",{
            identifier: model.identifier,
            password: model.passowrd,
            remberPassword: remberPassword
        },{},successCallback,feedback);
    }

    static register(model:RegisterModel,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null){
        PostTemplate("/Api/User/Register",model,{},successCallback,feedback);
    }

    static checkCodeLogin(model:LoginModel,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null){
            PostTemplate("/Api/User/CheckCodeLogin",model,{},successCallback,feedback);
        }  
}

export class CommonApi{
    static getCheckCode(email:string,count:Number,successCallback:((result:Result)=>void)|null = null,feedback:MessageInstance|NotificationInstance|null = null){
        GetTemplate(`/Api/Common/GetCheckCode/${count}?email=${email}`,{},successCallback,feedback);
    }

    static getRandomStr(successCallback:((result:Result)=>void)|null = null,feedback:MessageInstance|NotificationInstance|null = null){
        GetTemplate("/Api/Common/GetRandomStr",{},successCallback,feedback);
    }
}
import { MessageInstance } from "antd/es/message/interface";
import {  Result } from "../Request";
import { NotificationInstance } from "antd/es/notification/interface";
import { GetTemplate, PostTemplate } from "./template";

export class UserApi{
    static login(identifier:string,password:string,remberPassword:boolean,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null){
         PostTemplate("/Api/User/Login",{
            identifier: identifier,
            password: password,
            remberPassword: remberPassword
        },{},successCallback,feedback);
    }
}

export class CommonApi{
    static getCheckCode(email:string,count:Number,successCallback:((result:Result)=>void)|null = null,feedback:MessageInstance|NotificationInstance|null = null){
        GetTemplate(`/Api/Common/GetCheckCode/${count}?email=${email}`,{},successCallback,feedback);
    }
}
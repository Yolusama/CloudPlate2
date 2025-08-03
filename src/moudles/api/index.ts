import { MessageInstance } from "antd/es/message/interface";
import {  Authorization, Result } from "../Request";
import { NotificationInstance } from "antd/es/notification/interface";
import { GetTemplate, PostTemplate } from "./template";
import { type RegisterModel,type LoginModel } from "./types";
import { FileType } from "../Common";
import axios from "axios";



export class UserApi{
    static login(model:LoginModel,rememberPassword?:boolean,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null,failCallback:(()=>void)|null = null){
         PostTemplate("/Api/User/Login",{
            identifier: model.identifier,
            password: model.passowrd,
            rememberPassword: rememberPassword
        },{},successCallback,feedback,failCallback);
    }

    static register(model:RegisterModel,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null,failCallback:(()=>void)|null = null){
        PostTemplate("/Api/User/Register",model,{},successCallback,feedback,failCallback);
    }

    static checkCodeLogin(model:LoginModel,successCallback:((result:Result)=>void)|null = null,
        feedback:MessageInstance|NotificationInstance|null = null,failCallback:(()=>void)|null = null){
            PostTemplate("/Api/User/CheckCodeLogin",model,{},successCallback,feedback,failCallback);
        }  
}

export class CommonApi{
    static getCheckCode(email:string,count:Number,successCallback:((result:Result)=>void)|null = null,feedback:MessageInstance|NotificationInstance|null = null){
        GetTemplate(`/Api/Common/GetCheckCode/${count}?email=${email}`,{},successCallback,feedback);
    }

    static getRandomStr(successCallback:((result:Result)=>void)|null = null,feedback:MessageInstance|NotificationInstance|null = null){
        GetTemplate("/Api/Common/GetRandomStr",{},successCallback,feedback);
    }

    static getFileTypes(userId:string,successCallback:((result:Result)=>void)|null = null){
        GetTemplate(`/Api/Common/GetFileTypes/${userId}`,Authorization(),successCallback);
    }
}

export class FileInfoApi{
    static getUserFiles(userId:string,pid?:Number,type?:string,search?:string,successCallback:((result:Result)=>void)|null = null,feedback:MessageInstance|NotificationInstance|null = null){
       GetTemplate(`/Api/File/GetUserFiles/${userId}/${pid}?type=${type}&search=${search}`,
            Authorization(),successCallback,feedback
        );
    }
}
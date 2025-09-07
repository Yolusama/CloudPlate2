import { MessageInstance } from "antd/es/message/interface";
import { Authorization, Result } from "../Request";
import { NotificationInstance } from "antd/es/notification/interface";
import { GetTemplate, PostTemplate, PutTemplate } from "./template";
import { type RegisterModel, type LoginModel } from "./types";
import { FileType } from "../Common";
import axios from "axios";



export class UserApi {
    static login(model: LoginModel, rememberPassword?: boolean, successCallback: ((result: Result) => void) | null = null,
        feedback: MessageInstance | NotificationInstance | null = null, failCallback: (() => void) | null = null) {
        PostTemplate("/Api/User/Login", {
            identifier: model.identifier,
            password: model.passowrd,
            rememberPassword: rememberPassword
        }, {}, successCallback, feedback, failCallback);
    }

    static register(model: RegisterModel, successCallback: ((result: Result) => void) | null = null,
        feedback: MessageInstance | NotificationInstance | null = null, failCallback: (() => void) | null = null) {
        PostTemplate("/Api/User/Register", model, {}, successCallback, feedback, failCallback);
    }

    static checkCodeLogin(model: LoginModel, successCallback: ((result: Result) => void) | null = null,
        feedback: MessageInstance | NotificationInstance | null = null, failCallback: (() => void) | null = null) {
        PostTemplate("/Api/User/CheckCodeLogin", model, {}, successCallback, feedback, failCallback);
    }
}

export class CommonApi {
    static getCheckCode(email: string, count: Number, successCallback: ((result: Result) => void) | null = null, feedback: MessageInstance | NotificationInstance | null = null) {
        GetTemplate(`/Api/Common/GetCheckCode/${count}?email=${email}`, {}, successCallback, feedback);
    }

    static getRandomStr(successCallback: ((result: Result) => void) | null = null, feedback: MessageInstance | NotificationInstance | null = null) {
        GetTemplate("/Api/Common/GetRandomStr", {}, successCallback, feedback);
    }

    static getFileTypes(userId: string, successCallback: ((result: Result) => void) | null = null) {
        GetTemplate(`/Api/Common/GetFileTypes/${userId}`, Authorization(), successCallback);
    }
}

export class FileInfoApi {
    static getUserFiles(userId: string, pid?: Number, type?: string, search?: string
        , successCallback: ((result: Result) => void) | null = null, feedback: MessageInstance | NotificationInstance | null = null) {
        GetTemplate(`/Api/File/GetUserFiles/${userId}/${pid}?type=${type}&search=${search}`,
            Authorization(), successCallback, feedback
        );
    }

    static UploadSmallFile(userAccount: string, file: File, suffix: string, successCallback: ((result: Result) => void) | null = null,
        feedback: MessageInstance | NotificationInstance | null = null) {
        const data = new FormData();
        data.append("userAccount", userAccount);
        data.append("file", file);
        data.append("suffix", suffix);
        PostTemplate("/Api/File/UploadSmallFile", data, Authorization(true), successCallback,
            feedback);
    }

    static UploadFile(userAccount: string, file: File, suffix: string, current: number, total: number,
        tempFileName: string, taskId: number, pid: number, isFolder: string,
        successCallback: ((result: Result) => void) | null = null,
        failCallback:()=>void,
        feedback: MessageInstance | NotificationInstance | null = null) {
        const data = new FormData();
        data.append("userAccount", userAccount);
        data.append("file", file);
        data.append("suffix", suffix);
        data.append("current", current.toString());
        data.append("total", total.toString());
        data.append("tempFileName", tempFileName);
        data.append("taskId", taskId.toString());
        data.append("pid", pid.toString());
        data.append("isFolder", isFolder);

        PutTemplate("/Api/File/UploadFile", data, Authorization(true), successCallback,
            feedback,failCallback);
    }

}
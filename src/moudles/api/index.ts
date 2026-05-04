import { DeleteTemplate, GetTemplate, PostTemplate, PutTemplate } from "./template";
import { type RegisterModel, type LoginModel } from "./types";


export class UserApi {
    static login(model: LoginModel, rememberPassword?: boolean) {
        return PostTemplate("/Api/User/Login", {
            identifier: model.identifier,
            password: model.passowrd,
            rememberPassword: rememberPassword
        });
    }

    static register(model: RegisterModel) {
        return PostTemplate("/Api/User/Register", model);
    }

    static checkCodeLogin(model: LoginModel) {
        return PostTemplate("/Api/User/CheckCodeLogin", model);
    }

    static logout(userId: string) {
        return DeleteTemplate(`/Api/User/Logout/${userId}`, {});
    }

    static getUserSpace(account: string) {
        return GetTemplate(`/Api/User/GetUserSpace`, { account: account });
    }
}

export class CommonApi {
    static getCheckCode(email: string, count: Number) {
        return GetTemplate(`/Api/Common/GetCheckCode/${count}?email=${email}`, {});
    }

    static getRandomStr() {
        return GetTemplate("/Api/Common/GetRandomStr", {});
    }

    static getFileTypes(userId: string) {
        return GetTemplate(`/Api/Common/GetFileTypes/${userId}`, {});
    }
}

export class FileInfoApi {
    static getUserFiles(userId: string, pid?: Number, type?: string, search?: string) {
        const data = { search: search, type: type };
        return GetTemplate(`/Api/File/GetUserFiles/${userId}/${pid}`, data);
    }

    static uploadSmallFile(userAccount: string, file: File, pid: Number, suffix: string) {
        const data = new FormData();
        data.append("userAccount", userAccount);
        data.append("file", file);
        data.append("pid", pid.toString());
        data.append("suffix", suffix);
        return PostTemplate("/Api/File/UploadSmallFile", data);
    }

    static uploadFile(userAccount: string, file: File, suffix: string, current: number, total: number,
        tempFileName: string, taskId: number, pid: number, isFolder: string) {
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

        return PutTemplate("/Api/File/UploadFile", data);
    }

    static createFolder(userAccount: string, pid: number) {
        return PutTemplate(`/Api/File/CreateFolder/${pid}`, {
            account: userAccount,
        });
    }

}
import { Result, Authorization } from "../Request";
import axios, { AxiosRequestConfig } from "axios";

/*export function ApiTemplate(url: string, headers: Record<string, any>, type: string, data: any,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null,failCallback:(()=>void)|null = null) {
        Request(url, type, data, headers, response => {
        const res = response.data;
        if (!res.ok) {
            if(failCallback != null) 
                failCallback();
            if(feedback == null){
                console.error(`API request failed: ${res.message}`);
            }
            else 
                feedback.error(res.message);
            return;
        }
        if (successCallback != null)
            successCallback({ message: res.message, data: res.data });
        return;
    });
}

export function GetTemplate(url: string, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    ApiTemplate(url, headers, "get", null, successCallback, feedback, failCallback);
}

export function PostTemplate(url: string, data: any, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    ApiTemplate(url, headers, "post", data, successCallback, feedback, failCallback);
}

export function PutTemplate(url: string, data: any, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    ApiTemplate(url, headers, "put", data, successCallback, feedback, failCallback);
}

export function DeleteTemplate(url: string, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    ApiTemplate(url, headers, "delete", null, successCallback, feedback, failCallback);
}

export function PatchTemplate(url: string, data: any, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    ApiTemplate(url, headers, "patch", data, successCallback, feedback, failCallback);
}

export async function AsyncApiTemplate(url: string, headers: Record<string, any>, type: string, data: any,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    const response = await RequestAsync(url, type, data, headers);
    const res = response.data;
    if(!res.ok){
        if(failCallback != null) 
            failCallback();
        if(feedback == null){
            console.error(`API request failed: ${res.message}`);
            return;
        }
        feedback.error(res.message);
        return;
    }
    if (successCallback != null)
        successCallback({ message: res.message, data: res.data });
}

export async function GetAsyncTemplate(url: string, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    await AsyncApiTemplate(url, headers, "get", null, successCallback, feedback, failCallback);
}

export async function PostAsyncTemplate(url: string, data: any, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    await AsyncApiTemplate(url, headers, "post", data, successCallback, feedback, failCallback);
}

export async function PutAsyncTemplate(url: string, data: any, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    await AsyncApiTemplate(url, headers, "put", data, successCallback, feedback, failCallback);
}

export async function DeleteAsyncTemplate(url: string, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    await AsyncApiTemplate(url, headers, "delete", null, successCallback, feedback, failCallback);
}

export async function PatchAsyncTemplate(url: string, data: any, headers: Record<string, any>,
    successCallback: ((result: Result) => void) | null = null, feedback:MessageInstance|NotificationInstance | null = null, failCallback:(()=>void)|null = null) {
    await AsyncApiTemplate(url, headers, "patch", data, successCallback, feedback, failCallback);
}*/

function ApiTemplate(url: string, type: string, data: any) {
    const isFormData = data instanceof FormData;
    const authorization = Authorization(isFormData);
    const headers = {
        ...authorization
    };
    const config: AxiosRequestConfig = {
        url: url,
        method: type,
        headers: headers
    };
    if (type.toLowerCase() === "get" || type.toLowerCase() === "delete") {
        config.params = data;
    }
    else if (data !== undefined) {
        config.data = data;
    }
    return axios.request(config);
}

function RequestTemplate(url: string, data: any, type: string) {
    return new Promise<Result>((resolve, reject) => {
        ApiTemplate(url, type, data).then(response => {
            const res = response.data as Result;
            resolve(res);
        }).catch(error => {
            reject(error);
        });
    });
}

export function GetTemplate(url: string, data: any) {
   return RequestTemplate(url, data, "get");
}

export function PostTemplate(url: string, data: any) {
    return RequestTemplate(url, data, "post");
}
export  function PutTemplate(url: string, data: any) {
    return RequestTemplate(url, data, "put");
}
export  function DeleteTemplate(url: string, data: any) {
    return RequestTemplate(url, data, "delete");
}
export function PatchTemplate(url: string, data: any) {
    return RequestTemplate(url, data, "patch");
}

export async function AsyncGetTemplate(url: string, data: any) {
    return await RequestTemplate(url, data, "get");
}
export async function AsyncPostTemplate(url: string, data: any) {
    return await RequestTemplate(url, data, "post");
}
export async function AsyncPutTemplate(url: string, data: any) {
    return await RequestTemplate(url, data, "put");
}
export async function AsyncDeleteTemplate(url: string, data: any) {
    return await RequestTemplate(url, data, "delete");
}
export async function AsyncPatchTemplate(url: string, data: any) {
    return await RequestTemplate(url, data, "patch");
}
import axios, { AxiosError,type AxiosRequestConfig,type AxiosResponse } from "axios";

const baseUrl = "http://localhost:5725";

export const webSocketUrl = "ws://localhost:5726/ws";

axios.defaults.baseURL = baseUrl;

export function createCancelToken(){
  return axios.CancelToken.source();
}

export function imgSrc(imgName:string){
   return `${baseUrl}/img/${imgName}`;
}

export function fileSrc(fileName:string){
  return `${baseUrl}/file/${fileName}`;
}

export async function RequestAsync(url:string,type:string,data:any,headers:Record<string,any>){
  const option:Record<string,any> = {};
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  return (await axios.request(option)).data;
}

const defaultFailCallback = (error:AxiosError)=>{
  console.log(error);
}

export interface Result{
    message?:string,
    ok?:boolean,
    data?:any
}

export function Request(url:string,type:string,data:any,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  const option:Record<string,any> = {};
  if(data!=null)
    option.data = data;
  option.url = url;
  option.headers = headers;
  option.method = type;
  axios.request(option).then(successCallback).catch(failCallback);
}

export function Get(url:string,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  Request(url,"get",null,headers,successCallback,failCallback);
}

export function Post(url:string,data:any,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  Request(url,"post",data,headers,successCallback,failCallback);
}

export function Put(url:string,data:any,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  Request(url,"put",data,headers,successCallback,failCallback);
}

export function Delete(url:string,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  Request(url,"delete",null,headers,successCallback,failCallback);
}

export function Patch(url:string,data:any,headers:Record<string,any>,successCallback:(response:AxiosResponse)=>void
    ,failCallback=defaultFailCallback){
  Request(url,"patch",data,headers,successCallback,failCallback);
}

export async function GetAsync(url:string, config:AxiosRequestConfig) {
  return (await axios.get(url, config)).data;
}

export async function PostAsync(url:string,data:any,config:AxiosRequestConfig){
    return (await axios.post(url,data,config)).data;
}

export async function PutAsync(url:string,data:any,config:AxiosRequestConfig){
  return  (await axios.put(url,data,config)).data;
}

export async function DeleteAsync(url:string,config:AxiosRequestConfig)
{
  return (await axios.delete(url, config)).data;
}

export async function PatchAsync(url:string,data:any,config:AxiosRequestConfig){
  return  (await axios.patch(url,data,config)).data;
}


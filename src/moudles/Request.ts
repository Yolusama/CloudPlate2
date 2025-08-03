import axios, { AxiosError,type AxiosRequestConfig,type AxiosResponse } from "axios";
import stateStroge from "./StateStorage";
import {Route} from "../moudles/Route";

const baseUrl = "http://localhost:5435";

axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 60*1000;

export function createCancelToken(){
  return axios.CancelToken.source();
}

export function userAvatar(imgName:string){
   return `${baseUrl}/img/avatar/${imgName}`;
}

export function fileCover(fileName:string){
  return `${baseUrl}/img/cover/${fileName}`;
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
  const code = error.status == undefined ? "0" : error.status;
  /*switch(code){
    case 401:
      Route.dive("/401");
      break;
    case 404:
      Route.dive("/404");
      break;
    case 500:
      Route.dive("/500");
      break;  
  }*/

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

export function Authorization(isFormData:boolean = false) {
  const token = stateStroge.get("user").token;
  if(isFormData) {
    return {
      "Content-Type" : "multipart/form-data",
      Authorization : `Bearer ${token}`
    };
  }
  return {
    Authorization : `Bearer ${token}`,
    "Content-Type" : "application/json"
  };
}

function toDownload(blob:Blob,fileName:string){
    const data = new Blob([blob]);
    const downloadUrl = URL.createObjectURL(data);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

export function DownloadFile(url:string,fileName:string){
   axios.get(url,{
    responseType:"blob",
    headers: Authorization()
   })
   .then(response=>{
    const res = response.data;
    toDownload(res.data,fileName);
   }).catch(defaultFailCallback);
}

export async function DownloadFileAsync(url:string,fileName:string) {
  try{
    const res = await axios.get(url,{
    responseType:"blob",
    headers: Authorization()
   });
   toDownload(res.data,fileName);
  }
  catch(e){
     defaultFailCallback(e as AxiosError);
  }
}


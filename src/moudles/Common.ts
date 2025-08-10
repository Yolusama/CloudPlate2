import { JSX } from "react";
import { FileUnknownOutlined } from "@ant-design/icons";


export function copy(src: any, to: any) {
    for (const pro in src)
        to[pro] = src[pro];
}

export function delayToRun(func: () => void, expire: number) {
    const timer = setTimeout(() => {
        func();
        clearInterval(timer);
    }, expire);
}

export function onlyDate(date = new Date()) {
    const res = new Date(date);
    res.setHours(0);
    res.setMinutes(0);
    res.setSeconds(0);
    res.setMilliseconds(0);
    return res;
}

export function getTimeStr(date: Date) {
    const year = date.getFullYear();
    function withZeroStr(num: number): string {
        return num >= 10 ? num.toString() : "0" + num;
    }
    return `${year}-${withZeroStr(date.getMonth() + 1)}-${withZeroStr(date.getDate())}` +
        ` ${withZeroStr(date.getHours())}:${withZeroStr(date.getMinutes())}`;
}

export function swapArrayItem(array: any[], index1: number, index2: number) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

export class PageOption {
    public current: number;
    public size: number;
    public total: number;
    public data: Array<any> | Record<string, any>;
    constructor(current: number, size: number, data: Array<any> | Record<string, any>) {
        this.current = current;
        this.size = size;
        this.total = 0;
        this.data = data;
    }
    count() {
        return Math.ceil(this.total / this.size);
    }
}

export function timeWithoutSeconds(date: Date) {
    function withZeroStr(num: number): string {
        return num >= 10 ? num.toString() : "0" + num;
    }

    return `${withZeroStr(date.getHours())}:${withZeroStr(date.getMinutes())}`;
}

export function getFileSuffix(fileName:string){
    const index = fileName.lastIndexOf('.');
    if(index<0)
        return "";
    else
       return fileName.substring(index+1);
}

export const KB = 1024;
export const MB = KB*KB;
export const GB = MB*MB;

export function getFileSize(fileSize:number){
    if(fileSize<KB)
        return `${fileSize}B`;
    else if(fileSize>=KB&&fileSize<MB)
        return `${(fileSize/KB).toFixed(1)}KB`;
    else if(fileSize>=MB&&fileSize<=GB)
        return `${(fileSize/MB).toFixed(1)}MB`;
    else
       return `${(fileSize/GB).toFixed(1)}GB`;
}

export const ADayMills = 1000*60*60*24;

export function reactFor(data:any[]|undefined,elementFunc:(item:any)=>JSX.Element){
   return data?.map(e=>elementFunc(e));
}

export function reactKeyValuesFor(data:Record<string,any>|undefined,elementFunc:(item:any)=>JSX.Element)
{
    if(data == undefined)return;
    const res:JSX.Element[] = [];
    for(let pro in data)
        res.push(elementFunc(data[pro]));
    return res;    
}

export enum FileType{
    File = 1, Text = 2,Document,Image,Audio,Video,Folder,Zip
}

export function getFileType(type:FileType):string{
    switch(type){
        case FileType.Text: return "文本文件";
        case FileType.Document: return "文档";
        case FileType.Image: return "图片";
        case FileType.Audio: return "音频";
        case FileType.Video: return "视频";
        case FileType.Zip: return "压缩文件";
        case FileType.Folder: return "文件夹";
        default: return "文件";
    }
}
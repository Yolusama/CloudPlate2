

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
interface ElectronApi{
     send: (channel:string, data:any) => void;
     receive: (channel:string, callback:(event:any,...args:any[]) => void) => void;
     invoke: (channel:string, data:any) => void
}

declare global {
  interface Window {
    electron?:ElectronApi
  }   
}
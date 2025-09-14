import { CloudUploadOutlined, FolderAddFilled, UploadOutlined } from "@ant-design/icons";
import { getChunkSize, getFileSuffix, MB } from "../moudles/Common";
import "../css/Upload.css"
import { Button } from "antd";
import { FileInfoApi } from "../moudles/api";
import useMessage from "antd/es/message/useMessage";

interface UploadEvent{
   current:number,
   newFileName:string,
   finished:boolean
}

interface UploadUtilProps {
   userAccount?: string;
   rootId?:number;
   onUpload?: (event:UploadEvent) => void;
}

export function UploadFile(pros: UploadUtilProps) {
   const account = pros.userAccount;
   const rootId = pros.rootId;
   const [messageApi, contextHolder] = useMessage();

   function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
      const files = event.target.files;
      if (!files || !account) return;
      for (let i = 0; i < files.length; i++) {
         const file = files[i];
         if (file.size <= 10 * MB) {
            FileInfoApi.UploadSmallFile(account,file,rootId??-1,getFileSuffix(file.name), res => {
               if (res.ok)
                 {
                  messageApi.success(res.message);
                  if(pros.onUpload)
                     pros.onUpload({
                     current:1,newFileName:res.data.fileName,finished:true
                     });
                 }
            }, messageApi);
         }
         else {
            const chunkSize = getChunkSize(file.size);
            const total = Math.ceil(file.size / chunkSize);
            let tempFileName = "";
            let taskId = 0;
            let canGoOn = true;
            let j = 0;
            const timer = setInterval(() => {
               const part = new File([file.slice(j * chunkSize, (j + 1) * chunkSize)], file.name)
               FileInfoApi.UploadFile(account, part, getFileSuffix(file.name), j, total, tempFileName, taskId, rootId??-1, "false", res => {
                  tempFileName = res.data.fileName;
                  taskId = res.data.taskId;
                  if(pros.onUpload)
                     pros.onUpload({
                     current:j,newFileName:res.data.fileName,finished: j == total
                     });
               }, () => canGoOn = false, messageApi);
               if (!canGoOn) {
                  clearInterval(timer);
                  return;
               }
               else{
                  if(j==total){
                     clearInterval(timer);
                     return;
                  }
                  j++;
               }
            }, 1000)
         }
      }
   }

   function uploadFolder(){

   }

   function createNewUserFolder() {

   }

   return <>
      {contextHolder}
      <div id="upload" className="no-drag">
         <Button type="primary">
            <label htmlFor="file">
               <UploadOutlined /> 上传文件
               <input type="file" multiple onChange={uploadFile} accept="*/*"
                  style={{ display: "none" }}
                  id="file" />
            </label >
         </Button>
         <Button variant="solid" color="yellow" style={{ margin: "0 1%" }}>
            <label htmlFor="folder"><CloudUploadOutlined /> 上传文件夹
               <input
                  type="file"
                  id="folder"
                  multiple
                  onChange={uploadFolder}
                  style={{ display: "none" }}
                  ref={input => {
                     if (input) {
                        input.setAttribute('webkitdirectory', '');
                     }
                  }}
               />
            </label>
         </Button>
         <Button type="text" onClick={createNewUserFolder}>
            <FolderAddFilled color="#ffd86a" />
            新建文件夹
         </Button>
      </div>
   </>
}
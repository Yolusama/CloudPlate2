import { CloudUploadOutlined, FolderAddFilled, UploadOutlined } from "@ant-design/icons";
import { getChunkSize, getFileSuffix, MB, UploadFileType } from "../moudles/Common";
import "../css/Upload.css"
import { Button } from "antd";
import { FileInfoApi } from "../moudles/api";
import useMessage from "antd/es/message/useMessage";
import stateStroge from "../moudles/StateStorage";

interface UploadUtilProps {
   userAccount?: string;
   onUpload?:(count:number)=>void;
}

export function UploadFile(pros: UploadUtilProps) {
   const account = pros.userAccount;
   const [messageApi, contextHolder] = useMessage();

   function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
      const files = event.target.files;
      if (!files || !account) return;
      const currentFolderId = stateStroge.get("current-folder");
      for (let i = 0; i < files.length; i++) {
         const file = files[i];
         if (file.size <= 10 * MB) {
            FileInfoApi.UploadSmallFile(account, file, getFileSuffix(file.name), res => {
               if (res.ok)
                  messageApi.success(res.message);
            }, messageApi);
         }
         else {
            const chunkSize = getChunkSize(file.size);
            const total = Math.ceil(file.size/chunkSize);
            let tempFileName = "";
            let taskId = 0;
            let canGoOn = true;
            for(let j = 0; j < total; j++)
            {
               const part = new File([file.slice(j*chunkSize,(j+1)*chunkSize)],file.name)
               FileInfoApi.UploadFile(account,part, getFileSuffix(file.name),j,total,tempFileName,taskId,currentFolderId,"false",res=>{
                     tempFileName = res.data.fileName;
                     taskId = res.data.taskId;
               },()=>canGoOn = false,messageApi);
               if(!canGoOn){
                  continue;
               }
            }
         }
      }
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
                  onChange={uploadFile}
                  style={{ display: "none" }}
                  ref={input => {
                     if (input) {
                        input.setAttribute('webkitdirectory', '');
                     }
                  }}
               />
            </label>
         </Button>
         <Button type="text">
            <FolderAddFilled color="#ffd86a" />
            新建文件夹
         </Button>
      </div>
   </>
}
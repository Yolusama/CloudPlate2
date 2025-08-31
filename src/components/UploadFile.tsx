import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadFileType } from "../moudles/Common";
import "../css/Upload.css"

interface UploadUtilProps{
   userAccount?:string;
   multiable?:boolean|false;
}

export function UploadFile(pros:UploadUtilProps){
    const account = pros.userAccount;

    function uploadFile(event:React.ChangeEvent<HTMLInputElement>){

    }

    function createNewUserFolder(){

    }

    return <>
       <div id="upload" className="no-drag">
          <label htmlFor="file">
            <UploadOutlined /> 上传文件
            <input type="file" multiple={pros.multiable} onChange={uploadFile}  accept="*/*"
            style={{display:"none"}} 
            id="file" />
         </label > 
          <label htmlFor="folder"><CloudUploadOutlined/> 上传文件夹 
             <input
                type="file"
                id = "folder"
                multiple={pros.multiable}
                onChange={uploadFile}
                style={{display:"none"}}
                ref={input => {
                  if (input) {
                    input.setAttribute('webkitdirectory', '');
                  }
                }}
             />
          </label> 
          <div className="label">
            新建文件夹
         </div>
       </div>
    </>
}
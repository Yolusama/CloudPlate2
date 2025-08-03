import { useEffect, useState } from "react"
import { FileInfo, MenuItem } from "../../../moudles/api/types"
import { FileType, getFileSize } from "../../../moudles/Common"
import { CustomerServiceOutlined, FileImageOutlined, FileOutlined, FileTextOutlined, FileUnknownOutlined, FileWordFilled, FolderOutlined, PlayCircleOutlined, RestOutlined } from "@ant-design/icons"
import { Menu, Progress, ProgressProps } from "antd"
import { CommonApi, FileInfoApi } from "../../../moudles/api"
import stateStroge from "../../../moudles/StateStorage"

interface FileTypeNameIcon {
  name: string,
  icon: string,
  type: FileType
}

type UserFilesProps = {
  headers?: FileTypeNameIcon[],
  files?: FileInfo[],
  pid?: Number,
  type?: string,
  search?: string
}

function getFileTypeIcon(type: FileType) {
  switch (type) {
    case FileType.Text: return <FileTextOutlined />;
    case FileType.Image: return <FileImageOutlined />;
    case FileType.Document: return <FileWordFilled />;
    case FileType.Audio: return <CustomerServiceOutlined />;
    case FileType.Video: return <PlayCircleOutlined />;
    case FileType.Folder: return <FolderOutlined />
    default: return <FileUnknownOutlined />;
  }
}


export function UserFiles() {
  const [state, setState] = useState<UserFilesProps>({
    type:"",search:"",pid:-1
  });
  const user = stateStroge.get("user");
  const progressColor : ProgressProps["strokeColor"] = {
    '0%': '#52c41a',
    '50%': '#ffd821',
  '  100%': 'red'
  }
  useEffect(() => {
    FileInfoApi.getUserFiles(user.id, state?.pid, state?.type, state?.search, res => {
      const data = res.data;
      setState({ ...state, files: data });
    });

    CommonApi.getFileTypes(user.id,res=>setState({...state,headers:res.data}));
  }, []);

  const memuItems: MenuItem[] = [{
    label: "我的文件",
    icon: <FileOutlined />,
    key: "files",
    children: state?.headers?.map(e => {
      const item: MenuItem = {
        label: e.name,
        key: e.name,
        icon: getFileTypeIcon(e.type)
      }
      return item;
    })
  },
  {
    label: "回收站",
    key: "recycleBin",
    icon: <RestOutlined />
  }];

  useEffect(() => {

  }, []);


  return (
    <>
      <div id="user-files">
        <Menu
          onClick={() => { }}
          style={{ width: 128,height:"90%" }}
          items={memuItems}
        />
        <div className="space">
            <Progress percent={parseInt((user.currentSpace/user.totalSpace).toFixed(0))}
            strokeColor={progressColor}  />
            <p>{getFileSize(user.currentSpace)}/{getFileSize(user.totalSpace)}</p>
        </div>
      </div>
    </>
  )
}
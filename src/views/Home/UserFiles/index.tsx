import { useEffect, useState } from "react"
import { FileInfo, MenuItem } from "../../../moudles/api/types"
import { FileType, reactFor } from "../../../moudles/Common"
import { CustomerServiceOutlined, FileImageOutlined, FileOutlined, FileTextOutlined, FileUnknownOutlined, FileWordFilled, FolderOutlined, PlayCircleOutlined } from "@ant-design/icons"
import { Menu } from "antd"

interface FileTypeNameIcon {
  name: string,
  icon: string,
  type: FileType
}

type UserFilesProps = {
  headers: FileTypeNameIcon[],
  files: FileInfo[]
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
  const [state, setState] = useState<UserFilesProps>();

  const memuItems: MenuItem[] = [{
    label: "我的文件",
    icon: <FileOutlined />,
    key: "files",
    children: state?.headers.map(e => {
      const item: MenuItem = {
        label: e.name,
        key: e.name,
        icon: getFileTypeIcon(e.type)
      }

      return item;
    })
  }];

  useEffect(() => {

  }, []);


  return (
    <>
      <div id="user-files">
        <Menu
          onClick={()=>{}}
          style={{ width: 256 }}
          items={memuItems}
        />
      </div>
    </>
  )
}
import { useEffect, useState } from "react"
import { FileInfo, MenuItem, TableRowSelection } from "../../../moudles/api/types"
import { FileType, getFileSize, getFileType } from "../../../moudles/Common"
import { CustomerServiceOutlined, FileImageOutlined, FileOutlined, FileTextOutlined, FileUnknownOutlined, FileWordFilled, FileZipOutlined, FolderOutlined, PlayCircleOutlined, RestOutlined } from "@ant-design/icons"
import { Menu, Progress, ProgressProps, Table, Image, Space } from "antd"
import { CommonApi, FileInfoApi } from "../../../moudles/api"
import stateStroge from "../../../moudles/StateStorage"
import { fileCover } from "../../../moudles/Request"
import { UploadFile } from "../../../components/UploadFile"
import "../../../css/UserFiles.css"

interface FileTypeNameIcon {
  name: string,
  icon: string,
  type: FileType
}

type UserFilesProps = {
  headers?: FileTypeNameIcon[],
  files?: FileInfo[],
  selections?: TableRowSelection<FileInfo>,
  pid?: number,
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
    case FileType.Zip: return <FileZipOutlined />;
    default: return <FileUnknownOutlined />;
  }
}


export function UserFiles() {
  const [state, setState] = useState<UserFilesProps>({
    type: "", search: "", pid: -1
  });
  const user = stateStroge.get("user");
  const progressColor: ProgressProps["strokeColor"] = {
    '0%': '#52c41a',
    '50%': '#ffd821',
    '  100%': 'red'
  }
  useEffect(() => {
    FileInfoApi.getUserFiles(user.id, state?.pid, state?.type, state?.search, res => {
      const data = res.data;
      setState({ ...state, files: data });
    });

    CommonApi.getFileTypes(user.id, res => setState({ ...state, headers: res.data }));
  }, []);

  const memuItems: MenuItem[] = [{
    label: "我的文件",
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

  function files() {
    return <>
      <Table dataSource={state.files} rowSelection={state?.selections}>
        <Table.Column title="文件名" dataIndex="name" key="name" render={(_, f) => {
          return <Space>
            <Image width={30} height={30} src={fileCover(f.cover)}></Image>
            <span>{f.name}</span>
          </Space>
        }}>
        </Table.Column>
        <Table.Column title="大小" dataIndex="size" key="name" render={(_, f) => {
          return <span>{getFileSize(f.size)}</span>
        }}>
        </Table.Column>
        <Table.Column title="类型" dataIndex="type" key="type" render={(_, f) => {
          return <span>{getFileType(f.type)}</span>
        }}>
        </Table.Column>
        <Table.Column title="修改时间" dataIndex="updateTime" key="updateTime"></Table.Column>
      </Table>
    </>;
  }


  return (
    <>
      <div id="user-files">
        <div className="file-opt">
          <Menu
            onClick={() => { }}
            style={{ width: 164, height: "90%" }}
            items={memuItems}
            className="no-drag"
            mode="inline"
          />
          <div className="space">
            <Progress percent={parseInt((user.currentSpace / user.totalSpace).toFixed(0))}
              strokeColor={progressColor} />
            <p>{getFileSize(user.currentSpace)}/{getFileSize(user.totalSpace)}</p>
          </div>
        </div>
        <div className="content">
          <UploadFile userAccount={user.account} rootId={state?.pid}></UploadFile>
          {files()}
        </div>
      </div>
    </>
  )
}
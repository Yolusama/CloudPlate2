import { useEffect, useState } from "react"
import { FileInfo, MenuItem, TableRowSelection } from "../../../moudles/api/types"
import { FileType, getFileSize, getFileType } from "../../../moudles/Common"
import { CustomerServiceOutlined, FileImageOutlined, FileTextOutlined, FileUnknownOutlined, FileWordFilled, FileZipOutlined, FolderOutlined, PlayCircleOutlined, RestOutlined } from "@ant-design/icons"
import { Menu, Progress, ProgressProps, Table, Image, Space, message } from "antd"
import { CommonApi, FileInfoApi, UserApi } from "../../../moudles/api"
import stateStroge from "../../../moudles/StateStorage"
import { fileCover } from "../../../moudles/Request"
import { UploadEvent, UploadFile } from "../../../components/UploadFile"
import "../../../css/UserFiles.css"

interface FileTypeNameIcon {
  name: string,
  icon: string,
  type: FileType
}

type UserFilesProps = {
  headers?: FileTypeNameIcon[],
  files?: FileInfo[],
  currentSpace?: number,
  totalSpace?: number,
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
  const [messageApi, contextHolder] = message.useMessage();
  const user = stateStroge.get("user");
  const progressColor: ProgressProps["strokeColor"] = {
    '0%': '#52c41a',
    '50%': '#ffd821',
    '  100%': 'red'
  }
  useEffect(() => {
    getFiles();
    getUserSpace();
    CommonApi.getFileTypes(user.id).then(res => {
      if (!res.ok) {
        messageApi.error(res.message);
        return;
      }
      setState(prev => ({ ...prev, headers: res.data }));
    });
  }, []);

  function getFiles(nextState?: Partial<UserFilesProps>) {
    const pid = nextState?.pid ?? state?.pid;
    const type = nextState?.type ?? state?.type;
    const search = nextState?.search ?? state?.search;

    FileInfoApi.getUserFiles(user.id, pid, type, search).then(res => {
      if (!res.ok) {
        messageApi.error(res.message);
        return;
      }
      const data = res.data;
      setState(prev => ({ ...prev, files: data }));
    });
  }


  const memuItems: MenuItem[] = [{
    label: "我的文件",
    key: "files",
    children: state?.headers?.map(e => {
      const item: MenuItem = {
        label: e.name,
        key: e.type.toString(),
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
      {contextHolder}
      <Table dataSource={state.files} rowSelection={state?.selections}>
        <Table.Column title="文件名" dataIndex="name" key="name" render={(_, f) => {
          return <Space>
            <Image width={30} height={30} src={fileCover(f.cover)}></Image>
            <span>{f.name}</span>
          </Space>
        }}>
        </Table.Column>
        <Table.Column title="大小" dataIndex="size" key="size" render={(_, f) => {
          return <span>{getFileSize(f.size)}</span>
        }}>
        </Table.Column>
        <Table.Column title="类型" dataIndex="type" key="type" render={(_, f) => {
          return <span>{getFileType(f.type)}</span>
        }}>
        </Table.Column>
        <Table.Column title="上传时间" dataIndex="uploadTime" key="uploadTime" render={(_, f) => {
          return new Date(f.uploadTime).toLocaleString()
        }}
        ></Table.Column>
      </Table>
    </>;
  }

  function typeSelected(e: any) {
    const type = e.key;
    setState(prev => ({ ...prev, type }));
    getFiles({ type });
  }

  function getUserSpace() {
    UserApi.getUserSpace(user.account).then(res => {
      if (!res.ok) {
        messageApi.error(res.message);
        return;
      }
      const data = res.data;
      setState(prev => ({ ...prev, currentSpace: data.currentSpace, totalSpace: data.totalSpace }));
    });
  }

  function fileUploaded(e: UploadEvent) {
    if (e.finished) {
      getUserSpace();
      getFiles();
    }
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
            onSelect={typeSelected}
          />
          <div className="space">
            <Progress percent={parseInt(((state?.currentSpace ?? 0) / (state?.totalSpace ?? 1) * 100).toFixed(0))}
              strokeColor={progressColor} />
            <p>{getFileSize(state?.currentSpace ?? 0)}/{getFileSize(state?.totalSpace ?? 1)}</p>
          </div>
        </div>
        <div className="content">
          <UploadFile userAccount={user.account} rootId={state?.pid} onUpload={fileUploaded}></UploadFile>
          {files()}
        </div>
      </div>
    </>
  )
}
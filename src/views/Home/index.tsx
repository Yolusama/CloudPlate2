import { useEffect } from "react";
import { Outlet } from "react-router";
import { ToolBtn } from "../../components/ToolBtn";
import "../../css/Home.css";
import {  Menu, Image } from "antd";
import { CloudSyncOutlined, HomeOutlined, MenuFoldOutlined } from "@ant-design/icons";
import stateStroge from "../../moudles/StateStorage";
import { userAvatar } from "../../moudles/Request";
import { type MenuItem } from "../../moudles/api/types";

export function Home() {
    const items:MenuItem[] = [
        {
            key:"main",
            label:"首页",
            icon:<HomeOutlined />
        },
        {
            key:"transport",
            label:"传输",
            icon:<CloudSyncOutlined />
        },
        {
            key:"logout",
            label:"退出登录",
            icon: <MenuFoldOutlined />
        }
    ];

    const user = stateStroge.get("user");

    useEffect(() => {
        window.electron?.send("setHomeSizeState", {});
    }, []);

    return (
        <>
            <ToolBtn maximizable={true}></ToolBtn>
            <div id="home">
                <Outlet />
                <div className="cotnent">
                    <div id="user-info" onClick={e=>{}}>
                       <Image src={userAvatar(user.avatar)} width={50} height={50} style={{borderRadius:"50%"}}></Image>
                       <span>{user.nickName}</span>
                    </div>
                    <Menu
                        style={{ width: 128 }}
                        defaultSelectedKeys={["main"]}
                        mode="vertical"
                        theme="light"
                        items={items}
                    />
                </div>
            </div>
        </>
    )
}
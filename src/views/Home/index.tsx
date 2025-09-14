import { useEffect, useState } from "react";
import { ToolBtn } from "../../components/ToolBtn";
import "../../css/Home.css";
import { Menu, Image } from "antd";
import { CloudSyncOutlined, HomeOutlined, MenuFoldOutlined } from "@ant-design/icons";
import stateStroge from "../../moudles/StateStorage";
import { userAvatar } from "../../moudles/Request";
import { type MenuItem } from "../../moudles/api/types";
import { Outlet, useLocation } from "react-router";
import { Route } from "../../moudles/Route";
import useMessage from "antd/es/message/useMessage";
import { UserApi } from "../../moudles/api";

interface HomeProps {
    selectedRoute?:string
}

export function Home() {
    const [state, setState] = useState<HomeProps>({
        selectedRoute : "home"
    });
    const location = useLocation();
    const [messageApi,contextHolder] = useMessage();

    const items: MenuItem[] = [
        {
            key: "home",
            label: "首页",
            icon: <HomeOutlined />
        },
        {
            key: "transport",
            label: "传输",
            icon: <CloudSyncOutlined />
        },
        {
            key: "logout",
            label: "退出登录",
            icon: <MenuFoldOutlined />
        }
    ];

    const user = stateStroge.get("user");

    useEffect(() => {
        window.electron?.send("setHomeSizeState", {});
        console.log(location);
        if(location.pathname == "/Home")
            Route.switch("/Home/Files");
    }, []);
    function menuSelected(info: any) {
        console.log(info);
        setState({...state,selectedRoute:info.key});
        if(state.selectedRoute=="home")return;
            Route.switch("/Home/Files");
        if(state.selectedRoute == "logout"){
            UserApi.logout(user.id,()=>{
                stateStroge.clear();
            },messageApi)
        }
    }

    return (
        <>
            <ToolBtn maximizable={true}></ToolBtn>
            <div id="home" >
                <div id="user-info" onClick={e => { }} className="no-drag">
                    <Image src={userAvatar(user.avatar)} width={50} height={50} style={{ borderRadius: "50%" }}
                    ></Image>
                    <span className="text-over-flow">{user.nickname}</span>
                </div>
                <div className="content">
                    <Menu
                        style={{ width: 128, height: "calc(100vh - 55px)" }}
                        mode="vertical"
                        theme="light"
                        items={items}
                        selectedKeys={[state?.selectedRoute??""]}
                        onClick={menuSelected}
                    />
                    <Outlet />
                    
                </div>
            </div>
        </>
    )
}
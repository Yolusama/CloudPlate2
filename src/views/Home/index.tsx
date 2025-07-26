import { useEffect } from "react";
import { Outlet } from "react-router";
import { ToolBtn } from "../../components/ToolBtn";

export function Home(){
   
    useEffect(()=>{
     window.electron?.send("setHomeSizeState",{});
    },[]);

    return (
        <>
           <ToolBtn maximizable={true}></ToolBtn>
           <div id="home">
              <Outlet />
           </div>
        </>
    )
}
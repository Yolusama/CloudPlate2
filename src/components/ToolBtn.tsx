import { MinusOutlined, FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import '../css/ToolBtn.css';

export interface ToolBtnProps {
    maximizable: boolean;
}

export function ToolBtn({ maximizable }: ToolBtnProps) {
    const [state, setState] = useState({ maximized: false });
    
    function minimize() {
        window.electron?.send("minimize",{});
    }

    function close() {
        window.electron?.send("close", {});
    }

    function maximize() {
        window.electron?.send("maximize", {maxized: state.maximized});
        setState({ maximized: !state.maximized });
    }

    function toggleMaximize() {
        return (<>
            {state.maximized ? 
            <FullscreenExitOutlined onClick={maximize} className="btn" /> 
            : <FullscreenOutlined onClick={maximize} className="btn" />}
        </>)
    }

    return (
        <div id="tool-btn">
            <MinusOutlined onClick={minimize} className="btn" />
            {maximizable && toggleMaximize()}
            <CloseOutlined onClick={close} className="btn" />
        </div>
    );
}
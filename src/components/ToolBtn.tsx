import { MinusOutlined, FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import '../css/ToolBtn.css';

export interface ToolBtnProps {
    maximizable: boolean;
}

export function ToolBtn(props: ToolBtnProps) {
    const [state, setState] = useState({ maximized: false });

    function minimize() {
        window.electron?.send("minimize", {});
    }

    function close() {
        window.electron?.send("close", {});
    }

    function maximize() {
        if (!state.maximized) {
            setState({ maximized: true });
            window.electron?.send("maximize", { maximized: true });
        }
        else {
            setState({ maximized: false });
            window.electron?.send("maximize", { maximized: false });
        }
    }

    function toggleMaximize() {
        return (<>
            {state.maximized ?
                <FullscreenExitOutlined onClick={maximize} className="btn" />
                : <FullscreenOutlined onClick={maximize} className="btn" />}
        </>)
    }

    return (
        <div id="tool-btn" className="no-drag">
            <MinusOutlined onClick={minimize} className="btn" />
            {props.maximizable && toggleMaximize()}
            <CloseOutlined onClick={close} className="btn" />
        </div>
    );
}
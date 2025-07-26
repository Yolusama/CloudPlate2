import { Button, Input, Space } from "antd";
import { useState } from "react";
import { CommonApi } from "../moudles/api";
import useMessage from "antd/es/message/useMessage";

interface CheckCodeInputProps {
    email?: string;
    count?: number;
    value?: string;
    onValueChange?: (value: string) => void;
}

export function CheckCodeInput(props: CheckCodeInputProps) {
    const [checkCodeText, setCheckCodeText] = useState<string>("获取验证码");
    const [hasGotCode, setHasGotCode] = useState<boolean>(false);
    const [messageApi, ContextHolder] = useMessage();
    let count = 60;
    function getCheckCode() {
        setHasGotCode(true);
        CommonApi.getCheckCode(props.email ?? "", props.count ?? 0, () => {
            const timer = setInterval(() => {
                if (count == 0) {
                    clearInterval(timer);
                    setCheckCodeText("获取验证码");
                    setHasGotCode(false);
                    return;
                }
                else {
                    setCheckCodeText(`${count}s`);
                    count--;
                }
            }, 1000);
        }, messageApi);
    }

    return (
        <>
            {ContextHolder}
            <Space.Compact className="no-drag">
                <Input placeholder="输入验证码" maxLength={props.count} value={props.value} onInput=
                    {e => props.onValueChange?.(e.currentTarget.value)} />
                <Button type="primary" disabled={hasGotCode} onClick={getCheckCode}>{checkCodeText}</Button>
            </Space.Compact>
        </>
    );
}

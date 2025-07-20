import { Button, Checkbox, Form, Input, Select, Space } from "antd";
import { ToolBtn } from "../../../components/ToolBtn";
import { useEffect, useState } from "react";
import stateStroge from "../../../moudles/StateStorage";
import { DefaultOptionType } from "antd/es/select";
import { CheckCodeInput } from "../../../components/CheckCodeInput";

type LoginProps = {
    identifier?: string;
    password?: string;
    checkCode?: string;
    remember?: boolean;
    useCheckCode?: boolean;
    hasGotCode?: boolean;
}

export function Login() {
    const [state, setState] = useState<LoginProps>();
    const options: DefaultOptionType[] = [];
    const checkCodeMaxlength = 4;

    useEffect(() => {
        const accounts = stateStroge.get("accounts");
        if (accounts != undefined && accounts.length > 0) {
            accounts.forEach((account: string) => {
                options.push({ label: account, value: account });
            });
            setState({ ...state, identifier: accounts[0].value });
        }
        const remember = stateStroge.get("remember");
        if (remember !== undefined)
            setState({ ...state, remember: remember });
        const encryptedPassword = stateStroge.get("password");
        if (encryptedPassword !== undefined)
            setState({ ...state, password: encryptedPassword });

        window.electron?.send("SetLoginWindowState", {});
    }, []);

    function identifierComponent() {
        if (options.length === 0)
            return <Input placeholder="请输入账号" value={state?.identifier}
                onInput={e => setState({ ...state, identifier: e.currentTarget.value.replace(/\s/g, "") })} />;
        return <Select
            options={options}
            showSearch
            placeholder="选择账号"
            value={state?.identifier}
            filterOption={(input, option) =>
                (option?.label ?? '').toString().includes(input)
            }
            onChange={value => setState({ ...state, identifier: value })} />;
    }

    function loginPassComponent() {
        if (!state?.useCheckCode) {
            return (
                <Input.Password placeholder="密码" value={state?.password}
                    onInput={e => setState({ ...state, password: e.currentTarget.value.replace(/\s/g, "") })}></Input.Password>
            );
        }

        return (
            <CheckCodeInput count={checkCodeMaxlength} value={state?.checkCode} email={state.identifier}
                onValueChange={value => setState({ ...state, checkCode: value })} />
        )
    }

    function login() { }
    return (
        <>
            <ToolBtn maximizable={false} />
            <div id="login">
                <Form >
                    <Form.Item>
                        {identifierComponent()}
                    </Form.Item>
                    <Form.Item>
                        {loginPassComponent()}
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={state?.remember} onChange={e => setState({ ...state, remember: e.target.checked })}>记住密码</Checkbox>
                        <Checkbox checked={state?.useCheckCode} onChange={e => setState({ ...state, useCheckCode: e.target.checked })}>使用验证码登录</Checkbox>
                        <Button type="primary" onClick={login}>登录</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}
import { Button, Checkbox, Form, Input, Select, Image, Spin } from "antd";
import { ToolBtn } from "../../../components/ToolBtn";
import { useEffect, useState } from "react";
import stateStroge from "../../../moudles/StateStorage";
import { DefaultOptionType } from "antd/es/select";
import { CheckCodeInput } from "../../../components/CheckCodeInput";
import "../../../css/Login.css";
import { Register } from "../Register";
import useMessage from "antd/es/message/useMessage";
import { UserApi } from "../../../moudles/api";
import { Route } from "../../../moudles/Route";
import { LoginModel } from "../../../moudles/api/types";

type LoginProps = {
    identifier?: string;
    password?: string;
    checkCode?: string;
    remember?: boolean;
    useCheckCode?: boolean;
    showRegister?: boolean;
    loading?: boolean;
    accounts?: DefaultOptionType[];
}

export function Login() {
    const [state, setState] = useState<LoginProps>(
        { useCheckCode: false, loading: false, accounts: []});
    const [messageApi, contextHolder] = useMessage();
    const checkCodeMaxlength = 4;

    useEffect(() => {
        const accounts = stateStroge.get("accounts");
        var defaultAccount:string|undefined;
        if (accounts != undefined && accounts.length > 0) {
            accounts.forEach((account: string) => {
                state?.accounts?.push({ label: account, value: account });
            });
            defaultAccount = accounts[0];
            setState({ ...state, accounts: state?.accounts });
        }
        const user = stateStroge.get("user");
        var rememberObj = {
            remember:false,
            pwd:""
        }
        if (user != undefined) {
            const remember = stateStroge.get("rememberPassword");
            if (remember)
            {
                rememberObj.remember = remember;
                rememberObj.pwd = user.pwd;
            }
            
        }

        window.electron?.send("setLoginWindowState", {});
        setState({
            ...state, showRegister: false,identifier:defaultAccount,
            remember:rememberObj.remember,password:rememberObj.pwd
        });
    }, []);

    function identifierComponent() {
        if (!state?.accounts || state.accounts.length == 0)
            return <Input placeholder="账号/电子邮箱" value={state?.identifier}
                onInput={e => setState({ ...state, identifier: e.currentTarget.value.replace(/\s/g, "") })} />;
        return <Select
            options={state?.accounts}
            showSearch
            className="no-drag"
            placeholder="选择账号"
            allowClear={true}
            style={{ textAlign: "left" }}
            value={state?.identifier}
            filterOption={(input, option) =>
                (option?.label ?? '').toString().includes(input)
            }
            onChange={value => setState({ ...state, identifier: value })}
        />;
    }

    function loginPassComponent() {
        if (!state?.useCheckCode) {
            return (
                <Input.Password placeholder="密码" value={state?.password} visibilityToggle = {false}
                    onInput={e => setState({ ...state, password: e.currentTarget.value.replace(/\s/g, "") })}></Input.Password>
            );
        }

        return (
            <CheckCodeInput count={checkCodeMaxlength} value={state?.checkCode} email={state?.identifier}
                onValueChange={value => setState({ ...state, checkCode: value })} />
        )
    }

    function login() {
        setState({ ...state, loading: true });
        const model: LoginModel = { identifier: state?.identifier, passowrd: state?.password, checkCode: state?.checkCode };
        function afterLogin(data: any) {
            stateStroge.set("user", data);
            Route.switch("/Home");
            const accounts = [];

            if (stateStroge.has("accounts")) {
                const stored = stateStroge.get("accounts");
                if (!stored.includes(data.account))
                    stored.push(data.account);
                accounts.push(...stored);
            }
            else
                accounts.push(data.account);

            stateStroge.set("accounts", accounts);
            if(state?.remember)
                stateStroge.set("rememberPassword",true);
        }
        if (!state?.useCheckCode)
            UserApi.login(model, state?.remember, res => afterLogin(res.data), messageApi, () => setState({ ...state, loading: false }));
        else
            UserApi.checkCodeLogin(model, res => afterLogin(res.data), messageApi, () => setState({ ...state, loading: false }));
    }
    function goRegister() {
        setState({ ...state, showRegister: true });
    }
    return (
        <>
            <Spin spinning={state?.loading} fullscreen={true} tip="登录中..." />
            {contextHolder}
            <ToolBtn maximizable={false} />
            {!state?.showRegister && <div id="login" >
                <Image src="src/assets/login.gif" width={400} height={220} style={{ marginTop: "15px", borderRadius: "7px" }}></Image>
                <Form style={{ width: "60%", marginTop: "22px" }} className="no-drag">
                    <Form.Item>
                        {identifierComponent()}
                    </Form.Item>
                    <Form.Item>
                        {loginPassComponent()}
                    </Form.Item>
                    <Form.Item>
                        {!state?.useCheckCode&&<Checkbox checked={state?.remember} onChange={e => setState({ ...state, remember: e.target.checked })}>记住密码</Checkbox>}
                        <Checkbox checked={state?.useCheckCode} onChange={e => setState({ ...state, useCheckCode: e.target.checked })}>使用验证码登录</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={login}>登录</Button>
                        <Button type="default" onClick={goRegister} style={{ marginLeft: "2%" }}>注册</Button>
                    </Form.Item>
                </Form>
            </div>}
            {state?.showRegister && <Register onHide={() => setState({ ...state, showRegister: false })} />}
        </>
    );
}
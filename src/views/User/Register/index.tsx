import { Button, Form, Input, Spin } from "antd";
import "../../../css/Register.css";
import React, { useEffect, useState } from "react";
import { CheckCodeInput } from "../../../components/CheckCodeInput";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { UserApi } from "../../../moudles/api";
import useMessage from "antd/es/message/useMessage";

interface RegisterProps {
    nickname?: string;
    email?: string;
    password?: string;
    checkCode?: string;
    hasGotCode?: boolean;
    disabled?: boolean
    loading?:boolean;
}

interface RegisterOutPros {
    onHide?: () => void;
}

export function Register(pros: RegisterOutPros) {
    const [state, setState] = useState<RegisterProps>();
    const [messageApi, contextHolder] = useMessage();

    useEffect(() => {
        setState({ ...state, disabled: false,loading:false });
    }, [])

    function register() {
        setState({...state,loading:true});
        UserApi.register({
            nickName: state?.nickname,
            email: state?.email,
            checkCode: state?.checkCode,
            password: state?.password
        }, res => {
            setState({ ...state, disabled: true });
            messageApi.success(`${res.message}注册得到的账号${res.data},10秒内将自动返回`, 5000);
            const timer = setTimeout(() => {
                back(null);
                clearTimeout(timer);
            }, 10000);
        }, messageApi,()=>setState({...state,loading:false}));
    }

    function back(e: React.MouseEvent | null) {
        e?.stopPropagation();
        if (pros.onHide != undefined)
            pros.onHide();
    }

    return (
        <>
            <Spin spinning={state?.loading} fullscreen={true} tip="注册中..." />
            {contextHolder}
            <div className="back no-drag"  >
                <ArrowLeftOutlined className="icon" onClick={e => back(e)} />
            </div>
            <div id="register">
                <Form labelAlign="right" className="no-drag">
                    <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: "确定自己的昵称" }]}>
                        <Input value={state?.nickname} onInput={e => setState({ ...state, nickname: e.currentTarget.value.trim() })} />
                    </Form.Item>
                    <Form.Item label="电子邮箱" name="email" rules={[{ required: true, message: "请输入电子邮箱" }]}>
                        <Input value={state?.email} onInput={e => setState({ ...state, email: e.currentTarget.value })} />
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
                        <Input.Password value={state?.password} onInput={e => setState({
                            ...state, password: e.currentTarget.value
                                .replace(/\s/g, "")
                        })} />
                    </Form.Item>
                    <Form.Item label="验证码" name="checkCode" rules={[{ required: true, message: "请输入验证码" }]}>
                        <CheckCodeInput count={5} value={state?.checkCode} email={state?.email}
                            onValueChange={value => setState({ ...state, checkCode: value })} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={register} disabled={state?.disabled}>注册</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}
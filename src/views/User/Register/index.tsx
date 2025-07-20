import { Button, Form, Input, Space } from "antd";
import "./css/Register.css";
import { useState } from "react";
import { CheckCodeInput } from "../../../components/CheckCodeInput";

interface RegisterProps {
    nickname?: string;
    email?: string;
    password?: string;
    checkCode?: string;
    hasGotCode?: boolean;
}

export function Register() {
    const [state, setState] = useState<RegisterProps>();

    function register() {}
    return (
        <div id="register">
            <Form labelAlign="right">
                <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: "确定自己的昵称" }]}>
                    <Input value={state?.nickname} onInput={e => setState({ ...state, nickname: e.currentTarget.value.trim() })} />
                </Form.Item>
                <Form.Item label="电子邮箱" name="email" rules={[{ required: true, message: "请输入电子邮箱" }]}>
                    <Input value={state?.email} onInput={e => setState({ ...state, email: e.currentTarget.value })} />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
                    <Input.Password value={state?.password} onInput={e => setState({ ...state, password: e.currentTarget.value
                        .replace(/\s/g, "")
                     })} />
                </Form.Item>
                <Form.Item label="验证码" name="checkCode" rules={[{ required: true, message: "请输入验证码" }]}>
                    <CheckCodeInput count={5} value={state?.checkCode} email={state?.email}
                        onValueChange={value => setState({ ...state, checkCode: value })} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={register}>注册</Button>
                </Form.Item>
            </Form>
        </div>
    );
}
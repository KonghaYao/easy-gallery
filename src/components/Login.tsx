import { Tabs, Tab, TabsContext } from "@cn-ui/core";
import { useContext } from "solid-js";
export const Login = () => {
    return (
        <section class="flex justify-center items-center bg-neutral-100 h-full ">
            <Tabs activeId={"login"}>
                <Tab id="login">
                    <Login_inner></Login_inner>
                </Tab>
                <Tab id="signin">
                    <SignIn></SignIn>
                </Tab>
            </Tabs>
        </section>
    );
};

import { AV } from "../adapter/database/AV";
const SignIn = () => {
    return (
        <form
            class=" flex flex-col max-w-sm bg-neutral-50 rounded-md p-4"
            onsubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target as HTMLFormElement);
                new AV.Query("_User")
                    .get(fd.get("invite_code") as string)
                    .then((res) => {
                        AV.User.signUp(
                            fd.get("username") as string,
                            fd.get("password") as string
                        );
                        location.reload();
                    });
            }}>
            <header class=" text-xl font-bold">注册</header>
            <label>
                用户名
                <input type="text" name="username" />
            </label>
            <label>
                密码
                <input type="password" name="password" />
            </label>
            <label>
                邀请码
                <input type="text" name="invite_code" />
            </label>

            <button type="submit">注册</button>
        </form>
    );
};
const Login_inner = () => {
    const { changeSelected } = useContext(TabsContext);
    return (
        <form
            class=" flex flex-col max-w-sm bg-neutral-50 rounded-md p-4"
            onsubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target as HTMLFormElement);

                AV.User.logIn(
                    fd.get("username") as string,
                    fd.get("password") as string
                ).then((res) => {
                    location.href = "/";
                });
            }}>
            <header class=" text-xl font-bold">登录</header>
            <label>
                用户名
                <input type="text" name="username" />
            </label>
            <label>
                密码
                <input type="password" name="password" />
            </label>

            <button onclick={() => changeSelected("signin")}>注册</button>
            <button type="submit">登录</button>
        </form>
    );
};

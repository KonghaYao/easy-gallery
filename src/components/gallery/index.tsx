import { AV } from "../../adapter/database/AV";

const UserData = () => {
    const User = AV.User.current();
    console.log(User);
    return (
        <aside>
            <h3 class="font-bold text-xl pt-4 pb-2">{User.get("username")}</h3>
            <h6 class="font-thin text-xs select-all">{User.get("objectId")}</h6>
        </aside>
    );
};

export const Gallery = () => {
    if (AV.User.current()) {
        console.log("自动登录");
    } else {
        location.href = "/login";
        console.log("登录失败");
    }
    const { galleryList, db, usingGallery, isUsingGallery } = useGallery(true);

    return (
        <section class="relative flex  w-screen h-screen">
            <nav class="bg-neutral-100 max-w-[18rem] p-2">
                <UserData></UserData>
                <header class="font-bold text-xl pt-4">我的图库</header>
                <ul class="flex flex-col gap-2">
                    <button
                        class="bg-neutral-700 text-white rounded-lg my-2 w-full py-1  text-center"
                        onclick={asyncLock(() => {
                            const name = prompt("创建画廊名称");
                            if (name) {
                                db.createGallery({
                                    name,
                                    author: AV.User.current(),
                                }).then(() => galleryList.refetch());
                            }
                        })}>
                        创建画廊
                    </button>
                    <For each={galleryList()}>
                        {(item) => {
                            console.log(item);
                            const name = item.get("name");
                            return (
                                <li
                                    class="cursor-pointer px-2 rounded-lg hover:bg-neutral-200 transition-colors"
                                    classList={{
                                        "bg-neutral-600 text-white":
                                            isUsingGallery(item),
                                    }}
                                    onClick={() => {
                                        usingGallery(item);
                                    }}>
                                    🌟 {name}
                                </li>
                            );
                        }}
                    </For>
                    <Show when={galleryList.loading()}>
                        <div>加载中</div>
                    </Show>
                </ul>
            </nav>
            <MainApp></MainApp>
            <FloatControl></FloatControl>
            <UploadPanel></UploadPanel>
        </section>
    );
};

import { Atom, asyncLock } from "@cn-ui/use";
import { Component, For, Show } from "solid-js";
import { UploadPanel } from "./UploadPanel";
import { FloatControl } from "./FloatControl";
import { MainApp } from "./MainApp";
import { useGallery } from "./useGallery";

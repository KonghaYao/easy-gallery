import ImageViewer from "awesome-image-viewer";
import { useGallery } from "./useGallery";
import { WaterFall } from "@cn-ui/core";
import { asyncLock, atom, reflect } from "@cn-ui/use";
import type { ImageInfo } from "../../adapter/database/Meili";

export const MainApp = () => {
    const { usingGallery, imageList, imageStack } = useGallery();
    const column = atom(3);

    const updateItems = asyncLock(() => {
        console.log("滚动加载");
        return imageList.next();
    });
    return (
        <main class="flex-1 bg-neutral-50 max-h-screen flex flex-col">
            <header class="bg-neutral-50 border-b border-neutral-400 text-lg font-bold px-4  ">
                {usingGallery()?.get("name")}
            </header>
            <section
                class="pt-2 px-2 overflow-auto flex-1 pb-12 "
                onscroll={(e) => {
                    const el = e.target as HTMLDivElement;
                    if (
                        el.scrollHeight - (el.scrollTop + el.clientHeight) <
                        30
                    ) {
                        updateItems();
                    }
                }}>
                <WaterFall
                    column={column}
                    colClass="gap-4"
                    class="gap-4"
                    items={imageStack}>
                    {(query, index) => {
                        const item = query;
                        if (item.type === "video")
                            return <VideoAdapter item={item}></VideoAdapter>;
                        return (
                            <div
                                class="cursor-pointer overflow-hidden  bg-no-repeat bg-cover bg-neutral-300"
                                onclick={() => {
                                    new ImageViewer({
                                        images: imageList
                                            .currentData()
                                            .data.map((i) => ({
                                                mainUrl: i.url,
                                                thumbnailUrl: i.thumb,
                                            })),
                                        currentSelected: index!(),
                                    });
                                }}
                                style={{
                                    "aspect-ratio": `${item.width}/${item.height}`,
                                    "background-image": `url(${item.thumb})`,
                                    "background-position": "center",
                                }}></div>
                        );
                    }}
                </WaterFall>
            </section>
        </main>
    );
};
const VideoAdapter = ({ item }: { item: ImageInfo }) => {
    return (
        <video
            class="cursor-pointer"
            src={item.url + "?w=200&q=10"}
            style={{
                "aspect-ratio": `${item.width}/${item.height}`,
            }}
            onclick={(e) => {
                const el = e.target as HTMLVideoElement;
                el.src = item.url;
                el.requestFullscreen();
            }}></video>
    );
};

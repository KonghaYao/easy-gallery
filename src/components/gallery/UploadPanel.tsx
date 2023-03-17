import { asyncLock, atom, reflect, resource } from "@cn-ui/use";
import { Show, onCleanup } from "solid-js";
import { getImageSize } from "../../util/getImageSize";
import { useGallery } from "./useGallery";

const createRefFromFile = (f: File) => {
    if (!f) return null;
    const url = URL.createObjectURL(f!);
    onCleanup(() => URL.revokeObjectURL(url));
    const type = f?.type.split("/")[0];
    const dom = document.createElement(
        type === "video" ? "video" : "img"
    ) as HTMLImageElement & HTMLVideoElement;
    dom.src = url;
    dom.controls = true;
    return dom;
};

export const UploadPanel = () => {
    const { db, uploading, oss, usingGallery } = useGallery();
    const file = atom<FileList | null>(null);

    const demoRef = reflect(() => {
        const f = file();
        if (!f) return null;
        return [...f].map((i) => createRefFromFile(i));
    });
    const uploadSingleFile = async (
        f: File,
        ref: HTMLImageElement & HTMLVideoElement
    ) => {
        const type = f?.type.split("/")[0];

        const size = {
            height: ref.naturalHeight || ref.videoHeight,
            width: ref.naturalWidth || ref.videoWidth,
        };
        const data = await oss.uploadImage(
            f!,
            f!.name,
            usingGallery()!.get("name")
        );

        return db.createImage({
            url: data.url,
            thumb: data.thumbnailUrl,
            ...size,
            type,
            tags: [],
            CollectBy: [usingGallery()!],
        });
    };
    const imageUpload = resource(
        async () => {
            const f = file();
            const chunks = [...f!].reduce(
                (col, cur, index) => {
                    index % 3 === 0
                        ? (col[Math.floor(index / 3)] = [{ cur, index }])
                        : col[Math.floor(index / 3)].push({ cur, index });
                    return col;
                },
                [[]] as { cur: File; index: number }[][]
            );
            console.log(chunks);
            for (const iterator of chunks) {
                await Promise.all(
                    iterator.map(({ cur, index }) =>
                        uploadSingleFile(cur, demoRef()![index]!)
                    )
                );
            }
        },
        {
            immediately: false,
        }
    );
    let root!: HTMLDivElement;
    return (
        <Show when={uploading()}>
            <aside
                ref={root}
                class="absolute w-screen h-screen shadow-md top-0 left-0 flex justify-center items-center "
                onclick={function (e) {
                    if (e.target === root) uploading(false);
                }}>
                <section class="p-4 rounded-xl h-[80%] max-w-lg w-full bg-white flex flex-col ">
                    <header class="text-xl font-bold w-full py-4">
                        上传图片
                    </header>

                    <div class="text-red-600">
                        {imageUpload.error().message}
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,audio/*"
                            oninput={(e) => {
                                const list = (e.target as any).files;
                                file(() => list);
                            }}></input>
                        <button
                            disabled={imageUpload.loading()}
                            onclick={asyncLock(() => {
                                imageUpload.refetch();
                            })}>
                            {imageUpload.loading() ? "上传中..." : "上传"}
                        </button>
                    </div>
                    <div class="overflow-auto ">
                        <ul class="grid grid-cols-4 ">{demoRef()}</ul>
                    </div>
                </section>
            </aside>
        </Show>
    );
};

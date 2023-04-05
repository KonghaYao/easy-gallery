import { WaterFall } from "@cn-ui/core";
import {
    Atom,
    asyncLock,
    atom,
    reflect,
    resource,
    useBreakpoints,
    useWindowResize,
} from "@cn-ui/use";
import ImageViewer from "awesome-image-viewer";
export const Beauty = () => {
    const getRandom = () => Math.floor(Math.random() * 500);
    const page = atom(getRandom());
    const data = resource(
        () => {
            return fetch(
                "https://cofj-images.deno.dev/list?page=" + page()
            ).then<{ url: string; thumbnail: string }[]>((res) => res.json());
        },
        { initValue: [], deps: [page] }
    );
    const { width } = useWindowResize();
    const column = reflect<number>(() => (width() < 500 ? 2 : 3));
    return (
        <main class="flex-1 bg-neutral-50 max-h-screen flex flex-col">
            <header class="bg-neutral-50 border-b border-neutral-400 text-lg font-bold px-4  ">
                飘飘
                <aside class="float-right px-4">
                    <span
                        class="bg-neutral-600 text-white mx-2 rounded-md cursor-pointer text-center"
                        onclick={() => page((i) => i - 1)}>
                        《
                    </span>
                    <span
                        class="cursor-pointer"
                        onclick={() => page(getRandom)}>
                        {page()}
                    </span>
                    <span
                        class="bg-neutral-600 text-white mx-2 rounded-md cursor-pointer text-center"
                        onclick={() => page((i) => i + 1)}>
                        》
                    </span>
                </aside>
            </header>

            <section class="pt-2 px-2 overflow-auto flex-1 pb-12 ">
                <WaterFall
                    column={column}
                    colClass="gap-4"
                    class="gap-4"
                    items={data}>
                    {(query, index) => {
                        return (
                            <img
                                src={query.thumbnail.replace(
                                    "tr:n-ik_ml_thumbnail",
                                    "tr:q-10"
                                )}
                                class="cursor-pointer "
                                onclick={() => {
                                    new ImageViewer({
                                        images: data().map((i) => ({
                                            mainUrl: i.url,
                                            thumbnailUrl: i.thumbnail,
                                        })),
                                        currentSelected: index!(),
                                    });
                                }}></img>
                        );
                    }}
                </WaterFall>
            </section>
        </main>
    );
};

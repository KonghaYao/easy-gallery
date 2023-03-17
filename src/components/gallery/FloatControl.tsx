import { atom } from "@cn-ui/use";
import { Show } from "solid-js";
import { useGallery } from "./useGallery";
import { FloatPanel } from "@cn-ui/core";
export const FloatControl = () => {
    const isHidden = atom(true);
    const { uploading } = useGallery();
    return (
        <aside class="absolute bottom-8 right-8 items-end flex rounded-full  flex-col">
            <FloatPanel
                position="tr"
                popup={({ show }) => (
                    <Show when={show()}>
                        <nav class="divide-y flex flex-col   divide-gray-200 rounded-md shadow mb-4 p-2">
                            <div
                                class="cursor-pointer w-full  hover:bg-neutral-200 px-2  transition-colors rounded-xs"
                                onclick={() => uploading((i) => !i)}>
                                ➕
                            </div>
                        </nav>
                    </Show>
                )}>
                <button
                    class="rounded-full  w-12 h-12 bg-neutral-200 text-white"
                    onclick={() => {
                        isHidden((i) => !i);
                    }}>
                    🥳
                </button>
            </FloatPanel>
        </aside>
    );
};

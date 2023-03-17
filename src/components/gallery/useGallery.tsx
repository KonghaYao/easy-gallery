import type { AV } from "../../adapter/database/AV";
import { atom, reflect, resource, useEffect, usePagination } from "@cn-ui/use";
import { createEffect, createSelector } from "solid-js";
import { API, ImageInfo } from "../../adapter/database/Meili";
import { createEndpoint } from "../createEndpoint";
import { ImageKitOSS } from "../../adapter/oss";

export const useGallery = createEndpoint(() => {
    const db = new API();
    const galleryList = resource(
        async () => {
            return db.listGalleryName();
        },
        { initValue: [] }
    );
    const totalPageStore = new Map<string, Map<number, ImageInfo[]>>();
    const usingGallery = atom<AV.Queriable | null>(null);
    createEffect(() => {
        if (galleryList.isReady() && usingGallery() === null) {
            usingGallery(galleryList()[0]);
        }
    });
    const pageStore = reflect(() => {
        if (!usingGallery()) return new Map<number, ImageInfo[]>();
        const id = usingGallery()!.get("objectId");
        const info = totalPageStore.has(id);
        if (info) {
            return totalPageStore.get(id)!;
        } else {
            const newInfo = new Map<number, ImageInfo[]>();
            totalPageStore.set(id, newInfo);
            return newInfo;
        }
    });
    const singlePageSize = 10;
    const imageList = usePagination(
        async (page, maxPage) => {
            return db
                .queryGallery(usingGallery()!, {
                    limit: singlePageSize,
                    skip: singlePageSize * page,
                })
                .then((res) => {
                    maxPage(Math.ceil(res.total / singlePageSize));
                    res.data = res.data.map((i) => (i as any).toJSON());
                    pageStore().set(page, res.data);
                    return res as { total: number; data: ImageInfo[] };
                });
        },
        {
            deps: [usingGallery],
            immediately: false,
        }
    );
    // 当切换图库时，Pagination 的 index 还是以上一个图库的为准，导致错误
    createEffect(() => {
        const id = usingGallery()?.get("objectId");
        if (id) {
            const index = (totalPageStore.get(id)?.size ?? 1) - 1;
            imageList.currentIndex(index);
        }
    });
    const imageStack = reflect(() => {
        if (!imageList.currentData()) return [];
        let count = 0;
        const col: ImageInfo[] = [];

        const pageMap = pageStore();
        while (pageMap.has(count) || count <= pageMap.size) {
            col.push(...(pageMap.get(count) ?? []));
            console.log(pageMap.get(count));
            count++;
        }
        return col;
    });
    const oss = new ImageKitOSS();
    return {
        db,
        oss,
        galleryList,
        usingGallery,
        isUsingGallery: createSelector(usingGallery),
        imageList,
        imageStack,
        uploading: atom(false),
    };
});

import AV from "leancloud-storage";
import { Query } from "./AV";
// An index is where the documents are stored.
export interface GalleryInfo {
    name: string;
    author: AV.User;
}
export interface ImageInfo {
    url: string;
    width: number;
    height: number;
    thumb: string;
    type?: string;
    CollectBy: AV.Queriable[];
    tags: string[];
}
export class API {
    constructor() {}
    async listGalleryName() {
        const q = new Query("gallery");

        return q.equalTo("author", AV.User.current()).includeACL(true).find();
    }
    async _init(): Promise<void> {
        return;
    }
    createGallery(config: GalleryInfo) {
        const o = new AV.Object("gallery");
        Object.entries(config).forEach(([key, val]) => {
            o.set(key, val);
        });
        return o.save();
    }

    createImage(config: ImageInfo) {
        const o = new AV.Object("images");
        Object.entries(config).forEach(([key, val]) => {
            o.set(key, val);
        });
        return o.save();
    }
    async queryGallery(
        galleryName: AV.Queriable,
        queryInfo: { limit: number; skip: number }
    ): Promise<{
        data: ImageInfo[];
        total: number;
    }> {
        const q = new AV.Query("images");

        const [data, total] = await q
            .equalTo("CollectBy", galleryName)
            .limit(queryInfo.limit)
            .skip(queryInfo.skip)
            .findAndCount();
        return { data: data as any, total };
    }
}

import ImageKit from "imagekit-javascript";
import type { ListFileOptions } from "imagekit/dist/libs/interfaces";
export class ImageKitOSS {
    sys = new ImageKit({
        publicKey: "public_iwVFIvgEbdo+pudFUOblmRDdVYg=",
        urlEndpoint: "https://ik.imagekit.io/eh0zb3ila/",
        /** @ts-ignore */
        authenticationEndpoint: "https://cofj-images.deno.dev/",
    });

    uploadImage(file: File | string, fileName: string, galleryName: string) {
        console.log(this.sys);
        return this.sys!.upload({
            file: file as any,
            fileName: fileName,
            folder: galleryName,
            useUniqueFileName: false,
            overwriteFile: true,
            isPrivateFile: false,
        });
    }
}

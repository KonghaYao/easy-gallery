export function getImageSize(url: string) {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        let image = new Image();
        image.onload = function () {
            resolve({
                width: image.width,
                height: image.height,
            });
        };
        image.onerror = function (e) {
            reject(e);
        };
        image.src = url;
    });
}

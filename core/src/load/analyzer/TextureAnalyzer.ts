namespace dou3d {
    /**
     * 纹理贴图加载器
     * @author wizardc
     */
    export class TextureAnalyzer implements dou.IAnalyzer {
        public load(url: string, callback: (url: string, data: any) => void, thisObj: any): void {
            let loader = new dou.ImageLoader();
            loader.crossOrigin = true;
            loader.on(dou.Event.COMPLETE, () => {
                callback.call(thisObj, url, this.createTexture(loader.data));
            });
            loader.on(dou.IOErrorEvent.IO_ERROR, () => {
                callback.call(thisObj, url);
            });
            loader.load(url);
        }

        private createTexture(img: HTMLImageElement): ImageTexture {
            return new ImageTexture(img);
        }

        public release(data: ImageTexture): boolean {
            if (data) {
                data.dispose();
                return true;
            }
            return false;
        }
    }
}

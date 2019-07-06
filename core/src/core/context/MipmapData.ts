namespace dou3d {
    /**
     * 一个贴图的不同 LOD 层级数据
     * @author wizardc
     */
    export class MipmapData {
        public data: Uint8Array;
        public width: number;
        public height: number;

        public constructor(data: Uint8Array, width: number, height: number) {
            this.data = data;
            this.width = width;
            this.height = height;
        }
    }
}

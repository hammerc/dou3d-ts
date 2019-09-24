namespace dou3d {
    /**
     * 颜色转换类
     * @author wizardc
     */
    export class ColorTransform implements dou.ICacheable {
        private _matrix: Matrix4;
        private _alpha: number = 1;

        public constructor() {
            this._matrix = new Matrix4();
        }

        public get matrix(): Matrix4 {
            return this._matrix;
        }

        public set alpha(value: number) {
            this._alpha = value;
        }
        public get alpha(): number {
            return this._alpha;
        }

        /**
         * 设置颜色, 不包含 alpha
         */
        public setColor(value: number): void {
            let r = value & 0xff0000;
            r >>= 16;
            let g = value & 0xff00;
            g >>= 8;
            let b = value & 0xff;
            r /= 0xff;
            g /= 0xff;
            b /= 0xff;
            this.matrix.identity();
            this.scale(r, g, b, this._alpha);
        }

        public multiply(colorTransform: ColorTransform): void {
            this.matrix.multiply(colorTransform.matrix);
            this.alpha *= colorTransform.alpha;
        }

        public scale(r: number = 1, g: number = 1, b: number = 1, a: number = 1): void {
            let rawData = this.matrix.rawData;
            rawData[0] = r;
            rawData[5] = g;
            rawData[10] = b;
            this.alpha *= a;
        }

        public offset(r: number = 0, g: number = 0, b: number = 0, a: number = 0): void {
            let rawData = this.matrix.rawData;
            rawData[12] += r;
            rawData[13] += g;
            rawData[14] += b;
            this.alpha += a;
        }

        /**
         * 置灰
         */
        public gray(): void {
            let rawData = this.matrix.rawData;
            rawData[0] = 0.2126;
            rawData[1] = 0.7152;
            rawData[2] = 0.0722;
            rawData[3] = 1;
            rawData[4] = 0.2126;
            rawData[5] = 0.7152;
            rawData[6] = 0.0722;
            rawData[7] = 1;
            rawData[8] = 0.2126;
            rawData[9] = 0.7152;
            rawData[10] = 0.0722;
            rawData[11] = 1;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;
        }

        public clear(): void {
            this.matrix.identity();
            this.alpha = 1;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

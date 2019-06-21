namespace dou3d {
    /**
     * 四维向量接口
     * @author wizardc
     */
    export interface IVector4 extends IVector3 {
        w: number;
    }

    /**
     * 四维向量
     * @author wizardc
     */
    export class Vector4 implements IVector4, dou.ICacheable {
        /**
         * 线性插值
         */
        public static lerp(from: IVector4, to: IVector4, t: number, result?: IVector4): IVector4 {
            result = result || new Vector4();
            result.x = from.x + (to.x - from.x) * t;
            result.y = from.y + (to.y - from.y) * t;
            result.z = from.z + (to.z - from.z) * t;
            result.w = from.w + (to.w - from.w) * t;
            return result;
        }

        public x: number;
        public y: number;
        public z: number;
        public w: number;

        public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public get squaredLength(): number {
            let { x, y, z, w } = this;
            return x * x + y * y + z * z + w * w;
        }

        public get length(): number {
            let { x, y, z, w } = this;
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }

        public set(x: number, y: number, z: number, w: number): this {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        }

        /**
         * 将该向量或传入向量乘以一个标量
         * - v *= scalar
         * - v = input * scalar
         */
        public multiplyScalar(scalar: number, input?: IVector4): this {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.z = scalar * input.z;
            this.w = scalar * input.w;
            return this;
        }

        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        public dot(vector: IVector4): number {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
        }

        /**
         * 反转该向量或传入的向量
         */
        public inverse(input?: IVector4): this {
            input = input || this;
            this.x = input.x * -1;
            this.y = input.y * -1;
            this.z = input.z * -1;
            this.w = input.w;
            return this;
        }

        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        public normalize(input?: IVector4): this {
            input = input || this;
            let { x, y, z, w } = input;
            let l = Math.sqrt(x * x + y * y + z * z + w * w);
            if (l > MathUtil.EPSILON) {
                l = 1 / l;
                this.x = x * l;
                this.y = y * l;
                this.z = z * l;
                this.w = w * l;
            }
            else {
                this.clear();
            }
            return this;
        }

        public equal(value: IVector4, threshold: number = MathUtil.EPSILON): boolean {
            return Math.abs(this.x - value.x) <= threshold && Math.abs(this.y - value.y) <= threshold && Math.abs(this.z - value.z) <= threshold && Math.abs(this.w - value.w) <= threshold;
        }

        public fromArray(value: number[], offset: number = 0): this {
            this.x = value[offset];
            this.y = value[offset + 1];
            this.z = value[offset + 2];
            this.w = value[offset + 3];
            return this;
        }

        public toArray(array?: number[], offset: number = 0): number[] {
            array = array || [];
            array[0 + offset] = this.x;
            array[1 + offset] = this.y;
            array[2 + offset] = this.z;
            array[3 + offset] = this.w;
            return array;
        }

        public copy(value: IVector4): this {
            return this.set(value.x, value.y, value.z, value.w);
        }

        public clone(): IVector4 {
            return new Vector4(this.x, this.y, this.z, this.w);
        }

        public clear(): this {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

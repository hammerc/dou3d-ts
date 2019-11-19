namespace dou3d {
    /**
     * 二维向量接口
     * @author wizardc
     */
    export interface IVector2 {
        x: number;
        y: number;
    }

    /**
     * 二维向量
     * @author wizardc
     */
    export class Vector2 implements IVector2, dou.ICacheable {
        public static readonly ZERO: Readonly<Vector2> = new Vector2(0, 0);
        public static readonly ONE: Readonly<Vector2> = new Vector2(1, 1);
        public static readonly MINUS_ONE: Readonly<Vector2> = new Vector2(-1, -1);

        /**
         * 获取距离
         */
        public static distance(v1: IVector2, v2: IVector2): number {
            let x = (v1.x - v2.x);
            let y = (v1.y - v2.y);
            return Math.sqrt(x * x + y * y);
        }

        /**
         * 根据长度和角度获取一个向量
         * - 弧度制
         */
		public static polar(length: number, angle: number, result?: IVector2): IVector2 {
			result = result || new Vector2();
			result.x = length * Math.cos(angle);
			result.y = length * Math.sin(angle);
			return result;
		}

        /**
         * 判断两条直线是否相交
         * @param line1Point1 直线 1 上的任意一点
         * @param line1Point2 直线 1 上的任意一点
         * @param line2Point1 直线 2 上的任意一点
         * @param line2Point2 直线 2 上的任意一点
         * @param intersectionPoint 如果传入且相交则会保存交点的位置
         * @returns 是否相交
         * @tutorial https://github.com/thelonious/js-intersections/blob/master/src/intersection/Intersection.js
         */
        public static intersection(line1Point1: IVector2, line1Point2: IVector2, line2Point1: IVector2, line2Point2: IVector2, intersectionPoint?: IVector2): boolean {
            let cross = (line2Point2.y - line2Point1.y) * (line1Point2.x - line1Point1.x) - (line2Point2.x - line2Point1.x) * (line1Point2.y - line1Point1.y);
            if (cross == 0) {
                return false;
            }
            if (intersectionPoint) {
                let temp = (line2Point2.x - line2Point1.x) * (line1Point1.y - line2Point1.y) - (line2Point2.y - line2Point1.y) * (line1Point1.x - line2Point1.x);
                let u = temp / cross;
                intersectionPoint.x = line1Point1.x + u * (line1Point2.x - line1Point1.x);
                intersectionPoint.y = line1Point1.y + u * (line1Point2.y - line1Point1.y);
            }
            return true;
        }

        /**
         * 线性插值
         */
        public static lerp(from: IVector2, to: IVector2, t: number, result?: IVector2): IVector2 {
            result = result || new Vector2();
            result.x = from.x * (1 - t) + to.x * t;
            result.y = from.y * (1 - t) + to.y * t;
            return result;
        }

        public x: number;
        public y: number;

        public constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public get sqrtLength(): number {
            let { x, y } = this;
            return x * x + y * y;
        }

        public get length(): number {
            let { x, y } = this;
            return Math.sqrt(x * x + y * y);
        }

        public set(x: number, y: number): this {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
         * 将该向量加上一个向量或将两个向量相加的结果写入该向量
         * - v += v1
         * - v = v1 + v2
         */
        public add(v1: IVector2, v2?: IVector2): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x + v2.x;
            this.y = v1.y + v2.y;
            return this;
        }

        /**
         * 将该向量减去一个向量或将两个向量相减的结果写入该向量
         * - v -= v1
         * - v = v1 - v2
         */
        public subtract(v1: IVector2, v2?: IVector2): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x - v2.x;
            this.y = v1.y - v2.y;
            return this;
        }

        /**
         * 将该向量乘上一个向量或将两个向量相乘的结果写入该向量
         * - v *= v1
         * - v = v1 * v2
         */
        public multiply(v1: IVector2, v2?: IVector2): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x * v2.x;
            this.y = v1.y * v2.y;
            return this;
        }

        /**
         * 将该向量加上一个标量或将输入向量与标量相加的结果写入该向量
         * - v += scalar
         * - v = input + scalar
         */
        public addScalar(scalar: number, input?: IVector2): this {
            input = input || this;
            this.x = input.x + scalar;
            this.y = input.y + scalar;
            return this;
        }

        /**
         * 将该向量乘上一个标量或将输入向量与标量相乘的结果写入该向量
         * - v *= scalar
         * - v = input * scalar
         */
        public multiplyScalar(scalar: number, input?: IVector2): this {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            return this;
        }

        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        public dot(vector: IVector2): number {
            return this.x * vector.x + this.y * vector.y;
        }

        /**
         * 获取一个向量和该向量的夹角
         * - 弧度制
         */
        public getAngle(vector: IVector2): number {
            let v1 = dou.recyclable(Vector2);
            v1.normalize(this);
            let v2 = dou.recyclable(Vector2);
            v2.normalize(vector);
            let result = Math.acos(v1.dot(v2));
            v1.recycle();
            v2.recycle();
            return result;
        }

        /**
         * 叉乘
         */
        public cross(vector: IVector2): number {
            return this.x * vector.y - this.y * vector.x;
        }

        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        public normalize(input?: IVector2): this {
            input = input || this;
            let { x, y } = input;
            let l = Math.sqrt(x * x + y * y);
            if (l > MathUtil.EPSILON) {
                l = 1.0 / l;
                this.x = x * l;
                this.y = y * l;
            }
            else {
                this.x = 1;
                this.y = 0;
            }
            return this;
        }

        public equal(vector: IVector2, threshold: number = MathUtil.EPSILON): boolean {
            return Math.abs(this.x - vector.x) <= threshold && Math.abs(this.y - vector.y) <= threshold;
        }

        public copy(value: IVector2): this {
            return this.set(value.x, value.y);
        }

        public clone(): IVector2 {
            return new Vector2(this.x, this.y);
        }

        public clear(): this {
            this.x = 0;
            this.y = 0;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

namespace dou3d {
    /**
     * 颜色接口
     * @author wizardc
     */
    export interface IColor {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    /**
     * 颜色
     * @author wizardc
     */
    export class Color implements IColor, dou.ICacheable {
        /**
         * 所有颜色通道均为零的颜色
         */
        public static readonly ZERO: Readonly<Color> = new Color(0, 0, 0, 0);

        /**
         * 黑色
         */
        public static readonly BLACK: Readonly<Color> = new Color(0, 0, 0, 1);

        /**
         * 灰色
         */
        public static readonly GRAY: Readonly<Color> = new Color(0.5, 0.5, 0.5, 1);

        /**
         * 白色
         */
        public static readonly WHITE: Readonly<Color> = new Color(1, 1, 1, 1);

        /**
         * 红色
         */
        public static readonly RED: Readonly<Color> = new Color(1, 0, 0, 1);

        /**
         * 绿色
         */
        public static readonly GREEN: Readonly<Color> = new Color(0, 1, 0, 1);

        /**
         * 蓝色
         */
        public static readonly BLUE: Readonly<Color> = new Color(0, 0, 1, 1);

        /**
         * 黄色
         */
        public static readonly YELLOW: Readonly<Color> = new Color(1, 1, 0, 1);

        /**
         * 靛蓝色
         */
        public static readonly INDIGO: Readonly<Color> = new Color(0, 1, 1, 1);

        /**
         * 紫色
         */
        public static readonly PURPLE: Readonly<Color> = new Color(1, 0, 1, 1);

        /**
         * 线性插值
         */
        public static lerp(from: IColor, to: IColor, t: number, result?: Color): Color {
            result = result || new Color();
            result.r = t * (to.r - from.r) + from.r;
            result.g = t * (to.g - from.g) + from.g;
            result.b = t * (to.b - from.b) + from.b;
            result.a = t * (to.a - from.a) + from.a;
            return result;
        }

        public r: number;
        public g: number;
        public b: number;
        public a: number;

        public constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        public set(r: number, g: number, b: number, a?: number): this {
            this.r = r;
            this.g = g;
            this.b = b;
            if (!isNaN(a)) {
                this.a = a;
            }
            return this;
        }

        /**
         * 将该颜色乘以一个颜色或将两个颜色相乘的结果写入该颜色
         * - v *= color
         * - v = colorA * colorB
         */
        public multiply(colorA: IColor, colorB?: IColor): this {
            if (!colorB) {
                colorB = colorA;
            }
            colorA = this;
            this.r = colorA.r * colorB.r;
            this.g = colorA.g * colorB.g;
            this.b = colorA.b * colorB.b;
            this.a = colorA.a * colorB.a;
            return this;
        }

        public scale(scalar: number, input?: IColor): this {
            input = input || this;
            this.r = input.r * scalar;
            this.g = input.g * scalar;
            this.b = input.b * scalar;
            this.a = input.a * scalar;
            return this;
        }

        public fromArray(value: ArrayLike<number>, offset: number = 0): this {
            this.r = value[0 + offset];
            this.g = value[1 + offset];
            this.b = value[2 + offset];
            this.a = value[3 + offset];
            return this;
        }

        public fromHex(hex: number): this {
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;
            return this;
        }

        public copy(value: IColor): this {
            return this.set(value.r, value.g, value.b, value.a);
        }

        public clone(): Color {
            return new Color(this.r, this.g, this.b, this.a);
        }

        public clear(): this {
            this.r = 1;
            this.g = 1;
            this.b = 1;
            this.a = 1;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

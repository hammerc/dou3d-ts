namespace dou3d {
    /**
     * 尺寸接口
     * @author wizardc
     */
    export interface ISize {
        w: number;
        h: number;
    }

    /**
     * 矩形接口
     * @author wizardc
     */
    export interface IRectangle extends IVector2, ISize {
    }

    /**
     * 矩形
     * @author wizardc
     */
    export class Rectangle implements IRectangle, dou.ICacheable {
        public x: number;
        public y: number;
        public w: number;
        public h: number;

        public constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        public set(x: number, y: number, w: number, h: number): this {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            return this;
        }

        public contains(target: IVector2 | Rectangle): boolean {
            let minX = this.x;
            let minY = this.y;
            let maxX = this.x + this.w;
            let maxY = this.y + this.h;
            if (target instanceof Rectangle) {
                let vMinX = target.x;
                let vMinY = target.y;
                let vMaxX = target.x + target.w;
                let vMaxY = target.y + target.h;
                return minX <= vMinX && vMaxX <= maxX && minY <= vMinY && vMaxY <= maxY;
            }
            return target.x > minX && target.x < maxX && target.y > minY && target.y < maxY;
        }

        public multiplyScalar(scalar: number, input?: Readonly<IRectangle>): this {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.w = scalar * input.w;
            this.h = scalar * input.h;
            return this;
        }

        public copy(value: Readonly<IRectangle>): this {
            return this.set(value.x, value.y, value.w, value.h);
        }

        public clone(): Rectangle {
            return new Rectangle(this.x, this.y, this.w, this.h);
        }

        public clear(): this {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

namespace dou3d {
    /**
     * 包围盒
     * @author wizardc
     */
    export class BoundBox extends Bound {
        private _min: Vector3;
        private _max: Vector3;
        private _width: number = 0;
        private _heigth: number = 0;
        private _depth: number = 0;
        private _volume: number = 0;
        private _center: Vector3;
        private _radius: number = 0;

        private _box1: BoundBox;
        private _box2: BoundBox;

        public constructor(owner: Object3D, min: Vector3, max: Vector3) {
            super(owner);
            this._min = new Vector3();
            this._min.copy(min);
            this._max = new Vector3();
            this._max.copy(max);
            this._center = new Vector3();
            this.calculateBox();
        }

        /**
         * 盒子最小点
         */
        public get min(): Vector3 {
            return this._min;
        }

        /**
         * 盒子最大点
         */
        public get max(): Vector3 {
            return this._max;
        }

        /**
         * 盒子宽
         */
        public get width(): number {
            return this._width;
        }

        /**
         * 盒子高
         */
        public get height(): number {
            return this._heigth;
        }

        /**
         * 盒子长
         */
        public get depth(): number {
            return this._depth;
        }

        /**
         * 盒子体积
         */
        public get volume(): number {
            return this._volume;
        }

        /**
         * 盒子包围球中心点
         */
        public get center(): Vector3 {
            return this._center;
        }

        /**
         * 盒子包围球半径
         */
        public get radius(): number {
            return this._radius;
        }

        public copy(box: BoundBox): void {
            this._min.copy(box._min);
            this._max.copy(box._max);
            this.calculateBox();
        }

        public fillBox(min: Vector3, max: Vector3): void {
            this._min.copy(min);
            this._max.copy(max);
            this.calculateBox();
        }

        public createChild(): void {
            this._childBound = new BoundBox(this.owner, new Vector3(), new Vector3());
            let max = new Vector3();
            let min = new Vector3();
            max.x = this._center.x + this._width / 4;
            max.y = this._center.y + this._heigth / 4;
            max.z = this._center.z + this._depth / 4;
            min.x = this._center.x - this._width / 4;
            min.y = this._center.y - this._heigth / 4;
            min.z = this._center.z - this._depth / 4;
            (<BoundBox>this.childBound).fillBox(min, max);
        }

        protected updateAABB(): void {
            this._min.copy(new Vector3(MathUtil.INT_MAX, MathUtil.INT_MAX, MathUtil.INT_MAX));
            this._max.copy(new Vector3(MathUtil.INT_MIN, MathUtil.INT_MIN, MathUtil.INT_MIN));
            for (let i = 0; i < this.vexData.length; i += this.vexLength) {
                if (this._max.x < this.vexData[i]) {
                    this._max.x = this.vexData[i];
                }
                if (this._max.y < this.vexData[i + 1]) {
                    this._max.y = this.vexData[i + 1];
                }
                if (this._max.z < this.vexData[i + 2]) {
                    this._max.z = this.vexData[i + 2];
                }
                if (this._min.x > this.vexData[i]) {
                    this._min.x = this.vexData[i];
                }
                if (this._min.y > this.vexData[i + 1]) {
                    this._min.y = this.vexData[i + 1];
                }
                if (this._min.z > this.vexData[i + 2]) {
                    this._min.z = this.vexData[i + 2];
                }
            }
        }

        /**
         * 计算包围盒数据
         */
        public calculateBox(): void {
            let sub = this._max.subtract(this._min);
            this._vexData = this.vexData || new Float32Array(24);
            this._indexData = this.indexData || new Uint16Array(36);
            this.vexData[0] = this._min.x;
            this.vexData[1] = this._min.y;
            this.vexData[2] = this._min.z;
            this.vexData[3] = this._min.x;
            this.vexData[4] = this._min.y;
            this.vexData[5] = this._min.z + sub.z;
            this.vexData[6] = this._min.x + sub.x;
            this.vexData[7] = this._min.y;
            this.vexData[8] = this._min.z + sub.z;
            this.vexData[9] = this._min.x + sub.x;
            this.vexData[10] = this._min.y;
            this.vexData[11] = this._min.z;
            this.vexData[12] = this._max.x - sub.x;
            this.vexData[13] = this._max.y;
            this.vexData[14] = this._max.z - sub.z;
            this.vexData[15] = this._max.x - sub.x;
            this.vexData[16] = this._max.y;
            this.vexData[17] = this._max.z;
            this.vexData[18] = this._max.x;
            this.vexData[19] = this._max.y;
            this.vexData[20] = this._max.z;
            this.vexData[21] = this._max.x;
            this.vexData[22] = this._max.y;
            this.vexData[23] = this._max.z - sub.z;
            this.indexData[0] = 0;
            this.indexData[1] = 4;
            this.indexData[2] = 7;
            this.indexData[3] = 0;
            this.indexData[4] = 7;
            this.indexData[5] = 3;
            this.indexData[6] = 2;
            this.indexData[7] = 6;
            this.indexData[8] = 5;
            this.indexData[9] = 2;
            this.indexData[10] = 5;
            this.indexData[11] = 1;
            this.indexData[12] = 4;
            this.indexData[13] = 5;
            this.indexData[14] = 6;
            this.indexData[15] = 4;
            this.indexData[16] = 6;
            this.indexData[17] = 7;
            this.indexData[18] = 0;
            this.indexData[19] = 3;
            this.indexData[20] = 2;
            this.indexData[21] = 0;
            this.indexData[22] = 2;
            this.indexData[23] = 1;
            this.indexData[24] = 0;
            this.indexData[25] = 1;
            this.indexData[26] = 5;
            this.indexData[27] = 0;
            this.indexData[28] = 5;
            this.indexData[29] = 4;
            this.indexData[30] = 3;
            this.indexData[31] = 7;
            this.indexData[32] = 6;
            this.indexData[33] = 3;
            this.indexData[34] = 6;
            this.indexData[35] = 2;
            this._width = this._max.x - this._min.x;
            this._heigth = this._max.y - this._min.y;
            this._depth = this._max.z - this._min.z;
            this._volume = this._width * this._heigth * this._depth;
            let c = this._max.subtract(this._min);
            c.multiplyScalar(0.5);
            this._radius = c.length;
            this._center.copy(this._min);
            let tmp = this._center.add(c);
            this._center.copy(tmp);
        }

        /**
         * 检测一个点是否包围盒内
         */
        public pointIntersect(pos: Vector3): boolean {
            return pos.x <= this._max.x && pos.x >= this._min.x && pos.y <= this._max.y && pos.y >= this._min.y && pos.z <= this._max.z && pos.z >= this._min.z;
        }

        /**
         * 检测两个包围盒是否相交
         */
        public intersectAABBs(box: BoundBox, boxIntersect?: BoundBox): boolean {
            if (this._min.x > box._max.x) {
                return false;
            }
            if (this._max.x < box._min.x) {
                return false;
            }
            if (this._min.y > box._max.y) {
                return false;
            }
            if (this._max.y < box._min.y) {
                return false;
            }
            if (this._min.z > box._max.z) {
                return false;
            }
            if (this._max.z < box._min.z) {
                return false;
            }
            if (boxIntersect) {
                boxIntersect._min.x = Math.max(this._min.x, box._min.x);
                boxIntersect._max.x = Math.min(this._max.x, box._max.x);
                boxIntersect._min.y = Math.max(this._min.y, box._min.y);
                boxIntersect._max.y = Math.min(this._max.y, box._max.y);
                boxIntersect._min.z = Math.max(this._min.z, box._min.z);
                boxIntersect._max.z = Math.min(this._max.z, box._max.z);
                boxIntersect.calculateBox();
            }
            return true;
        }

        /**
         * 检测两个包围对象是否相交
         */
        public intersect(target: Bound, intersect: Bound = null): boolean {
            if (!this._box1) {
                this._box1 = <BoundBox>this.clone();
            }
            else {
                this._box1.copyVertex(this);
                this._box1.owner = this.owner;
            }
            this._box1.calculateTransform();
            this._box1.updateAABB();
            if (!this._box2) {
                this._box2 = <BoundBox>(<BoundBox>target).clone();
            }
            else {
                this._box2.copyVertex(this);
                this._box2.owner = target.owner;
            }
            this._box2.calculateTransform();
            this._box2.updateAABB();
            return this._box1.intersectAABBs(this._box2, <BoundBox>intersect);
        }

        /**
         * 检测一个盒子是否在视椎体内
         */
        public inBound(frustum: Frustum): boolean {
            let vec4 = dou.recyclable(Vector4);
            this.transform.transformVector(this._center, vec4);
            let result = frustum.inSphere(vec4, this._radius);
            vec4.recycle();
            return result;
        }

        public toString(): string {
            return "BoundBox [min:(" + this._min.x + ", " + this._min.y + ", " + this._min.z + ") max:(" + this._max.x + ", " + this._max.y + ", " + this._max.z + ")]";
        }

        public clone(): Bound {
            return new BoundBox(this.owner, this._min, this._max);
        }
    }
}

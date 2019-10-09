namespace dou3d {
    /**
     * 基础包围盒类
     * - 包含包围盒的各顶点信息, 当包围盒要进行世界变换时, 应当变换各顶点信息
     * @author wizardc
     */
    export abstract class Bound extends dou.HashObject {
        protected _vexData: Float32Array;
        protected _indexData: Uint16Array;
        protected _vexLength: number = 3;
        protected _childBound: Bound;
        protected _owner: Object3D;

        private _defaultMatrix: Matrix4;

        public constructor(owner: Object3D) {
            super();
            this._owner = owner;
            this._defaultMatrix = new Matrix4();
        }

        /**
         * 被拥有的对象
         */
        public set owner(value: Object3D) {
            this._owner = value;
        }
        public get owner(): Object3D {
            return this._owner;
        }

        /**
         * 顶点数据
         */
        public get vexData(): Float32Array {
            return this._vexData;
        }

        /**
         * 索引数据
         */
        public get indexData(): Uint16Array {
            return this._indexData;
        }

        /**
         * 顶点长度
         */
        public get vexLength(): number {
            return this._vexLength;
        }

        /**
         * 子包围盒
         */
        public get childBound(): Bound {
            return this._childBound;
        }

        /**
         * 变换矩阵
         */
        public get transform(): Matrix4 {
            if (!this._owner) {
                return this._defaultMatrix;
            }
            return this._owner.globalMatrix;
        }

        protected calculateTransform() {
            let vec4 = dou.recyclable(Vector4);
            for (let j: number = 0; j < this._vexData.length; j += 3) {
                vec4.set(this._vexData[j], this._vexData[j + 1], this._vexData[j + 2], 0);
                this.transform.transformVector(vec4, vec4);
                this._vexData[j + 0] = vec4.x;
                this._vexData[j + 1] = vec4.y;
                this._vexData[j + 2] = vec4.z;
            }
            vec4.recycle();
        }

        public abstract createChild(): void;

        protected abstract updateAABB(): void;

        public copyVertex(bound: Bound): void {
            for (let i = 0; i < bound.vexData.length; ++i) {
                this._vexData[i] = bound.vexData[i];
            }

            for (let i = 0; i < bound.indexData.length; ++i) {
                this._indexData[i] = bound.indexData[i];
            }
            this._vexLength = bound.vexLength;
        }

        /**
         * 检测一个点是否包围盒内
         */
        public abstract pointIntersect(pos: Vector3): boolean;

        /**
         * 检测两个包围盒是否相交
         */
        public abstract intersectAABBs(box: BoundBox, boxIntersect?: BoundBox): boolean;

        /**
         * 检测两个包围对象是否相交
         */
        public abstract intersect(target: Bound, intersect?: Bound): boolean;

        /**
         * 检测是否在视椎体内
         */
        public abstract inBound(frustum: Frustum): boolean;

        public dispose() {
            if (this._childBound) {
                this._childBound.dispose();
            }
        }
    }
}

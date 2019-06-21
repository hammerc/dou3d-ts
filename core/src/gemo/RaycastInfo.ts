namespace dou3d {
    /**
     * 射线检测信息
     * @author wizardc
     */
    export class RaycastInfo implements dou.ICacheable {
        /**
         * 交点到射线起始点的距离
         * - 如果未相交则为 -1
         */
        public distance: number = -1;

        /**
         * 相交的点
         */
        public readonly position: Vector3 = new Vector3();

        /**
         * 三角形或几何面相交的 UV 坐标
         */
        public readonly coord: Vector2 = new Vector2();

        /**
         * 相交的法线向量
         * - 设置该值将会在检测时计算相交的法线向量, 并将结果写入该值
         */
        public normal: Vector3 = null;

        public copy(value: RaycastInfo): this {
            this.distance = value.distance;
            this.position.copy(value.position);
            this.coord.copy(value.coord);
            if (this.normal && value.normal) {
                this.normal.copy(value.normal!);
            }
            return this;
        }

        public clear(): this {
            this.distance = -1;
            this.position.set(0, 0, 0);
            this.coord.set(0, 0);
            this.normal = null;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

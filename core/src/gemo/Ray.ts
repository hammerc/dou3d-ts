namespace dou3d {
    /**
     * 射线
     * @author wizardc
     */
    export class Ray implements dou.ICacheable {
        /**
         * 射线的起点
         */
        public readonly origin: Vector3 = new Vector3();

        /**
         * 射线的方向
         */
        public readonly direction: Vector3 = new Vector3();

        public constructor(origin?: IVector3, direction?: IVector3) {
            this.origin.copy(origin || new Vector3());
            this.direction.copy(direction || new Vector3());
        }

        public set(origin: IVector3, direction: IVector3): this {
            this.origin.copy(origin);
            this.direction.copy(direction);
            return this;
        }

        /**
         * 将该射线乘以一个矩阵或将输入射线与一个矩阵相乘的结果写入该射线
         * - v *= matrix
         * - v = input * matrix
         */
        public applyMatrix(matrix: Matrix4, input?: Ray): this {
            input = input || this;
            this.origin.applyMatrix(matrix, input.origin);
            this.direction.applyDirection(matrix, input.direction);
            return this;
        }

        /**
         * 获取一个点到该射线的最近点
         */
        public getClosestPointToPoint(point: IVector3, result?: Vector3): Vector3 {
            result = result || new Vector3();
            let origin = result != this.origin ? this.origin : new Vector3().copy(this.origin);
            let direction = this.direction;
            let directionDistance = result.subtract(point, origin).dot(direction);
            if (directionDistance < 0) {
                return result.copy(origin);
            }
            return result.copy(direction).multiplyScalar(directionDistance).add(origin);
        }

        /**
         * 获取从该射线的起点沿着射线方向移动一段距离的一个点
         * - out = ray.origin + ray.direction * distanceDelta
         */
        public getPointAt(distanceDelta: number, result?: Vector3): Vector3 {
            result = result || new Vector3();
            let origin = result != this.origin ? this.origin : new Vector3().copy(this.origin);
            return result.multiplyScalar(distanceDelta, this.direction).add(origin);
        }

        /**
         * 获取一个点到该射线的最近距离的平方
         */
        public getSquaredDistance(point: IVector3): number {
            let vector = dou.recyclable(Vector3);
            let directionDistance = vector.subtract(point, this.origin).dot(this.direction);
            if (directionDistance < 0) {
                return this.origin.getSquaredDistance(point);
            }
            let result = this.getPointAt(directionDistance, vector).getSquaredDistance(point);
            vector.recycle();
            return result;
        }

        /**
         * 获取一个点到该射线的最近距离
         */
        public getDistance(point: IVector3): number {
            return Math.sqrt(this.getSquaredDistance(point));
        }

        /**
         * 获取该射线起点到一个平面的最近距离
         * - 如果射线并不与平面相交，则返回 -1
         */
        public getDistanceToPlane(plane: Plane): number {
            let origin = this.origin;
            let planeNormal = plane.normal;
            let denominator = planeNormal.dot(this.direction);
            if (denominator == 0) {
                if (plane.getDistance(origin) == 0) {
                    return 0;
                }
                return -1;
            }
            let t = -(origin.dot(planeNormal) + plane.constant) / denominator;
            return t >= 0 ? t : -1;
        }

        public fromArray(value: number[], offset: number = 0): this {
            this.origin.fromArray(value, offset);
            this.direction.fromArray(value, offset + 3);
            return this;
        }

        /**
         * 设置该射线，使其从起点出发，经过终点
         */
        public fromPoints(from: IVector3, to: IVector3): this {
            this.direction.subtract(to, this.origin.copy(from)).normalize();
            return this;
        }

        public copy(value: Readonly<Ray>) {
            return this.set(value.origin, value.direction);
        }

        public clone() {
            return new Ray(this.origin, this.direction);
        }

        public clear(): this {
            this.origin.clear();
            this.direction.clear();
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

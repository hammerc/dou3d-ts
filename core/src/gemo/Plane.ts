namespace dou3d {
    /**
     * 几何平面
     * @author wizardc
     */
    export class Plane implements IRaycast, dou.ICacheable {
        public static UP: Readonly<Plane> = new Plane(Vector3.UP, 0);
        public static DOWN: Readonly<Plane> = new Plane(Vector3.DOWN, 0);
        public static LEFT: Readonly<Plane> = new Plane(Vector3.BACK, 0);
        public static RIGHT: Readonly<Plane> = new Plane(Vector3.BACK, 0);
        public static FORWARD: Readonly<Plane> = new Plane(Vector3.FORWARD, 0);
        public static BACK: Readonly<Plane> = new Plane(Vector3.BACK, 0);

        /**
         * 平面的法线
         */
        public readonly normal: Vector3 = new Vector3();

        /**
         * 二维平面到原点的距离
         */
        public constant: number = 0;

        public constructor(normal: IVector3, constant: number = 0) {
            this.normal.copy(normal);
            this.constant = constant;
        }

        public set(normal: Readonly<IVector3>, constant: number = 0): this {
            this.constant = constant;
            this.normal.copy(normal);
            return this;
        }

        public getDistance(point: IVector3): number {
            return this.normal.dot(point) + this.constant;
        }

        public normalize(input?: Plane): this {
            input = input || this;
            let inverseNormalLength = 1 / input.normal.length;
            this.constant = input.constant * inverseNormalLength;
            this.normal.multiplyScalar(inverseNormalLength, input.normal);
            return this;
        }

        public negate(input?: Plane): this {
            input = input || this;
            this.constant = -input.constant;
            this.normal.negate(input.normal);
            return this;
        }

        public getProjectionPoint(point: IVector3, result?: Vector3): Vector3 {
            result = result || new Vector3();
            return result.multiplyScalar(-this.getDistance(point), this.normal).add(point);
        }

        public getCoplanarPoint(result?: Vector3): Vector3 {
            result = result || new Vector3();
            return result.copy(this.normal).multiplyScalar(-this.constant);
        }

        public applyMatrix(matrix: Matrix4, normalMatrix?: Matrix3): this {
            if (!normalMatrix) {
                let matrix3 = dou.recyclable(Matrix3);
                normalMatrix = matrix3.getNormalMatrix(matrix);
                matrix3.recycle();
            }
            let vector = dou.recyclable(Vector3);
            let referencePoint = this.getCoplanarPoint(vector).applyMatrix(matrix);
            let normal = this.normal.applyMatrix3(normalMatrix).normalize();
            this.constant = -referencePoint.dot(normal);
            vector.recycle();
            return this;
        }

        public raycast(ray: Ray, raycastInfo?: RaycastInfo): boolean {
            let t = ray.getDistanceToPlane(this);
            if (t > 0) {
                if (raycastInfo) {
                    let normal = raycastInfo.normal;
                    raycastInfo.distance = t;
                    ray.getPointAt(t, raycastInfo.position);
                    if (normal) {
                        normal.copy(this.normal);
                    }
                }
                return true;
            }
            return false;
        }

        public fromArray(array: number[], offset: number = 0): this {
            this.normal.fromArray(array, offset);
            this.constant = array[offset + 3];
            return this;
        }

        public fromPoint(point: IVector3, normal: IVector3 = Vector3.UP): this {
            this.constant = -(<Vector3>normal).dot(point);
            this.normal.copy(normal);
            return this;
        }

        public fromPoints(point1: IVector3, point2: IVector3, point3: IVector3): this {
            let vector1 = dou.recyclable(Vector3);
            let vector2 = dou.recyclable(Vector3);
            let normal = vector1.subtract(point3, point2).cross(vector2.subtract(point1, point2)).normalize();
            this.fromPoint(point1, normal);
            vector1.recycle();
            vector2.recycle();
            return this;
        }

        public toArray(array?: number[], offset: number = 0): number[] {
            array = array || [];
            this.normal.toArray(array, offset);
            array[offset + 3] = this.constant;
            return array;
        }

        public copy(value: Plane): this {
            return this.set(value.normal, value.constant);
        }

        public clone(): Plane {
            return new Plane(this.normal, this.constant);
        }

        public clear(): this {
            this.normal.clear();
            this.constant = 0;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

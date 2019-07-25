namespace dou3d {
    /**
     * 三维向量接口
     * @author wizardc
     */
    export interface IVector3 extends IVector2 {
        z: number;
    }

    /**
     * 三维向量
     * @author wizardc
     */
    export class Vector3 implements IVector3, dou.ICacheable {
        /**
         * 零向量
         */
        public static readonly ZERO: Readonly<Vector3> = new Vector3(0, 0, 0);

        /**
         * 三方向均为一的向量
         */
        public static readonly ONE: Readonly<Vector3> = new Vector3(1, 1, 1);

        /**
         * 三方向均为负一的向量
         */
        public static readonly MINUS_ONE: Readonly<Vector3> = new Vector3(-1, -1, -1);

        /**
         * 上向量
         */
        public static readonly UP: Readonly<Vector3> = new Vector3(0, 1, 0);

        /**
         * 下向量
         */
        public static readonly DOWN: Readonly<Vector3> = new Vector3(0, -1, 0);

        /**
         * 左向量
         */
        public static readonly LEFT: Readonly<Vector3> = new Vector3(-1, 0, 0);

        /**
         * 右向量
         */
        public static readonly RIGHT: Readonly<Vector3> = new Vector3(1, 0, 0);

        /**
         * 前向量
         */
        public static readonly FORWARD: Readonly<Vector3> = new Vector3(0, 0, 1);

        /**
         * 后向量
         */
        public static readonly BACK: Readonly<Vector3> = new Vector3(0, 0, -1);

        /**
         * 获取距离
         */
        public static getDistance(v1: IVector3, v2: IVector3): number {
            let x = (v1.x - v2.x);
            let y = (v1.y - v2.y);
            let z = (v1.z - v2.z);
            return Math.sqrt(x * x + y * y + z * z);
        }

        /**
         * 判断两条直线是否相交
         * @param line1Point 直线 1 上的任意一点
         * @param line1Orientation 直线 1 的方向
         * @param line2Point 直线 2 上的任意一点
         * @param line2Orientation 直线 2 的方向
         * @param intersectionPoint 如果传入且相交则会保存交点的位置
         * @returns 是否相交
         * @tutorial https://blog.csdn.net/xdedzl/article/details/86009147
         */
        public static intersection(line1Point: Vector3, line1Orientation: Vector3, line2Point: Vector3, line2Orientation: Vector3, intersectionPoint?: Vector3): boolean {
            let dot = line1Orientation.dot(line2Orientation);
            if (dot == 1) {
                // 平行
                return false;
            }
            let startPointSeg = dou.recyclable(Vector3);
            startPointSeg.subtract(line2Point, line1Point);
            let vecS1 = dou.recyclable(Vector3);
            vecS1.cross(line1Orientation, line2Orientation);
            let vecS2 = dou.recyclable(Vector3);
            vecS2.cross(startPointSeg, line2Orientation);
            let num = startPointSeg.dot(vecS1);
            if (num >= 0.00001 || num <= 0.00001) {
                // 共面
                startPointSeg.recycle();
                vecS1.recycle();
                vecS2.recycle();
                return false;
            }
            let num2 = vecS2.dot(vecS1) / vecS1.squaredLength;
            if (intersectionPoint) {
                intersectionPoint.copy(line1Orientation);
                intersectionPoint.multiplyScalar(num2);
                intersectionPoint.add(line1Point);
            }
            startPointSeg.recycle();
            vecS1.recycle();
            vecS2.recycle();
            return true;
        }

        /**
         * 线性插值
         */
        public static lerp(from: IVector3, to: IVector3, t: number, result?: IVector3): IVector3 {
            result = result || new Vector3();
            result.x = from.x + (to.x - from.x) * t;
            result.y = from.y + (to.y - from.y) * t;
            result.z = from.z + (to.z - from.z) * t;
            return result;
        }

        /**
         * 球形插值
         */
        public static slerp(from: Vector3, to: Vector3, t: number, result?: Vector3): IVector3 {
            result = result || new Vector3();
            let fromLength = from.length;
            let toLength = to.length;
            if (fromLength < MathUtil.EPSILON || toLength < MathUtil.EPSILON) {
                return this.lerp(from, to, t, result);
            }
            let dot = from.dot(to) / (fromLength * toLength);
            if (dot > 1 - MathUtil.EPSILON) {
                return this.lerp(from, to, t, result);
            }
            let lerpedLength = MathUtil.lerp(fromLength, toLength, t);
            let martix1 = dou.recyclable(Matrix3);
            let martix2 = dou.recyclable(Matrix4);
            if (dot < -1 + MathUtil.EPSILON) {
                let axis = result.orthoNormal(from);
                martix1.fromMatrix4(martix2.fromAxis(axis, Math.PI * t));
                result.multiplyScalar(1 / fromLength, from).applyMatrix3(martix1).multiplyScalar(lerpedLength);
            }
            else {
                let axis = result.cross(from, to).normalize();
                martix1.fromMatrix4(martix2.fromAxis(axis, Math.acos(dot) * t));
                result.multiplyScalar(1 / fromLength, from).applyMatrix3(martix1).multiplyScalar(lerpedLength);
            }
            martix1.recycle();
            martix2.recycle();
            return result;
        }

        public x: number;
        public y: number;
        public z: number;

        public constructor(x: number = 0, y: number = 0, z: number = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public get squaredLength(): number {
            let { x, y, z } = this;
            return x * x + y * y + z * z;
        }

        public get length(): number {
            let { x, y, z } = this;
            return Math.sqrt(x * x + y * y + z * z);
        }

        public set(x: number, y: number, z: number): this {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }

        /**
         * 将该向量或传入向量加上一个标量
         * - v += scalar
         * - v = input + scalar
         */
        public addScalar(scalar: number, input?: IVector3): this {
            input = input || this;
            this.x = input.x + scalar;
            this.y = input.y + scalar;
            this.z = input.z + scalar;
            return this;
        }

        /**
         * 将该向量或传入向量乘以一个标量
         * - v *= scalar
         * - v = input * scalar
         */
        public multiplyScalar(scalar: number, input?: IVector3): this {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.z = scalar * input.z;
            return this;
        }

        /**
         * 将该向量加上一个向量或将两个向量相加的结果写入该向量
         * - v += v1
         * - v = v1 + v2
         */
        public add(v1: IVector3, v2?: IVector3): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x + v2.x;
            this.y = v1.y + v2.y;
            this.z = v1.z + v2.z;
            return this;
        }

        /**
         * 将该向量减去一个向量或将两个向量相减的结果写入该向量
         * - v -= v1
         * - v = v1 - v2
         */
        public subtract(v1: IVector3, v2?: IVector3): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x - v2.x;
            this.y = v1.y - v2.y;
            this.z = v1.z - v2.z;
            return this;
        }

        /**
         * 将该向量乘以一个向量或将两个向量相乘的结果写入该向量
         * - v *= v1
         * - v = v1 * v2
         */
        public multiply(v1: IVector3, v2?: IVector3): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x * v2.x;
            this.y = v1.y * v2.y;
            this.z = v1.z * v2.z;
            return this;
        }

        /**
         * 将该向量除以一个向量或将两个向量相除的结果写入该向量
         * -  v /= v1
         * -  v = v1 / v2
         */
        public divide(v1: IVector3, v2?: IVector3): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            if (DEBUG && (v2.x === 0 || v2.y === 0 || v2.z === 0)) {
                console.warn("除数为 0");
            }
            this.x = v1.x / v2.x;
            this.y = v1.y / v2.y;
            this.z = v1.z / v2.z;
            return this;
        }

        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        public dot(vector: IVector3): number {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        }

        /**
         * 获取一个向量和该向量的夹角
         * - 弧度制
         */
        public getAngle(vector: Vector3): number {
            let v = this.squaredLength * vector.squaredLength;
            if (v < MathUtil.EPSILON) {
                if (DEBUG) {
                    console.warn("除数为 0");
                }
                return 0;
            }
            let theta = this.dot(vector) / Math.sqrt(v);
            return Math.acos(Math.max(-1, Math.min(1, theta)));
        }

        /**
         * 将该向量叉乘一个向量或将两个向量叉乘的结果写入该向量
         * - v ×= vector
         * - v = vectorA × vectorB
         */
        public cross(v1: IVector3, v2?: IVector3): this {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            let x = v1.x;
            let y = v1.y;
            let z = v1.z;
            let xB = v2.x;
            let yB = v2.y;
            let zB = v2.z;
            this.x = y * zB - z * yB;
            this.y = z * xB - x * zB;
            this.z = x * yB - y * xB;
            return this;
        }

        /**
         * 沿着一个法线向量反射该向量或传入向量
         * - 假设法线已被归一化
         */
        public reflect(normal: IVector3, input?: Vector3): this {
            input = input || this;
            let vector3 = dou.recyclable(Vector3);
            this.subtract(input, vector3.multiplyScalar(2 * input.dot(normal), normal));
            vector3.recycle();
            return this;
        }

        /**
         * 获取一点到该点的直线距离的平方
         */
        public getSquaredDistance(point: IVector3): number {
            let vector3 = dou.recyclable(Vector3);
            let result = vector3.subtract(point, this).squaredLength;
            vector3.recycle();
            return result;
        }

        /**
         * 获取一点到该点的直线距离
         */
        public getPointDistance(point: IVector3): number {
            let vector3 = dou.recyclable(Vector3);
            let result = vector3.subtract(point, this).length;
            vector3.recycle();
            return result;
        }

        /**
         * 通过一个球面坐标设置该向量
         * @param radius 球面半径
         * @param phi 相对于 Y 轴的极角
         * @param theta 围绕 Y 轴的赤道角
         */
        public fromSphericalCoords(radius: number, phi: number = 0, theta: number = 0): this {
            let sinPhiRadius = Math.sin(phi) * radius;
            this.x = sinPhiRadius * Math.sin(theta);
            this.y = Math.cos(phi) * radius;
            this.z = sinPhiRadius * Math.cos(theta);
            return this;
        }

        /**
         * 将该向量或传入向量乘以一个 3x3 矩阵
         * - v *= matrix
         */
        public applyMatrix3(matrix: Matrix3 | Matrix4, input?: IVector3): this {
            input = input || this;
            let { x, y, z } = input;
            let rawData = matrix.rawData;
            if (matrix instanceof Matrix3) {
                this.x = rawData[0] * x + rawData[3] * y + rawData[6] * z;
                this.y = rawData[1] * x + rawData[4] * y + rawData[7] * z;
                this.z = rawData[2] * x + rawData[5] * y + rawData[8] * z;
            }
            else {
                this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
                this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
                this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;
            }
            return this;
        }

        /**
         * 将该向量或传入向量乘以一个 4x4 矩阵
         * - v *= matrix
         */
        public applyMatrix(matrix: Matrix4, input?: IVector3): this {
            input = input || this;
            let { x, y, z } = input;
            let rawData = matrix.rawData;
            let w = rawData[3] * x + rawData[7] * y + rawData[11] * z + rawData[15];
            if (w < -MathUtil.EPSILON || MathUtil.EPSILON < w) {
                w = 1 / w;
                this.x = (rawData[0] * x + rawData[4] * y + rawData[8] * z + rawData[12]) * w;
                this.y = (rawData[1] * x + rawData[5] * y + rawData[9] * z + rawData[13]) * w;
                this.z = (rawData[2] * x + rawData[6] * y + rawData[10] * z + rawData[14]) * w;
            }
            else {
                if (DEBUG) {
                    console.warn("除数为 0");
                }
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
            }
            return this;
        }

        /**
         * 将该向量或传入向量乘以一个矩阵
         * - v *= matrix
         * - 矩阵的平移数据不会影响向量
         * - 结果被归一化
         */
        public applyDirection(matrix: Matrix4, input?: IVector3): this {
            input = input || this;
            let { x, y, z } = input;
            let rawData = matrix.rawData;
            this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
            this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
            this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;
            return this.normalize();
        }

        /**
         * 将该向量或传入向量乘以一个四元数
         * - v *= quaternion
         * - v = input * quaternion
         */
        public applyQuaternion(quaternion: IVector4, input?: IVector3): this {
            input = input || this;
            let { x, y, z } = input;
            let qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;
            let ix = qw * x + qy * z - qz * y;
            let iy = qw * y + qz * x - qx * z;
            let iz = qw * z + qx * y - qy * x;
            let iw = - qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
            this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
            this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
            return this;
        }

        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        public normalize(input?: IVector3): this {
            input = input || this;
            let { x, y, z } = input;
            let l = Math.sqrt(x * x + y * y + z * z);
            if (l > MathUtil.EPSILON) {
                l = 1 / l;
                this.x = x * l;
                this.y = y * l;
                this.z = z * l;
            }
            else {
                this.x = 1;
                this.y = 0;
                this.z = 0;
            }
            return this;
        }

        /**
         * 归一化该向量，并使该向量垂直于自身或输入向量
         */
        public orthoNormal(input?: IVector3): this {
            input = input || this;
            let { x, y, z } = input;
            if (z > 0 ? z > MathUtil.SQRT1_2 : z < MathUtil.SQRT1_2) {
                let k = 1 / Math.sqrt(y * y + z * z);
                this.x = 0;
                this.y = -z * k;
                this.z = y * k;
            }
            else {
                let k = 1 / Math.sqrt(x * x + y * y);
                this.x = -y * k;
                this.y = x * k;
                this.z = 0;
            }
            return this;
        }

        /**
         * 反转该向量或传入的向量
         */
        public negate(input?: IVector3): this {
            input = input || this;
            this.x = -input.x;
            this.y = -input.y;
            this.z = -input.z;
            return this;
        }

        public equal(vector: IVector3, threshold: number = MathUtil.EPSILON): boolean {
            return Math.abs(this.x - vector.x) <= threshold && Math.abs(this.y - vector.y) <= threshold && Math.abs(this.z - vector.z) <= threshold;
        }

        public fromArray(array: number[] | Float32Array, offset: number = 0): this {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            return this;
        }

        public fromMatrixPosition(matrix: Matrix4): this {
            return this.fromArray(matrix.rawData, 12);
        }

        public fromMatrixColumn(matrix: Matrix4, index: 0 | 1 | 2): this {
            return this.fromArray(matrix.rawData, index * 4);
        }

        public toArray(array?: number[], offset: number = 0): number[] {
            array = array || [];
            array[0 + offset] = this.x;
            array[1 + offset] = this.y;
            array[2 + offset] = this.z;
            return array;
        }

        public copy(value: IVector3): this {
            return this.set(value.x, value.y, value.z);
        }

        public clone() {
            return new Vector3(this.x, this.y, this.z);
        }

        public clear(): this {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        }

        public onRecycle(): void {
            this.clear();
        }
    }
}

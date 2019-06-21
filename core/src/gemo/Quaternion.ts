namespace dou3d {
    /**
     * 四元数
     * @author wizardc
     */
    export class Quaternion extends Vector4 {
        /**
         * 恒等四元数
         */
        public static readonly IDENTITY: Readonly<Quaternion> = new Quaternion();

        /**
         * 线性插值
         */
        public static lerp(from: Quaternion, to: Quaternion, t: number, result?: Quaternion): Quaternion {
            result = result || new Quaternion();
            let fX = from.x, fY = from.y, fZ = from.z, fW = from.w;
            let tX = to.x, tY = to.y, tZ = to.z, tW = to.w;
            if (fX * tX + fY * tY + fZ * tZ + fW * tW < 0) {
                result.x = fX + (-tX - fX) * t;
                result.y = fY + (-tY - fY) * t;
                result.z = fZ + (-tZ - fZ) * t;
                result.w = fW + (-tW - fW) * t;
            }
            else {
                result.x = fX + (tX - fX) * t;
                result.y = fY + (tY - fY) * t;
                result.z = fZ + (tZ - fZ) * t;
                result.w = fW + (tW - fW) * t;
            }
            return result.normalize();
        }

        /**
         * 球形插值
         * @tutorial http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
         */
        public static slerp(from: Quaternion, to: Quaternion, t: number, result?: Quaternion): Quaternion {
            result = result || new Quaternion();
            let fX = from.x, fY = from.y, fZ = from.z, fW = from.w;
            let tX = to.x, tY = to.y, tZ = to.z, tW = to.w;
            let cosHalfTheta = fW * tW + fX * tX + fY * tY + fZ * tZ;
            if (cosHalfTheta < 0) {
                result.w = -tW;
                result.x = -tX;
                result.y = -tY;
                result.z = -tZ;
                cosHalfTheta = -cosHalfTheta;
            }
            else {
                result.w = tW;
                result.x = tX;
                result.y = tY;
                result.z = tZ;
            }
            if (cosHalfTheta >= 1) {
                result.w = fW;
                result.x = fX;
                result.y = fY;
                result.z = fZ;
                return result;
            }
            let sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
            if (sqrSinHalfTheta < MathUtil.EPSILON) {
                return this.lerp(from, result, t, result);
            }
            let sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            let ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            result.w = fW * ratioA + result.w * ratioB;
            result.x = fX * ratioA + result.x * ratioB;
            result.y = fY * ratioA + result.y * ratioB;
            result.z = fZ * ratioA + result.z * ratioB;
            return result;
        }

        /**
         * 通过旋转矩阵设置该四元数
         * - 旋转矩阵不应包含缩放值
         * @tutorial http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
         */
        public fromMatrix(rotateMatrix: Matrix4): this {
            let rawData = rotateMatrix.rawData;
            let m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            let m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            let m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];
            let trace = m11 + m22 + m33;
            let s = 0;
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1);
                this.w = 0.25 / s;
                this.x = (m32 - m23) * s;
                this.y = (m13 - m31) * s;
                this.z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2 * Math.sqrt(1 + m11 - m22 - m33);
                this.w = (m32 - m23) / s;
                this.x = 0.25 * s;
                this.y = (m12 + m21) / s;
                this.z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2 * Math.sqrt(1 + m22 - m11 - m33);
                this.w = (m13 - m31) / s;
                this.x = (m12 + m21) / s;
                this.y = 0.25 * s;
                this.z = (m23 + m32) / s;
            }
            else {
                s = 2 * Math.sqrt(1 + m33 - m11 - m22);
                this.w = (m21 - m12) / s;
                this.x = (m13 + m31) / s;
                this.y = (m23 + m32) / s;
                this.z = 0.25 * s;
            }
            return this;
        }

        /**
         * 通过欧拉旋转 (弧度制) 设置该四元数
         * @tutorial http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
         */
        public fromEuler(x: number, y: number, z: number, order: EulerOrder = EulerOrder.YXZ): this {
            let cos = Math.cos;
            let sin = Math.sin;
            let c1 = cos(x * 0.5);
            let c2 = cos(y * 0.5);
            let c3 = cos(z * 0.5);
            let s1 = sin(x * 0.5);
            let s2 = sin(y * 0.5);
            let s3 = sin(z * 0.5);
            switch (order) {
                case EulerOrder.XYZ:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;
                case EulerOrder.XZY:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
                case EulerOrder.YXZ:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
                case EulerOrder.YZX:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;
                case EulerOrder.ZXY:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;
                case EulerOrder.ZYX:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
            }
            return this;
        }

        /**
         * 通过旋转轴设置该四元数
         * - 假设旋转轴已被归一化
         * @param axis 旋转轴
         * @param angle 旋转角 (弧度制)
         * @tutorial http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
         */
        public fromAxis(axis: IVector3, angle: number): this {
            let halfAngle = angle * 0.5, s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);
            return this;
        }

        /**
         * 通过自起始方向到目标方向的旋转值设置该四元数
         * - 假设方向向量已被归一化
         */
        public fromVectors(from: Vector3, to: IVector3): this {
            let r = from.dot(to) + 1;
            let vector3 = dou.recyclable(Vector3);
            if (r < MathUtil.EPSILON) {
                r = 0;
                if (Math.abs(from.x) > Math.abs(from.z)) {
                    vector3.set(-from.y, from.x, 0);
                }
                else {
                    vector3.set(0, -from.z, from.y);
                }
            }
            else {
                vector3.cross(from, to);
            }
            this.x = vector3.x;
            this.y = vector3.y;
            this.z = vector3.z;
            this.w = r;
            vector3.recycle();
            return this.normalize();
        }

        /**
         * 将该四元数转换为欧拉旋转 (弧度制)
         */
        public toEuler(out?: IVector3, order: EulerOrder = EulerOrder.YXZ): IVector3 {
            out = out || new Vector3();
            let matrix = dou.recyclable(Matrix4);
            let result = matrix.fromRotation(this).toEuler(order, out);
            matrix.recycle();
            return result;
        }

        /**
         * 将该四元数乘以一个四元数或将两个四元数相乘的结果写入该四元数
         * - v *= q1
         * - v = q1 * q2
         * @tutorial http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
         */
        public multiply(q1: Quaternion, q2?: Quaternion): this {
            if (!q2) {
                q2 = q1;
                q1 = this;
            }
            let ax = q1.x, ay = q1.y, az = q1.z, aw = q1.w;
            let bx = q2.x, by = q2.y, bz = q2.z, bw = q2.w;
            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;
            return this;
        }

        /**
         * 旋转指定点
         */
        public transformVector(vector: IVector3, result?: IVector3): IVector3 {
            result = result || new Vector3();
            let x = this.x, y = this.y, z = this.z, w = this.w;
            let x2 = vector.x, y2 = vector.y, z2 = vector.z;
            let w1 = -x * x2 - y * y2 - z * z2;
            let x1 = w * x2 + y * z2 - z * y2;
            let y1 = w * y2 - x * z2 + z * x2;
            let z1 = w * z2 + x * y2 - y * x2;
            result.x = -w1 * x + x1 * w - y1 * z + z1 * y;
            result.y = -w1 * y + x1 * z + y1 * w - z1 * x;
            result.z = -w1 * z - x1 * y + y1 * x + z1 * w;
            return result;
        }

        /**
         * 设置该四元数, 使其与起始点到目标点的方向相一致
         */
        public lookAt(from: IVector3, to: IVector3, up: IVector3): this {
            let matrix = dou.recyclable(Matrix4);
            let result = this.fromMatrix(matrix.lookAt(from, to, up));
            matrix.recycle();
            return result;
        }

        /**
         * 设置该四元数, 使其与目标方向相一致
         */
        public lookRotation(vector: IVector3, up: IVector3): this {
            let matrix = dou.recyclable(Matrix4);
            let result = this.fromMatrix(matrix.lookRotation(vector, up));
            matrix.recycle();
            return result;
        }

        /**
         * 获取该四元数和一个四元数的夹角 (弧度制)
         */
        public getAngle(value: Quaternion): number {
            return 2 * Math.acos(Math.abs(MathUtil.clamp(this.dot(value), -1, 1)));
        }

        /**
         * 将该四元数转换为恒等四元数
         */
        public identity(): this {
            this.x = this.y = this.z = 0;
            this.w = 1;
            return this;
        }

        public clone(): Quaternion {
            return new Quaternion(this.x, this.y, this.z, this.w);
        }
    }
}

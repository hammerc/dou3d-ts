namespace dou3d {
    /**
     * 4x4 矩阵
     * 表示一个转换矩阵, 该矩阵确定三维显示对象的位置和方向
     * 该矩阵可以执行转换功能, 包括平移 (沿 x, y 和 z 轴重新定位), 旋转和缩放 (调整大小)
     * 该类还可以执行透视投影, 这会将 3D 坐标空间中的点映射到二维视图
     * ```
     *  ---                                   ---
     *  |   scaleX      0         0       0     |   x轴
     *  |     0       scaleY      0       0     |   y轴
     *  |     0         0       scaleZ    0     |   z轴
     *  |     tx        ty        tz      tw    |   平移
     *  ---                                   ---
     * 
     *  ---                                   ---
     *  |     0         1         2        3    |   x轴
     *  |     4         5         6        7    |   y轴
     *  |     8         9         10       11   |   z轴
     *  |     12        13        14       15   |   平移
     *  ---                                   ---
     * ```
     * @author wizardc
     */
    export class Matrix4 implements dou.ICacheable {
        /**
         * 一个静态的恒等矩阵
         */
        public static readonly IDENTITY: Readonly<Matrix4> = new Matrix4();

        /**
         * 线性插值
         */
        public static lerp(from: Matrix4, to: Matrix4, t: number, result?: Matrix4): Matrix4 {
            result = result || new Matrix4();
            let { rawData } = result;
            if (t == 0) {
                for (let i = 0; i < 16; i++) {
                    rawData[i] = from.rawData[i];
                }
                return result;
            }
            else if (t == 1) {
                for (let i = 0; i < 16; i++) {
                    rawData[i] = to.rawData[i];
                }
                return result;
            }
            for (let i = 0; i < 16; i++) {
                let fV = from.rawData[i];
                rawData[i] = fV + (to.rawData[i] - fV) * t;
            }
            return result;
        }

        public readonly rawData: Float32Array;

        public constructor(rawData?: number[], offsetOrByteOffset: number = 0) {
            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(16);
                this.fromArray(rawData || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            }
        }

        /**
         * 获取该矩阵的行列式
         * @tutorial https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
         */
        public get determinant(): number {
            let rawData = this.rawData;
            let n11 = rawData[0], n12 = rawData[4], n13 = rawData[8], n14 = rawData[12];
            let n21 = rawData[1], n22 = rawData[5], n23 = rawData[9], n24 = rawData[13];
            let n31 = rawData[2], n32 = rawData[6], n33 = rawData[10], n34 = rawData[14];
            let n41 = rawData[3], n42 = rawData[7], n43 = rawData[11], n44 = rawData[15];
            let n2332 = n23 * n32, n2432 = n24 * n32, n2233 = n22 * n33, n2433 = n24 * n33, n2234 = n22 * n34, n2334 = n23 * n34;
            let n2133 = n21 * n33, n2134 = n21 * n34, n2431 = n24 * n31, n2331 = n23 * n31, n2132 = n21 * n32, n2231 = n22 * n31;
            return (n41 * (n14 * n2332 - n13 * n2432 - n14 * n2233 + n12 * n2433 + n13 * n2234 - n12 * n2334) + n42 * (n11 * n2334 - n11 * n2433 + n14 * n2133 - n13 * n2134 + n13 * n2431 - n14 * n2331) + n43 * (n11 * n2432 - n11 * n2234 - n14 * n2132 + n12 * n2134 + n14 * n2231 - n12 * n2431) + n44 * (-n13 * n2231 - n11 * n2332 + n11 * n2233 + n13 * n2132 - n12 * n2133 + n12 * n2331));
        }

        /**
         * 获取该矩阵的最大缩放值
         */
        public get maxScaleOnAxis(): number {
            let rawData = this.rawData;
            let scaleXSq = rawData[0] * rawData[0] + rawData[1] * rawData[1] + rawData[2] * rawData[2];
            let scaleYSq = rawData[4] * rawData[4] + rawData[5] * rawData[5] + rawData[6] * rawData[6];
            let scaleZSq = rawData[8] * rawData[8] + rawData[9] * rawData[9] + rawData[10] * rawData[10];
            return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
        }

        public set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this {
            let { rawData } = this;
            rawData[0] = n11;
            rawData[4] = n12;
            rawData[8] = n13;
            rawData[12] = n14;
            rawData[1] = n21;
            rawData[5] = n22;
            rawData[9] = n23;
            rawData[13] = n24;
            rawData[2] = n31;
            rawData[6] = n32;
            rawData[10] = n33;
            rawData[14] = n34;
            rawData[3] = n41;
            rawData[7] = n42;
            rawData[11] = n43;
            rawData[15] = n44;
            return this;
        }

        /**
         * 通过平移向量、四元数旋转、缩放向量设置该矩阵
         * @param translation 平移向量
         * @param rotation 四元数旋转
         * @param scale 缩放向量
         */
        public compose(translation: IVector3, rotation: IVector4, scale: IVector3): this {
            let rX = rotation.x, rY = rotation.y, rZ = rotation.z, rW = rotation.w;
            let sX = scale.x, sY = scale.y, sZ = scale.z;
            let x2 = rX + rX, y2 = rY + rY, z2 = rZ + rZ;
            let xx = rX * x2, xy = rX * y2, xz = rX * z2;
            let yy = rY * y2, yz = rY * z2, zz = rZ * z2;
            let wx = rW * x2, wy = rW * y2, wz = rW * z2;
            let { rawData } = this;
            rawData[0] = (1 - (yy + zz)) * sX;
            rawData[1] = (xy + wz) * sX;
            rawData[2] = (xz - wy) * sX;
            rawData[4] = (xy - wz) * sY;
            rawData[5] = (1 - (xx + zz)) * sY;
            rawData[6] = (yz + wx) * sY;
            rawData[8] = (xz + wy) * sZ;
            rawData[9] = (yz - wx) * sZ;
            rawData[10] = (1 - (xx + yy)) * sZ;
            rawData[12] = translation.x;
            rawData[13] = translation.y;
            rawData[14] = translation.z;
            rawData[3] = rawData[7] = rawData[11] = 0, rawData[15] = 1;
            return this;
        }

        /**
         * 将该矩阵分解为平移向量、四元数旋转、缩放向量
         * @param translation 平移向量
         * @param rotation 四元数旋转
         * @param scale 缩放向量
         */
        public decompose(translation?: IVector3, rotation?: Quaternion, scale?: IVector3): this {
            let { rawData } = this;
            if (translation) {
                translation.x = rawData[12];
                translation.y = rawData[13];
                translation.z = rawData[14];
            }
            if (rotation || scale) {
                let vector = dou.recyclable(Vector3);
                let sx = vector.set(rawData[0], rawData[1], rawData[2]).length;
                let sy = vector.set(rawData[4], rawData[5], rawData[6]).length;
                let sz = vector.set(rawData[8], rawData[9], rawData[10]).length;
                if (this.determinant < 0) {
                    sx = -sx;
                }
                if (rotation) {
                    let matrix = dou.recyclable(Matrix4);
                    let helpRawData = matrix.rawData;
                    let invSX = 1 / sx;
                    let invSY = 1 / sy;
                    let invSZ = 1 / sz;
                    matrix.copy(this);
                    helpRawData[0] *= invSX;
                    helpRawData[1] *= invSX;
                    helpRawData[2] *= invSX;
                    helpRawData[4] *= invSY;
                    helpRawData[5] *= invSY;
                    helpRawData[6] *= invSY;
                    helpRawData[8] *= invSZ;
                    helpRawData[9] *= invSZ;
                    helpRawData[10] *= invSZ;
                    rotation.fromMatrix(matrix);
                    matrix.recycle();
                }
                if (scale) {
                    scale.x = sx;
                    scale.y = sy;
                    scale.z = sz;
                }
                vector.recycle();
            }
            return this;
        }

        /**
         * 提取该矩阵的旋转分量或提取传入矩阵的旋转分量写入该矩阵
         */
        public extractRotation(input?: Matrix4): this {
            input = input || this;
            let { rawData } = this;
            let inputRawData = input.rawData;
            let vector = dou.recyclable(Vector3);
            let scaleX = 1 / vector.fromMatrixColumn(input, 0).length;
            let scaleY = 1 / vector.fromMatrixColumn(input, 1).length;
            let scaleZ = 1 / vector.fromMatrixColumn(input, 2).length;
            rawData[0] = inputRawData[0] * scaleX;
            rawData[1] = inputRawData[1] * scaleX;
            rawData[2] = inputRawData[2] * scaleX;
            rawData[3] = 0;
            rawData[4] = inputRawData[4] * scaleY;
            rawData[5] = inputRawData[5] * scaleY;
            rawData[6] = inputRawData[6] * scaleY;
            rawData[7] = 0;
            rawData[8] = inputRawData[8] * scaleZ;
            rawData[9] = inputRawData[9] * scaleZ;
            rawData[10] = inputRawData[10] * scaleZ;
            rawData[11] = 0;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;
            vector.recycle();
            return this;
        }

        /**
         * 转置该矩阵或将传入矩阵转置的结果写入该矩阵
         */
        public transpose(input?: Matrix4): this {
            input = input || this;
            let { rawData } = this;
            let inputRawData = input.rawData;
            let temp = 0;
            temp = inputRawData[1];
            rawData[1] = inputRawData[4];
            rawData[4] = temp;
            temp = inputRawData[2];
            rawData[2] = inputRawData[8];
            rawData[8] = temp;
            temp = inputRawData[6];
            rawData[6] = inputRawData[9];
            rawData[9] = temp;
            temp = inputRawData[3];
            rawData[3] = inputRawData[12];
            rawData[12] = temp;
            temp = inputRawData[7];
            rawData[7] = inputRawData[13];
            rawData[13] = temp;
            temp = inputRawData[11];
            rawData[11] = inputRawData[14];
            rawData[14] = temp;
            return this;
        }

        /**
         * 将该矩阵求逆或将传入矩阵的逆矩阵写入该矩阵
         */
        public inverse(input?: Matrix4): this {
            input = input || this;
            let { rawData } = this;
            let valueRawData = input.rawData;
            let n11 = valueRawData[0], n12 = valueRawData[4], n13 = valueRawData[8], n14 = valueRawData[12];
            let n21 = valueRawData[1], n22 = valueRawData[5], n23 = valueRawData[9], n24 = valueRawData[13];
            let n31 = valueRawData[2], n32 = valueRawData[6], n33 = valueRawData[10], n34 = valueRawData[14];
            let n41 = valueRawData[3], n42 = valueRawData[7], n43 = valueRawData[11], n44 = valueRawData[15];
            let n2332 = n23 * n32, n2432 = n24 * n32, n2233 = n22 * n33, n2433 = n24 * n33, n2234 = n22 * n34, n2334 = n23 * n34;
            let n2133 = n21 * n33, n2134 = n21 * n34, n2431 = n24 * n31, n2331 = n23 * n31, n2132 = n21 * n32, n2231 = n22 * n31;
            let t11 = n2334 * n42 - n2433 * n42 + n2432 * n43 - n2234 * n43 - n2332 * n44 + n2233 * n44;
            let t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
            let t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
            let t14 = n14 * n2332 - n13 * n2432 - n14 * n2233 + n12 * n2433 + n13 * n2234 - n12 * n2334;
            let determinant = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
            if (determinant == 0) {
                if (DEBUG) {
                    console.warn("Cannot invert matrix, determinant is 0.");
                }
                return this.identity();
            }
            let detInv = 1 / determinant;
            rawData[0] = t11 * detInv;
            rawData[1] = (n2433 * n41 - n2334 * n41 - n2431 * n43 + n2134 * n43 + n2331 * n44 - n2133 * n44) * detInv;
            rawData[2] = (n2234 * n41 - n2432 * n41 + n2431 * n42 - n2134 * n42 - n2231 * n44 + n2132 * n44) * detInv;
            rawData[3] = (n2332 * n41 - n2233 * n41 - n2331 * n42 + n2133 * n42 + n2231 * n43 - n2132 * n43) * detInv;
            rawData[4] = t12 * detInv;
            rawData[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
            rawData[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
            rawData[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
            rawData[8] = t13 * detInv;
            rawData[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
            rawData[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
            rawData[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
            rawData[12] = t14 * detInv;
            rawData[13] = (n13 * n2431 - n14 * n2331 + n14 * n2133 - n11 * n2433 - n13 * n2134 + n11 * n2334) * detInv;
            rawData[14] = (n14 * n2231 - n12 * n2431 - n14 * n2132 + n11 * n2432 + n12 * n2134 - n11 * n2234) * detInv;
            rawData[15] = (n12 * n2331 - n13 * n2231 + n13 * n2132 - n11 * n2332 - n12 * n2133 + n11 * n2233) * detInv;
            return this;
        }

        /**
         * 将该矩阵乘以一个标量或将传入矩阵与一个标量相乘的结果写入该矩阵
         * - v *= scaler
         */
        public multiplyScalar(scalar: number, input?: Matrix4): this {
            input = input || this;
            let { rawData } = this;
            let inputRawData = input.rawData;
            rawData[0] = inputRawData[0] * scalar;
            rawData[1] = inputRawData[1] * scalar;
            rawData[2] = inputRawData[2] * scalar;
            rawData[3] = inputRawData[3] * scalar;
            rawData[4] = inputRawData[4] * scalar;
            rawData[5] = inputRawData[5] * scalar;
            rawData[6] = inputRawData[6] * scalar;
            rawData[7] = inputRawData[7] * scalar;
            rawData[8] = inputRawData[8] * scalar;
            rawData[9] = inputRawData[9] * scalar;
            rawData[10] = inputRawData[10] * scalar;
            rawData[11] = inputRawData[11] * scalar;
            rawData[12] = inputRawData[12] * scalar;
            rawData[13] = inputRawData[13] * scalar;
            rawData[14] = inputRawData[14] * scalar;
            rawData[15] = inputRawData[15] * scalar;
            return this;
        }

        /**
         * 将该矩阵乘以一个矩阵或将两个矩阵相乘的结果写入该矩阵
         * - v *= matrix
         * - v = matrixA * matrixB
         */
        public multiply(matrixA: Matrix4, matrixB?: Matrix4): this {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }
            let { rawData } = this;
            let rawDataA = matrixA.rawData;
            let rawDataB = matrixB.rawData;
            let a11 = rawDataA[0], a12 = rawDataA[4], a13 = rawDataA[8], a14 = rawDataA[12];
            let a21 = rawDataA[1], a22 = rawDataA[5], a23 = rawDataA[9], a24 = rawDataA[13];
            let a31 = rawDataA[2], a32 = rawDataA[6], a33 = rawDataA[10], a34 = rawDataA[14];
            let a41 = rawDataA[3], a42 = rawDataA[7], a43 = rawDataA[11], a44 = rawDataA[15];
            let b11 = rawDataB[0], b12 = rawDataB[4], b13 = rawDataB[8], b14 = rawDataB[12];
            let b21 = rawDataB[1], b22 = rawDataB[5], b23 = rawDataB[9], b24 = rawDataB[13];
            let b31 = rawDataB[2], b32 = rawDataB[6], b33 = rawDataB[10], b34 = rawDataB[14];
            let b41 = rawDataB[3], b42 = rawDataB[7], b43 = rawDataB[11], b44 = rawDataB[15];
            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            rawData[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            rawData[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            rawData[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            rawData[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            rawData[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            rawData[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            rawData[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            rawData[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            rawData[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            rawData[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            rawData[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            rawData[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return this;
        }

        /**
         * 将该矩阵乘以一个矩阵来之后前置一个矩阵或将两个矩阵相乘来前置一个矩阵的结果写入该矩阵
         */
        public append(matrixA: Matrix4, matrixB?: Matrix4): this {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }
            let { rawData } = this;
            let rawDataA = matrixA.rawData;
            let rawDataB = matrixB.rawData;
            let a11 = rawDataA[0], a21 = rawDataA[4], a31 = rawDataA[8], a41 = rawDataA[12];
            let a12 = rawDataA[1], a22 = rawDataA[5], a32 = rawDataA[9], a42 = rawDataA[13];
            let a13 = rawDataA[2], a23 = rawDataA[6], a33 = rawDataA[10], a43 = rawDataA[14];
            let a14 = rawDataA[3], a24 = rawDataA[7], a34 = rawDataA[11], a44 = rawDataA[15];
            let b11 = rawDataB[0], b21 = rawDataB[4], b31 = rawDataB[8], b41 = rawDataB[12];
            let b12 = rawDataB[1], b22 = rawDataB[5], b32 = rawDataB[9], b42 = rawDataB[13];
            let b13 = rawDataB[2], b23 = rawDataB[6], b33 = rawDataB[10], b43 = rawDataB[14];
            let b14 = rawDataB[3], b24 = rawDataB[7], b34 = rawDataB[11], b44 = rawDataB[15];
            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            rawData[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            rawData[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            rawData[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            rawData[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            rawData[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            rawData[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            rawData[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            rawData[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            rawData[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            rawData[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            rawData[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            rawData[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return this;
        }

        /**
         * 转换指定点
         */
        public transformVector(vector: IVector3, result?: IVector4): IVector4 {
            result = result || new Vector4();
            let x = vector.x, y = vector.y, z = vector.z;
            let rawData = this.rawData;
            result.x = x * rawData[0] + y * rawData[4] + z * rawData[8] + rawData[12];
            result.y = x * rawData[1] + y * rawData[5] + z * rawData[9] + rawData[13];
            result.z = x * rawData[2] + y * rawData[6] + z * rawData[10] + rawData[14];
            result.w = x * rawData[3] + y * rawData[7] + z * rawData[11] + rawData[15];
            return result;
        }

        /**
         * 根据投影参数设置该矩阵
         * @param offsetX 投影近平面水平偏移
         * @param offsetY 投影远平面垂直偏移
         * @param near 投影近平面
         * @param far 投影远平面
         * @param fov 投影视角
         * - 透视投影时生效
         * @param size 投影尺寸
         * - 正交投影时生效
         * @param opvalue 透视投影和正交投影的插值系数
         * - `0.0` ~ `1.0`
         * - `0.0` 正交投影
         * - `1.0` 透视投影
         * @param asp 投影宽高比
         * @param matchFactor 宽高适配的插值系数
         * - `0.0` ~ `1.0`
         * - `0.0` 以宽适配
         * - `1.0` 以高适配
         */
        public fromProjection(near: number, far: number, fov: number, size: number, opvalue: number, asp: number, matchFactor: number, viewport?: Rectangle): this {
            let orthographicMatrix = dou.recyclable(Matrix4);
            matchFactor = 1 - matchFactor;
            let offsetX = (viewport ? -viewport.x : 0) - 0.5;
            let offsetY = (viewport ? viewport.y : 0) + 0.5;
            let scaleX = viewport ? viewport.w : 1;
            let scaleY = viewport ? viewport.h : 1;
            if (opvalue > 0) {
                let wh = 2 * near * Math.tan(fov * 0.5);
                let heightX = wh;
                let widthX = asp * heightX;
                let leftX = offsetX * widthX;
                let topX = offsetY * heightX;
                let widthY = wh;
                let heightY = widthY / asp;
                let leftY = offsetX * widthY;
                let topY = offsetY * heightY;
                let left = leftX + (leftY - leftX) * matchFactor;
                let top = topX + (topY - topX) * matchFactor;
                let width = (widthX + (widthY - widthX) * matchFactor) * scaleX;
                let height = (heightX + (heightY - heightX) * matchFactor) * scaleY;
                this.perspectiveProjectMatrix(left, left + width, top, top - height, near, far);
            }
            if (opvalue < 1) {
                let widthX = size * asp;
                let heightX = size;
                let leftX = offsetX * widthX;
                let topX = offsetY * heightX;
                let widthY = size;
                let heightY = size / asp;
                let leftY = offsetX * widthY;
                let topY = offsetY * heightY;
                let left = leftX + (leftY - leftX) * matchFactor;
                let top = topX + (topY - topX) * matchFactor;
                let width = (widthX + (widthY - widthX) * matchFactor) * scaleX;
                let height = (heightX + (heightY - heightX) * matchFactor) * scaleY;
                orthographicMatrix.orthographicProjectMatrix(left, left + width, top, top - height, near, far);
            }
            if (opvalue == 0) {
                this.copy(orthographicMatrix);
            }
            else if (opvalue == 1) {
            }
            else {
                Matrix4.lerp(orthographicMatrix, this, Math.pow(opvalue, 8), this);
            }
            orthographicMatrix.recycle();
            return this;
        }

        /**
         * 透视矩阵
         */
        public perspectiveProjectMatrix(left: number, right: number, top: number, bottom: number, near: number, far: number): this {
            let iDeltaX = 1 / (right - left);
            let iDeltaY = 1 / (top - bottom);
            let iDeltaZ = 1 / (near - far);
            let doubleNear = 2 * near;
            let { rawData } = this;
            rawData[0] = doubleNear * iDeltaX;
            rawData[1] = rawData[2] = rawData[3] = 0;
            rawData[4] = rawData[6] = rawData[7] = 0;
            rawData[5] = doubleNear * iDeltaY;
            rawData[8] = (right + left) * iDeltaX;
            rawData[9] = (top + bottom) * iDeltaY;
            rawData[10] = -(far + near) * iDeltaZ;
            rawData[11] = 1;
            rawData[12] = rawData[13] = rawData[15] = 0;
            rawData[14] = doubleNear * far * iDeltaZ;
            return this;
        }

        /**
         * 正交矩阵
         */
        public orthographicProjectMatrix(left: number, right: number, top: number, bottom: number, near: number, far: number): this {
            let w = 1 / (right - left);
            let h = 1 / (top - bottom);
            let p = 1 / (near - far);
            let { rawData } = this;
            rawData[0] = 2 * w;
            rawData[1] = rawData[2] = rawData[3] = 0;
            rawData[4] = rawData[6] = rawData[7] = 0;
            rawData[5] = 2 * h;
            rawData[8] = rawData[9] = rawData[11] = 0;
            rawData[10] = -2 * p;
            rawData[12] = -(right + left) * w;
            rawData[13] = - (top + bottom) * h;
            rawData[14] = (far + near) * p;
            rawData[15] = 1;
            return this;
        }

        /**
         * 设置该矩阵, 使其 Z 轴正方向与起始点到目标点的方向相一致
         * - 矩阵的缩放值将被覆盖
         * @param from 起始点
         * @param to 目标点
         * @param up 
         */
        public lookAt(from: IVector3, to: IVector3, up: IVector3): this {
            let vector = dou.recyclable(Vector3);
            this.lookRotation(vector.subtract(to, from), up);
            vector.recycle();
            return this;
        }

        /**
         * 设置该矩阵, 使其 Z 轴正方向与目标方向相一致
         * - 矩阵的缩放值将被覆盖
         * @param vector 目标方向
         * @param up 
         */
        public lookRotation(vector: IVector3, up: IVector3): this {
            let vector1 = dou.recyclable(Vector3);
            let vector2 = dou.recyclable(Vector3);
            let vector3 = dou.recyclable(Vector3);
            let z = vector1.normalize(vector);
            let x = vector2.cross(up, z).normalize(vector2);
            let y = vector3.cross(z, x);
            let { rawData } = this;
            rawData[0] = x.x;
            rawData[4] = y.x;
            rawData[8] = z.x;
            rawData[1] = x.y;
            rawData[5] = y.y;
            rawData[9] = z.y;
            rawData[2] = x.z;
            rawData[6] = y.z;
            rawData[10] = z.z;
            vector1.recycle();
            vector2.recycle();
            vector3.recycle();
            return this;
        }

        public fromArray(array: number[] | Float32Array, offset: number = 0): this {
            let { rawData } = this;
            if (offset > 0) {
                for (let i = 0; i < 16; ++i) {
                    rawData[i] = array[i + offset];
                }
            }
            else {
                for (let i = 0; i < 16; ++i) {
                    rawData[i] = array[i];
                }
            }
            return this;
        }

        public fromBuffer(buffer: ArrayBuffer, byteOffset: number = 0): this {
            (this.rawData as Float32Array) = new Float32Array(buffer, byteOffset, 16);
            return this;
        }

        /**
         * 通过平移向量设置该矩阵
         * @param translate 平移向量
         * @param rotationAndScaleStays 是否保留该矩阵的旋转数据
         */
        public fromTranslate(translate: IVector3, rotationAndScaleStays: boolean = false): this {
            if (!rotationAndScaleStays) {
                this.identity();
            }
            let { rawData } = this;
            rawData[12] = translate.x;
            rawData[13] = translate.y;
            rawData[14] = translate.z;
            return this;
        }

        /**
         * 通过四元数旋转设置该矩阵
         * @param rotation 四元数旋转
         * @param translateStays 是否保留该矩阵的平移数据
         */
        public fromRotation(rotation: IVector4, translateStays: boolean = false): this {
            let vector = dou.recyclable(Vector3);
            let result = this.compose(translateStays ? vector.fromArray(this.rawData, 12) : Vector3.ZERO, rotation, Vector3.ONE);
            vector.recycle();
            return result;
        }

        /**
         * 通过欧拉旋转设置该矩阵
         * @param euler 欧拉旋转
         * @param order 欧拉旋转顺序
         * @param translateStays 是否保留该矩阵的平移数据
         * @tutorial http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
         */
        public fromEuler(euler: IVector3, order: EulerOrder = EulerOrder.YXZ, translateStays: boolean = false): this {
            let cos = Math.cos;
            let sin = Math.sin;
            let { x, y, z } = euler;
            let a = cos(x), b = sin(x);
            let c = cos(y), d = sin(y);
            let e = cos(z), f = sin(z);
            let { rawData } = this;
            switch (order) {
                case EulerOrder.XYZ: {
                    let ae = a * e, af = a * f, be = b * e, bf = b * f;
                    rawData[0] = c * e;
                    rawData[4] = -c * f;
                    rawData[8] = d;
                    rawData[1] = af + be * d;
                    rawData[5] = ae - bf * d;
                    rawData[9] = -b * c;
                    rawData[2] = bf - ae * d;
                    rawData[6] = be + af * d;
                    rawData[10] = a * c;
                    break;
                }
                case EulerOrder.XZY: {
                    let ac = a * c, ad = a * d, bc = b * c, bd = b * d;
                    rawData[0] = c * e;
                    rawData[4] = -f;
                    rawData[8] = d * e;
                    rawData[1] = ac * f + bd;
                    rawData[5] = a * e;
                    rawData[9] = ad * f - bc;
                    rawData[2] = bc * f - ad;
                    rawData[6] = b * e;
                    rawData[10] = bd * f + ac;
                    break;
                }
                case EulerOrder.YXZ: {
                    let ce = c * e, cf = c * f, de = d * e, df = d * f;
                    rawData[0] = ce + df * b;
                    rawData[4] = de * b - cf;
                    rawData[8] = a * d;
                    rawData[1] = a * f;
                    rawData[5] = a * e;
                    rawData[9] = -b;
                    rawData[2] = cf * b - de;
                    rawData[6] = df + ce * b;
                    rawData[10] = a * c;
                    break;
                }
                case EulerOrder.YZX: {
                    let ac = a * c, ad = a * d, bc = b * c, bd = b * d;
                    rawData[0] = c * e;
                    rawData[4] = bd - ac * f;
                    rawData[8] = bc * f + ad;
                    rawData[1] = f;
                    rawData[5] = a * e;
                    rawData[9] = -b * e;
                    rawData[2] = -d * e;
                    rawData[6] = ad * f + bc;
                    rawData[10] = ac - bd * f;
                    break;
                }
                case EulerOrder.ZXY: {
                    let ce = c * e, cf = c * f, de = d * e, df = d * f;
                    rawData[0] = ce - df * b;
                    rawData[4] = -a * f;
                    rawData[8] = de + cf * b;
                    rawData[1] = cf + de * b;
                    rawData[5] = a * e;
                    rawData[9] = df - ce * b;
                    rawData[2] = -a * d;
                    rawData[6] = b;
                    rawData[10] = a * c;
                    break;
                }
                case EulerOrder.ZYX: {
                    let ae = a * e, af = a * f, be = b * e, bf = b * f;
                    rawData[0] = c * e;
                    rawData[4] = be * d - af;
                    rawData[8] = ae * d + bf;
                    rawData[1] = c * f;
                    rawData[5] = bf * d + ae;
                    rawData[9] = af * d - be;
                    rawData[2] = -d;
                    rawData[6] = b * c;
                    rawData[10] = a * c;
                    break;
                }
            }
            rawData[3] = rawData[7] = rawData[11] = 0;
            if (!translateStays) {
                rawData[12] = rawData[13] = rawData[14] = 0;
                rawData[15] = 1;
            }
            return this;
        }

        /**
         * 通过缩放向量设置该矩阵
         * @param scale 缩放向量
         * @param translateStays 是否保留该矩阵的平移数据
         */
        public fromScale(scale: IVector3, translateStays: boolean = false): this {
            let vector = dou.recyclable(Vector3);
            if (translateStays) {
                vector.fromArray(this.rawData, 12);
            }
            this.identity();
            let { rawData } = this;
            rawData[0] = scale.x;
            rawData[5] = scale.y;
            rawData[10] = scale.z;
            if (translateStays) {
                rawData[12] = vector.x;
                rawData[13] = vector.y;
                rawData[14] = vector.z;
            }
            vector.recycle();
            return this;
        }

        /**
         * 通过绕 X 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        public fromRotationX(angle: number): this {
            let c = Math.cos(angle), s = Math.sin(angle);
            return this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
        }

        /**
         * 通过绕 Y 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        public fromRotationY(angle: number): this {
            let c = Math.cos(angle), s = Math.sin(angle);
            return this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
        }

        /**
         * 通过绕 Z 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        public fromRotationZ(angle: number): this {
            let c = Math.cos(angle), s = Math.sin(angle);
            return this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }

        /**
         * 通过旋转轴设置该矩阵
         * - 假设旋转轴已被归一化
         * @param axis 旋转轴
         * @param angle 旋转角
         * - 弧度制
         * @tutorial http://www.gamedev.net/reference/articles/article1199.asp
         */
        public fromAxis(axis: IVector3, angle: number): this {
            let c = Math.cos(angle);
            let s = Math.sin(angle);
            let t = 1 - c;
            let x = axis.x, y = axis.y, z = axis.z;
            let tx = t * x, ty = t * y;
            return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        }

        /**
         * 通过 X、Y、Z 轴设置该矩阵
         */
        public fromAxises(axisX: IVector3, axisY: IVector3, axisZ: IVector3): this {
            return this.set(axisX.x, axisY.x, axisZ.x, 0, axisX.y, axisY.y, axisZ.y, 0, axisX.z, axisY.z, axisZ.z, 0, 0, 0, 0, 1);
        }

        public toArray(array?: number[], offset: number = 0): number[] {
            array = array || [];
            let { rawData } = this;
            if (offset > 0) {
                for (let i = 0; i < 16; ++i) {
                    array[i + offset] = rawData[i];
                }
            }
            else {
                for (let i = 0; i < 16; ++i) {
                    array[i] = rawData[i];
                }
            }
            return array;
        }

        /**
         * 将该旋转矩阵转换为欧拉旋转
         * - 弧度制
         */
        public toEuler(order: EulerOrder = EulerOrder.YXZ, result?: IVector3): IVector3 {
            result = result || new Vector3();
            let rawData = this.rawData;
            let m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            let m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            let m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];
            switch (order) {
                case EulerOrder.XYZ: {
                    result.y = Math.asin(MathUtil.clamp(m13, -1, 1));
                    if (Math.abs(m13) < 0.999999) {
                        result.x = Math.atan2(-m23, m33);
                        result.z = Math.atan2(-m12, m11);
                    }
                    else {
                        result.x = Math.atan2(m32, m22);
                        result.z = 0;
                    }
                    break;
                }
                case EulerOrder.XZY: {
                    result.z = Math.asin(-MathUtil.clamp(m12, -1, 1));
                    if (Math.abs(m12) < 0.999999) {
                        result.x = Math.atan2(m32, m22);
                        result.y = Math.atan2(m13, m11);
                    }
                    else {
                        result.x = Math.atan2(-m23, m33);
                        result.y = 0;
                    }
                    break;
                }
                case EulerOrder.YXZ: {
                    result.x = Math.asin(-MathUtil.clamp(m23, -1, 1));
                    if (Math.abs(m23) < 0.999999) {
                        result.y = Math.atan2(m13, m33);
                        result.z = Math.atan2(m21, m22);
                    }
                    else {
                        result.y = Math.atan2(-m31, m11);
                        result.z = 0;
                    }
                    break;
                }
                case EulerOrder.YZX: {
                    result.z = Math.asin(MathUtil.clamp(m21, -1, 1));
                    if (Math.abs(m21) < 0.999999) {
                        result.x = Math.atan2(-m23, m22);
                        result.y = Math.atan2(-m31, m11);
                    }
                    else {
                        result.x = 0;
                        result.y = Math.atan2(m13, m33);
                    }
                    break;
                }
                case EulerOrder.ZXY: {
                    result.x = Math.asin(MathUtil.clamp(m32, -1, 1));
                    if (Math.abs(m32) < 0.999999) {
                        result.y = Math.atan2(-m31, m33);
                        result.z = Math.atan2(-m12, m22);
                    }
                    else {
                        result.y = 0;
                        result.z = Math.atan2(m21, m11);
                    }
                    break;
                }
                case EulerOrder.ZYX: {
                    result.y = Math.asin(-MathUtil.clamp(m31, -1, 1));
                    if (Math.abs(m31) < 0.999999) {
                        result.x = Math.atan2(m32, m33);
                        result.z = Math.atan2(m21, m11);
                    }
                    else {
                        result.x = 0;
                        result.z = Math.atan2(-m12, m22);
                    }
                    break;
                }
            }
            return result;
        }

        public copy(target: Matrix4): this {
            return this.fromArray(target.rawData);
        }

        public clone(): Matrix4 {
            let value = new Matrix4();
            value.copy(this);
            return value;
        }

        public identity(): this {
            let { rawData } = this;
            rawData[0] = 1;
            rawData[1] = rawData[2] = rawData[3] = 0;
            rawData[4] = rawData[6] = rawData[7] = 0;
            rawData[5] = 1;
            rawData[8] = rawData[9] = rawData[11] = 0;
            rawData[10] = 1;
            rawData[12] = rawData[13] = rawData[14] = 0;
            rawData[15] = 1;
            return this;
        }

        public onRecycle(): void {
            this.identity();
        }
    }
}

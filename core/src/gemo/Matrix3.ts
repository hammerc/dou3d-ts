namespace dou3d {
    /**
     * 3×3 矩阵
     * @author wizardc
     */
    export class Matrix3 implements dou.ICacheable {
        /**
         * 一个静态的恒等矩阵
         */
        public static readonly IDENTITY: Readonly<Matrix3> = new Matrix3();

        public readonly rawData: Float32Array;

        public constructor(rawData?: number[], offsetOrByteOffset: number = 0) {
            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(9);
                this.fromArray(rawData || [1, 0, 0, 0, 1, 0, 0, 0, 1]);
            }
        }

        /**
         * 当前矩阵行列式的值
         */
        public get determinant(): number {
            let rawData = this.rawData;
            let a = rawData[0], b = rawData[1], c = rawData[2], d = rawData[3], e = rawData[4], f = rawData[5], g = rawData[6], h = rawData[7], i = rawData[8];
            return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
        }

        public set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this {
            let rawData = this.rawData;
            rawData[0] = n11; rawData[1] = n21; rawData[2] = n31;
            rawData[3] = n12; rawData[4] = n22; rawData[5] = n32;
            rawData[6] = n13; rawData[7] = n23; rawData[8] = n33;
            return this;
        }

        public getNormalMatrix(matrix4: Matrix4): this {
            return this.fromMatrix4(matrix4).inverse().transpose();
        }

        /**
         * 反转当前矩阵或传入的矩阵
         */
        public inverse(input?: Matrix3): this {
            input = input || this;
            let me = input.rawData, te = this.rawData, n11 = me[0], n21 = me[1], n31 = me[2], n12 = me[3], n22 = me[4], n32 = me[5], n13 = me[6], n23 = me[7], n33 = me[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
            if (det === 0) {
                return this.identity();
            }
            let detInv = 1 / det;
            te[0] = t11 * detInv;
            te[1] = (n31 * n23 - n33 * n21) * detInv;
            te[2] = (n32 * n21 - n31 * n22) * detInv;
            te[3] = t12 * detInv;
            te[4] = (n33 * n11 - n31 * n13) * detInv;
            te[5] = (n31 * n12 - n32 * n11) * detInv;
            te[6] = t13 * detInv;
            te[7] = (n21 * n13 - n23 * n11) * detInv;
            te[8] = (n22 * n11 - n21 * n12) * detInv;
            return this;
        }

        /**
         * 转置矩阵
         */
        public transpose(): this {
            let temp = 0;
            let rawData = this.rawData;
            temp = rawData[1];
            rawData[1] = rawData[3];
            rawData[3] = temp;
            temp = rawData[2];
            rawData[2] = rawData[6];
            rawData[6] = temp;
            temp = rawData[5];
            rawData[5] = rawData[7];
            rawData[7] = temp;
            return this;
        }

        /**
         * 将该矩阵乘以一个矩阵或将两个矩阵相乘的结果写入该矩阵
         * - v *= matrix
         * - v = matrixA * matrixB
         */
        public multiply(matrixA: Readonly<Matrix3>, matrixB?: Readonly<Matrix3>): this {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }
            let rawDataA = matrixA.rawData;
            let rawDataB = matrixB.rawData;
            let rawData = this.rawData;
            let a11 = rawDataA[0], a12 = rawDataA[3], a13 = rawDataA[6];
            let a21 = rawDataA[1], a22 = rawDataA[4], a23 = rawDataA[7];
            let a31 = rawDataA[2], a32 = rawDataA[5], a33 = rawDataA[8];
            let b11 = rawDataB[0], b12 = rawDataB[3], b13 = rawDataB[6];
            let b21 = rawDataB[1], b22 = rawDataB[4], b23 = rawDataB[7];
            let b31 = rawDataB[2], b32 = rawDataB[5], b33 = rawDataB[8];
            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31;
            rawData[3] = a11 * b12 + a12 * b22 + a13 * b32;
            rawData[6] = a11 * b13 + a12 * b23 + a13 * b33;
            rawData[1] = a21 * b11 + a22 * b21 + a23 * b31;
            rawData[4] = a21 * b12 + a22 * b22 + a23 * b32;
            rawData[7] = a21 * b13 + a22 * b23 + a23 * b33;
            rawData[2] = a31 * b11 + a32 * b21 + a33 * b31;
            rawData[5] = a31 * b12 + a32 * b22 + a33 * b32;
            rawData[8] = a31 * b13 + a32 * b23 + a33 * b33;
            return this;
        }

        public fromArray(value: number[] | Float32Array, offset: number = 0): this {
            for (let i = 0; i < 9; ++i) {
                this.rawData[i] = value[i + offset];
            }
            return this;
        }

        public fromBuffer(value: ArrayBuffer, byteOffset: number = 0): this {
            (this.rawData as Float32Array) = new Float32Array(value, byteOffset, 9);
            return this;
        }

        public fromScale(vector: IVector3): this {
            let rawData = this.rawData;
            rawData[0] = vector.x;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = vector.y;
            rawData[5] = 0;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = vector.z;
            return this;
        }

        /**
         * 通过 UV 变换设置该矩阵
         * @param offsetX 水平偏移
         * @param offsetY 垂直偏移
         * @param repeatX 水平重复
         * @param repeatY 垂直重复
         * @param rotation 旋转 (弧度制)
         * @param pivotX 水平中心
         * @param pivotY 垂直中心
         */
        public fromUVTransform(offsetX: number, offsetY: number, repeatX: number, repeatY: number, rotation: number = 0, pivotX: number = 0, pivotY: number = 0): this {
            let cos = Math.cos(rotation);
            let sin = Math.sin(rotation);
            return this.set(repeatX * cos, repeatX * sin, -repeatX * (cos * pivotX + sin * pivotY) + pivotX + offsetX, -repeatY * sin, repeatY * cos, -repeatY * (-sin * pivotX + cos * pivotY) + pivotY + offsetY, 0, 0, 1);
        }

        public fromMatrix4(value: Matrix4): this {
            let rawData = value.rawData;
            this.set(rawData[0], rawData[4], rawData[8], rawData[1], rawData[5], rawData[9], rawData[2], rawData[6], rawData[10]);
            return this;
        }

        public toArray(array?: number[], offset: number = 0): number[] {
            array = array || [];
            for (let i = 0; i < 9; ++i) {
                array[i + offset] = this.rawData[i];
            }
            return array;
        }

        public copy(value: Readonly<Matrix3>):this {
            this.fromArray(value.rawData);
            return this;
        }

        public clone(): Matrix3 {
            let value = new Matrix3();
            value.copy(this);
            return value;
        }

        public identity(): this {
            let rawData = this.rawData;
            rawData[0] = 1;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = 1;
            rawData[5] = 0;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = 1;
            return this;
        }

        public onRecycle(): void {
            this.identity();
        }
    }
}

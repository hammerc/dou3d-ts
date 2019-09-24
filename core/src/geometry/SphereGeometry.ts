namespace dou3d {
    /**
     * 球体
     * @author wizardc
     */
    export class SphereGeometry extends Geometry {
        private _segmentsW: number;
        private _radius: number;
        private _segmentsH: number;

        public constructor(r: number = 100, segmentsW: number = 15, segmentsH: number = 15) {
            super();
            this._radius = r;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this.buildSphere(true);
        }

        public get segmentsW(): number {
            return this._segmentsW;
        }

        public get segmentsH(): number {
            return this._segmentsH;
        }

        public get radius(): number {
            return this._radius;
        }

        private buildSphere(front: boolean = true) {
            this.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0 | VertexFormat.VF_UV1;
            let i = 0, j = 0, triIndex = 0;
            let numVerts = (this._segmentsH + 1) * (this._segmentsW + 1);
            let stride = this.vertexAttLength;
            let skip = stride - 9;
            this.vertexCount = numVerts;
            this.indexCount = (this._segmentsH - 1) * this._segmentsW * 6;
            let startIndex = 0;
            let index = 0;
            let comp1 = 0, comp2 = 0, t1 = 0, t2 = 0;
            for (j = 0; j <= this._segmentsH; ++j) {
                startIndex = index;
                let horangle = Math.PI * j / this._segmentsH;
                let z = -this._radius * Math.cos(horangle);
                let ringradius = this._radius * Math.sin(horangle);
                for (i = 0; i <= this._segmentsW; ++i) {
                    let verangle = 2 * Math.PI * i / this._segmentsW;
                    let x = ringradius * Math.cos(verangle);
                    let y = ringradius * Math.sin(verangle);
                    let normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                    let tanLen = Math.sqrt(y * y + x * x);
                    t1 = 0;
                    t2 = tanLen > .007 ? x / tanLen : 0;
                    comp1 = -z;
                    comp2 = y;
                    if (i == this._segmentsW) {
                        this.vertexArray[index++] = this.vertexArray[startIndex];
                        this.vertexArray[index++] = this.vertexArray[startIndex + 1];
                        this.vertexArray[index++] = this.vertexArray[startIndex + 2];
                        this.vertexArray[index++] = x * normLen;;
                        this.vertexArray[index++] = comp1 * normLen;;
                        this.vertexArray[index++] = comp2 * normLen;;
                        this.vertexArray[index++] = tanLen > .007 ? -y / tanLen : 1;
                        this.vertexArray[index++] = t1;
                        this.vertexArray[index++] = t2;
                        this.vertexArray[index + 0] = 1.0;
                        this.vertexArray[index + 1] = 1.0;
                        this.vertexArray[index + 2] = 1.0;
                        this.vertexArray[index + 3] = 1.0;
                    }
                    else {
                        this.vertexArray[index++] = x;
                        this.vertexArray[index++] = comp1;
                        this.vertexArray[index++] = comp2;
                        this.vertexArray[index++] = x * normLen;
                        this.vertexArray[index++] = comp1 * normLen;
                        this.vertexArray[index++] = comp2 * normLen;
                        this.vertexArray[index++] = tanLen > .007 ? -y / tanLen : 1;
                        this.vertexArray[index++] = t1;
                        this.vertexArray[index++] = t2;
                        this.vertexArray[index] = 1.0;
                        this.vertexArray[index + 1] = 1.0;
                        this.vertexArray[index + 2] = 1.0;
                        this.vertexArray[index + 3] = 1.0;
                    }
                    if (i > 0 && j > 0) {
                        let a = (this._segmentsW + 1) * j + i;
                        let b = (this._segmentsW + 1) * j + i - 1;
                        let c = (this._segmentsW + 1) * (j - 1) + i - 1;
                        let d = (this._segmentsW + 1) * (j - 1) + i;
                        if (j == this._segmentsH) {
                            this.vertexArray[index - 9] = this.vertexArray[startIndex];
                            this.vertexArray[index - 8] = this.vertexArray[startIndex + 1];
                            this.vertexArray[index - 7] = this.vertexArray[startIndex + 2];
                            if (front) {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = d;
                                this.indexArray[triIndex++] = c;
                            }
                            else {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = d;
                            }
                        }
                        else if (j == 1) {
                            if (front) {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = b;
                            }
                            else {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = b;
                                this.indexArray[triIndex++] = c;
                            }
                        }
                        else {
                            if (front) {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = d
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = b;
                            }
                            else {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c
                                this.indexArray[triIndex++] = d;
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = b;
                                this.indexArray[triIndex++] = c;
                            }
                        }
                    }
                    index += skip;
                }
            }
            stride = 17;
            let numUvs = (this._segmentsH + 1) * (this._segmentsW + 1) * stride;
            let data: number[];
            skip = stride - 2;
            index = 13;
            for (j = 0; j <= this._segmentsH; ++j) {
                for (i = 0; i <= this._segmentsW; ++i) {
                    this.vertexArray[index++] = (i / this._segmentsW);
                    this.vertexArray[index++] = (j / this._segmentsH);
                    index += skip;
                }
            }
            let subGeometry = new SubGeometry();
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        }
    }
}

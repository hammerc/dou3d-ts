namespace dou3d {
    /**
     * 平面
     * @author wizardc
     */
    export class PlaneGeometry extends Geometry {
        private _wCenter: boolean;
        private _hCenter: boolean;
        private _segmentsW: number;
        private _segmentsH: number;
        private _width: number;
        private _height: number;
        private _scaleU: number;
        private _scaleV: number;

        public constructor(width: number = 500, height: number = 500, segmentsW: number = 1, segmentsH: number = 1, uScale: number = 1, vScale: number = 1, wCenter: boolean = true, hCenter: boolean = true) {
            super();
            this._width = width;
            this._height = height;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this._scaleU = uScale;
            this._scaleV = vScale;
            this._wCenter = wCenter;
            this._hCenter = hCenter;
            this.buildGeometry();
        }

        public get segmentsW(): number {
            return this._segmentsW;
        }

        public get segmentsH(): number {
            return this._segmentsH;
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        public get scaleU(): number {
            return this._scaleU;
        }

        public get scaleV(): number {
            return this._scaleV;
        }

        private buildGeometry(): void {
            this.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0;
            let x: number, y: number;
            let numIndices: number;
            let base: number;
            let tw = this._segmentsW + 1;
            let numVertices = (this._segmentsH + 1) * tw;
            let stride = this.vertexAttLength;
            let skip = stride - 15;
            numIndices = this._segmentsH * this._segmentsW * 6;
            this.vertexCount = numVertices;
            this.indexCount = numIndices;
            numIndices = 0;
            let index = 0;
            for (let yi = 0; yi <= this._segmentsH; ++yi) {
                for (let xi = 0; xi <= this._segmentsW; ++xi) {
                    x = (xi / this._segmentsW - .5) * this._width;
                    y = (yi / this._segmentsH - .5) * this._height;
                    if (this._wCenter == false) {
                        x += this._width / 2;
                    }
                    if (this._hCenter == false) {
                        y += this._height / 2;
                    }
                    this.vertexArray[index++] = x;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = y;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = (xi / this._segmentsW) * this._scaleU;
                    this.vertexArray[index++] = (1 - yi / this._segmentsH) * this._scaleV;
                    index += skip;
                    if (xi != this._segmentsW && yi != this._segmentsH) {
                        base = xi + yi * tw;
                        let mult = 1;
                        this.indexArray[numIndices++] = base * mult;
                        this.indexArray[numIndices++] = (base + tw + 1) * mult;
                        this.indexArray[numIndices++] = (base + tw) * mult;
                        this.indexArray[numIndices++] = base * mult;
                        this.indexArray[numIndices++] = (base + 1) * mult;
                        this.indexArray[numIndices++] = (base + tw + 1) * mult;
                    }
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

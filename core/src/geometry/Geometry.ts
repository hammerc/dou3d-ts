namespace dou3d {
    /**
     * 几何形状
     * * 注意: 当使用 vertexArray 或 indexArray 必须先设置 vertexCount 或 indexCount
     * @author wizardc
     */
    export class Geometry extends Reference {
        /**
         * 顶点坐标大小
         */
        public static readonly positionSize: number = 3;

        /**
         * 顶点法线大小
         */
        public static readonly normalSize: number = 3;

        /**
         * 顶点切线大小
         */
        public static readonly tangentSize: number = 3;

        /**
         * 顶点色大小
         */
        public static readonly colorSize: number = 4;

        /**
         * 顶点uv大小
         */
        public static readonly uvSize: number = 2;

        /**
         * 顶点uv2大小
         */
        public static readonly uv2Size: number = 2;

        /**
         * 顶点uv2大小
         */
        public static readonly skinSize: number = 8;

        /**
         * 绘制类型
         */
        public drawType: number = Context3DProxy.gl.STATIC_DRAW;

        /**
         * 顶点格式
         */
        private _vertexFormat: number = 0;

        /**
         * 顶点属性长度
         */
        public vertexAttLength: number = 0;

        /**
         * 顶点数据
         */
        public vertexArray: Float32Array;

        /**
         * 索引数据
         */
        public indexArray: Uint16Array;

        /**
         * shader buffer
         */
        public sharedVertexBuffer: VertexBuffer3D;

        /**
         * shader index
         */
        public sharedIndexBuffer: IndexBuffer3D;

        /**
         * 顶点字节数
         */
        public vertexSizeInBytes: number;

        /**
         * 面翻转，仅对系统 geometry 有效
         */
        public faceOrBack: boolean = false;

        /**
         * geometry子集
         */
        public subGeometrys: SubGeometry[] = [];

        /**
         * buffer 需要重新提交的时候
         */
        private _bufferDiry: boolean = true;

        /**
         * 顶点的数量
         */
        private _vertexCount: number = 0;

        /**
         * 索引数量
         */
        private _indexCount: number = 0;

        /**
         * 当前索引数量的最大值
         */
        private _totalIndexCount: number = 0;

        /**
         * 三角形面数
         */
        public _faceCount: number = 0;

        private _skeleton: Skeleton;

        /**
         * 骨骼动画会上传到 GPU 的数据
         */
        public skeletonGPUData: Float32Array;

        public set bufferDiry(value: boolean) {
            this._bufferDiry = value;
        }
        public get bufferDiry(): boolean {
            return this._bufferDiry;
        }

        /**
         * 设置顶点的数量
         * * 同时 this.vertexArray = new Float32Array(this.vertexAttLength * this.vertexCount);
         */
        public set vertexCount(value: number) {
            if (this._vertexCount == value) {
                return;
            }
            let dataCount = value * this.vertexAttLength;
            let data: Float32Array = null;
            if (this.vertexArray) {
                if (this.vertexCount < value) {
                    data = new Float32Array(dataCount);
                    data.set(this.vertexArray);
                }
                else {
                    data = this.vertexArray;
                }
            }
            else {
                data = new Float32Array(dataCount);
            }
            this.vertexArray = data;
            this._vertexCount = value;
        }
        public get vertexCount(): number {
            return this._vertexCount;
        }

        /**
         * 索引的数量
         */
        public get indexCount(): number {
            return this._indexCount;
        }

        /**
         * 设置索引的数量
         * * 同时 this.indexArray = new Uint16Array(this._indexCount);
         */
        public set indexCount(value: number) {
            this._indexCount = value;
            this._faceCount = value / 3;
            if (this._totalIndexCount >= value) {
                return;
            }
            let data = new Uint16Array(value);
            if (this.indexArray) {
                data.set(this.indexArray);
            }
            this.indexArray = data;
            this._totalIndexCount = value;
        }

        /**
         * 模型面数
         */
        public set faceCount(value: number) {
            if (this._faceCount == value) {
                return;
            }
            this.indexCount = value * 3;
            this._faceCount = value;
        }
        public get faceCount(): number {
            return this._faceCount;
        }

        /**
         * 定义顶点数据结构
         * * 设置后, 就会增加这样的数据顶点数据结构, 如果源文件中没有这样的数据结构就会通过计算的方式计算补全, 不能计算的就默认为 0
         * @param vertexFormat 需要定义的顶点格式类型 VertexFormat.VF_COLOR | VertexFormat.VF_UV1
         * @example this.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_COLOR |  VertexFormat.VF_UV0 | VertexFormat.VF_UV1; //定义了一个完整的数据结构
         */
        public set vertexFormat(vertexFormat: number) {
            this._vertexFormat = vertexFormat;
            if (this.vertexFormat & VertexFormat.VF_POSITION) {
                this.vertexAttLength += Geometry.positionSize;
            }
            if (this.vertexFormat & VertexFormat.VF_NORMAL) {
                this.vertexAttLength += Geometry.normalSize;
            }
            if (this.vertexFormat & VertexFormat.VF_TANGENT) {
                this.vertexAttLength += Geometry.tangentSize;
            }
            if (this.vertexFormat & VertexFormat.VF_COLOR) {
                this.vertexAttLength += Geometry.colorSize;
            }
            if (this.vertexFormat & VertexFormat.VF_UV0) {
                this.vertexAttLength += Geometry.uvSize;
            }
            if (this.vertexFormat & VertexFormat.VF_UV1) {
                this.vertexAttLength += Geometry.uv2Size;
            }
            if (this.vertexFormat & VertexFormat.VF_SKIN) {
                this.vertexAttLength += Geometry.skinSize;
            }
            this.vertexSizeInBytes = this.vertexAttLength * 4;
        }
        public get vertexFormat(): number {
            return this._vertexFormat;
        }

        /**
         * 当前模型的骨骼
         */
        public set skeleton(skeleton: Skeleton) {
            if (!skeleton) {
                return;
            }
            this._skeleton = skeleton;
            this.skeletonGPUData = new Float32Array(skeleton.jointNum * 8);
            for (var i: number = 0; i < skeleton.jointNum; ++i) {
                this.skeletonGPUData[i * 8 + 3] = 1;
                this.skeletonGPUData[i * 8 + 7] = 1;
            }
        }
        public get skeleton(): Skeleton {
            return this._skeleton;
        }

        /**
         * 由顶点索引根据格式拿到顶点数据
         * @param index 顶点索引
         * @param vf 得到顶点的需要的数据格式
         * @param target 获取的数据
         * @param count 得到顶点个数, 默认一个
         * @returns 获取的数据
         */
        public getVertexForIndex(index: number, vf: VertexFormat, target?: number[], count: number = 1): number[] {
            target = target || [];
            if (index < 0 || index >= this.vertexCount) {
                return target;
            }
            for (let i = 0; i < count; ++i) {
                let offset = 0;
                if (vf & VertexFormat.VF_POSITION) {
                    if (this.vertexFormat & VertexFormat.VF_POSITION) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                    }
                    else {
                        target.push(0, 0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_POSITION) {
                    offset += Geometry.positionSize;
                }
                if (vf & VertexFormat.VF_NORMAL) {
                    if (this.vertexFormat & VertexFormat.VF_NORMAL) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                    }
                    else {
                        target.push(0, 0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_NORMAL) {
                    offset += Geometry.normalSize;
                }
                if (vf & VertexFormat.VF_TANGENT) {
                    if (this.vertexFormat & VertexFormat.VF_TANGENT) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                    }
                    else {
                        target.push(0, 0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_TANGENT) {
                    offset += Geometry.tangentSize;

                }
                if (vf & VertexFormat.VF_COLOR) {
                    if (this.vertexFormat & VertexFormat.VF_COLOR) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 3]);
                    }
                    else {
                        target.push(0, 0, 0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_COLOR) {
                    offset += Geometry.colorSize;
                }
                if (vf & VertexFormat.VF_UV0) {
                    if (this.vertexFormat & VertexFormat.VF_UV0) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                    }
                    else {
                        target.push(0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_UV0) {
                    offset += Geometry.uvSize;
                }
                if (vf & VertexFormat.VF_UV1) {
                    if (this.vertexFormat & VertexFormat.VF_UV1) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                    }
                    else {
                        target.push(0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_UV1) {
                    offset += Geometry.uv2Size;
                }
                if (vf & VertexFormat.VF_SKIN) {
                    if (this.vertexFormat & VertexFormat.VF_SKIN) {
                        for (let j = 0; j < Geometry.skinSize; ++j) {
                            target.push(this.vertexArray[index * this.vertexAttLength + offset + j]);
                        }
                    }
                    else {
                        target.push(0, 0, 0, 0, 0, 0, 0, 0);
                    }
                }
                if (this.vertexFormat & VertexFormat.VF_SKIN) {
                    offset += Geometry.skinSize;
                }
                index++;
            }
            return target;
        }

        /**
         * 由顶点索引根据格式设置顶点数据
         * @param index 顶点索引
         * @param vf 设置顶点的需要的数据格式
         * @param src 设置的数据
         * @param vertexCount 设置的顶点数量
         */
        public setVerticesForIndex(index: number, vf: VertexFormat, src: number[], vertexCount: number = 1): void {
            if (index + vertexCount > this.vertexCount) {
                this.vertexCount = index + vertexCount;
            }
            this._bufferDiry = true;
            let offset = 0;
            let srcOffset = 0;
            for (let i = 0; i < vertexCount; ++i) {
                offset = 0;
                if (this.vertexFormat & VertexFormat.VF_POSITION) {
                    if (vf & VertexFormat.VF_POSITION) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                    }
                    offset += Geometry.positionSize;
                }
                if (vf & VertexFormat.VF_POSITION) {
                    srcOffset += Geometry.positionSize;
                }
                if (this.vertexFormat & VertexFormat.VF_NORMAL) {
                    if (vf & VertexFormat.VF_NORMAL) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                    }
                    offset += Geometry.normalSize;
                }
                if (vf & VertexFormat.VF_NORMAL) {
                    srcOffset += Geometry.normalSize;
                }
                if (this.vertexFormat & VertexFormat.VF_TANGENT) {
                    if (vf & VertexFormat.VF_TANGENT) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                    }
                    offset += Geometry.tangentSize;
                }
                if (vf & VertexFormat.VF_TANGENT) {
                    srcOffset += Geometry.tangentSize;
                }
                if (this.vertexFormat & VertexFormat.VF_COLOR) {
                    if (vf & VertexFormat.VF_COLOR) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                        this.vertexArray[index * this.vertexAttLength + offset + 3] = src[srcOffset + 3];
                    }
                    else {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = 1;
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = 1;
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = 1;
                        this.vertexArray[index * this.vertexAttLength + offset + 3] = 1;
                    }
                    offset += Geometry.colorSize;
                }
                if (vf & VertexFormat.VF_COLOR) {
                    srcOffset += Geometry.colorSize;
                }
                if (this.vertexFormat & VertexFormat.VF_UV0) {
                    if (vf & VertexFormat.VF_UV0) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                    }
                    offset += Geometry.uvSize;
                }
                if (vf & VertexFormat.VF_UV0) {
                    srcOffset += Geometry.uvSize;
                }
                if (this.vertexFormat & VertexFormat.VF_UV1) {
                    if (vf & VertexFormat.VF_UV1) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                    }
                    offset += Geometry.uv2Size;
                }
                if (vf & VertexFormat.VF_UV1) {
                    srcOffset += Geometry.uv2Size;
                }
                if (this.vertexFormat & VertexFormat.VF_SKIN) {
                    if (vf & VertexFormat.VF_SKIN) {
                        for (let j = 0; j < Geometry.skinSize; ++j) {
                            this.vertexArray[index * this.vertexAttLength + offset + j] = src[srcOffset + j];
                        }
                    }
                    offset += Geometry.skinSize;
                }
                if (vf & VertexFormat.VF_SKIN) {
                    srcOffset += Geometry.skinSize;
                }
                index++;
            }
        }

        /**
         * 获取顶点索引数据
         * @param start 数据开始位置
         * @param count 需要的索引数据, 默认参数为 -1, 如果为 -1 那么取从 start 后面的所有索引数据
         * @param target 获取的数据
         * @returns 获取的数据
         */
        public getVertexIndices(start: number, count: number = -1, target: number[] = null): number[] {
            target = target || [];
            if (start >= this.indexCount) {
                return target;
            }
            count == -1 ? count = this.indexCount : count;
            if (start + count > this.indexCount) {
                count = this.indexCount - start;
            }
            for (let i = 0; i < count; ++i) {
                target[i] = this.indexArray[i + start];
            }
            return target;
        }

        /**
         * 设置顶点索引数据
         * @param start 数据开始位置
         * @param indices 数据
         */
        public setVertexIndices(start: number, indices: number[]): void {
            if (start + indices.length > this.indexCount) {
                this.indexCount = start + indices.length;
            }
            for (let i = 0; i < indices.length; ++i) {
                this.indexArray[start + i] = indices[i];
            }
        }

        public activeState(context3DProxy: Context3DProxy): void {
            if (this._bufferDiry) {
                this._bufferDiry = false;
                this.upload(context3DProxy, this.drawType);
            }
            context3DProxy.bindVertexBuffer(this.sharedVertexBuffer);
            context3DProxy.bindIndexBuffer(this.sharedIndexBuffer);
        }

        /**
         * 提交顶点数据, 如果顶点数据有变化的话, 需要调用此函数重新提交
         */
        public upload(context3DProxy: Context3DProxy, drawType: number = Context3DProxy.gl.STATIC_DRAW): void {
            if (!this.sharedIndexBuffer && !this.sharedVertexBuffer) {
                this.sharedIndexBuffer = context3DProxy.createIndexBuffer(this.indexArray);
                this.sharedVertexBuffer = context3DProxy.createVertexBuffer(this.vertexArray, drawType);
            }
            else {
                context3DProxy.uploadVertexBuffer(this.sharedVertexBuffer);
                context3DProxy.uploadIndexBuffer(this.sharedIndexBuffer);
            }
        }

        public buildDefaultSubGeometry(): void {
            let subGeometry = new SubGeometry();
            subGeometry.matID = 0;
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        }

        public dispose(): void {
            this.decRef();
            if (this.canDispose) {
                if (this.sharedIndexBuffer) {
                    this.sharedIndexBuffer.dispose();
                    this.sharedIndexBuffer = null;
                }
                if (this.sharedVertexBuffer) {
                    this.sharedVertexBuffer.dispose();
                    this.sharedVertexBuffer = null;
                }
                this.vertexArray = null;
                this.indexArray = null;
                this.subGeometrys = [];
            }
        }
    }
}

namespace dou3d {
    /**
     * 顶点数据
     * @author wizardc
     */
    export class VertexBuffer3D {
        private _buffer: WebGLBuffer;
        private _arrayBuffer: Float32Array;

        public constructor(buffer: WebGLBuffer, arrayBuffer: Float32Array) {
            this._buffer = buffer;
            this._arrayBuffer = arrayBuffer;
        }

        public get buffer(): WebGLBuffer {
            return this._buffer;
        }

        public get arrayBuffer(): Float32Array {
            return this._arrayBuffer;
        }

        public dispose(): void {
            if (this._buffer) {
                Context3DProxy.gl.deleteBuffer(this._buffer);
                this._buffer = null;
            }
            if (this._arrayBuffer) {
                this._arrayBuffer = null;
            }
        }
    }
}

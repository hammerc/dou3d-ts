namespace dou3d {
    /**
     * 顶点索引缓冲
     * @author wizardc
     */
    export class IndexBuffer3D {
        private _buffer: WebGLBuffer;
        private _arrayBuffer: Uint16Array;

        constructor(buffer: WebGLBuffer, arrayBuffer: Uint16Array) {
            this._buffer = buffer;
            this._arrayBuffer = arrayBuffer;
        }

        public get buffer(): WebGLBuffer {
            return this._buffer;
        }

        public get arrayBuffer(): Uint16Array {
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

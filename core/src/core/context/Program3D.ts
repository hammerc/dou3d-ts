namespace dou3d {
    /**
     * 渲染程序
     * @author wizardc
     */
    export class Program3D {
        private static ID: number = 0;

        private _id: number;
        private _program: WebGLProgram;

        public constructor(program: WebGLProgram) {
            this._id = Program3D.ID++;
            this._program = program;
        }

        public get id(): number {
            return this._id;
        }

        public get program(): WebGLProgram {
            return this._program;
        }

        public dispose(): void {
            if (this._program) {
                Context3DProxy.gl.deleteProgram(this._program);
                this._program = null;
            }
        }
    }
}

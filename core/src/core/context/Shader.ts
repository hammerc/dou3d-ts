namespace dou3d {
    /**
     * 着色器
     * @author wizardc
     */
    export class Shader {
        private static ID: number = 0;

        private _id: string;
        private _shader: WebGLShader;

        public constructor(shader: WebGLShader) {
            this._id = "" + Shader.ID++;
            this._shader = shader;
        }

        public set id(value: string) {
            this._id = value;
        }
        public get id(): string {
            return this._id;
        }

        public get shader(): WebGLShader {
            return this._shader;
        }

        public dispose(): void {
            if (this._shader) {
                Context3DProxy.gl.deleteShader(this._shader);
                this._shader = null;
            }
        }
    }
}

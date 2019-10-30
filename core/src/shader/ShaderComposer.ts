namespace dou3d {
    /**
     * 着色器组合器
     * * 添加多个需要使用的着色器片段, 得到最终可以使用的着色器
     * @author wizardc
     */
    export class ShaderComposer {
        protected _shadersName: string[] = [];
        protected _endShadername: string = "";

        private _shaderType: number = -1;
        private _shader: Shader;

        public constructor(type: number) {
            this._shaderType = type;
        }

        public get shaderType(): number {
            return this._shaderType;
        }

        public set shader(value: Shader) {
            this._shader = value;
        }
        public get shader(): Shader {
            return this._shader;
        }

        public addUseShaderName(shaderName: string) {
            this._shadersName.push(shaderName);
        }

        public addEndShaderName(shaderName: string) {
            this._endShadername = shaderName;
        }

        public getShader(passUsage: PassUsage): Shader {
            if (this._endShadername) {
                let index = this._shadersName.indexOf(this._endShadername);
                if (index == -1) {
                    this._shadersName.push(this._endShadername);
                }
            }
            return ShaderUtil.fillShaderContent(this, this._shadersName, passUsage);
        }
    }
}

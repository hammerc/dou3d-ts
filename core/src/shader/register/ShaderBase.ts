namespace dou3d {
    /**
     * 着色器基类
     * @author wizardc
     */
    export class ShaderBase {
        protected index: number = 0;
        protected shadersName: string[] = [];
        protected endShadername: string = "";
        protected stateChange: boolean = false;

        public maxBone: number = 0;
        public shaderType: number = -1;
        public shader: Shader;

        public constructor(type: number) {
            this.shaderType = type;
        }

        public addUseShaderName(shaderName: string) {
            this.shadersName.push(shaderName);
        }

        public addEndShaderName(shaderName: string) {
            this.endShadername = shaderName;
        }

        public getShader(passUsage: PassUsage): Shader {
            if (this.endShadername != "") {
                var index: number = this.shadersName.indexOf(this.endShadername);
                if (index == -1) {
                    this.shadersName.push(this.endShadername);
                }
            }
            return ShaderUtil.instance.fillShaderContent(this, this.shadersName, passUsage);
        }
    }
}

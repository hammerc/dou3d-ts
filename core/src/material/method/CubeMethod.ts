namespace dou3d {
    /**
     * 立方体渲染方法
     * @author wizardc
     */
    export class CubeMethod extends MethodBase {
        constructor() {
            super();
            this.vsShaderList[ShaderPhaseType.vertex_2] = this.fsShaderList[ShaderPhaseType.vertex_2] || [];
            this.vsShaderList[ShaderPhaseType.vertex_2].push("cube_vs");
            this.fsShaderList[ShaderPhaseType.diffuse_fragment] = this.fsShaderList[ShaderPhaseType.diffuse_fragment] || [];
            this.fsShaderList[ShaderPhaseType.diffuse_fragment].push("cube_fs");
        }

        public upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void {
        }

        public activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void {
        }
    }
}

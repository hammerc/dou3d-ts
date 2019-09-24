namespace dou3d {
    /**
     * 渲染方法基类
     * @author wizardc
     */
    export abstract class MethodBase {
        /**
         * 顶点着色器列表
         */
        public vsShaderList: { [shaderPhaseType: number]: string[] } = [];

        /**
         * 片段着色器列表
         */
        public fsShaderList: { [shaderPhaseType: number]: string[] } = [];

        /**
         * 材质数据
         */
        public materialData: MaterialData;

        public abstract upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;

        public abstract activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;

        public dispose(): void {
        }
    }
}

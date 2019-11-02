namespace dou3d {
    /**
     * 方法中需要用到的数据
     * @author wizardc
     */
    export class PassUsage {
        /** 顶点位置 */
        public attribute_position: Attribute;
        /** 顶点法线 */
        public attribute_normal: Attribute;
        /** 顶点切线 */
        public attribute_tangent: Attribute;
        /** 顶点颜色 */
        public attribute_color: Attribute;
        /** 第一套 UV */
        public attribute_uv0: Attribute;
        /** 第二套 UV, 一般用于场景灯光烘焙 */
        public attribute_uv1: Attribute;

        /** 骨骼索引, 最多包含 4 个索引 */
        public attribute_boneIndex: Attribute;
        /** 骨骼权重 */
        public attribute_boneWeight: Attribute;

        /** 模型全局转换信息矩阵 */
        public uniform_ModelMatrix: Uniform;

        /** 摄像机全局转换信息矩阵 */
        public uniform_cameraMatrix: Uniform;
        /** 摄像机全局转换信息逆矩阵 */
        public uniform_ViewMatrix: Uniform;
        /** 摄像机投影矩阵 */
        public uniform_ProjectionMatrix: Uniform;
        /** 摄像机全局转换信息逆矩阵乘与摄像机投影矩阵之后的矩阵 */
        public uniform_ViewProjectionMatrix: Uniform;
        /** 摄像机正交投影矩阵 */
        public uniform_orthProectMatrix: Uniform;
        /** 摄像机本地坐标位置信息 */
        public uniform_eyepos: Uniform;

        /** 材质自身的一些信息数据 */
        public uniform_materialSource: Uniform;

        /** 方向光信息 */
        public uniform_directLightSource: Uniform;
        /** 点光源信息 */
        public uniform_pointLightSource: Uniform;
        /** 聚光灯信息 */
        public uniform_spotLightSource: Uniform;

        /** 阴影渲染摄像机 uniform_ViewProjectionMatrix 矩阵 */
        public uniform_ShadowMatrix: Uniform;
        /** 阴影颜色 */
        public uniform_ShadowColor: Uniform;

        /** 骨骼动画骨骼相关造型数据 */
        public uniform_PoseMatrix: Uniform;
        /** 骨骼动画的当前时间 */
        public uniform_time: Uniform;

        /** 2D 采样器 */
        public sampler2DList: Sampler2D[] = [];
        /** 立方体采样器 */
        public sampler3DList: Sampler3D[] = [];

        /** 片段着色器 */
        public vertexShader: ShaderComposer;
        /** 顶点着色器 */
        public fragmentShader: ShaderComposer;
        /** 对应的渲染程序 */
        public program3D: Program3D;

        /** 方向光数量 */
        public maxDirectLight: number = 0;
        /** 对应的方向光数据 */
        public directLightData: Float32Array;

        /** 点光源数量 */
        public maxPointLight: number = 0;
        /** 对应的点光源数据 */
        public pointLightData: Float32Array;

        /** 聚光灯数量 */
        public maxSpotLight: number = 0;
        /** 对应的聚光灯数据 */
        public spotLightData: Float32Array;

        /** 骨骼数量 */
        public maxBone: number = 0;

        /** 存放当前使用到的所有属性 */
        public attributeList: Attribute[];

        /** 属性是否改变, 改变后需要重新提交 */
        public attributeDiry: boolean = true;

        public constructor() {
            this.vertexShader = new ShaderComposer(ShaderType.vertex);
            this.fragmentShader = new ShaderComposer(ShaderType.fragment);
        }

        public dispose(): void {
            if (this.program3D) {
                this.program3D.dispose();
            }
            this.program3D = null;
            if (this.vertexShader && this.vertexShader.shader) {
                this.vertexShader.shader.dispose();
            }
            this.vertexShader = null;
            if (this.fragmentShader && this.fragmentShader.shader) {
                this.fragmentShader.shader.dispose();
            }
            this.fragmentShader = null;
        }
    }
}

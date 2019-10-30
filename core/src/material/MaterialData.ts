namespace dou3d {
    /**
     * 材质渲染数据
     * @author wizardc
     */
    export class MaterialData {
        /**
         * 着色器阶段记录表
         * 渲染通道类型 -> 着色器片段类型数组
         */
        public shaderPhaseTypes: { [passType: number]: ShaderPhaseType[] } = {};

        /**
         * 绘制模式
         */
        public drawMode: number = Context3DProxy.gl.TRIANGLES;

        /**
         * 是否开启 MipMap
         */
        public useMipmap: boolean = true;

        /**
         * 阴影贴图
         */
        public shadowMapTexture: TextureBase;

        /**
         * 漫反射贴图
         */
        public diffuseTexture: TextureBase;

        /**
         * 立方体漫反射贴图
         */
        public diffuseTexture3D: TextureBase;

        /**
         * 法线贴图
         */
        public normalTexture: TextureBase;

        /**
         * 高光贴图
         */
        public specularTexture: TextureBase;

        /**
         * 投射阴影
         */
        public castShadow: boolean = false;

        /**
         * 接受阴影
         */
        public acceptShadow: boolean = false;

        /**
         * 阴影颜色
         */
        public shadowColor: Float32Array = new Float32Array([0.2, 0.2, 0.2, 0.003]);

        /**
         * 深度测试
         */
        public depthTest: boolean = true;

        /**
         * 深度测试模式
         */
        public depthMode: number = 0;

        /**
         * 混合模式
         */
        public blendMode: BlendMode = BlendMode.NORMAL;

        /**
         * 混合 src 值
         */
        public blendSrc: number;

        /**
         * 混合 dest 值
         */
        public blendDest: number;

        /**
         * 透明混合
         */
        public alphaBlending: boolean = false;

        /**
         * 环境光颜色
         */
        public ambientColor: number = 0x333333;

        /**
         * 漫反射颜色
         */
        public diffuseColor: number = 0xffffff;

        /**
         * 高光颜色
         */
        public specularColor: number = 0xffffff;

        /**
         * 色相
         */
        public tintColor: number = 0x80808080;

        /**
         * 材质球的高光强度
         */
        public specularLevel: number = 4;

        /**
         * 材质球的光滑度
         */
        public gloss: number = 20;

        /**
         * 透明度小于该值的像素完全透明
         */
        public cutAlpha: number = 0.7;

        /**
         * 是否重复
         */
        public repeat: boolean = false;

        /**
         * 是否进行双面渲染
         */
        public bothside: boolean = false;

        /**
         * 透明度
         */
        public alpha: number = 1;

        /**
         * 反射颜色的强度值，出射光照的出射率
         */
        public albedo: number = 0.95;

        /**
         * uv 在贴图上的映射区域， 值的范围限制在 0~1 之间
         */
        public uvRectangle: Rectangle = new Rectangle(0, 0, 1, 1);

        /**
         * 材质数据需要变化
         */
        public materialDataNeedChange: boolean = true;

        /**
         * 纹理变化
         */
        public textureChange: boolean = false;

        /**
         * 纹理状态需要更新
         */
        public textureStateChage: boolean = true;

        /**
         * 剔除模式
         */
        public cullFrontOrBack: number = Context3DProxy.gl.BACK;

        /**
         * 材质属性数据
         */
        public materialSourceData: Float32Array = new Float32Array(20);

        public clone(): MaterialData {
            let data = new MaterialData();
            data.drawMode = this.drawMode;
            data.diffuseTexture = this.diffuseTexture;
            data.diffuseTexture3D = this.diffuseTexture3D;
            data.shadowMapTexture = this.shadowMapTexture;
            for (let i = 0; i < 4; ++i) {
                data.shadowColor[i] = this.shadowColor[i];
            }
            data.castShadow = this.castShadow;
            data.acceptShadow = this.acceptShadow;
            data.depthTest = this.depthTest;
            data.blendMode = this.blendMode;
            data.blendSrc = this.blendSrc;
            data.blendDest = this.blendDest;
            data.ambientColor = this.ambientColor;
            data.diffuseColor = this.diffuseColor;
            data.specularColor = this.specularColor;
            data.cutAlpha = this.cutAlpha;
            data.alpha = this.alpha;
            data.specularLevel = this.specularLevel;
            data.gloss = this.gloss;
            data.albedo = this.albedo;
            data.materialDataNeedChange = this.materialDataNeedChange;
            data.textureChange = true;
            data.cullFrontOrBack = this.cullFrontOrBack;
            return data;
        }

        public dispose() {
        }
    }
}

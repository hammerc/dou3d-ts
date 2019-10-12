namespace dou3d {
    /**
     * 材质渲染数据
     * @author wizardc
     */
    export class MaterialData {
        /**
         * 材质类型数组
         * * 每个材质球可能会有很多种贴图方法, 而这个是做为默认支持的材质方法的添加通道
         */
        public shaderPhaseTypes: { [passID: number]: ShaderPhaseType[] } = {};

        /**
         * 渲染模式
         */
        public drawMode: number = ContextConfig.TRIANGLES;

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
         * 法线贴图
         */
        public normalTexture: TextureBase;

        /**
         * 
         */
        public matcapTexture: TextureBase;

        /**
         * 特效贴图
         */
        public specularTexture: TextureBase;

        /**
         * 灯光贴图
         */
        public lightTexture: TextureBase;

        /**
         * 遮罩贴图
         */
        public maskTexture: TextureBase;

        /**
         * ao 贴图
         */
        public aoTexture: TextureBase;

        /**
         * mask 贴图
         */
        public blendMaskTexture: TextureBase;

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
         * blend_src 值
         */
        public blend_src: number;

        /**
         * blend_dest 值
         */
        public blend_dest: number;

        /**
         * alphaBlending
         */
        public alphaBlending: boolean = false;

        /**
         * ambientColor 值
         */
        public ambientColor: number = 0x333333;

        /**
         * diffuseColor
         */
        public diffuseColor: number = 0xffffff;

        /**
         * specularColor 值
         */
        public specularColor: number = 0xffffff;

        /**
         * 色相
         */
        public tintColor: number = 0x80808080;

        /**
         * 材质球的高光强度
         */
        public specularLevel: number = 4.0;

        /**
         * 材质球的光滑度
         */
        public gloss: number = 20.0;

        /**
         * cutAlpha 值
         */
        public cutAlpha: number = 0.7;

        /**
         * 是否重复
         */
        public repeat: boolean = false;

        /**
         * bothside 值
         */
        public bothside: boolean = false;

        /**
         * alpha 值
         */
        public alpha: number = 1.0;

        /**
         * 反射颜色的强度值，出射光照的出射率
         */
        public albedo: number = 0.95;

        /**
         * 高光亮度的强度值,设置较大的值会让高光部分极亮
         */
        public specularScale: number = 1.0;
        public normalScale: number = 1.0;

        /**
         * uv 在贴图上的映射区域，值的范围限制在0.0~1.0之间
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
         * cullFrontOrBack
         */
        public cullFrontOrBack: number = ContextConfig.BACK;

        public materialSourceData: Float32Array = new Float32Array(20);

        public colorGradientsSource: Float32Array = new Float32Array(10);

        public colorTransform: ColorTransform;

        public clone(): MaterialData {
            let data = new MaterialData();
            data.drawMode = this.drawMode;
            data.diffuseTexture = this.diffuseTexture;
            data.shadowMapTexture = this.shadowMapTexture;
            for (let i = 0; i < 4; ++i) {
                data.shadowColor[i] = this.shadowColor[i];
            }
            data.castShadow = this.castShadow;
            data.acceptShadow = this.acceptShadow;
            data.depthTest = this.depthTest;
            data.blendMode = this.blendMode;
            data.blend_src = this.blend_src;
            data.blend_dest = this.blend_dest;
            data.ambientColor = this.ambientColor;
            data.diffuseColor = this.diffuseColor;
            data.specularColor = this.specularColor;
            data.cutAlpha = this.cutAlpha;
            data.alpha = this.alpha;
            data.specularLevel = this.specularLevel;
            data.gloss = this.gloss;
            data.albedo = this.albedo;
            data.specularScale = this.specularScale;
            data.materialDataNeedChange = this.materialDataNeedChange;
            data.textureChange = true;
            data.cullFrontOrBack = this.cullFrontOrBack;
            data.colorTransform = this.colorTransform;
            return data;
        }

        public dispose() {
        }
    }
}

namespace dou3d {
    /**
     * 材质基类
     * @author wizardc
     */
    export abstract class MaterialBase {
        protected _passes: { [pass: number]: MaterialPass[] };
        protected _materialData: MaterialData;

        private _lightGroup: LightGroup;
        private _shadowMethod: ShadowMethod;

        public constructor(materialData?: MaterialData) {
            this._passes = [];
            if (materialData) {
                this.materialData = materialData;
            }
            else {
                this.materialData = new MaterialData();
            }
        }

        public get passes(): { [pass: number]: MaterialPass[] } {
            return this._passes;
        }

        /**
         * 漫反射通道
         */
        public get diffusePass(): DiffusePass {
            return this._passes[PassType.diffusePass][0];
        }

        public set materialData(data: MaterialData) {
            this._materialData = data;
            this.initPass();
            this.blendMode = BlendMode.NORMAL;
        }
        public get materialData(): MaterialData {
            return this._materialData;
        }

        /**
         * 材质球接受的灯光组
         */
        public set lightGroup(group: LightGroup) {
            this._lightGroup = group;
            if (this._passes[PassType.diffusePass] && this._passes[PassType.diffusePass].length > 0) {
                for (let i = 0; i < this._passes[PassType.diffusePass].length; i++) {
                    this._passes[PassType.diffusePass][i].lightGroup = group;
                }
            }
        }
        public get lightGroup(): LightGroup {
            return this._lightGroup;
        }

        /**
         * 是否开启深度测试
         */
        public set depth(v: boolean) {
            this._materialData.depthTest = v;
        }
        public get depth(): boolean {
            return this._materialData.depthTest;
        }

        /**
         * 深度测试方式
         */
        public set depthMode(v: number) {
            this._materialData.depthMode = v;
        }
        public get depthMode(): number {
            return this._materialData.depthMode;
        }

        /**
         * 材质球的漫反射贴图
         */
        public set diffuseTexture(texture: TextureBase) {
            if (texture) {
                this._materialData.diffuseTexture = texture;
                this._materialData.textureChange = true;
                if (this._materialData.shaderPhaseTypes[PassType.diffusePass] && !this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.diffuse_fragment)) {
                    this._materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.diffuse_fragment);
                }
                if (this._materialData.shaderPhaseTypes[PassType.shadowPass] && !this._materialData.shaderPhaseTypes[PassType.shadowPass].contains(ShaderPhaseType.diffuse_fragment)) {
                    this._materialData.shaderPhaseTypes[PassType.shadowPass].push(ShaderPhaseType.diffuse_fragment);
                }
            }
        }
        public get diffuseTexture(): TextureBase {
            return this._materialData.diffuseTexture;
        }

        /**
         * 材质球的凹凸法线贴图
         */
        public set normalTexture(texture: TextureBase) {
            if (texture) {
                this._materialData.normalTexture = texture;
                this._materialData.textureChange = true;
                if (this._materialData.shaderPhaseTypes[PassType.diffusePass] && !this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.normal_fragment)) {
                    this._materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.normal_fragment);
                    this.passInvalid(PassType.diffusePass);
                }
            }
        }
        public get normalTexture(): TextureBase {
            return this._materialData.normalTexture;
        }

        /**
         * 材质球的高光贴图
         */
        public set specularTexture(texture: TextureBase) {
            if (texture) {
                this._materialData.specularTexture = texture;
                this._materialData.textureChange = true;
                if (this._materialData.shaderPhaseTypes[PassType.diffusePass] && !this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.specular_fragment)) {
                    this._materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.specular_fragment);
                }
            }
        }
        public get specularTexture(): TextureBase {
            return this._materialData.specularTexture;
        }

        /**
         * 设置模型渲染模式
         */
        public set drawMode(mode: number) {
            this._materialData.drawMode = mode;
        }
        public get drawMode(): number {
            return this._materialData.drawMode;
        }

        /**
         * 模型渲染中带透明贴图的去除不渲染透明透明部分的阀值
         */
        public set cutAlpha(v: number) {
            this._materialData.cutAlpha = v;
        }
        public get cutAlpha(): number {
            return this._materialData.cutAlpha;
        }

        /**
         * 漫反射颜色
         */
        public set diffuseColor(color: number) {
            this._materialData.materialDataNeedChange = true;
            this._materialData.diffuseColor = color;
        }
        public get diffuseColor(): number {
            return this._materialData.diffuseColor;
        }

        /**
         * 环境光颜色
         */
        public set ambientColor(color: number) {
            this._materialData.materialDataNeedChange = true;
            this._materialData.ambientColor = color;
        }
        public get ambientColor(): number {
            return this._materialData.ambientColor;
        }

        /**
         * 镜面光反射颜色
         */
        public set specularColor(color: number) {
            this._materialData.materialDataNeedChange = true;
            this._materialData.specularColor = color;
        }
        public get specularColor(): number {
            return this._materialData.specularColor;
        }

        /**
         * 色相颜色
         */
        public set tintColor(color: number) {
            this._materialData.materialDataNeedChange = true;
            this._materialData.tintColor = color;
        }
        public get tintColor(): number {
            return this._materialData.tintColor;
        }

        /**
         * 材质的透明度, 如果透明度小于 1 会自动启用 alpha blending
         */
        public set alpha(value: number) {
            if (this._materialData.alpha != value) {
                this._materialData.alpha = value;
                this._materialData.materialDataNeedChange = true;
            }
        }
        public get alpha(): number {
            return this._materialData.alpha;
        }

        /**
         * 透明混合
         */
        public set alphaBlending(value: boolean) {
            if (this._materialData.alphaBlending != value) {
                this._materialData.alphaBlending = value;
                this._materialData.materialDataNeedChange = true;
            }
        }
        public get alphaBlending(): boolean {
            return this._materialData.alphaBlending;
        }

        /**
         * 材质的高光强度
         */
        public set specularLevel(value: number) {
            if (this._materialData.specularLevel != value) {
                this._materialData.specularLevel = value;
                this._materialData.materialDataNeedChange = true;
            }
        }
        public get specularLevel(): number {
            return this._materialData.specularLevel;
        }

        /**
         * 镜面平滑程度值
         */
        public set gloss(value: number) {
            if (this._materialData.gloss != value) {
                this._materialData.gloss = value;
                this._materialData.materialDataNeedChange = true;
            }
        }
        public get gloss(): number {
            return this._materialData.gloss;
        }

        /**
         * 映射贴图 UV 坐标, 设置此材质要显示使用贴图的区域
         */
        public set uvRectangle(rect: Rectangle) {
            this._materialData.uvRectangle.x = rect.x;
            this._materialData.uvRectangle.y = rect.y;
            this._materialData.uvRectangle.w = rect.w;
            this._materialData.uvRectangle.h = rect.h;
            this._materialData.materialDataNeedChange = true;
        }
        public get uvRectangle(): Rectangle {
            return this._materialData.uvRectangle;
        }

        /**
         * 材质是否接受阴影
         */
        public set castShadow(value: boolean) {
            this._materialData.castShadow = value;
            if (value) {
                ShadowCast.instance.enableShadow = true;
                this.addPass(PassType.shadowPass);
            }
            else {
                if (this._passes[PassType.shadowPass]) {
                    this.disposePass(PassType.shadowPass);
                    this._passes[PassType.shadowPass] = null;
                }
            }
        }
        public get castShadow(): boolean {
            return this._materialData.castShadow;
        }

        /**
         * 材质是否是否产生阴影
         */
        public set acceptShadow(value: boolean) {
            if (this._materialData.acceptShadow == value) {
                return;
            }
            this._materialData.acceptShadow = value;
            if (this._materialData.acceptShadow) {
                this._shadowMethod = new ShadowMethod(this);
                this._shadowMethod.shadowMapTexture = ShadowCast.instance.shadowRender.renderTexture;
                this.diffusePass.addMethod(this._shadowMethod);
            }
            else {
                if (this._shadowMethod) {
                    this.diffusePass.removeMethod(this._shadowMethod);
                }
            }
        }
        public get acceptShadow(): boolean {
            return this._materialData.acceptShadow;
        }

        /**
         * 阴影颜色
         */
        public set shadowColor(color: number) {
            this._materialData.shadowColor[0] = color >> 16 & 0xff / 255.0;
            this._materialData.shadowColor[1] = color >> 8 & 0xff / 255.0;
            this._materialData.shadowColor[2] = color & 0xff / 255.0;
        }
        public get shadowColor(): number {
            let color: number = 0;
            color |= this._materialData.shadowColor[0] * 255.0 << 16;
            color |= this._materialData.shadowColor[1] * 255.0 << 8;
            color |= this._materialData.shadowColor[2] * 255.0;
            return color;
        }

        /**
         * 阴影偏移
         */
        public set shadowOffset(offset: number) {
            this._materialData.shadowColor[3] = offset;
        }
        public get shadowOffset(): number {
            return this._materialData.shadowColor[3];
        }

        /**
         * 是否进行纹理重复采样的方式开关
         */
        public set repeat(val: boolean) {
            this._materialData.repeat = val;
            this._materialData.textureStateChage = true;
        }
        public get repeat(): boolean {
            return this._materialData.repeat;
        }

        /**
         * 材质是否显示双面的开关
         */
        public set bothside(val: boolean) {
            this._materialData.textureStateChage = true;
            this._materialData.bothside = val;
        }
        public get bothside(): boolean {
            return this._materialData.bothside;
        }

        /**
         * 正面渲染三角形或者背面渲染三角形
         */
        public set cullMode(value: number) {
            this._materialData.textureStateChage = true;
            this._materialData.cullFrontOrBack = value;
        }
        public get cullMode(): number {
            return this._materialData.cullFrontOrBack;
        }

        /**
         * 混合模式
         */
        public set blendMode(value: BlendMode) {
            this._materialData.textureStateChage = true;
            this._materialData.blendMode = value;
            switch (value) {
                case BlendMode.NORMAL:
                    this._materialData.blendSrc = Context3DProxy.gl.ONE;
                    this._materialData.blendDest = Context3DProxy.gl.ONE_MINUS_SRC_ALPHA;
                    this._materialData.alphaBlending = false;
                    break;
                case BlendMode.LAYER:
                    this._materialData.blendSrc = Context3DProxy.gl.SRC_ALPHA;
                    this._materialData.blendDest = Context3DProxy.gl.ZERO;
                    this._materialData.alphaBlending = true;
                    break;
                case BlendMode.MULTIPLY:
                    this._materialData.blendSrc = Context3DProxy.gl.ZERO;
                    this._materialData.blendDest = Context3DProxy.gl.SRC_COLOR;
                    this._materialData.alphaBlending = true;
                    break;
                case BlendMode.ADD:
                    this._materialData.blendSrc = Context3DProxy.gl.SRC_ALPHA;
                    this._materialData.blendDest = Context3DProxy.gl.ONE;
                    this._materialData.alphaBlending = true;
                    break;
                case BlendMode.SOFT_ADD:
                    this._materialData.blendSrc = Context3DProxy.gl.SRC_COLOR;
                    this._materialData.blendDest = Context3DProxy.gl.ONE;
                    this._materialData.alphaBlending = true;
                    break;
                case BlendMode.ALPHA:
                    this._materialData.blendSrc = Context3DProxy.gl.ONE;
                    this._materialData.blendDest = Context3DProxy.gl.ONE_MINUS_SRC_ALPHA;
                    this._materialData.alphaBlending = true;
                    break;
                case BlendMode.SCREEN:
                    this._materialData.blendSrc = Context3DProxy.gl.ONE;
                    this._materialData.blendDest = Context3DProxy.gl.ONE_MINUS_SRC_COLOR;
                    break;
            }
        }
        public get blendMode(): BlendMode {
            return this._materialData.blendMode;
        }

        /**
         * 点的大小
         */
        public set pointSize(value: number) {
            if (value == this._materialData.specularLevel) {
                return;
            }
            this._materialData.specularLevel = value;
            this._materialData.textureStateChage = true;
        }
        public get pointSize(): number {
            return this._materialData.specularLevel;
        }

        protected initPass(): void {
            this.addPass(PassType.diffusePass);
        }

        protected passInvalid(passType: PassType): void {
            if (this._passes[passType] && this._passes[passType].length > 0) {
                for (let i = 0; i < this._passes[passType].length; i++) {
                    this._passes[passType][i].passInvalid();
                }
            }
        }

        /**
         * 添加一个渲染通道
         */
        public addPass(pass: PassType): void {
            this._passes[pass] = PassUtil.createPass(pass, this._materialData);
        }

        /**
         * 销毁指定的渲染通道
         */
        public disposePass(passType: PassType): void {
            for (let i = 0; i < this._passes[passType].length; i++) {
                this._passes[passType][i].dispose();
            }
        }

        public dispose(): void {
            for (let key in this._passes) {
                for (let i = 0; i < this._passes[key].length; ++i) {
                    this._passes[key][i].dispose();
                }
            }
        }
    }
}

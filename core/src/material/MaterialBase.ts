namespace dou3d {
    /**
     * 材质球共有的基础类型，封装了材质球共有的基础数据设置方法。</p>
    * 不同的渲染通道pass。</p>
     * @author wizardc
     */
    export abstract class MaterialBase {

        public passes: { [pass: number]: MaterialPass[] } = [];

        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        public materialData: MaterialData;

        private _lightGroup: LightGroup;
        private _shadowMethod: ShadowMethod;
        /**
        * @language zh_CN
        * @class egret3d.MaterialBase
        * @classdesc
        * TerrainMaterial,TextureMaterial 的基类。</p>
        * 材质球共有的基础类型，封装了材质球共有的基础数据设置方法。</p>
        * 不同的渲染通道pass。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(materialData: MaterialData = null) {
            if (materialData == null) {
                this.setData(new MaterialData());
            }
            else
                this.setData(materialData);
        }

        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        public setData(data: MaterialData) {
            this.materialData = data;
            this.initPass();
            this.blendMode = BlendMode.NORMAL;
        }

        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        public getData(): MaterialData {
            return this.materialData;
        }

        protected initPass() {
            //this.passes[PassType.diffusePass] = new ColorPass(this.materialData);
            this.addPass(PassType.colorPass);
            //this.addPass(PassType.normalPass);
            //this.addPass(PassType.depthPass_8);
        }

        /**
         * @language zh_CN
         * 设置材质 lightGroup 。
         * 设置材质球接受的灯光组。
         * @param lightGroup LightGroup
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set lightGroup(group: LightGroup) {
            this._lightGroup = group;

            if (this.passes[PassType.diffusePass] && this.passes[PassType.diffusePass].length > 0) {
                for (var i: number = 0; i < this.passes[PassType.diffusePass].length; i++) {
                    this.passes[PassType.diffusePass][i].lightGroup = group;
                }
            }

        }

        /**
         * @language zh_CN
         * 获取材质球接受的灯光组。
         * @return LightGroup 灯光组
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get lightGroup(): LightGroup {
            return this._lightGroup;
        }

        ///**
        // * @language zh_CN
        // * 设置材质 shadowMapTexture 。
        // * 设置材质球的阴影贴图。
        // * @param texture ITexture
        // * @version Egret 3.0
        // * @platform Web,Native
        // */
        ////public set shadowMapTexture(texture: ITexture) {
        ////    if (texture) {
        ////        this.materialData.shadowMapTexture = texture;
        ////        this.materialData.textureChange = true;

        ////        //if (this.materialData.shaderPhaseTypes.indexOf(ShaderPhaseType.shadow_fragment) == -1) {
        ////        //    this.materialData.shaderPhaseTypes.push(ShaderPhaseType.shadow_fragment);
        ////        //    this.diffusePass.passInvalid();
        ////        //}
        ////    }
        ////}

        ///**
        //* @language zh_CN
        //* 返回材质 shadowMapTexture。
        //* 返回材质球的阴影贴图。
        //* @returns ITexture 阴影贴图
        //* @version Egret 3.0
        //* @platform Web,Native
        //*/
        ////public get shadowMapTexture(): ITexture {
        ////    return this.materialData.shadowMapTexture;
        ////}

        /**
         * @language zh_CN
         * 设置是否开启深度测试
         * @param texture ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set depth(v: boolean) {
            this.materialData.depthTest = v;
        }

        /**
        * @language zh_CN
        * 返回深度测试
        * @param texture ITexture
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get depth(): boolean {
            return this.materialData.depthTest;
        }

        /**
         * @language zh_CN
         * 设置是否开启深度测试方式
         * @param v 模式
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set depthMode(v: number) {
            this.materialData.depthMode = v;
        }

        /**
        * @language zh_CN
        * 返回深度测试方式
        * @param texture ITexture
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get depthMode(): number {
            return this.materialData.depthMode;
        }


        /**
         * @language zh_CN
         * 设置材质 diffuseTexture 。
         * 设置材质球的漫反射贴图。
         * @param texture ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set diffuseTexture(texture: ITexture) {
            if (texture) {
                this.materialData.diffuseTexture = texture;
                this.materialData.textureChange = true;

                if (this.materialData.shaderPhaseTypes[PassType.diffusePass] && this.materialData.shaderPhaseTypes[PassType.diffusePass].indexOf(ShaderPhaseType.diffuse_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.diffuse_fragment);
                }

                if (this.materialData.shaderPhaseTypes[PassType.shadowPass] && this.materialData.shaderPhaseTypes[PassType.shadowPass].indexOf(ShaderPhaseType.diffuse_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.shadowPass].push(ShaderPhaseType.diffuse_fragment);
                    //this.passes[PassType.shadowPass].passInvalid();
                }
            }
        }

        /**
        * @language zh_CN
        * 返回材质 diffuseTexture。
        * 返回材质球的漫反射贴图。
        * @returns ITexture 漫反射贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get diffuseTexture(): ITexture {
            return this.materialData.diffuseTexture;
        }

        /**
         * @language zh_CN
         * 设置材质 normalTexture 。
         * 设置材质球的凹凸法线贴图。
         * @param texture {TextureBase}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set normalTexture(texture: ITexture) {
            if (texture) {
                this.materialData.normalTexture = texture;
                this.materialData.textureChange = true;

                if (this.materialData.shaderPhaseTypes[PassType.diffusePass] && this.materialData.shaderPhaseTypes[PassType.diffusePass].indexOf(ShaderPhaseType.normal_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.normal_fragment);
                    this.passInvalid(PassType.diffusePass);
                }

                if (this.materialData.shaderPhaseTypes[PassType.matCapPass] && this.materialData.shaderPhaseTypes[PassType.matCapPass].indexOf(ShaderPhaseType.normal_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.matCapPass].push(ShaderPhaseType.normal_fragment);
                    //this.passes[PassType.matCapPass].passInvalid();
                }

            }
        }

        protected passInvalid(passType: PassType) {
            if (this.passes[passType] && this.passes[passType].length > 0) {
                for (var i: number = 0; i < this.passes[passType].length; i++) {
                    this.passes[passType][i].passInvalid();
                }
            }
        }


        /**
          * @language zh_CN
          * 设置材质 matcapTexture 。
          * 设置材质球特殊光效算法。
          * @param texture {TextureBase}
          * @version Egret 3.0
          * @platform Web,Native
          */
        public set matcapTexture(texture: ITexture) {
            if (texture) {
                this.materialData.matcapTexture = texture;
                this.materialData.textureChange = true;

                if (this.materialData.shaderPhaseTypes[PassType.diffusePass] && this.materialData.shaderPhaseTypes[PassType.diffusePass].indexOf(ShaderPhaseType.matCap_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.matCap_fragment);
                    this.passInvalid(PassType.diffusePass);
                }

                if (this.materialData.shaderPhaseTypes[PassType.matCapPass] && this.materialData.shaderPhaseTypes[PassType.matCapPass].indexOf(ShaderPhaseType.matCap_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.matCapPass].push(ShaderPhaseType.matCap_fragment);
                    //this.passes[PassType.matCapPass].passInvalid();
                }

            }
        }

        /**
        * @language zh_CN
        * 得到材质球特殊光效贴图。
        * @returns ITexture 
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get matcapTexture(): ITexture {
            return this.materialData.normalTexture;
        }

        /**
         * @language zh_CN
         * 得到材质球的凹凸法线贴图。
         * @returns ITexture 
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get normalTexture(): ITexture {
            return this.materialData.normalTexture;
        }

        /**
         * @language zh_CN
         * 设置材质 specularTexture 。
         * 设置材质球的高光贴图。
         * @param texture {TextureBase}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set specularTexture(texture: ITexture) {
            if (texture) {
                this.materialData.specularTexture = texture;
                this.materialData.textureChange = true;
                if (this.materialData.shaderPhaseTypes[PassType.diffusePass] && this.materialData.shaderPhaseTypes[PassType.diffusePass].indexOf(ShaderPhaseType.specular_fragment) == -1) {
                    this.materialData.shaderPhaseTypes[PassType.diffusePass].push(ShaderPhaseType.specular_fragment);
                    //this.passes[PassType.diffusePass].passInvalid();
                }
            }
        }

        /**
         * @language zh_CN
         * 得到材质球的高光贴图。
         * @returns ITexture 
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get specularTexture(): ITexture {
            return this.materialData.specularTexture;
        }

        /**
        * @language zh_CN
        * 设置模型渲染模式。模型可以以顶点的方式渲染，线框渲染（会需要特定模型），三角形渲染
        * DrawMode.POINTS
        * rawMode.LINES
        * DrawMode.TRIANGLES
        * @default DrawMode.TRIANGLES
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set drawMode(mode: number) {
            this.materialData.drawMode = mode;
        }

        /**
        * @language zh_CN
        * 设置模型渲染模式。模型可以以顶点的方式渲染，线框渲染（会需要特定模型），三角形渲染
        * DrawMode.POINTS
        * rawMode.LINES
        * DrawMode.TRIANGLES
        * @default DrawMode.TRIANGLES
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get drawMode(): number {
            return this.materialData.drawMode;
        }

        /**
        * @language zh_CN
        * 设置模型渲染模式。模型渲染中，带透明贴图的 去除不渲染透明透明部分的阀值
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set cutAlpha(v: number) {
            this.materialData.cutAlpha = v;
        }

        /**
        * @language zh_CN
        * 设置模型渲染模式。模型渲染中，带透明贴图的 去除不渲染透明透明部分的阀值
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get cutAlpha(): number {
            return this.materialData.cutAlpha;
        }

        /**
        * @language zh_CN
        * 设置材质 diffuseColor。
        * 设置 16 进制的漫反射颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set diffuseColor(color: number) {
            this.materialData.materialDataNeedChange = true;
            this.materialData.diffuseColor = color;
        }

        /**
        * @language zh_CN
        * 获取材质 diffuseColor
        * @returns number 材质 diffuseColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get diffuseColor(): number {
            return this.materialData.diffuseColor;
        }

        /**
        * @language zh_CN
        * 设置材质 ambientColor。
        * 设置 16 进制的环境光颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set ambientColor(color: number) {
            this.materialData.materialDataNeedChange = true;
            this.materialData.ambientColor = color;
        }

        /**
        * @language zh_CN
        * 获取材质 ambientColor
        * @returns number 材质 ambientColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get ambientColor(): number {
            return this.materialData.ambientColor;
        }

        /**
        * @language zh_CN
        * 设置材质 specularColor。
        * 设置 16 进制的镜面光反射颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set specularColor(color: number) {
            this.materialData.materialDataNeedChange = true;
            this.materialData.specularColor = color;
        }

        /**
        * @language zh_CN
        * 获取材质 specularColor
        * @returns number 材质 specularColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get specularColor(): number {
            return this.materialData.specularColor;
        }

        /**
        * @language zh_CN
        * 设置材质色相。
        * 设置 16 进制的色相颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set tintColor(color: number) {
            this.materialData.materialDataNeedChange = true;
            this.materialData.tintColor = color;
        }

        /**
        * @language zh_CN
        * 获取材质 tintColor
        * @returns number 材质 tintColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get tintColor(): number {
            return this.materialData.tintColor;
        }

        /**
         * @language zh_CN
         * 设置材质 alpha 值。
         * 设置 材质球的透明度，如果透明度小于1会自动启用 alphablending
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set alpha(value: number) {
            if (this.materialData.alpha != value) {
                this.materialData.alpha = value;
                this.materialData.materialDataNeedChange = true;
            }
        }

        /**
         * @language zh_CN
         * 返回材质 alpha 值。
         * 返回 alpha 颜色
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get alpha(): number {
            return this.materialData.alpha;
        }

        /**
       * @language zh_CN
       * 设置材质 的alphaBlending 值。
       * 设置 材质球的的alpha是否进行深度排序
       * @param value {Number}
       * @version Egret 3.0
       * @platform Web,Native
       */
        public set alphaBlending(value: boolean) {
            if (this.materialData.alphaBlending != value) {
                this.materialData.alphaBlending = value;
                this.materialData.materialDataNeedChange = true;
            }
        }

        /**
         * @language zh_CN
         * 返回 alphaBlending 颜色
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get alphaBlending(): boolean {
            return this.materialData.alphaBlending;
        }

        /**
         * @language zh_CN
         * 设置材质 specularLevel 值。
         * 设置材质球的材质球的高光强度
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set specularLevel(value: number) {
            if (this.materialData.specularLevel != value) {
                this.materialData.specularLevel = value;
                this.materialData.materialDataNeedChange = true;
            }
        }

        /**
         * @language zh_CN
         * 返回材质 specularLevel 值。
         * 返回材质 材质球的高光强度
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get specularLevel(): number {
            return this.materialData.specularLevel;
        }

        /**
         * @language zh_CN
         * 设置材质 gloss 值。
         * 设置材质 镜面平滑程度值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set gloss(value: number) {
            if (this.materialData.gloss != value) {
                this.materialData.gloss = value;
                this.materialData.materialDataNeedChange = true;
            }
        }

        /**
         * @language zh_CN
         * 返回材质球的镜面平滑程度值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get gloss(): number {
            return this.materialData.gloss;
        }

        /**
        * @language zh_CN
        * 映射贴图UV坐标，设置此材质要显示使用贴图的区域，用uvRectangle 的方式映射
        * @param rect Rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set uvRectangle(rect: Rectangle) {
            this.materialData.uvRectangle.x = rect.x;
            this.materialData.uvRectangle.y = rect.y;
            this.materialData.uvRectangle.width = rect.width;
            this.materialData.uvRectangle.height = rect.height;
            this.materialData.materialDataNeedChange = true;
        }

        /**
        * @language zh_CN
        * 获取映射贴图UV坐标，区域，用uvRectangle 的方式映射
        * @return rect Rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get uvRectangle(): Rectangle {
            return this.materialData.uvRectangle;
        }

        /**
         * @private
         * @language zh_CN
         * 设置材质 ambientPower 值。
         * 设置材质 环境光颜色的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get diffusePass(): DiffusePass {
            return this.passes[PassType.diffusePass][0];
        }


        /**
         * @language zh_CN
         * 设置材质 ambientPower 值。
         * 设置材质 环境光颜色的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public set ambientPower(value: number) {
        //    if (this.materialData.ambientPower != value) {
        //        this.materialData.ambientPower = value;
        //        this.materialData.materialDataNeedChange = true;
        //    }
        //}

        /**
         * @language zh_CN
         * 返回材质 ambientPower 值。
         * 返回材质 环境光颜色的强度 值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public get ambientPower(): number {
        //    return this.materialData.ambientPower;
        //}


        /**
         * @language zh_CN
         * 设置材质 diffusePower 值。
         * 设置材质 漫反射颜色的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public set diffusePower(value: number) {
        //    if (this.materialData.diffusePower != value) {
        //        this.materialData.diffusePower = value;
        //        this.materialData.materialDataNeedChange = true;
        //    }
        //}

        /**
         * @language zh_CN
         * 返回材质 diffusePower 值。
         * 返回材质 漫反射颜色的强度 值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public get diffusePower(): number {
        //    return this.materialData.diffusePower;
        //}

        /**
         * @language zh_CN
         * 设置材质 normalPower 值。
         * 设置材质 法线的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */

        //public set normalPower(value: number) {
        //    if (this.materialData.normalPower != value) {
        //        this.materialData.normalPower = value;
        //        this.materialData.materialDataNeedChange = true;
        //    }
        //}
        /**
         * @language zh_CN
         * 返回材质 normalPower 值。
         * 返回材质 法线的强度 值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public get normalPower(): number {
        //    return this.materialData.normalPower;
        //}

        /** m
        * @language zh_CN
        * 返回材质 normalPower 值。
        * 返回材质 法线的强度 值。
        * @returns {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public addPass(pass: PassType) {
            this.passes[pass] = PassUtil.CreatPass(pass, this.materialData);
        }

        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 设置材质 castShadow 值。
        * 设置材质是否接受阴影，设置了之后必须要给 shadowmaping 的方法。
        * @param value {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set castShadow(value: boolean) {
            this.materialData.castShadow = value;
            if (value) {
                ShadowCast.enableShadow = true;
                this.addPass(PassType.shadowPass);
            } else {
                if (this.passes[PassType.shadowPass]) {
                    this.disposePass(PassType.shadowPass);
                    this.passes[PassType.shadowPass] = null;
                }
            }
        }

        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set castPick(value: boolean) {
            if (value) {
                PickSystem.instance.enablePick = true;
                this.addPass(PassType.PickPass);
            } else {
                if (this.passes[PassType.PickPass]) {
                    this.disposePass(PassType.PickPass);
                    this.passes[PassType.PickPass] = null;
                }
            }
        }

        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 返回材质 castShadow 值。
        * 返回材质 是否产生阴影 值。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get castShadow(): boolean {
            return this.materialData.castShadow;
        }

        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 设置材质 acceptShadow 值。
        * 设置材质是否是否产生阴影，设置了之后必须要给 shadowmaping 的方法。
        * @param value {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set acceptShadow(value: boolean) {
            if (this.materialData.acceptShadow == value) {
                return;
            }
            this.materialData.acceptShadow = value;

            if (this.materialData.acceptShadow) {
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

        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 返回材质 acceptShadow 值。
        * 返回材质是否接受阴影，设置了之后必须要给 shadowmaping 的方法。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get acceptShadow(): boolean {
            return this.materialData.acceptShadow;
        }

        /**
        * @language zh_CN
        * 设置 阴影颜色
        * @param color 0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set shadowColor(color: number) {
            this.materialData.shadowColor[0] = color >> 16 & 0xff / 255.0;
            this.materialData.shadowColor[1] = color >> 8 & 0xff / 255.0;
            this.materialData.shadowColor[2] = color & 0xff / 255.0;
        }

        /**
        * @language zh_CN
        * 返回材质 阴影颜色
        * @returns number 阴影颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get shadowColor(): number {
            var color: number = 0;
            color |= this.materialData.shadowColor[0] * 255.0 << 16;
            color |= this.materialData.shadowColor[1] * 255.0 << 8;
            color |= this.materialData.shadowColor[2] * 255.0;
            return color;
        }


        /**
        * @language zh_CN
        * @private
        * 设置 阴影offset
        * @param offset 
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set shadowOffset(offset: number) {
            this.materialData.shadowColor[3] = offset;
        }

        /**
        * @language zh_CN
        * @private
        * 返回材质 阴影offset
        * @returns number 阴影offset
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get shadowOffset(): number {
            return this.materialData.shadowColor[3];
        }

        /**
         * @language zh_CN
         * 设置材质 repeat 值。
         * 设置材质 是否进行纹理重复采样的方式开关。
         * @param value {boolean}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set repeat(val: boolean) {
            this.materialData.repeat = val;
            this.materialData.textureStateChage = true;
        }

        /**
        * @language zh_CN
        * 返回材质 repeat 值。
        * 返回材质 是否进行纹理重复采样的方式开关。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get repeat(): boolean {
            return this.materialData.repeat;
        }

        /**
        * @language zh_CN
        * 设置材质 bothside 值。
        * 设置材质是否显示双面的开关。
        * @param value {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set bothside(val: boolean) {
            this.materialData.textureStateChage = true;
            this.materialData.bothside = val;
        }

        /**

        * @language zh_CN
        * 返回材质 bothside 值。
       * 返回是否显示双面的开关。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get bothside(): boolean {
            return this.materialData.bothside;
        }

        /**
       * @language zh_CN
       * 设置 cull 模式 正面渲染三角形或者背面渲染三角形。
       * @param value {Number}
       * @version Egret 3.0
       * @platform Web,Native
       */
        public set cullMode(value: number) {
            this.materialData.textureStateChage = true;
            this.materialData.cullFrontOrBack = value;
        }

        /**
         * @language zh_CN
         * 返回 cull 模式。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get cullMode(): number {
            return this.materialData.cullFrontOrBack;
        }

        /**
         * @language zh_CN
         * 设置材质 blendMode 值。
         * 设置材质球的 混合模式可以参照 blendmode 中的值
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set blendMode(value: BlendMode) {
            this.materialData.textureStateChage = true;
            this.materialData.blendMode = value;
            switch (value) {
                //his.materialData.blend_src = ContextConfig.SRC_ALPHA; 透明
                //this.materialData.blend_dest = ContextConfig.SRC_COLOR;
                case BlendMode.NORMAL:
                    this.materialData.blend_src = ContextConfig.ONE;
                    this.materialData.blend_dest = ContextConfig.ONE_MINUS_SRC_ALPHA;
                    this.materialData.alphaBlending = false;
                    break;
                case BlendMode.LAYER:
                    this.materialData.blend_src = ContextConfig.SRC_ALPHA;
                    this.materialData.blend_dest = ContextConfig.ZERO;
                    this.materialData.alphaBlending = true;
                    break;
                case BlendMode.MULTIPLY:
                    this.materialData.blend_src = ContextConfig.ZERO;
                    this.materialData.blend_dest = ContextConfig.SRC_COLOR;
                    this.materialData.alphaBlending = true;
                    break;
                case BlendMode.ADD:
                    this.materialData.blend_src = ContextConfig.SRC_ALPHA;
                    this.materialData.blend_dest = ContextConfig.ONE;
                    this.materialData.alphaBlending = true;
                    break;
                case BlendMode.SOFT_ADD:
                    this.materialData.blend_src = ContextConfig.SRC_COLOR;
                    this.materialData.blend_dest = ContextConfig.ONE;
                    this.materialData.alphaBlending = true;
                    break;
                case BlendMode.ALPHA:
                    this.materialData.blend_src = ContextConfig.ONE;
                    this.materialData.blend_dest = ContextConfig.ONE_MINUS_SRC_ALPHA;
                    this.materialData.alphaBlending = true;
                    break;
                case BlendMode.SCREEN:
                    this.materialData.blend_src = ContextConfig.ONE;
                    this.materialData.blend_dest = ContextConfig.ONE_MINUS_SRC_COLOR;
                    break;
            }
        }

        public set pointSize(value: number) {
            if (value == this.materialData.specularLevel) {
                return;
            }
            this.materialData.specularLevel = value;
            this.materialData.textureStateChage = true;
        }

        public get pointSize(): number {
            return this.materialData.specularLevel;
        }

        public disposePass(passType: PassType) {
            for (var i: number = 0; i < this.passes[passType].length; i++) {
                this.passes[passType][i].dispose();
            }
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public renderDiffusePass(time: number, delay: number, matID: number , context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, subGeometry: SubGeometry, animtion: IAnimation) {
        //    this.diffusePass.draw(time, delay, context3DProxy, modeltransform, camera3D, subGeometry, animtion);
        //}

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderXRayPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderOutlinePass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderNormalPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderDepthPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderPositionPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderUVPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderScendUVPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderVertexColorPass() {
        }

        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        public renderLightingPass() {
        }


        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        public dispose(): void {
            for (var key in this.passes) {
                for (var i: number = 0; i < this.passes[key].length; ++i) {
                    this.passes[key][i].dispose();
                }
            }
        }
    }
}

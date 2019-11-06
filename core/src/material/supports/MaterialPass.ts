namespace dou3d {
    /**
     * 材质渲染通道基类
     * @author wizardc
     */
    export abstract class MaterialPass {
        protected _passID: number;
        protected _passUsage: PassUsage;
        protected _materialData: MaterialData;
        protected _passChange: boolean = true;

        protected _vs_shader_methods: { [phaseType: number]: string[] } = {};
        protected _fs_shader_methods: { [phaseType: number]: string[] } = {};

        public methodList: MethodBase[] = [];

        public vsShaderNames: string[] = [];
        public fsShaderNames: string[] = [];

        public lightGroup: LightGroup;

        public constructor(materialData: MaterialData) {
            this._materialData = materialData;
        }

        /**
         * 增加渲染方法
         */
        public addMethod(method: MethodBase): void {
            let index = this.methodList.indexOf(method);
            if (index == -1) {
                this.methodList.push(method);
                method.materialData = this._materialData;
                this._passChange = true;
            }
        }

        /**
         * 获取指定类型的渲染方法实例
         */
        public getMethod(type: { new(): MethodBase }): MethodBase {
            for (let i = 0; i < this.methodList.length; ++i) {
                if (this.methodList[i] instanceof type) {
                    return this.methodList[i];
                }
            }
            return null;
        }

        /**
         * 移除渲染方法
         */
        public removeMethod(method: MethodBase): void {
            let index = this.methodList.indexOf(method);
            if (index != -1) {
                this.methodList.slice(index);
                this._passChange = true;
            }
        }

        public passInvalid(): void {
            this._passChange = true;
        }

        /**
         * 重置纹理
         */
        protected resetTexture(context3DProxy: Context3DProxy): void {
            let sampler2D: Sampler2D;
            for (let index in this._passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                if (this._materialData[sampler2D.varName]) {
                    sampler2D.texture = this._materialData[sampler2D.varName];
                }
            }
            let sampler3D: Sampler3D;
            for (let index in this._passUsage.sampler3DList) {
                sampler3D = this._passUsage.sampler3DList[index];
                if (this._materialData[sampler3D.varName]) {
                    sampler3D.texture = this._materialData[sampler3D.varName];
                }
            }
            this._materialData.textureChange = false;
        }

        protected addMethodShaders(shaderComposer: ShaderComposer, shaders: string[]): void {
            for (let i = 0; i < shaders.length; i++) {
                shaderComposer.addUseShaderName(shaders[i]);
            }
        }

        public upload(time: number, delay: number, context3DProxy: Context3DProxy, modelTransform: Matrix4, camera3D: Camera3D, animation: IAnimation): void {
            this._passChange = false;
            this.initShader(animation);
            this._passUsage.vertexShader.shader = this._passUsage.vertexShader.getShader(this._passUsage);
            this._passUsage.fragmentShader.shader = this._passUsage.fragmentShader.getShader(this._passUsage);
            this._passUsage.program3D = ShaderPool.getProgram(this._passUsage.vertexShader.shader.id, this._passUsage.fragmentShader.shader.id);
            // 添加 Shader 中所有带有 uniform 名称变量的索引
            for (let property in this._passUsage) {
                if (property.indexOf("uniform") != -1) {
                    if (this._passUsage[property]) {
                        (<Uniform>this._passUsage[property]).uniformIndex = context3DProxy.getUniformLocation(this._passUsage.program3D, property);
                    }
                }
            }
            // 添加取样器的索引
            let sampler2D: Sampler2D;
            for (let index in this._passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                sampler2D.uniformIndex = context3DProxy.getUniformLocation(this._passUsage.program3D, sampler2D.varName);
                sampler2D.texture = this._materialData[sampler2D.varName];
            }
            let sampler3D: Sampler2D;
            for (let index in this._passUsage.sampler3DList) {
                sampler3D = this._passUsage.sampler3DList[index];
                sampler3D.uniformIndex = context3DProxy.getUniformLocation(this._passUsage.program3D, sampler3D.varName);
            }
            if (this.methodList) {
                for (let i = 0; i < this.methodList.length; i++) {
                    this.methodList[i].upload(time, delay, this._passUsage, null, context3DProxy, modelTransform, camera3D);
                }
            }
        }

        /**
         * 初始化所有的渲染方法
         */
        protected abstract initShader(animation: IAnimation): void;

        public draw(time: number, delay: number, context3DProxy: Context3DProxy, modelTransform: Matrix4, camera3D: Camera3D, subGeometry: SubGeometry, render: RenderBase): void {
            // 如果材质中的变量改变了, 就更新这些变量的数据到 materialSourceData 中
            if (this._materialData.materialDataNeedChange) {
                let tintValue = this._materialData.tintColor;
                let tintAlpha = Math.floor(tintValue / 0x1000000);
                let tintRed = (tintValue & 0xff0000) / 0x10000;
                let tintGreen = (tintValue & 0xff00) / 0x100;
                let tintBlue = (tintValue & 0xff);
                tintAlpha /= 0x80;
                tintRed /= 0x80;
                tintGreen /= 0x80;
                tintBlue /= 0x80;
                this._materialData.materialSourceData[0] = tintRed * (this._materialData.diffuseColor >> 16 & 0xff) / 255.0;
                this._materialData.materialSourceData[1] = tintGreen * (this._materialData.diffuseColor >> 8 & 0xff) / 255.0;
                this._materialData.materialSourceData[2] = tintBlue * (this._materialData.diffuseColor & 0xff) / 255.0;
                this._materialData.materialSourceData[3] = (this._materialData.ambientColor >> 16 & 0xff) / 255.0;
                this._materialData.materialSourceData[4] = (this._materialData.ambientColor >> 8 & 0xff) / 255.0;
                this._materialData.materialSourceData[5] = (this._materialData.ambientColor & 0xff) / 255.0;
                this._materialData.materialSourceData[6] = (this._materialData.specularColor >> 16 & 0xff) / 255.0;
                this._materialData.materialSourceData[7] = (this._materialData.specularColor >> 8 & 0xff) / 255.0;
                this._materialData.materialSourceData[8] = (this._materialData.specularColor & 0xff) / 255.0;
                this._materialData.materialSourceData[9] = tintAlpha * this._materialData.alpha;
                this._materialData.materialSourceData[10] = this._materialData.cutAlpha;
                this._materialData.materialSourceData[11] = this._materialData.gloss;
                this._materialData.materialSourceData[12] = this._materialData.specularLevel;
                this._materialData.materialSourceData[13] = this._materialData.albedo;
                this._materialData.materialSourceData[14] = this._materialData.uvRectangle.x;
                this._materialData.materialSourceData[15] = this._materialData.uvRectangle.y; // 保留
                this._materialData.materialSourceData[16] = this._materialData.uvRectangle.w; // 保留
                this._materialData.materialSourceData[17] = this._materialData.uvRectangle.h; // 保留
                this._materialData.materialSourceData[18] = this._materialData.specularLevel; // 保留
                this._materialData.materialSourceData[19] = window.devicePixelRatio; // 保留
            }
            // 通道改变之后需要重新提交
            if (this._passChange) {
                this.upload(time, delay, context3DProxy, modelTransform, camera3D, render.animation);
            }
            context3DProxy.setProgram(this._passUsage.program3D);
            subGeometry.activeState(this._passUsage, context3DProxy);
            if (this._materialData.depthTest) {
                context3DProxy.enableDepth();
                context3DProxy.depthFunc(Context3DProxy.gl.LEQUAL);
            }
            else {
                context3DProxy.disableDepth();
                context3DProxy.depthFunc(Context3DProxy.gl.LEQUAL);
            }
            context3DProxy.setCulling(this._materialData.cullFrontOrBack);
            if (this._materialData.bothside) {
                context3DProxy.disableCullFace();
            }
            else {
                context3DProxy.enableCullFace();
            }
            if (this._passID == PassType.shadowPass) {
                context3DProxy.disableBlend();
                context3DProxy.setBlendFactors(Context3DProxy.gl.ONE, Context3DProxy.gl.ZERO);
            }
            else {
                if (this._materialData.alphaBlending) {
                    Context3DProxy.gl.depthMask(false);
                }
                context3DProxy.enableBlend();
                context3DProxy.setBlendFactors(this._materialData.blendSrc, this._materialData.blendDest);
            }
            if (this._passUsage.uniform_materialSource) {
                context3DProxy.uniform1fv(this._passUsage.uniform_materialSource.uniformIndex, this._materialData.materialSourceData);
            }
            if (this._materialData.textureChange) {
                this.resetTexture(context3DProxy);
            }
            let sampler2D: Sampler2D;
            for (let index in this._passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                sampler2D.texture = this._materialData[sampler2D.varName];
                if (!sampler2D.texture) {
                    continue;
                }
                sampler2D.texture.upload(context3DProxy);
                context3DProxy.setTexture2DAt(sampler2D.activeTextureIndex, sampler2D.uniformIndex, sampler2D.index, sampler2D.texture.texture2D);
                if (sampler2D.texture.useMipmap) {
                    sampler2D.texture.useMipmap = this._materialData.useMipmap;
                }
                sampler2D.texture.repeat = this._materialData.repeat;
                sampler2D.texture.activeState(context3DProxy);
                this._materialData.textureStateChage = false;
            }
            let sampler3D: Sampler3D;
            for (let index in this._passUsage.sampler3DList) {
                sampler3D = this._passUsage.sampler3DList[index];
                sampler3D.texture = this._materialData[sampler3D.varName];
                if (!sampler3D.texture) {
                    continue;
                }
                sampler3D.texture.upload(context3DProxy);
                context3DProxy.setCubeTextureAt(sampler3D.activeTextureIndex, sampler3D.uniformIndex, sampler3D.index, sampler3D.texture.texture3D);
            }
            if (this.lightGroup) {
                for (let i = 0; i < this._passUsage.maxDirectLight; i++) {
                    this.lightGroup.directList[i].updateLightData(camera3D, i, this._passUsage.directLightData);
                }
                for (let i = 0; i < this._passUsage.maxSpotLight; i++) {
                    this.lightGroup.spotList[i].updateLightData(camera3D, i, this._passUsage.spotLightData);
                }
                for (let i = 0; i < this._passUsage.maxPointLight; i++) {
                    this.lightGroup.pointList[i].updateLightData(camera3D, i, this._passUsage.pointLightData);
                }
                if (this._passUsage.uniform_directLightSource) {
                    context3DProxy.uniform1fv(this._passUsage.uniform_directLightSource.uniformIndex, this._passUsage.directLightData);
                }
                if (this._passUsage.uniform_spotLightSource) {
                    context3DProxy.uniform1fv(this._passUsage.uniform_spotLightSource.uniformIndex, this._passUsage.spotLightData);
                }
                if (this._passUsage.uniform_pointLightSource) {
                    context3DProxy.uniform1fv(this._passUsage.uniform_pointLightSource.uniformIndex, this._passUsage.pointLightData);
                }
            }
            if (this._passUsage.uniform_ModelMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ModelMatrix.uniformIndex, false, modelTransform.rawData);
            }
            if (this._passUsage.uniform_ViewMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ViewMatrix.uniformIndex, false, camera3D.viewMatrix.rawData);
            }
            if (this._passUsage.uniform_ProjectionMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ProjectionMatrix.uniformIndex, false, camera3D.projectMatrix.rawData);
            }
            if (this._passUsage.uniform_ViewProjectionMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ViewProjectionMatrix.uniformIndex, false, camera3D.viewProjectionMatrix.rawData);
            }
            if (this._passUsage.uniform_orthProectMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_orthProectMatrix.uniformIndex, false, camera3D.orthProjectionMatrix.rawData);
            }
            if (render.animation) {
                render.animation.activeState(time, delay, this._passUsage, subGeometry, context3DProxy, modelTransform, camera3D);
            }
            if (this.methodList) {
                for (let i = 0; i < this.methodList.length; i++) {
                    this.methodList[i].activeState(time, delay, this._passUsage, null, context3DProxy, modelTransform, camera3D);
                }
            }
            if (this._passUsage.uniform_eyepos) {
                context3DProxy.uniform3f(this._passUsage.uniform_eyepos.uniformIndex, camera3D.globalPosition.x, camera3D.globalPosition.y, camera3D.globalPosition.z);
            }
            if (this._passUsage.uniform_cameraMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_cameraMatrix.uniformIndex, false, camera3D.globalMatrix.rawData);
            }
            context3DProxy.drawElement(this._materialData.drawMode, subGeometry.start, subGeometry.count);
            if (this._materialData.alphaBlending) {
                Context3DProxy.gl.depthMask(true);
            }
        }

        public deactiveState(passUsage: PassUsage, context3DProxy: Context3DProxy): void {
            let sampler2D: Sampler2D;
            for (let index in passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                if (!sampler2D.texture) {
                    continue;
                }
            }
        }

        public dispose(): void {
            if (this._passUsage) {
                this._passUsage.dispose();
            }
            this._passUsage = null;
        }
    }
}

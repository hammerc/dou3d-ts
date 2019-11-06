namespace dou3d {
    /**
     * 漫反射渲染通道
     * @author wizardc
     */
    export class DiffusePass extends MaterialPass {
        public constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.diffusePass;
        }

        protected initShader(animation: IAnimation): void {
            this._passChange = false;
            this._passUsage = new PassUsage();
            this._vs_shader_methods = {};
            this._fs_shader_methods = {};

            this.phaseBegin(animation);
            this.initMethodShader();
            this.phaseEnd();
        }

        /**
         * 根据属性添加需要的着色器片段
         */
        private phaseBegin(animation: IAnimation): void {
            // 动画
            if (animation) {
                // 添加骨骼动画处理着色器
                if (animation instanceof SkeletonAnimation) {
                    this._passUsage.maxBone = animation.jointNum * 2;
                    this._vs_shader_methods[ShaderPhaseType.start_vertex] = [];
                    this._vs_shader_methods[ShaderPhaseType.start_vertex].push("skeleton_vs");
                }
            }
            // 根据属性设定加入需要的渲染方法
            if (this._materialData.acceptShadow) {
                // 添加接受阴影的 Shader
                this._vs_shader_methods[ShaderPhaseType.vertex_2] = this._vs_shader_methods[ShaderPhaseType.vertex_2] || [];
                this._fs_shader_methods[ShaderPhaseType.shadow_fragment] = this._fs_shader_methods[ShaderPhaseType.shadow_fragment] || [];
            }
            if (this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.diffuse_fragment)) {
                this._fs_shader_methods[ShaderPhaseType.diffuse_fragment] = [];
                this._fs_shader_methods[ShaderPhaseType.diffuse_fragment].push("diffuse_fs");
            }
            if (this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.normal_fragment)) {
                this._fs_shader_methods[ShaderPhaseType.normal_fragment] = [];
                this._fs_shader_methods[ShaderPhaseType.normal_fragment].push("normalMap_fs");
            }
            if (this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.specular_fragment)) {
                this._fs_shader_methods[ShaderPhaseType.specular_fragment] = [];
                this._fs_shader_methods[ShaderPhaseType.specular_fragment].push("specularMap_fs");
            }
            // 灯光相关的渲染方法
            if (this.lightGroup) {
                this._passUsage.maxDirectLight = this.lightGroup.directList.length;
                this._passUsage.maxSpotLight = this.lightGroup.spotList.length;
                this._passUsage.maxPointLight = this.lightGroup.pointList.length;
                this._vs_shader_methods[ShaderPhaseType.vertex_1] = this._vs_shader_methods[ShaderPhaseType.vertex_1] || [];
                this._fs_shader_methods[ShaderPhaseType.lighting_fragment] = [];
                this._fs_shader_methods[ShaderPhaseType.lighting_fragment].push("lightingBase_fs");
                if (this.lightGroup.directList.length) {
                    this._passUsage.directLightData = new Float32Array(DirectLight.stride * this.lightGroup.directList.length);
                    this._fs_shader_methods[ShaderPhaseType.lighting_fragment].push("directLight_fs");
                }
                if (this.lightGroup.pointList.length) {
                    this._passUsage.pointLightData = new Float32Array(PointLight.stride * this.lightGroup.pointList.length);
                    this._fs_shader_methods[ShaderPhaseType.lighting_fragment].push("pointLight_fs");
                }
                if (this.lightGroup.spotList.length) {
                    this._passUsage.spotLightData = new Float32Array(SpotLight.stride * this.lightGroup.spotList.length);
                    this._fs_shader_methods[ShaderPhaseType.lighting_fragment].push("spotLight_fs");
                }
            }
        }

        /**
         * 添加来自 Method 的着色器片段
         */
        protected initMethodShader(): void {
            let shaderPhase: string;
            let shaderList: string[];
            for (let d = 0; d < this.methodList.length; d++) {
                let method = this.methodList[d];
                for (shaderPhase in method.vsShaderList) {
                    shaderList = method.vsShaderList[shaderPhase];
                    for (let i = 0; i < shaderList.length; i++) {
                        this._vs_shader_methods[shaderPhase] = this._vs_shader_methods[shaderPhase] || [];
                        this._vs_shader_methods[shaderPhase].push(shaderList[i]);
                    }
                }
                for (shaderPhase in method.fsShaderList) {
                    shaderList = method.fsShaderList[shaderPhase];
                    for (let i = 0; i < shaderList.length; i++) {
                        this._fs_shader_methods[shaderPhase] = this._fs_shader_methods[shaderPhase] || [];
                        this._fs_shader_methods[shaderPhase].push(shaderList[i]);
                    }
                }
            }
        }

        /**
         * 将渲染方法的对应着色器加入到对应的 Shader 对象中以便获得最终的着色器对象
         */
        protected phaseEnd(): void {
            let shaderList: string[];
            // 顶点着色器
            shaderList = this._vs_shader_methods[ShaderPhaseType.custom_vertex];
            if (shaderList && shaderList.length > 0) {
                this.addMethodShaders(this._passUsage.vertexShader, shaderList);
            }
            // 没有时加入默认的着色器
            else {
                this.addMethodShaders(this._passUsage.vertexShader, ["base_vs"]);
                // start
                shaderList = this._vs_shader_methods[ShaderPhaseType.start_vertex];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.vertexShader, ["diffuse_vs"]);
                }
                // vertex_1
                shaderList = this._vs_shader_methods[ShaderPhaseType.vertex_1];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                // vertex_2
                shaderList = this._vs_shader_methods[ShaderPhaseType.vertex_2];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                // end
                shaderList = this._vs_shader_methods[ShaderPhaseType.end_vertex];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.vertexShader, ["end_vs"]);
                }
            }
            // 片段着色器
            shaderList = this._fs_shader_methods[ShaderPhaseType.custom_fragment];
            if (shaderList && shaderList.length > 0) {
                this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
            }
            // 没有时加入默认的着色器
            else {
                this.addMethodShaders(this._passUsage.fragmentShader, ["base_fs"]);
                // start
                shaderList = this._fs_shader_methods[ShaderPhaseType.start_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // materialsource
                shaderList = this._fs_shader_methods[ShaderPhaseType.materialsource_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.fragmentShader, ["materialSource_fs"]);
                }
                // diffuse
                shaderList = this._fs_shader_methods[ShaderPhaseType.diffuse_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.fragmentShader, ["diffuse_fs"]);
                }
                // normal
                shaderList = this._fs_shader_methods[ShaderPhaseType.normal_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // shadow
                shaderList = this._fs_shader_methods[ShaderPhaseType.shadow_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // lighting
                shaderList = this._fs_shader_methods[ShaderPhaseType.lighting_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // specular
                shaderList = this._fs_shader_methods[ShaderPhaseType.specular_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // end
                shaderList = this._fs_shader_methods[ShaderPhaseType.end_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.fragmentShader, ["end_fs"]);
                }
            }
        }
    }
}

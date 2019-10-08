namespace dou3d {
    /**
     * 阴影渲染方法
     * @author wizardc
     */
    export class ShadowMethod extends MethodBase {
        public constructor(material: MaterialBase) {
            super();
            this.materialData = material.materialData;
            this.vsShaderList[ShaderPhaseType.local_vertex] = this.vsShaderList[ShaderPhaseType.local_vertex] || [];
            this.vsShaderList[ShaderPhaseType.local_vertex].push("shadowMapping_vs");
            this.fsShaderList[ShaderPhaseType.shadow_fragment] = this.fsShaderList[ShaderPhaseType.shadow_fragment] || [];
            this.fsShaderList[ShaderPhaseType.shadow_fragment].push("shadowMapping_fs");
        }

        /**
         * 阴影贴图
         */
        public set shadowMapTexture(texture: TextureBase) {
            if (this.materialData.shadowMapTexture != texture) {
                this.materialData.shadowMapTexture = texture;
                this.materialData.textureChange = true;
            }
        }
        public get shadowMapTexture(): TextureBase {
            return this.materialData.shadowMapTexture;
        }

        public upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void {
            if (usage.uniform_ShadowMatrix) {
                usage.uniform_ShadowMatrix.uniformIndex = context3DProxy.getUniformLocation(usage.program3D, "uniform_ShadowMatrix");
            }
        }

        public activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void {
            let camera = ShadowCast.instance.shadowCamera;
            if (camera) {
                if (usage.uniform_ShadowMatrix && usage.uniform_ShadowMatrix.uniformIndex) {
                    context3DProxy.uniformMatrix4fv(usage.uniform_ShadowMatrix.uniformIndex, false, camera.viewProjectionMatrix.rawData);
                }
            }
            context3DProxy.uniform4fv(usage.uniform_ShadowColor.uniformIndex, this.materialData.shadowColor);
        }
    }
}

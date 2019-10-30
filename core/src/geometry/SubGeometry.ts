namespace dou3d {
    /**
     * 表示几何形状子集, 不同的子集渲染时使用的材质会不同, 这样就可以用不同的材质来共用相同的 geometry buffer
     * @author wizardc
     */
    export class SubGeometry {
        private _useVertexAttributeList: { [key: number]: number } = {};

        /**
         * 顶点索引
         */
        public start: number = 0;

        /**
         * 顶点数量
         */
        public count: number = 0;

        /**
         * 材质ID
         */
        public matID: number = 0;

        /**
         * 属于的几何体对象
         */
        public geometry: Geometry;

        /**
         * 材质球的漫反射贴图
         */
        public textureDiffuse: string;

        /**
         * 材质球的凹凸法线贴图
         */
        public textureNormal: string;

        /**
         * 材质球的高光贴图
         */
        public textureSpecular: string;

        public preAttList: Attribute[] = [];

        public activeState(passUsage: PassUsage, contextProxy: Context3DProxy): void {
            if (passUsage.attributeDiry) {
                this.upload(passUsage, contextProxy);
            }
            contextProxy.disableAllVertexAttribArray();
            for (let i = 0; i < passUsage.attributeList.length; i++) {
                let attribute = passUsage.attributeList[i];
                if (attribute.uniformIndex >= 0) {
                    contextProxy.vertexAttribPointer(attribute.uniformIndex, attribute.size, attribute.dataType, attribute.normalized, attribute.stride, attribute.offsetBytes);
                }
            }
        }

        public upload(passUsage: PassUsage, contextPorxy: Context3DProxy): void {
            passUsage.attributeDiry = false;
            let offsetBytes = 0;
            passUsage.attributeList = [];
            if (this.geometry.vertexFormat & VertexFormat.VF_POSITION) {
                if (passUsage.attribute_position) {
                    if (!passUsage.attribute_position.uniformIndex) {
                        passUsage.attribute_position.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_position.varName);
                    }
                    passUsage.attribute_position.size = Geometry.positionSize;
                    passUsage.attribute_position.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_position.normalized = false;
                    passUsage.attribute_position.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_position.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_position);
                    this._useVertexAttributeList[passUsage.attribute_position.uniformIndex] = passUsage.attribute_position.uniformIndex;
                }
                offsetBytes += Geometry.positionSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & VertexFormat.VF_NORMAL) {
                if (passUsage.attribute_normal) {
                    if (!passUsage.attribute_normal.uniformIndex) {
                        passUsage.attribute_normal.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_normal.varName);
                    }
                    passUsage.attribute_normal.size = Geometry.normalSize;
                    passUsage.attribute_normal.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_normal.normalized = false;
                    passUsage.attribute_normal.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_normal.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_normal);
                    this._useVertexAttributeList[passUsage.attribute_normal.uniformIndex] = passUsage.attribute_normal.uniformIndex;
                }
                offsetBytes += Geometry.normalSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & VertexFormat.VF_TANGENT) {
                if (passUsage.attribute_tangent) {
                    if (!passUsage.attribute_tangent.uniformIndex) {
                        passUsage.attribute_tangent.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_tangent.varName);
                    }
                    passUsage.attribute_tangent.size = Geometry.tangentSize;
                    passUsage.attribute_tangent.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_tangent.normalized = false;
                    passUsage.attribute_tangent.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_tangent.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_tangent);
                    this._useVertexAttributeList[passUsage.attribute_tangent.uniformIndex] = passUsage.attribute_tangent.uniformIndex;
                }
                offsetBytes += Geometry.tangentSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & VertexFormat.VF_COLOR) {
                if (passUsage.attribute_color) {
                    if (!passUsage.attribute_color.uniformIndex) {
                        passUsage.attribute_color.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_color.varName);
                    }
                    passUsage.attribute_color.size = Geometry.colorSize;
                    passUsage.attribute_color.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_color.normalized = false;
                    passUsage.attribute_color.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_color.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_color);
                    this._useVertexAttributeList[passUsage.attribute_color.uniformIndex] = passUsage.attribute_color.uniformIndex;
                }
                offsetBytes += Geometry.colorSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & VertexFormat.VF_UV0) {
                if (passUsage.attribute_uv0) {
                    if (!passUsage.attribute_uv0.uniformIndex) {
                        passUsage.attribute_uv0.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_uv0.varName);
                    }
                    passUsage.attribute_uv0.size = Geometry.uvSize;
                    passUsage.attribute_uv0.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_uv0.normalized = false;
                    passUsage.attribute_uv0.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_uv0.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_uv0);
                    this._useVertexAttributeList[passUsage.attribute_uv0.uniformIndex] = passUsage.attribute_uv0.uniformIndex;
                }
                offsetBytes += Geometry.uvSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & VertexFormat.VF_UV1) {
                if (passUsage.attribute_uv1) {
                    if (!passUsage.attribute_uv1.uniformIndex) {
                        passUsage.attribute_uv1.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_uv1.varName);
                    }
                    passUsage.attribute_uv1.size = Geometry.uv2Size;
                    passUsage.attribute_uv1.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_uv1.normalized = false;
                    passUsage.attribute_uv1.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_uv1.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_uv1);
                    this._useVertexAttributeList[passUsage.attribute_uv1.uniformIndex] = passUsage.attribute_uv1.uniformIndex;
                }
                offsetBytes += Geometry.uv2Size * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & VertexFormat.VF_SKIN) {
                if (passUsage.attribute_boneIndex) {
                    if (!passUsage.attribute_boneIndex.uniformIndex) {
                        passUsage.attribute_boneIndex.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_boneIndex.varName);
                    }
                    passUsage.attribute_boneIndex.size = Geometry.skinSize / 2;
                    passUsage.attribute_boneIndex.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_boneIndex.normalized = false;
                    passUsage.attribute_boneIndex.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_boneIndex.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_boneIndex);
                    this._useVertexAttributeList[passUsage.attribute_boneIndex.uniformIndex] = passUsage.attribute_boneIndex.uniformIndex;
                }
                offsetBytes += Geometry.skinSize / 2 * Float32Array.BYTES_PER_ELEMENT;
                if (passUsage.attribute_boneWeight) {
                    if (!passUsage.attribute_boneWeight.uniformIndex) {
                        passUsage.attribute_boneWeight.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_boneWeight.varName);
                    }
                    passUsage.attribute_boneWeight.size = Geometry.skinSize / 2;
                    passUsage.attribute_boneWeight.dataType = Context3DProxy.gl.FLOAT;
                    passUsage.attribute_boneWeight.normalized = false;
                    passUsage.attribute_boneWeight.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_boneWeight.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_boneWeight);
                    this._useVertexAttributeList[passUsage.attribute_boneWeight.uniformIndex] = passUsage.attribute_boneWeight.uniformIndex;
                }
                offsetBytes += Geometry.skinSize / 2 * Float32Array.BYTES_PER_ELEMENT;
            }
            for (let i = 0; i < this.preAttList.length; ++i) {
                let var0: VarRegister = this.preAttList[i];
                let attribute: Attribute = passUsage[var0.name];
                if (attribute) {
                    if (!attribute.uniformIndex) {
                        attribute.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, attribute.varName);
                        attribute.size = var0.size;
                        attribute.dataType = Context3DProxy.gl.FLOAT;
                        attribute.normalized = false;
                        attribute.stride = this.geometry.vertexSizeInBytes;
                        attribute.offsetBytes = offsetBytes;
                        passUsage.attributeList.push(attribute);
                        this._useVertexAttributeList[attribute.uniformIndex] = attribute.uniformIndex;
                    }
                }
                offsetBytes += var0.size * Float32Array.BYTES_PER_ELEMENT;
            }
        }
    }
}

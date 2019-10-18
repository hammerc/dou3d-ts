namespace dou3d {
    /**
     * 几何体创建器
     * @author wizardc
     */
    export class GeometryCreator {
        /**
         * 构建几何体
         */
        public static buildGeomtry(source: GeometryCreator, vertexFormat: number): Geometry {
            let target = new Geometry();
            target.vertexFormat = vertexFormat;
            target.vertexCount = source.faces * 3;
            target.indexCount = source.faces * 3;
            target.faceCount = source.faces;
            target.skeleton = source.skeleton;
            let vertex = new Vector3();
            let normal = new Vector3(1.0, 1.0, 1.0);
            let color = new Vector4(1.0, 1.0, 1.0, 1.0);
            let uv_0 = { u: 1, v: 0 };
            let uv_1 = { u: 1, v: 0 };
            let index = 0;
            let vertexIndex = 0;
            let offset = 0;
            for (let faceIndex = 0; faceIndex < source.faces; faceIndex++) {
                target.indexArray[faceIndex * 3 + 0] = faceIndex * 3 + 0;
                target.indexArray[faceIndex * 3 + 1] = faceIndex * 3 + 2;
                target.indexArray[faceIndex * 3 + 2] = faceIndex * 3 + 1;
                for (let i = 0; i < 3; i++) {
                    vertexIndex = faceIndex * 3 + i;
                    vertexIndex *= target.vertexAttLength;
                    offset = 0;
                    index = source.vertexIndices[faceIndex * 3 + i] * Geometry.positionSize;
                    if (vertexFormat & VertexFormat.VF_POSITION) {
                        vertex.x = source.source_vertexData[index + 0];
                        vertex.y = source.source_vertexData[index + 1];
                        vertex.z = source.source_vertexData[index + 2];
                        target.vertexArray[vertexIndex + offset + 0] = vertex.x;
                        target.vertexArray[vertexIndex + offset + 1] = vertex.y;
                        target.vertexArray[vertexIndex + offset + 2] = vertex.z;
                        offset += Geometry.positionSize;
                    }
                    if (vertexFormat & VertexFormat.VF_NORMAL) {
                        if (source.normalIndices && source.source_normalData && source.source_normalData.length > 0) {
                            index = source.normalIndices[faceIndex * 3 + i] * Geometry.normalSize;
                            normal.x = source.source_normalData[index + 0];
                            normal.y = source.source_normalData[index + 1];
                            normal.z = source.source_normalData[index + 2];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = normal.x;
                        target.vertexArray[vertexIndex + offset + 1] = normal.y;
                        target.vertexArray[vertexIndex + offset + 2] = normal.z;
                        offset += Geometry.normalSize;
                    }
                    if (vertexFormat & VertexFormat.VF_TANGENT) {
                        target.vertexArray[vertexIndex + offset + 0] = 0;
                        target.vertexArray[vertexIndex + offset + 1] = 0;
                        target.vertexArray[vertexIndex + offset + 2] = 0;
                        offset += Geometry.tangentSize;
                    }
                    if (vertexFormat & VertexFormat.VF_COLOR) {
                        if (source.colorIndices && source.source_vertexColorData && source.source_vertexColorData.length > 0) {
                            index = source.colorIndices[faceIndex * 3 + i] * Geometry.colorSize;
                            color.x = source.source_vertexColorData[index + 0];
                            color.y = source.source_vertexColorData[index + 1];
                            color.z = source.source_vertexColorData[index + 2];
                            color.w = source.source_vertexColorData[index + 3];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = color.x;
                        target.vertexArray[vertexIndex + offset + 1] = color.y;
                        target.vertexArray[vertexIndex + offset + 2] = color.z;
                        target.vertexArray[vertexIndex + offset + 3] = color.w;
                        offset += Geometry.colorSize;
                    }
                    if (vertexFormat & VertexFormat.VF_UV0) {
                        if (source.uvIndices && source.source_uvData && source.source_uvData.length > 0) {
                            index = source.uvIndices[faceIndex * 3 + i] * Geometry.uvSize;
                            uv_0.u = source.source_uvData[index + 0];
                            uv_0.v = source.source_uvData[index + 1];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = uv_0.u;
                        target.vertexArray[vertexIndex + offset + 1] = uv_0.v;
                        offset += Geometry.uvSize;
                    }
                    if (vertexFormat & VertexFormat.VF_UV1) {
                        if (source.uv2Indices && source.source_uv2Data && source.source_uv2Data.length > 0) {
                            index = source.uv2Indices[faceIndex * 3 + i] * Geometry.uv2Size;
                            uv_1.u = source.source_uv2Data[index + 0];
                            uv_1.v = source.source_uv2Data[index + 1];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = uv_1.u;
                        target.vertexArray[vertexIndex + offset + 1] = uv_1.v;
                        offset += Geometry.uv2Size;
                    }
                    if (vertexFormat & VertexFormat.VF_SKIN) {
                        if (source.source_skinData && source.source_skinData.length > 0) {
                            index = source.vertexIndices[faceIndex * 3 + i] * Geometry.skinSize;
                            target.vertexArray[vertexIndex + offset + 0] = source.source_skinData[index + 0];
                            target.vertexArray[vertexIndex + offset + 1] = source.source_skinData[index + 2];
                            target.vertexArray[vertexIndex + offset + 2] = source.source_skinData[index + 4];
                            target.vertexArray[vertexIndex + offset + 3] = source.source_skinData[index + 6];
                            target.vertexArray[vertexIndex + offset + 4] = source.source_skinData[index + 1];
                            target.vertexArray[vertexIndex + offset + 5] = source.source_skinData[index + 3];
                            target.vertexArray[vertexIndex + offset + 6] = source.source_skinData[index + 5];
                            target.vertexArray[vertexIndex + offset + 7] = source.source_skinData[index + 7];
                        }
                        else {
                            target.vertexArray[vertexIndex + offset + 0] = 0;
                            target.vertexArray[vertexIndex + offset + 1] = 0;
                            target.vertexArray[vertexIndex + offset + 2] = 0;
                            target.vertexArray[vertexIndex + offset + 3] = 0;
                            target.vertexArray[vertexIndex + offset + 4] = 0;
                            target.vertexArray[vertexIndex + offset + 5] = 0;
                            target.vertexArray[vertexIndex + offset + 6] = 0;
                            target.vertexArray[vertexIndex + offset + 7] = 0;
                        }
                    }
                }
            }
            for (let i = 0; i < source.matCount; ++i) {
                let subGeometry = new SubGeometry();
                subGeometry.matID = i;
                subGeometry.geometry = target;
                subGeometry.start = source.material[i].start * 3 * Uint16Array.BYTES_PER_ELEMENT;
                subGeometry.count = source.material[i].count * 3;
                subGeometry.textureDiffuse = source.material[i].textureDiffuse;
                subGeometry.textureNormal = source.material[i].textureNormal;
                subGeometry.textureSpecular = source.material[i].textureSpecular;
                target.subGeometrys.push(subGeometry);
            }
            return target;
        }

        /**
         * 顶点属性长度
         */
        public vertexAttLength: number = 17;

        /**
         * 数据长度
         */
        public length: number;

        /**
         * 顶点长度
         */
        public vertLen: number = 0;

        /**
         * 面数
         */
        public faces: number = 0;

        /**
         * 索引数据
         */
        public source_indexData: number[] = [];

        /**
         * 顶点数据
         */
        public source_vertexData: number[] = [];

        /**
         * 顶点色数据
         */
        public source_vertexColorData: number[] = [];

        /**
         * 顶点法线
         */
        public source_normalData: number[] = [];

        /**
         * 顶点切线数据
         */
        public source_tangtData: number[] = [];

        /**
         * 顶点uv数据
         */
        public source_uvData: number[] = [];

        /**
         * 顶点uv2数据
         */
        public source_uv2Data: number[] = [];

        /**
         * 蒙皮数据
         */
        public source_skinData: number[] = [];

        /**
         * 顶点索引
         */
        public vertexIndex: number = 0;

        /**
         * 索引数据数组
         */
        public indices: number[] = [];

        /**
         * 顶点数据数组(x、y、z)三个number为一个顶点数据
         */
        public vertices: number[] = [];

        /**
         * 法线数据数组(x、y、z)三个number为一个法线数据
         */
        public normals: number[] = [];

        /**
         * 切线数据数组(x、y、z)三个number为一个切线数据
         */
        public tangts: number[] = [];

        /**
         * 顶点颜色数据数组
         */
        public verticesColor: number[] = [];

        /**
         * 第一套UV数据数组
         */
        public uvs: number[] = [];

        /**
         * 第二套UV数据数组
         */
        public uv2s: number[] = [];

        /**
         * 蒙皮数据数组
         */
        public skinMesh: number[] = [];

        /**
         * 面法线数据数组
         */
        public faceNormals: number[] = [];

        /**
         * 面权重数据数组
         */
        public faceWeights: number[] = [];

        /**
         * 顶点索引数据
         */
        public vertexIndices: number[] = [];

        /**
         * uv索引数据
         */
        public uvIndices: number[] = [];

        /**
         * uv2索引数据
         */
        public uv2Indices: number[] = [];

        /**
         * 法线索引数据
         */
        public normalIndices: number[] = [];

        /**
         * 顶点色索引数据
         */
        public colorIndices: number[] = [];

        /**
         * 索引数据数组
         */
        public indexIds: any[] = [];

        public skeleton: Skeleton;

        /**
         * 顶点数据数组
         */
        public vertexDatas: number[];

        public matCount: number = 0;

        public material: any = {};
    }
}

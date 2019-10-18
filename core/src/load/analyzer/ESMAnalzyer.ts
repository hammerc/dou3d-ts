namespace dou3d {
    /**
     * 自定义文件类型模型加载器
     * @author wizardc
     */
    export class ESMAnalyzer implements dou.IAnalyzer {
        public load(url: string, callback: (url: string, data: any) => void, thisObj: any): void {
            let request = new dou.HttpRequest();
            request.responseType = dou.HttpResponseType.arraybuffer;
            request.on(dou.Event.COMPLETE, (event: Event) => {
                callback.call(thisObj, url, this.createGeometry(request.response));
            }, this);
            request.on(dou.IOErrorEvent.IO_ERROR, (event: dou.IOErrorEvent) => {
                callback.call(thisObj, url);
            }, this);
            request.open(url, dou.HttpMethod.GET);
            request.send();
        }

        private createGeometry(data: any): Geometry {
            let bytes = new dou.ByteArray(data);
            bytes.position = 3;
            let version = bytes.readUnsignedInt();
            let geomtryCreator = new GeometryCreator();
            switch (version) {
                case 1:
                    this.parseVersion_1(bytes, geomtryCreator);
                    break;
                case 2:
                    this.parseVersion_2(bytes, geomtryCreator);
                    break;
                case 3:
                    this.parseVersion_3(bytes, geomtryCreator);
                    break;
                default:
                    console.error("ESM version error : " + version);
                    return null;
            }
            let geomtry: Geometry;
            let vertexFormat = 0;
            if (geomtryCreator.source_skinData.length > 0) {
                vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0 | VertexFormat.VF_SKIN;
                geomtry = GeometryCreator.buildGeomtry(geomtryCreator, vertexFormat);
            }
            else {
                vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0 | VertexFormat.VF_UV1;
                geomtry = GeometryCreator.buildGeomtry(geomtryCreator, vertexFormat);
            }
            return geomtry;
        }

        public parseVersion_1(bytes: dou.ByteArray, geomtry: GeometryCreator): void {
            let description = bytes.readInt();
            geomtry.matCount = bytes.readInt();
            for (let i = 0; i < geomtry.matCount; ++i) {
                geomtry.material[i] = {};
                geomtry.material[i].matID = bytes.readInt();
                geomtry.material[i].start = bytes.readInt();
                geomtry.material[i].count = bytes.readInt();
                geomtry.material[i].textureDiffuse = bytes.readUTF();
                geomtry.material[i].textureNormal = bytes.readUTF();
                geomtry.material[i].textureSpecular = bytes.readUTF();
            }
            if (description & VertexFormat.VF_POSITION) {
                let vertexCount = bytes.readInt();
                for (let i = 0; i < vertexCount; i++) {
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_NORMAL) {
                let vertexNormalCount = bytes.readInt();
                for (let i = 0; i < vertexNormalCount; i++) {
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_COLOR) {
                let vertexColorCount = bytes.readInt();
                for (let i = 0; i < vertexColorCount; i++) {
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_UV0) {
                let uvCount = bytes.readInt();
                for (let i = 0; i < uvCount; i++) {
                    geomtry.source_uvData.push(bytes.readFloat());
                    geomtry.source_uvData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_UV1) {
                let uvCount = bytes.readInt();
                for (let i = 0; i < uvCount; i++) {
                    geomtry.source_uv2Data.push(bytes.readFloat());
                    geomtry.source_uv2Data.push(bytes.readFloat());
                }
            }
            geomtry.faces = bytes.readInt();
            for (let i = 0; i < geomtry.faces; i++) {
                geomtry.vertexIndices.push(bytes.readUnsignedInt());
                geomtry.vertexIndices.push(bytes.readUnsignedInt());
                geomtry.vertexIndices.push(bytes.readUnsignedInt());
                if (description & VertexFormat.VF_NORMAL) {
                    geomtry.normalIndices.push(bytes.readUnsignedInt());
                    geomtry.normalIndices.push(bytes.readUnsignedInt());
                    geomtry.normalIndices.push(bytes.readUnsignedInt());
                }
                if (description & VertexFormat.VF_COLOR) {
                    geomtry.colorIndices.push(bytes.readUnsignedInt());
                    geomtry.colorIndices.push(bytes.readUnsignedInt());
                    geomtry.colorIndices.push(bytes.readUnsignedInt());
                }
                if (description & VertexFormat.VF_UV0) {
                    geomtry.uvIndices.push(bytes.readUnsignedInt());
                    geomtry.uvIndices.push(bytes.readUnsignedInt());
                    geomtry.uvIndices.push(bytes.readUnsignedInt());
                }
                if (description & VertexFormat.VF_UV1) {
                    geomtry.uv2Indices.push(bytes.readUnsignedInt());
                    geomtry.uv2Indices.push(bytes.readUnsignedInt());
                    geomtry.uv2Indices.push(bytes.readUnsignedInt());
                }
            }
            let nBoneCount = bytes.readUnsignedByte();
            if (nBoneCount > 0) {
                geomtry.skeleton = new Skeleton();
            }
            let rotation = new Vector3();
            let scaling = new Vector3();
            let translation = new Vector3();
            for (let i: number = 0; i < nBoneCount; ++i) {
                let joint = new Joint(null);
                bytes.readInt();
                joint.parentIndex = bytes.readInt();
                joint.name = bytes.readUTF();
                rotation.x = bytes.readFloat() * MathUtil.RAD_DEG;
                rotation.y = bytes.readFloat() * MathUtil.RAD_DEG;
                rotation.z = bytes.readFloat() * MathUtil.RAD_DEG;
                scaling.x = bytes.readFloat();
                scaling.y = bytes.readFloat();
                scaling.z = bytes.readFloat();
                translation.x = bytes.readFloat();
                translation.y = bytes.readFloat();
                translation.z = bytes.readFloat();
                joint.buildInverseMatrix(scaling, rotation, translation);
                geomtry.skeleton.joints.push(joint);
            }
            let nVertsCount = bytes.readInt();
            for (let i = 0; i < nVertsCount; i++) {
                let nCount = bytes.readUnsignedByte();
                for (let j = 0; j < nCount; j++) {
                    geomtry.source_skinData.push(bytes.readUnsignedByte());
                    geomtry.source_skinData.push(bytes.readFloat());
                }
                for (let j = nCount; j < 4; j++) {
                    geomtry.source_skinData.push(0);
                    geomtry.source_skinData.push(0);
                }
            }
        }

        public parseVersion_2(bytes: dou.ByteArray, geomtry: GeometryCreator): void {
            let description = bytes.readInt();
            geomtry.matCount = bytes.readInt();
            for (let i = 0; i < geomtry.matCount; ++i) {
                geomtry.material[i] = {};
                geomtry.material[i].matID = bytes.readInt();
                geomtry.material[i].start = bytes.readInt();
                geomtry.material[i].count = bytes.readInt();
                geomtry.material[i].textureDiffuse = bytes.readUTF();
                geomtry.material[i].textureNormal = bytes.readUTF();
                geomtry.material[i].textureSpecular = bytes.readUTF();
            }
            if (description & VertexFormat.VF_POSITION) {
                let vertexCount = bytes.readInt();
                for (let i = 0; i < vertexCount; i++) {
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_NORMAL) {
                let vertexNormalCount = bytes.readInt();
                for (let i = 0; i < vertexNormalCount; i++) {
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_COLOR) {
                let vertexColorCount = bytes.readInt();
                for (let i = 0; i < vertexColorCount; i++) {
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                }
            }
            if (description & VertexFormat.VF_UV0) {
                let uvCount = bytes.readInt();
                for (let i = 0; i < uvCount; i++) {
                    geomtry.source_uvData.push(bytes.readFloat());
                    geomtry.source_uvData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_UV1) {
                let uvCount = bytes.readInt();
                for (let i = 0; i < uvCount; i++) {
                    geomtry.source_uv2Data.push(bytes.readFloat());
                    geomtry.source_uv2Data.push(bytes.readFloat());
                }
            }
            geomtry.faces = bytes.readInt();
            for (let i = 0; i < geomtry.faces; i++) {
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                if (description & VertexFormat.VF_NORMAL) {
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                }
                if (description & VertexFormat.VF_COLOR) {
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                }
                if (description & VertexFormat.VF_UV0) {
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                }
                if (description & VertexFormat.VF_UV1) {
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                }
            }
            let nBoneCount = bytes.readUnsignedByte();
            if (nBoneCount > 0) {
                geomtry.skeleton = new Skeleton();
            }
            let rotation = new Vector3();
            let scaling = new Vector3();
            let translation = new Vector3();
            for (let i = 0; i < nBoneCount; ++i) {
                let joint = new Joint(null);
                bytes.readInt();
                joint.parentIndex = bytes.readInt();
                joint.name = bytes.readUTF();
                rotation.x = bytes.readFloat() * MathUtil.RAD_DEG;
                rotation.y = bytes.readFloat() * MathUtil.RAD_DEG;
                rotation.z = bytes.readFloat() * MathUtil.RAD_DEG;
                scaling.x = bytes.readFloat();
                scaling.y = bytes.readFloat();
                scaling.z = bytes.readFloat();
                translation.x = bytes.readFloat();
                translation.y = bytes.readFloat();
                translation.z = bytes.readFloat();
                joint.buildInverseMatrix(scaling, rotation, translation);
                geomtry.skeleton.joints.push(joint);
            }
            let nVertsCount = bytes.readInt();
            for (let i = 0; i < nVertsCount; i++) {
                let nCount = bytes.readUnsignedByte();
                for (let j = 0; j < nCount; j++) {
                    geomtry.source_skinData.push(bytes.readUnsignedByte());
                    geomtry.source_skinData.push(bytes.readFloat());
                }
                for (let j = nCount; j < 4; j++) {
                    geomtry.source_skinData.push(0);
                    geomtry.source_skinData.push(0);
                }
            }
        }

        public parseVersion_3(bytes: dou.ByteArray, geomtry: GeometryCreator): void {
            let description = bytes.readInt();
            geomtry.matCount = bytes.readInt();
            for (let i = 0; i < geomtry.matCount; ++i) {
                geomtry.material[i] = {};
                geomtry.material[i].matID = bytes.readInt();
                geomtry.material[i].start = bytes.readInt();
                geomtry.material[i].count = bytes.readInt();
                geomtry.material[i].textureDiffuse = bytes.readUTF();
                geomtry.material[i].textureNormal = bytes.readUTF();
                geomtry.material[i].textureSpecular = bytes.readUTF();
            }
            if (description & VertexFormat.VF_POSITION) {
                let vertexCount = bytes.readInt();
                for (let i = 0; i < vertexCount; i++) {
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_NORMAL) {
                let vertexNormalCount = bytes.readInt();
                for (let i = 0; i < vertexNormalCount; i++) {
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_COLOR) {
                let vertexColorCount = bytes.readInt();
                for (let i = 0; i < vertexColorCount; i++) {
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                }
            }
            if (description & VertexFormat.VF_UV0) {
                let uvCount = bytes.readInt();
                for (let i = 0; i < uvCount; i++) {
                    geomtry.source_uvData.push(bytes.readFloat());
                    geomtry.source_uvData.push(bytes.readFloat());
                }
            }
            if (description & VertexFormat.VF_UV1) {
                let uvCount = bytes.readInt();
                for (let i = 0; i < uvCount; i++) {
                    geomtry.source_uv2Data.push(bytes.readFloat());
                    geomtry.source_uv2Data.push(bytes.readFloat());
                }
            }
            geomtry.faces = bytes.readInt();
            for (let i = 0; i < geomtry.faces; i++) {
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                if (description & VertexFormat.VF_NORMAL) {
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                }
                if (description & VertexFormat.VF_COLOR) {
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                }
                if (description & VertexFormat.VF_UV0) {
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                }
                if (description & VertexFormat.VF_UV1) {
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                }
            }
            let nBoneCount = bytes.readUnsignedByte();
            if (nBoneCount > 0) {
                geomtry.skeleton = new Skeleton();
            }
            let orientation = new Quaternion();
            let scaling = new Vector3();
            let translation = new Vector3();
            for (let i = 0; i < nBoneCount; ++i) {
                let joint = new Joint(null);
                bytes.readInt();
                joint.parentIndex = bytes.readInt();
                joint.name = bytes.readUTF();
                orientation.x = bytes.readFloat();
                orientation.y = bytes.readFloat();
                orientation.z = bytes.readFloat();
                orientation.w = bytes.readFloat();
                scaling.x = bytes.readFloat();
                scaling.y = bytes.readFloat();
                scaling.z = bytes.readFloat();
                translation.x = bytes.readFloat();
                translation.y = bytes.readFloat();
                translation.z = bytes.readFloat();
                joint.buildInverseMatrix(scaling, orientation, translation);
                geomtry.skeleton.joints.push(joint);
            }
            let nVertsCount = bytes.readInt();
            for (let i = 0; i < nVertsCount; i++) {
                let nCount = bytes.readUnsignedByte();
                for (let j = 0; j < nCount; j++) {
                    geomtry.source_skinData.push(bytes.readUnsignedByte());
                    geomtry.source_skinData.push(bytes.readFloat());
                }
                for (let j = nCount; j < 4; j++) {
                    geomtry.source_skinData.push(0);
                    geomtry.source_skinData.push(0);
                }
            }
        }

        public release(data: ImageTexture): boolean {
            return true;
        }
    }
}

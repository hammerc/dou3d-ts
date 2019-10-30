namespace dou3d {
    /**
     * 渲染线框
     * * 使用LINES的模式进行渲染
     * @author wizardc
     */
    export class Wireframe extends RenderBase {
        public constructor(color: number = 0x7e7e7e) {
            super();
            this.type = "wireframe";
            this.geometry = new Geometry();
            this.material = new ColorMaterial(color);
            this.addSubMaterial(0, this.material);
            this.material.drawMode = Context3DProxy.gl.LINES;
            this.geometry.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_COLOR | VertexFormat.VF_UV0;
        }

        public fromVertexs(src: any, vf: VertexFormat = VertexFormat.VF_POSITION): void {
            if (src) {
                this.geometry.setVerticesForIndex(0, vf, src, src.length / GeometryUtil.fromVertexFormatToLength(vf));
                this.geometry.indexCount = (this.geometry.vertexCount - 1) * 2;
                for (let i = 0; i < this.geometry.vertexCount - 1; ++i) {
                    this.geometry.indexArray[i * 2 + 0] = i;
                    this.geometry.indexArray[i * 2 + 1] = i + 1;
                }
            }
        }

        public fromVertexsEx(src: any, vf: VertexFormat = VertexFormat.VF_POSITION): void {
            if (src) {
                this.geometry.setVerticesForIndex(0, vf, src, src.length / GeometryUtil.fromVertexFormatToLength(vf));
                this.geometry.indexCount = this.geometry.vertexCount;
                for (let i = 0; i < this.geometry.vertexCount; ++i) {
                    this.geometry.indexArray[i] = i;
                }
            }
        }

        public fromGeometry(geo: Geometry): void {
            let target = [];
            geo.getVertexForIndex(0, VertexFormat.VF_POSITION | VertexFormat.VF_COLOR, target, geo.vertexCount);
            this.geometry.setVerticesForIndex(0, VertexFormat.VF_POSITION | VertexFormat.VF_COLOR, target, geo.vertexCount);
            this.geometry.indexCount = geo.faceCount * 6;
            for (let i = 0; i < geo.faceCount; ++i) {
                let _0 = geo.indexArray[i * 3 + 0];
                let _1 = geo.indexArray[i * 3 + 1];
                let _2 = geo.indexArray[i * 3 + 2];
                this.geometry.indexArray[i * 6 + 0] = _0;
                this.geometry.indexArray[i * 6 + 1] = _1;
                this.geometry.indexArray[i * 6 + 2] = _1;
                this.geometry.indexArray[i * 6 + 3] = _2;
                this.geometry.indexArray[i * 6 + 4] = _2;
                this.geometry.indexArray[i * 6 + 5] = _0;
            }
        }
    }
}

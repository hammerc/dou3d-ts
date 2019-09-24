namespace dou3d {
    /**
     * 圆柱体
     * @author wizardc
     */
    export class CylinderGeometry extends Geometry {
        private _height: number;
        private _radius: number;

        public constructor(height: number = 100, radius: number = 200) {
            super();
            this._height = height;
            this._radius = radius;
            this.buildGeomtry();
        }

        public get height(): number {
            return this._height;
        }

        public get radius(): number {
            return this._radius;
        }

        public buildGeomtry(): void {
            this.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0 | VertexFormat.VF_UV1;
            let vertexBuffer: number[] = [];
            let indexBuffer: number[] = [];
            let m_nSegments = 20;
            let nCurrentSegment = 20;
            let rDeltaSegAngle = (2.0 * Math.PI / m_nSegments);
            let rSegmentLength = 1.0 / m_nSegments;
            for (nCurrentSegment = 0; nCurrentSegment < m_nSegments; nCurrentSegment++) {
                let x0 = this._radius * Math.sin(nCurrentSegment * rDeltaSegAngle);
                let z0 = this._radius * Math.cos(nCurrentSegment * rDeltaSegAngle);
                vertexBuffer.push(
                    x0, 0.0 + (this._height / 2.0), z0, x0, 0.0, z0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                    x0, 0.0 - (this._height / 2.0), z0, x0, 0.0, z0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            }
            let len_base = vertexBuffer.length / this.vertexAttLength;
            let topCenter = len_base;
            vertexBuffer.push(0.0, 0.0 - (this._height / 2.0), 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            let buttomCenter = len_base + 1;
            vertexBuffer.push(0.0, 0.0 + (this._height / 2.0), 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            for (let i = 0; i < len_base; i++) {
                if ((i & 1) != 0) {
                    indexBuffer.push(
                        i,
                        i + 1 >= len_base ? i + 1 - len_base : i + 1,
                        i + 2 >= len_base ? i + 2 - len_base : i + 2,
                        topCenter,
                        i,
                        i + 2 >= len_base ? i + 2 - len_base : i + 2
                    );
                } else {
                    indexBuffer.push(
                        i + 1 >= len_base ? i + 1 - len_base : i + 1,
                        i,
                        i + 2 >= len_base ? i + 2 - len_base : i + 2,
                        i,
                        buttomCenter,
                        i + 2 >= len_base ? i + 2 - len_base : i + 2
                    );
                }
            }
            this.setVerticesForIndex(0, this.vertexFormat, vertexBuffer, vertexBuffer.length / this.vertexAttLength);
            this.setVertexIndices(0, indexBuffer);
            let subGeometry = new SubGeometry();
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        }
    }
}

namespace dou3d {
    /**
     * 模型网格
     * @author wizardc
     */
    export class Mesh extends RenderBase {
        public constructor(geometry: Geometry, material?: MaterialBase) {
            super();
            this.type = "mesh";
            this.geometry = geometry;
            this.material = material || new TextureMaterial();
            this.addSubMaterial(0, this.material);
            this.bound = this.buildBoundBox();
        }

        protected buildBoundBox(): Bound {
            let bound = new BoundBox(this, new Vector3(), new Vector3());
            if (this.geometry && this.geometry.vertexArray) {
                bound.min.copy(new Vector3(MathUtil.INT_MAX, MathUtil.INT_MAX, MathUtil.INT_MAX));
                bound.max.copy(new Vector3(-MathUtil.INT_MAX, -MathUtil.INT_MAX, -MathUtil.INT_MAX));
                for (let i = 0; i < this.geometry.vertexArray.length; i += this.geometry.vertexAttLength) {
                    if (bound.max.x < this.geometry.vertexArray[i]) {
                        bound.max.x = this.geometry.vertexArray[i];
                    }
                    if (bound.max.y < this.geometry.vertexArray[i + 1]) {
                        bound.max.y = this.geometry.vertexArray[i + 1];
                    }
                    if (bound.max.z < this.geometry.vertexArray[i + 2]) {
                        bound.max.z = this.geometry.vertexArray[i + 2];
                    }
                    if (bound.min.x > this.geometry.vertexArray[i]) {
                        bound.min.x = this.geometry.vertexArray[i];
                    }
                    if (bound.min.y > this.geometry.vertexArray[i + 1]) {
                        bound.min.y = this.geometry.vertexArray[i + 1];
                    }
                    if (bound.min.z > this.geometry.vertexArray[i + 2]) {
                        bound.min.z = this.geometry.vertexArray[i + 2];
                    }
                }
            }
            bound.fillBox(bound.min, bound.max);
            bound.createChild();
            this.bound = bound;
            return bound;
        }

        public clone(): Mesh {
            let cloneMesh = new Mesh(this.geometry, this.material);
            cloneMesh.multiMaterial = this.multiMaterial;
            return cloneMesh;
        }
    }
}

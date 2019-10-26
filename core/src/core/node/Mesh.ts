namespace dou3d {
    /**
     * 模型网格
     * @author wizardc
     */
    export class Mesh extends RenderBase {
        public constructor(geometry: Geometry, material?: MaterialBase, animation?: IAnimation) {
            super();
            this.type = "mesh";
            this.geometry = geometry;
            this.material = material || new TextureMaterial();
            this.addSubMaterial(0, this.material);
            if (animation) {
                this.animation = animation;
            }
            else {
                if (geometry) {
                    if (this.geometry.vertexFormat & VertexFormat.VF_SKIN) {
                        this.animation = new SkeletonAnimation();
                    }
                }
            }
        }

        public clone(): Mesh {
            let cloneMesh = new Mesh(this.geometry, this.material, this.animation ? this.animation.clone() : null);
            cloneMesh.multiMaterial = this.multiMaterial;
            return cloneMesh;
        }
    }
}

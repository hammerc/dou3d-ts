namespace dou3d {
    /**
     * 几何体工具类
     * @author wizardc
     */
    export namespace GeometryUtil {
        export function fromVertexFormatToLength(vf: VertexFormat): number {
            let length = 0;
            if (vf & VertexFormat.VF_POSITION) {
                length += Geometry.positionSize;
            }
            if (vf & VertexFormat.VF_NORMAL) {
                length += Geometry.normalSize;
            }
            if (vf & VertexFormat.VF_TANGENT) {
                length += Geometry.tangentSize;
            }
            if (vf & VertexFormat.VF_COLOR) {
                length += Geometry.colorSize;
            }
            if (vf & VertexFormat.VF_UV0) {
                length += Geometry.uvSize;
            }
            if (vf & VertexFormat.VF_UV1) {
                length += Geometry.uv2Size;
            }
            if (vf & VertexFormat.VF_SKIN) {
                length += Geometry.skinSize;
            }
            return length;
        }
    }
}

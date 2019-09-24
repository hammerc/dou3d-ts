namespace dou3d {
    /**
     * 顶点类型
     * @author wizardc
     */
    export const enum VertexFormat {
        /**
         * 顶点坐标
         */
        VF_POSITION = 0x00000001,

        /**
         * 顶点法线
         */
        VF_NORMAL = 0x00000002,

        /**
         * 顶点切线
         */
        VF_TANGENT = 0x00000004,

        /**
         * 顶点颜色
         */
        VF_COLOR = 0x00000008,

        /**
         * 顶点uv
         */
        VF_UV0 = 0x00000010,

        /**
         * 顶点第二uv
         */
        VF_UV1 = 0x00000020,

        /**
         * 顶点蒙皮信息
         */
        VF_SKIN = 0x00000040,
    }
}

namespace dou3d {
    /**
     * 基础包围盒类
     * - 包含包围盒的各顶点信息, 当包围盒要进行世界变换时, 应当变换各顶点信息
     * @author wizardc
     */
    export class Bound extends dou.HashObject {
        /**
         * 顶点数据
         */
        public vexData: Float32Array;

        /**
         * 索引数据
         */
        public indexData: Uint16Array;

        /**
         * 顶点长度
         */
        public vexLength: number = 3;

        /**
         * 子包围盒
         */
        public childBound: Bound;

        /**
         * 绑定的Object3D对象
         */
        public owner: Object3D;

    }
}

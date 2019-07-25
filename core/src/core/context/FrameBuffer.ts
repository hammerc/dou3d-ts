namespace dou3d {
    /**
     * 提供了用于呈现几何定义图形的上下文的帧缓冲对象
     * 渲染上下文包括一个绘图表面及其关联的资源帧缓冲对象
     * @author wizardc
     */
    export class FrameBuffer {
        public name: number;
        public width: number;
        public height: number;
        public texture: ContextTexture2D;
    }
}

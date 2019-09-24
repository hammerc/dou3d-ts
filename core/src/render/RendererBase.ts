namespace dou3d {
    /**
     * 执行渲染基类
     * @author wizardc
     */
    export abstract class RendererBase {
        public renderTexture: RenderTexture;
        public numEntity: number = 0;

        /**
         * 设置为渲染到贴图
         */
        public setRenderToTexture(width: number, height: number, format: FrameBufferFormat = FrameBufferFormat.UNSIGNED_BYTE_RGB): void {
            this.renderTexture = new RenderTexture(width, height, format);
        }

        /**
         * 执行渲染
         * @param time 当前时间
         * @param delay 每帧间隔时间
         * @param context3D 设备上下文
         * @param collect 渲染对象收集器
         * @param camera 渲染时的相机
         */
        public abstract draw(time: number, delay: number, context3D: Context3DProxy, collect: CollectBase, camera: Camera3D, backViewPort?: Rectangle): void;
    }
}

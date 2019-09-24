namespace dou3d {
    /**
     * 3D 相关配置
     * @author wizardc
     */
    export namespace ContextConfig {
        /**
         * canvas 窗口矩形
         */
        export var canvasRectangle: Rectangle;

        /**
         * 混合模式标志
         */
        export var BLEND: number;

        /**
         * 深度测试标志
         */
        export var DEPTH_TEST: number;

        /**
         * 剔除面模式标志
         */
        export var CULL_FACE: number;

        /**
         * 裁剪正面进行反面渲染
         */
        export var FRONT: number;

        /**
         * 裁剪反面进行正面渲染
         */
        export var BACK: number;

        /**
         * 裁剪正面和反面
         */
        export var FRONT_AND_BACK: number;

        /**
         * 一个颜色用 16 个 bit (2 字节) 表示
         */
        export var ColorFormat_RGB565: number;

        /**
         * 一个颜色用 16 个 bit (2 字节) 表示
         */
        export var ColorFormat_RGBA5551: number;

        /**
         * 一个颜色用 16 个 bit (2 字节) 表示
         */
        export var ColorFormat_RGBA4444: number;

        /**
         * 一个颜色用 32 个 bit (4 字节) 表示
         */
        export var ColorFormat_RGBA8888: number;

        /**
         * 8 位整型
         */
        export var BYTE: GLenum;

        /**
         * 16 位整形
         */
        export var SHORT: GLenum;

        /**
         * 32 位整型
         */
        export var INT: GLenum;

        /**
         * 无符号 8 位整型
         */
        export var UNSIGNED_BYTE: GLenum;

        /**
         * 无符号 16 位整型
         */
        export var UNSIGNED_SHORT: GLenum;

        /**
         * 无符号 32 位整型
         */
        export var UNSIGNED_INT: GLenum;

        /**
         * 32 位浮点型
         */
        export var FLOAT: GLenum;

        /**
         * 小于等于
         */
        export var LEQUAL: number;

        /**
         * 绘制类型, 点
         */
        export var POINTS: number;

        /**
         * 绘制类型, 直线
         */
        export var LINES: number;

        /**
         * 绘制类型, 连续直线
         */
        export var LINE_STRIP: number;

        /**
         * 绘制类型, 三角形
         */
        export var TRIANGLES: number;

        export var ONE: number;
        export var ZERO: number;
        export var SRC_ALPHA: number;
        export var ONE_MINUS_SRC_ALPHA: number;
        export var SRC_COLOR: number;
        export var ONE_MINUS_SRC_COLOR: number;

        export function register(gl: WebGLRenderingContext): void {
            BLEND = gl.BLEND;
            DEPTH_TEST = gl.DEPTH_TEST;
            CULL_FACE = gl.CULL_FACE;

            FRONT = gl.FRONT;
            BACK = gl.BACK;
            FRONT_AND_BACK = gl.FRONT_AND_BACK;

            ColorFormat_RGB565 = gl.RGB565;
            ColorFormat_RGBA5551 = gl.RGB5_A1;
            ColorFormat_RGBA4444 = gl.RGBA4;
            ColorFormat_RGBA8888 = gl.RGBA;

            BYTE = gl.BYTE;
            SHORT = gl.SHORT;
            INT = gl.INT;
            UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
            UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
            UNSIGNED_INT = gl.UNSIGNED_INT;
            FLOAT = gl.FLOAT;

            LEQUAL = gl.LEQUAL;

            POINTS = gl.POINTS;
            LINES = gl.LINES;
            LINE_STRIP = gl.LINE_STRIP;
            TRIANGLES = gl.TRIANGLES;

            ONE = gl.ONE;
            ZERO = gl.ZERO;
            SRC_ALPHA = gl.SRC_ALPHA;
            ONE_MINUS_SRC_ALPHA = gl.ONE_MINUS_SRC_ALPHA;
            SRC_COLOR = gl.SRC_COLOR;
            ONE_MINUS_SRC_COLOR = gl.ONE_MINUS_SRC_COLOR;

            ContextSamplerType.TEXTURE_0 = gl.TEXTURE0;
            ContextSamplerType.TEXTURE_1 = gl.TEXTURE1;
            ContextSamplerType.TEXTURE_2 = gl.TEXTURE2;
            ContextSamplerType.TEXTURE_3 = gl.TEXTURE3;
            ContextSamplerType.TEXTURE_4 = gl.TEXTURE4;
            ContextSamplerType.TEXTURE_5 = gl.TEXTURE5;
            ContextSamplerType.TEXTURE_6 = gl.TEXTURE6;
            ContextSamplerType.TEXTURE_7 = gl.TEXTURE7;
            ContextSamplerType.TEXTURE_8 = gl.TEXTURE8;
        }
    }
}

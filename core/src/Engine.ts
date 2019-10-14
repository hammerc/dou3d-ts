namespace dou3d {
    export let canvas: HTMLCanvasElement;
    export let ticker: Ticker;

    /**
     * 引擎类, 用来启动 3D 引擎
     * - 本引擎采用左手坐标系
     * - 可以添加多个 View3D 对象来进行 3D 场景的渲染
     * @author wizardc
     */
    export class Engine {
        /**
         * 渲染上下文
         */
        public static context3DProxy: Context3DProxy;

        private _canvas: HTMLCanvasElement;
        private _viewRect: Rectangle;
        private _view3Ds: View3D[];

        /**
         * @param canvas 用户呈现 3D 图像的 Canvas 元素, 为空则会创建一个全屏的元素
         */
        public constructor(canvas?: HTMLCanvasElement) {
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.style.position = "absolute";
                document.body.appendChild(canvas);
            }
            this._canvas = dou3d.canvas = canvas;

            let gl = <WebGLRenderingContext>(canvas.getContext("experimental-webgl") || canvas.getContext("webgl"));
            if (!gl) {
                console.error("You drivers not suport WEBGL!");
                return;
            }
            Context3DProxy.gl = gl;

            this._viewRect = new Rectangle();
            this._view3Ds = [];

            Engine.context3DProxy = new Context3DProxy();
            Engine.context3DProxy.register();

            ticker = new Ticker(this);
            this.startTicker();
        }

        /**
         * 获取当前画布的可视区域
         */
        public get viewRect(): Rectangle {
            let rect = this._canvas.getBoundingClientRect();
            this._viewRect.set(rect.left, rect.top, rect.width, rect.height);
            return this._viewRect;
        }

        /**
         * 获取所有的 3D 视图
         */
        public get view3Ds(): View3D[] {
            return this._view3Ds;
        }

        /**
         * 添加一个 3D 视图
         */
        public addView3D(view3D: View3D): void {
            let index = this._view3Ds.indexOf(view3D);
            if (index == -1) {
                this._view3Ds.push(view3D);
            }
        }

        /**
         * 移除一个 3D 视图
         */
        public removeView3D(view3D: View3D): void {
            let index = this._view3Ds.indexOf(view3D);
            if (index != -1) {
                this._view3Ds.splice(index, 1);
            }
        }

        private startTicker(): void {
            // 下面的兼容处理会导致部分 WebGL 工具不能正常运行, 所以先注释掉
            // let requestAnimationFrame = (<any>window).requestAnimationFrame ||
            //     (<any>window).webkitRequestAnimationFrame ||
            //     (<any>window).mozRequestAnimationFrame ||
            //     (<any>window).oRequestAnimationFrame ||
            //     (<any>window).msRequestAnimationFrame;
            // if (!requestAnimationFrame) {
            //     requestAnimationFrame = function (callback: Function) {
            //         return window.setTimeout(callback, 1000 / 60);
            //     };
            // }
            requestAnimationFrame(onTick);
            function onTick() {
                ticker.update();
                requestAnimationFrame(onTick);
            }
        }
    }
}

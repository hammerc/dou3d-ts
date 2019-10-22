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
                canvas.style.position = "fixed";
                canvas.style.left = "0px";
                canvas.style.top = "0px";
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                document.body.appendChild(canvas);
            }
            this._canvas = dou3d.canvas = canvas;

            let gl = <WebGLRenderingContext>(canvas.getContext("experimental-webgl") || canvas.getContext("webgl"));
            if (!gl) {
                console.error("You drivers not suport WEBGL!");
                return;
            }
            Context3DProxy.gl = gl;

            window.addEventListener("mousedown", (event: MouseEvent) => {
                this.onTouchEvent("mousedown", event);
            });
            window.addEventListener("mousemove", (event: MouseEvent) => {
                this.onTouchEvent("mousemove", event);
            });
            window.addEventListener("mouseup", (event: MouseEvent) => {
                this.onTouchEvent("mouseup", event);
            });
            window.addEventListener("touchstart", (event: TouchEvent) => {
                this.onTouchEvent("touchstart", event);
            });
            window.addEventListener("touchmove", (event: TouchEvent) => {
                this.onTouchEvent("touchmove", event);
            });
            window.addEventListener("touchend", (event: TouchEvent) => {
                this.onTouchEvent("touchend", event);
            });
            window.addEventListener("touchcancel", (event: TouchEvent) => {
                this.onTouchEvent("touchcancel", event);
            });

            window.addEventListener("resize", () => {
                setTimeout(() => {
                    for (let view3D of this._view3Ds) {
                        Event3D.dispatch(view3D, Event3D.RESIZE);
                    }
                }, 300);
            });

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
            this._canvas.width = rect.width;
            this._canvas.height = rect.height;
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

        private onTouchEvent(type: string, event: MouseEvent | TouchEvent): void {
            let eventType: string;
            let rect = this._canvas.getBoundingClientRect();
            let pos = dou.recyclable(Vector2);
            if (event instanceof MouseEvent) {
                switch (type) {
                    case "mousedown":
                        eventType = Event3D.TOUCH_BEGIN;
                        break;
                    case "mousemove":
                        eventType = Event3D.TOUCH_MOVE;
                        break;
                    case "mouseup":
                        eventType = Event3D.TOUCH_END;
                        break;
                }
                pos.set(event.clientX - rect.left, event.clientY - rect.top);
            }
            else {
                switch (type) {
                    case "touchstart":
                        eventType = Event3D.TOUCH_BEGIN;
                        break;
                    case "touchmove":
                        eventType = Event3D.TOUCH_MOVE;
                        break;
                    case "touchend":
                    case "touchcancel":
                        eventType = Event3D.TOUCH_END;
                        break;
                }
                if (event.touches.length > 0) {
                    let touch = event.touches[0];
                    pos.set(touch.clientX - rect.left, touch.clientY - rect.top);
                }
            }
            for (let view3D of this._view3Ds) {
                Event3D.dispatch(view3D, eventType, pos);
            }
            pos.recycle();
        }
    }
}

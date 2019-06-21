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
            dou3d.canvas = canvas;

            ticker = new Ticker();
            this.startTicker();
        }

        private startTicker(): void {
            let requestAnimationFrame = (<any> window)["requestAnimationFrame"] ||
                (<any> window)["webkitRequestAnimationFrame"] ||
                (<any> window)["mozRequestAnimationFrame"] ||
                (<any> window)["oRequestAnimationFrame"] ||
                (<any> window)["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback: Function) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame(onTick);
            function onTick() {
                requestAnimationFrame(onTick);
                ticker.update();
            }
        }
    }
}

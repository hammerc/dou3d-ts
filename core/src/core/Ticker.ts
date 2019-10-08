namespace dou3d {
    /**
     * 心跳计时器
     * @author wizardc
     */
    export class Ticker extends dou.TickerBase {
        private _engine: Engine;

        public constructor(engine: Engine) {
            super();
            this._engine = engine;
            Engine.context3DProxy.enableBlend();
            Engine.context3DProxy.enableCullFace();
            Context3DProxy.gl.enable(Context3DProxy.gl.SCISSOR_TEST);
            Context3DProxy.gl.enableVertexAttribArray(0);
            Context3DProxy.gl.enableVertexAttribArray(1);
            Context3DProxy.gl.enableVertexAttribArray(2);
            Context3DProxy.gl.enableVertexAttribArray(3);
            Context3DProxy.gl.enableVertexAttribArray(4);
            Context3DProxy.gl.enableVertexAttribArray(5);
            Context3DProxy.gl.enableVertexAttribArray(6);
        }

        public updateLogic(passedTime: number): void {
            let viewRect = this._engine.viewRect;
            let view3Ds = this._engine.view3Ds;
            Engine.context3DProxy.viewPort(0, 0, viewRect.w, viewRect.h);
            Engine.context3DProxy.setScissorRectangle(0, 0, viewRect.w, viewRect.h);
            for (let i = 0; i < view3Ds.length; i++) {
                view3Ds[i].update(dou.getTimer(), passedTime);
            }
            Context3DProxy.gl.flush();
        }
    }
}

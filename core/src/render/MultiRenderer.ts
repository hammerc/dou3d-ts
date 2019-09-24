namespace dou3d {
    /**
     * 渲染多个可渲染项目类
     * @author wizardc
     */
    export class MultiRenderer extends RendererBase {
        public drawOver: (collect: CollectBase, camera: Camera3D, time: number, delay: number, backViewPort?: Rectangle) => void;

        private _pass: number;

        public constructor(pass: number = PassType.diffusePass) {
            super();
            this._pass = pass;
        }

        public draw(time: number, delay: number, context3D: Context3DProxy, collect: CollectBase, camera: Camera3D, backViewPort?: Rectangle): void {
            this.numEntity = collect.renderList.length;
            if (this.renderTexture) {
                this.renderTexture.upload(context3D);
                context3D.setRenderToTexture(this.renderTexture.texture2D);
            }
            let material: MaterialBase;
            for (let renderIndex = 0; renderIndex < this.numEntity; renderIndex++) {
                let renderItem = collect.renderList[renderIndex];
                renderItem.geometry.activeState(time, delay, context3D, camera);
                for (let i = 0; i < renderItem.geometry.subGeometrys.length; i++) {
                    let subGeometry = renderItem.geometry.subGeometrys[i];
                    let matID = subGeometry.matID;
                    material = renderItem.multiMaterial[matID];
                    if (material == null) {
                        continue;
                    }
                    if (material.passes[this._pass]) {
                        for (let j = material.passes[this._pass].length - 1; j >= 0; j--) {
                            material.passes[this._pass][j].draw(time, delay, context3D, renderItem.modelMatrix, camera, subGeometry, renderItem);
                        }
                    }
                    // 没有设定 PASS 就使用默认的 PASS 来渲染
                    else if (PassUtil.passAuto[this._pass]) {
                        if (!material.passes[this._pass]) {
                            material.addPass(this._pass);
                        }
                        for (let j = material.passes[this._pass].length - 1; j >= 0; j--) {
                            material.passes[this._pass] = PassUtil.creatPass(this._pass, material.materialData);
                            material.passes[this._pass][j].draw(time, delay, context3D, renderItem.modelMatrix, camera, subGeometry, renderItem);
                        }
                    }
                    material = null;
                }
            }
            if (this.drawOver) {
                this.drawOver(collect, camera, time, delay, backViewPort);
            }
            if (this.renderTexture) {
                context3D.setRenderToBackBuffer();
                if (backViewPort) {
                    context3D.viewPort(backViewPort.x, backViewPort.y, backViewPort.w, backViewPort.h);
                    context3D.setScissorRectangle(backViewPort.x, backViewPort.y, backViewPort.w, backViewPort.h);
                }
            }
        }
    }
}

namespace dou3d {
    /**
     * 灯光组
     * @author wizardc
     */
    export class LightGroup {
        private _lightNum: number = 0;
        private _directList: DirectLight[];
        private _spotList: SpotLight[];
        private _pointList: PointLight[];

        public constructor() {
            this._directList = [];
            this._spotList = [];
            this._pointList = [];
        }

        /**
         * 灯光个数
         */
        public get lightNum(): number {
            return this._lightNum;
        }

        /**
         * 方向光列表
         */
        public get directList(): DirectLight[] {
            return this._directList;
        }

        /**
         * 聚光灯列表
         */
        public get spotList(): SpotLight[] {
            return this._spotList;
        }

        /**
         * 点光源列表
         */
        public get pointList(): PointLight[] {
            return this._pointList;
        }

        public addLight(light: LightBase): void {
            switch (light.lightType) {
                case LightType.direct:
                    this._directList.push(<DirectLight>light);
                    this._lightNum++;
                    break;
                case LightType.point:
                    this._pointList.push(<PointLight>light);
                    this._lightNum++;
                    break;
                case LightType.spot:
                    this._spotList.push(<SpotLight>light);
                    this._lightNum++;
                    break;
            }
        }

        public removeLight(light: LightBase): void {
            switch (light.lightType) {
                case LightType.direct: {
                    let index = this._directList.indexOf(<DirectLight>light);
                    if (index >= 0 && index < this._directList.length) {
                        this._directList.splice(index, 1);
                        this._lightNum--;
                    }
                    break;
                }
                case LightType.point: {
                    let index = this._pointList.indexOf(<PointLight>light);
                    if (index >= 0 && index < this._pointList.length) {
                        this._pointList.splice(index, 1);
                        this._lightNum--;
                    }
                    break;
                }
                case LightType.spot: {
                    let index = this._spotList.indexOf(<SpotLight>light);
                    if (index >= 0 && index < this._spotList.length) {
                        this._spotList.splice(index, 1);
                        this._lightNum--;
                    }
                    break;
                }
            }
        }
    }
}

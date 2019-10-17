namespace dou3d {
    /**
     * 场景中的可见物体, 可渲染对象
     * 在渲染之前会将渲染树中对象进行筛选, 只有继承 RenderBase 的对象才会进入渲染管线
     * @author wizardc
     */
    export abstract class RenderBase extends Object3D {
        /**
         * 几何体网格信息
         */
        protected _geometry: Geometry;

        protected _materialCount: number = 0;

        protected _lightGroup: LightGroup;

        protected _order: number = 0;

        /**
         * 当前对象使用的材质
         */
        public material: MaterialBase;

        /**
         * 如果使用到多个材质时, 多个材质会存储在这里
         */
        public multiMaterial: { [matID: number]: MaterialBase } = {};

        /**
         * 类型
         */
        public type: string = "";

        /**
         * 动画对象, 控制骨骼动画
         */
        public animation: IAnimation;

        /**
         * 渲染排序的参数，数值越大，先渲染
         */
        public set order(value: number) {
            this._order = value;
        }
        public get order(): number {
            return this._order;
        }

        public set geometry(value: Geometry) {
            if (this._geometry == value) {
                return;
            }
            if (value) {
                value.incRef();
            }
            if (this._geometry) {
                this._geometry.dispose();
            }
            this._geometry = value;
        }
        public get geometry(): Geometry {
            return this._geometry;
        }

        /**
         * 设置材质球接受的灯光组
         */
        public set lightGroup(lightGroup: LightGroup) {
            this._lightGroup = lightGroup;
            for (var id in this.multiMaterial) {
                this.multiMaterial[id].lightGroup = this._lightGroup;
            }
        }
        public get lightGroup(): LightGroup {
            return this._lightGroup;
        }

        /**
         * 增加一个材质
         */
        public addSubMaterial(id: number, material: MaterialBase) {
            if (!this.multiMaterial[id]) {
                this._materialCount++;
            }
            this.multiMaterial[id] = material;
            material.lightGroup = this._lightGroup;
        }

        /**
         * 删除一个材质
         */
        public removeSubMaterial(id: number) {
            if (this.multiMaterial[id]) {
                delete this.multiMaterial[id];
                this._materialCount--;
            }
        }

        /**
         * 用ID得到一个材质
         */
        public getMaterial(id: number): MaterialBase {
            return this.multiMaterial[id];
        }

        /**
         * 得到所有材质的个数
         */
        public materialCount(): number {
            return this._materialCount;
        }

        public update(time: number, delay: number, camera: Camera3D) {
            super.update(time, delay, camera);
            if (this.animation) {
                this.animation.update(time, delay, this._geometry);
            }
            if (this.geometry.subGeometrys.length <= 0) {
                this.geometry.buildDefaultSubGeometry();
            }
        }

        public dispose() {
            this.geometry = null;
            this.multiMaterial = {};
        }
    }
}

namespace dou3d {
    /**
     * 灯光基类
     * @author wizardc
     */
    export abstract class LightBase extends Object3D {
        protected _lightType: LightType;

        protected _ambientColor: number = 0;
        protected _ambient: Vector4;

        protected _diffuseColor: number = 0xffffff;
        protected _diffuse: Vector4;

        protected _specularColor: number = 0xffffff;
        protected _specular: Vector4;

        protected _intensity: number = 1;
        protected _halfIntensity: number = 0;

        protected _change: boolean = true;

        public constructor() {
            super();
            this._ambient = new Vector4(0, 0, 0);
            this._diffuse = new Vector4(1, 1, 1);
            this._specular = new Vector4(1, 1, 1);
        }

        public get lightType(): LightType {
            return this._lightType;
        }

        /**
         * 灯光强度
         * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
         */
        public set intensity(value: number) {
            if (this._intensity != value) {
                this._intensity = value;
                this._change = false;
            }
        }
        public get intensity(): number {
            return this._intensity;
        }

        /**
         * 背光灯光强度
         * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
         */
        public set halfIntensity(value: number) {
            if (this._halfIntensity != value) {
                this._halfIntensity = value;
                this._change = false;
            }
        }
        public get halfIntensity(): number {
            return this._halfIntensity;
        }

        /**
         * 灯光环境颜色
         * * 物体在未受到光的直接照射的地方, 模拟间接环境光颜色, 会影响背光面的颜色
         */
        public set ambient(color: number) {
            this._ambientColor = color;
            this._ambient.w = (color >> 24 & 0xff) / 255;
            this._ambient.x = (color >> 16 & 0xff) / 255;
            this._ambient.y = (color >> 8 & 0xff) / 255;
            this._ambient.z = (color & 0xff) / 255;
            this._change = false;
        }
        public get ambient(): number {
            return this._ambientColor;
        }

        /**
         * 灯光漫反射颜色
         * * 直接影响最终灯光的颜色色值
         */
        public set diffuse(color: number) {
            this._diffuseColor = color;
            this._diffuse.w = (color >> 24 & 0xff) / 255;
            this._diffuse.x = (color >> 16 & 0xff) / 255;
            this._diffuse.y = (color >> 8 & 0xff) / 255;
            this._diffuse.z = (color & 0xff) / 255;
            this._change = false;
        }
        public get diffuse(): number {
            return this._diffuseColor;
        }

        /**
         * 灯光镜面高光反射颜色
         * * 在灯光方向与物体和相机成一个反光角度的时候, 就会产生反光, 高光, 而不同的物体会有不同的颜色色值, 尤其是金属
         */
        public set specular(color: number) {
            this._specularColor = color;
            this._specular.w = (color >> 24 & 0xff) / 255;
            this._specular.x = (color >> 16 & 0xff) / 255;
            this._specular.y = (color >> 8 & 0xff) / 255;
            this._specular.z = (color & 0xff) / 255;
            this._change = false;
        }
        public get specular(): number {
            return this._specularColor;
        }

        /**
         * 更新灯光数据
         */
        public abstract updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}

namespace dou3d {
    /**
     * 立方体贴图对象
     * @author wizardc
     */
    export class CubeTexture extends TextureBase {
        public image_front: ContextTexture2D;
        public image_back: ContextTexture2D;
        public image_left: ContextTexture2D;
        public image_right: ContextTexture2D;
        public image_up: ContextTexture2D;
        public image_down: ContextTexture2D;

        public constructor(image_front?: ContextTexture2D, image_back?: ContextTexture2D, image_left?: ContextTexture2D, image_right?: ContextTexture2D, image_up?: ContextTexture2D, image_down?: ContextTexture2D) {
            super();
            this.image_front = image_front;
            this.image_back = image_back;
            this.image_left = image_left;
            this.image_right = image_right;
            this.image_up = image_up;
            this.image_down = image_down;
            this.texture3D = new ContextTexture3D();
        }

        public upload(context3D: Context3DProxy): void {
            if (!this.image_front || !this.image_back || !this.image_left || !this.image_right || !this.image_up || !this.image_down) {
                return;
            }
            if (!this.texture3D.texture) {
                this.texture3D.texture = this.texture3D.texture || context3D.createTexture();
                this.texture3D.border = 0;
                this.texture3D.image_front = this.image_front;
                this.texture3D.image_back = this.image_back;
                this.texture3D.image_left = this.image_left;
                this.texture3D.image_right = this.image_right;
                this.texture3D.image_up = this.image_up;
                this.texture3D.image_down = this.image_down;
                context3D.uploadCubetexture(this.texture3D);
            }
        }

        public uploadForcing(context3D: Context3DProxy): void {
        }
    }
}

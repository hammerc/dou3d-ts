namespace dou3d {
    /**
     * 着色器变量基类
     * @author wizardc
     */
    export class VarRegister {
        /**
         * 值名字
         */
        public varName: string = "";

        /**
         * 变量名
         */
        public name: string = "";

        /**
         * 变量属性类型
         * * att varying uniform
         */
        public key: string = "";

        /**
         * 变量类型
         * * float vec2 vec3 vec4 int int2 int3 int4
         */
        public valueType: string = "";

        /**
         * 变量值
         */
        public value: any = "";

        /**
         * texture
         */
        public texture//: ITexture;

        /**
         * uniform Index
         */
        public uniformIndex: any;

        /**
         * active Texture Index
         */
        public activeTextureIndex: number = -1;

        /**
         * index
         */
        public index: number = -1;

        public size: number = 0;
        public dataType: number = 0;
        public normalized: boolean = false;
        public stride: number = 0;
        public offset: number = 0;
        public offsetIndex: number = 0;
        public offsetBytes: number = 0;

        protected computeVarName(): void {
            let index: number = this.name.indexOf("[");
            if (index >= 0) {
                this.varName = this.name.substr(0, index);
            }
            else {
                this.varName = this.name;
            }
        }

        public clone(): VarRegister {
            let temp = new VarRegister();
            temp.name = this.name;
            temp.valueType = this.valueType;
            temp.varName = this.varName;
            temp.value = this.value;
            temp.key = this.key;
            return temp;
        }
    }
}

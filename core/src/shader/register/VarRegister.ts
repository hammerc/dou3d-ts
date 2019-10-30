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
         * * 类型为宏和常量时
         */
        public value: any = "";

        /**
         * 着色器中的索引
         * * 类型为 Attribute、 Uniform 和取样器时
         */
        public uniformIndex: any;

        /**
         * 贴图对象
         * * 采样器类型时
         */
        public texture: any;

        /**
         * 要激活的纹理单元
         * * gl.TEXTURE_0 ~ gl.TEXTURE_8
         */
        public activeTextureIndex: number = -1;

        /**
         * 绑定到取样器的纹理索引
         * * 如果激活的纹理单元是 gl.TEXTURE_0 则这里是 0, 和纹理单元对应
         */
        public index: number = -1;

        /**
         * 总大小
         */
        public size: number = 0;

        /**
         * 数据类型
         */
        public dataType: number = 0;

        /**
         * 是否归一化
         */
        public normalized: boolean = false;

        /**
         * 一个完整数据的字节数
         */
        public stride: number = 0;

        /**
         * 单个数据的偏移量
         */
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

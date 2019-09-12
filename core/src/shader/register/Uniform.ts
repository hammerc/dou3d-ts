namespace dou3d {
    /**
     * Uniform 属性
     * @author wizardc
     */
    export class Uniform extends VarRegister {
        public constructor(name: string, valueType: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "uniform";
            this.valueType = valueType;
        }
    }
}

namespace dou3d {
    /**
     * sampler2D
     * @author wizardc
     */
    export class Sampler2D extends VarRegister {
        public constructor(name: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "sampler2D";
        }
    }
}

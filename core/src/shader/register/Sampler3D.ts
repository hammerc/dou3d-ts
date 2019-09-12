namespace dou3d {
    /**
     * sampler3D
     * @author wizardc
     */
    export class Sampler3D extends VarRegister {
        public constructor(name: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "samplerCube";
        }
    }
}

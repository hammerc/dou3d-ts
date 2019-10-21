namespace dou3d {
    /**
     * 渲染通道工具类
     * @author wizardc
     */
    export namespace PassUtil {
        export const passAuto: Readonly<boolean[]> = [true, true, true, false, false, true, true, true, true, true];

        export function creatPass(pass: PassType, materialData: MaterialData): MaterialPass[] {
            switch (pass) {
                case PassType.colorPass:
                    materialData.shaderPhaseTypes[PassType.colorPass] = [];
                    return [new ColorPass(materialData)];
                case PassType.diffusePass:
                    materialData.shaderPhaseTypes[PassType.diffusePass] = [];
                    return [new DiffusePass(materialData)];
                case PassType.shadowPass:
                    materialData.shaderPhaseTypes[PassType.shadowPass] = [];
                    return [new ShadowPass(materialData)];
                case PassType.normalPass:
                    materialData.shaderPhaseTypes[PassType.normalPass] = [];
                    return [new NormalPass(materialData)];
            }
            return null;
        }
    }
}

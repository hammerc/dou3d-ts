namespace dou3d {
    /**
     * 渲染通道工具类
     * @author wizardc
     */
    export namespace PassUtil {
        /**
         * 和 PassType 对应, 指定的渲染通道没有设定时是否创建默认的通道对象
         */
        export const passAuto: Readonly<boolean[]> = [true, true, true, true];

        /**
         * 创建默认的渲染通道数组
         */
        export function createPass(pass: PassType, materialData: MaterialData): MaterialPass[] {
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

namespace dou3d {
    /**
     * 渲染通道类型
     * @author wizardc
     */
    export const enum PassType {
        diffusePass,
        colorPass,
        normalPass,
        shadowPass,
        lightPass,
        matCapPass,
        depthPass_8,
        depthPass_32,
        CubePass,
        Gbuffer,
        PickPass
    }
}

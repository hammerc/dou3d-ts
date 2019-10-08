namespace dou3d {
    /**
     * 着色器小片段类型
     * @author wizardc
     */
    export enum ShaderPhaseType {
        /**
         * 自定义顶点着色器类型, 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        base_vertex,
        start_vertex,
        local_vertex,
        global_vertex,
        end_vertex,
        /**
         * 自定义片段着色器类型, 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        base_fragment,
        start_fragment,
        materialsource_fragment,
        diffuse_fragment,
        normal_fragment,
        matCap_fragment,
        specular_fragment,
        shadow_fragment,
        lighting_fragment,
        multi_end_fragment,
        end_fragment
    }
}

namespace dou3d {
    /**
     * 着色器片段类型
     * @author wizardc
     */
    export enum ShaderPhaseType {

        // -----
        // 顶点着色器
        // -----

        /**
         * 自定义顶点着色器类型
         * * 定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        custom_vertex,

        /**
         * 顶点着色器写入顺序: 0
         * * 自动写入 base_vs
         */

        /**
         * 顶点着色器写入顺序: 1
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 diffuse_vs 着色器片段
         * * 目前会添加的是 skeleton_vs
         */
        start_vertex,

        /**
         * 顶点着色器写入顺序: 2
         * * 无默认着色器片段
         * * 目前会添加的是 varyingViewDir_vs、shadowMapping_vs
         */
        vertex_1,

        /**
         * 顶点着色器写入顺序: 3
         * * 无默认着色器片段
         * * 目前会添加的是 cube_vs
         */
        vertex_2,

        /**
         * 顶点着色器写入顺序: 最后
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 end_vs 着色器片段
         * * 目前会添加的是
         */
        end_vertex,

        // -----
        // 片段着色器
        // -----

        /**
         * 自定义片段着色器类型
         * * 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        custom_fragment,

        /**
         * 片段着色器写入顺序: 0
         * * 自动写入 base_fs
         */

        /**
         * 片段着色器写入顺序: 1
         * * 无默认着色器片段
         * * 目前会添加的是
         */
        start_fragment,

        /**
         * 片段着色器写入顺序: 2
         * * 解码 materialsource 数据
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 materialSource_fs 着色器片段
         * * 目前会添加的是
         */
        materialsource_fragment,

        /**
         * 片段着色器写入顺序: 3
         * * 漫反射
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 diffuse_fs 着色器片段
         * * 目前会添加的是 color_fs
         */
        diffuse_fragment,

        /**
         * 片段着色器写入顺序: 4
         * * 法线贴图
         * * 无默认着色器片段
         * * 目前会添加的是
         */
        normal_fragment,

        /**
         * 片段着色器写入顺序: 5
         * * 阴影贴图渲染
         * * 无默认着色器片段
         * * 目前会添加的是 shadowMapping_fss
         */
        shadow_fragment,

        /**
         * 片段着色器写入顺序: 6
         * * 灯光渲染
         * * 无默认着色器片段
         * * 目前会添加的是 lightingBase_fs、directLight_fs、pointLight_fs、spotLight_fs
         */
        lighting_fragment,

        /**
         * 片段着色器写入顺序: 7
         * * 高光贴图
         * * 无默认着色器片段
         * * 目前会添加的是 specularMap_fs
         */
        specular_fragment,

        /**
         * 片段着色器写入顺序: 最后
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 end_fs 着色器片段
         * * 目前会添加的是 colorPassEnd_fs、normalPassEnd_fs
         */
        end_fragment
    }
}

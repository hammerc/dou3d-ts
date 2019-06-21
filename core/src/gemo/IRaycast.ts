namespace dou3d {
    /**
     * 射线检测接口
     * @author wizardc
     */
    export interface IRaycast {
        /**
         * 射线检测
         * @param ray 射线
         * @param raycastInfo 将检测的详细数据写入的对象
         * @returns 是否和射线相交
         */
        raycast(ray: Ray, raycastInfo?: RaycastInfo): boolean;
    }
}

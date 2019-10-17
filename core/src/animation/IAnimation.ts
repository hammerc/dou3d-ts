namespace dou3d {
    /**
     * 动画接口
     * @author wizardc
     */
    export interface IAnimation {
        /**
         * 总时间
         */
        animTime: number;

        /**
         * 帧间隔时间
         */
        delay: number;

        /**
         * 动画播放速度
         */
        speed: number;

        /**
         * 动画列表
         */
        animStateNames: string[];

        /**
         * 动画节点
         */
        animStates: IAnimationState[];

        /**
         * 更新
         */
        update(time: number, delay: number, geometry: Geometry): void;

        /**
         * GPU传值
         */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modelTransform: Matrix4, camera3D: Camera3D): void;

        /**
         * 播放动画
         * @param animName 动画名称
         * @param speed 播放速度
         * @param reset 是否重置
         * @param prewarm 是否预热
         */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): void;

        /**
         * 是否正在播放
         */
        isPlay(): boolean;

        /**
         * 停止动画播放
         */
        stop(): void;

        addAnimState(animState: IAnimationState): void;

        removeAnimState(animState: IAnimationState): void;

        clone(): IAnimation;
    }
}

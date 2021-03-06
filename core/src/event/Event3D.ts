namespace dou3d {
    /**
     * 3D 事件
     * @author wizardc
     */
    export class Event3D extends dou.Event {
        public static ENTER_FRAME: string = "enterFrame";
        public static EXIT_FRAME: string = "exitFrame";

        public static RESIZE: string = "resize";

        public static TOUCH_BEGIN: string = "touchBegin";
        public static TOUCH_MOVE: string = "touchMove";
        public static TOUCH_END: string = "touchEnd";

        public static dispatch(target: dou.IEventDispatcher, type: string, data?: any, cancelable?: boolean): boolean {
            let event = dou.recyclable(Event3D);
            event.initEvent(type, data, cancelable);
            let result = target.dispatchEvent(event);
            event.recycle();
            return result;
        }

        public initEvent(type: string, data?: any, cancelable?: boolean): void {
            this.init(type, data, cancelable);
        }

        public onRecycle(): void {
            super.onRecycle();
        }
    }
}

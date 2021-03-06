interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
interface Array<T> {
    fill(value: T, start?: number, end?: number): this;
}
interface String {
    startsWith(searchString: string, position?: number): boolean;
    endsWith(searchString: string, endPosition?: number): boolean;
}
interface Object {
    /**
     * 获取属性描述
     */
    getPropertyDescriptor(property: string): PropertyDescriptor;
    /**
     * 浅拷贝当前对象
     * * 注意: 仅浅拷贝属性, 继承原型链和方法等均会丢失
     */
    shallowClone(): Object;
    /**
     * 浅拷贝所有属性
     * * 注意: 仅浅拷贝属性, 继承原型链和方法等均会丢失
     */
    shallowCloneTo(target: Object): void;
    /**
     * 深拷贝当前对象
     * * 注意: 仅深拷贝属性, 继承原型链和方法等均会丢失
     */
    deepClone(): Object;
    /**
     * 深拷贝所有属性
     * * 注意: 仅深拷贝属性, 继承原型链和方法等均会丢失
     */
    deepCloneTo(target: Object): void;
    /**
     * 清除所有属性
     */
    clearAllProperty(): void;
}
interface String {
    /**
     * 根据分割符拆分字符串为数组且元素转换为数字
     */
    splitNum(separator: string, limit?: number): number[];
    splitNum(separator: RegExp, limit?: number): number[];
}
interface ArrayConstructor {
    /**
     * 默认的排序规则
     */
    readonly NORMAL: number;
    /**
     * 排序时字符串不区分大小写
     */
    readonly CASEINSENSITIVE: number;
    /**
     * 降序
     */
    readonly DESCENDING: number;
    /**
     * 返回包含已经排序完毕的索引数组
     */
    readonly RETURNINDEXEDARRAY: number;
    /**
     * 按数字而非字符串排序
     */
    readonly NUMERIC: number;
}
interface Array<T> {
    /**
     * 判断是否包含指定数据
     */
    contains(...args: T[]): boolean;
    /**
     * 添加唯一数据
     */
    pushUnique(...args: T[]): number;
    /**
     * 按数组元素的字段进行排序, 支持多字段
     */
    sortOn(fieldNames: string | string[], options?: number | number[]): void | this;
    /**
     * 移除指定元素
     */
    remove(item: T): boolean;
    /**
     * 洗牌, 随机打乱当前数组
     */
    shuffle(): this;
}
interface Date {
    /**
     * 格式化当前日期
     * * 月(M), 日(d), 小时(h), 分(m), 秒(s), 季度(q)可以用 1-2 个占位符, 年(y)可以用 1-4 个占位符, 毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     */
    format(template: string): string;
}
declare type globalEvent = Event;
declare namespace dou {
    let hashCount: number;
    /**
     * 带有 Hash 码的对象
     * @author wizardc
     */
    abstract class HashObject {
        private _hashCode;
        constructor();
        readonly hashCode: number;
    }
}
declare namespace dou {
    /**
     * 心跳计时器基类
     * 请使用 requestAnimationFrame 来调用 update 方法, 或者保证每 1/60 秒调用 update 方法 1 次
     * @author wizardc
     */
    abstract class TickerBase {
        static $startTime: number;
        protected _frameRateList: number[];
        protected _frameRate: number;
        protected _frameCount: number;
        protected _lastCount: number;
        protected _lastTimeStamp: number;
        protected _paused: boolean;
        constructor();
        /**
         * 设置帧率
         * 注意: 只能设置为可以被 60 整除的帧率, 包括 60, 30, 20, 15, 12, 10, 6, 5, 4, 3, 2, 1
         */
        frameRate: number;
        /**
         * 是否暂停
         */
        readonly paused: boolean;
        protected setFrameRate(value: number): void;
        /**
         * 暂停计时器
         */
        pause(): void;
        /**
         * 恢复计时器
         */
        resume(): void;
        /**
         * 执行一次更新逻辑
         */
        update(): void;
        protected abstract updateLogic(passedTime: number): void;
    }
}
declare namespace dou {
    /**
     * 事件发送器接口
     * @author wizardc
     */
    interface IEventDispatcher {
        on(type: string, listener: Function, thisObj?: any): void;
        once(type: string, listener: Function, thisObj?: any): void;
        has(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        off(type: string, listener: Function, thisObj?: any): void;
    }
}
declare namespace dou {
    /**
     * 事件发送器
     * @author wizardc
     */
    class EventDispatcher extends HashObject implements IEventDispatcher {
        private $map;
        constructor();
        on(type: string, listener: Function, thisObj?: any): void;
        once(type: string, listener: Function, thisObj?: any): void;
        private $addEvent;
        has(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        dispatch(type: string, data?: any, cancelable?: boolean): boolean;
        off(type: string, listener: Function, thisObj?: any): void;
    }
}
declare namespace dou {
    /**
     * 事件类
     * @author wizardc
     */
    class Event extends HashObject implements ICacheable {
        static OPEN: string;
        static CHANGE: string;
        static COMPLETE: string;
        static MESSAGE: string;
        static CLOSE: string;
        private _type;
        private _data;
        private _cancelable;
        private _isDefaultPrevented;
        private _target;
        init(type: string, data?: any, cancelable?: boolean): void;
        readonly type: string;
        readonly data: any;
        readonly cancelable: boolean;
        readonly target: IEventDispatcher;
        setTarget(target: IEventDispatcher): void;
        /**
         * 如果可以取消事件的默认行为, 则取消该行为
         */
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        onRecycle(): void;
    }
}
declare namespace dou {
    /**
     * IO 错误事件类
     * @author wizardc
     */
    class IOErrorEvent extends Event {
        static IO_ERROR: string;
        static dispatch(target: IEventDispatcher, type: string, msg: string, cancelable?: boolean): boolean;
        private _msg;
        readonly msg: string;
        initEvent(type: string, msg: string, cancelable?: boolean): void;
        onRecycle(): void;
    }
}
declare namespace dou {
    /**
     * 进度事件类
     * @author wizardc
     */
    class ProgressEvent extends Event {
        static PROGRESS: string;
        static dispatch(target: IEventDispatcher, type: string, loaded: number, total: number, cancelable?: boolean): boolean;
        private _loaded;
        private _total;
        readonly loaded: number;
        readonly total: number;
        initEvent(type: string, loaded: number, total: number, cancelable?: boolean): void;
        onRecycle(): void;
    }
}
declare namespace dou {
    /**
     * 资源加载解析器接口
     * @author wizardc
     */
    interface IAnalyzer {
        load(url: string, callback: (url: string, data: any) => void, thisObj: any): void;
        release(data: any): boolean;
    }
}
declare namespace dou {
    /**
     * HTTP 请求加载器基类
     * @author wizardc
     */
    abstract class RequestAnalyzerBase implements IAnalyzer {
        protected abstract getResponseType(): HttpResponseType;
        protected abstract dataAnalyze(data: any): any;
        load(url: string, callback: (url: string, data: any) => void, thisObj: any): void;
        release(data: any): boolean;
    }
}
declare namespace dou {
    /**
     * 文本加载器
     * @author wizardc
     */
    class TextAnalyzer extends RequestAnalyzerBase {
        protected getResponseType(): HttpResponseType;
        protected dataAnalyze(data: any): any;
    }
}
declare namespace dou {
    /**
     * JSON 加载器
     * @author wizardc
     */
    class JsonAnalyzer extends RequestAnalyzerBase {
        protected getResponseType(): HttpResponseType;
        protected dataAnalyze(data: any): any;
    }
}
declare namespace dou {
    /**
     * 二进制加载器
     * @author wizardc
     */
    class BytesAnalyzer extends RequestAnalyzerBase {
        protected getResponseType(): HttpResponseType;
        protected dataAnalyze(data: any): any;
    }
}
declare namespace dou {
    /**
     * 加载管理器
     * @author wizardc
     */
    class LoadManager {
        private static _instance;
        static readonly instance: LoadManager;
        private _maxLoadingThread;
        private _resourceRoot;
        private _analyzerMap;
        private _extensionMap;
        private _priorityList;
        private _priorityMap;
        private _keyMap;
        private _loadingMap;
        private _cacheTypeMap;
        private _cacheDataMap;
        private _nowLoadingThread;
        private constructor();
        /**
         * 最大的下载线程数
         */
        maxLoadingThread: number;
        /**
         * 资源根路径
         */
        resourceRoot: string;
        /**
         * 注册加载器
         */
        registerAnalyzer(type: string, analyzer: IAnalyzer): void;
        /**
         * 注册后缀名和其对应的默认类型
         */
        registerExtension(extension: string, type: string): void;
        /**
         * 加载指定项
         */
        load(url: string, callback?: (data: any, url: string) => void, thisObj?: any, type?: string, priority?: number, cache?: boolean): void;
        private getDefaultType;
        private sortFunc;
        private loadNext;
        loadAsync(url: string, type?: string, priority?: number, cache?: boolean): Promise<any>;
        /**
         * 加载多个指定项
         */
        loadGroup(items: {
            url: string;
            type?: string;
            priority?: number;
            cache?: boolean;
        }[], callback?: (current: number, total: number, url: string, data: any) => void, thisObj?: any): void;
        loadGroupAsync(items: {
            url: string;
            type?: string;
            priority?: number;
            cache?: boolean;
        }[]): Promise<void>;
        /**
         * 资源是否已经加载并缓存
         */
        isLoaded(url: string): boolean;
        /**
         * 获取已经加载并缓存的资源
         */
        get(url: string): any;
        /**
         * 释放已经加载并缓存的资源
         */
        release(url: string): boolean;
    }
    /**
     * 加载管理器快速访问
     */
    const loader: LoadManager;
}
declare namespace dou {
    /**
     * HTTP 请求方法
     * @author wizardc
     */
    enum HttpMethod {
        GET = 0,
        POST = 1
    }
}
declare namespace dou {
    /**
     * HTTP 返回值类型
     * @author wizardc
     */
    enum HttpResponseType {
        arraybuffer = 1,
        blob = 2,
        document = 3,
        json = 4,
        text = 5
    }
}
declare namespace dou {
    /**
     * HTTP 请求类
     * @author wizardc
     */
    class HttpRequest extends EventDispatcher {
        private _xhr;
        private _responseType;
        private _withCredentials;
        private _headerMap;
        private _url;
        private _method;
        constructor();
        responseType: HttpResponseType;
        withCredentials: boolean;
        readonly response: any;
        setRequestHeader(header: string, value: string): void;
        getResponseHeader(header: string): string;
        getAllResponseHeaders(): {
            [key: string]: string;
        };
        open(url: string, method?: HttpMethod): void;
        send(data?: any): void;
        private onReadyStateChange;
        private updateProgress;
        abort(): void;
    }
}
declare namespace dou {
    /**
     * 图片加载器
     * @author wizardc
     */
    class ImageLoader extends EventDispatcher {
        /**
         * 默认是否开启跨域访问控制
         */
        static crossOrigin: boolean;
        private _data;
        private _crossOrigin;
        private _currentImage;
        /**
         * 是否开启跨域访问控制
         */
        crossOrigin: boolean;
        readonly data: HTMLImageElement;
        load(url: string): void;
        private getImage;
        private onLoad;
        private onError;
    }
}
declare namespace dou {
    /**
     * 声音加载器
     * @author wizardc
     */
    class SoundLoader extends EventDispatcher {
        private _data;
        private _currentAudio;
        readonly data: HTMLAudioElement;
        load(url: string): void;
        private getAudio;
        private onLoaded;
        private onError;
    }
}
declare namespace dou {
    /**
     * 套接字对象
     * @author wizardc
     */
    class Socket extends EventDispatcher {
        private _webSocket;
        private _endian;
        private _input;
        private _output;
        private _url;
        private _connected;
        private _cacheInput;
        private _addInputPosition;
        constructor(host?: string, port?: number);
        endian: Endian;
        readonly input: ByteArray;
        readonly output: ByteArray;
        readonly url: string;
        readonly connected: boolean;
        /**
         * 是否缓存服务端发送的数据到输入流中
         */
        cacheInput: boolean;
        connect(host: string, port: number): void;
        connectByUrl(url: string): void;
        private onOpen;
        private onMessage;
        private onClose;
        private onError;
        send(data: string | ArrayBuffer): void;
        flush(): void;
        close(): void;
        private cleanSocket;
    }
}
declare namespace dou {
    /**
     * 缓动函数集合
     * @author wizardc
     */
    namespace Ease {
        const quadIn: (t: number) => number;
        const quadOut: (t: number) => number;
        const quadInOut: (t: number) => number;
        const cubicIn: (t: number) => number;
        const cubicOut: (t: number) => number;
        const cubicInOut: (t: number) => number;
        const quartIn: (t: number) => number;
        const quartOut: (t: number) => number;
        const quartInOut: (t: number) => number;
        const quintIn: (t: number) => number;
        const quintOut: (t: number) => number;
        const quintInOut: (t: number) => number;
        function sineIn(t: number): number;
        function sineOut(t: number): number;
        function sineInOut(t: number): number;
        const backIn: (t: number) => number;
        const backOut: (t: number) => number;
        const backInOut: (t: number) => number;
        function circIn(t: number): number;
        function circOut(t: number): number;
        function circInOut(t: number): number;
        function bounceIn(t: number): number;
        function bounceOut(t: number): number;
        function bounceInOut(t: number): number;
        const elasticIn: (t: number) => number;
        const elasticOut: (t: number) => number;
        const elasticInOut: (t: number) => number;
    }
}
declare namespace dou {
    /**
     * 缓动类
     * @author wizardc
     */
    class Tween extends EventDispatcher {
        /**
         * 不做特殊处理
         */
        private static NONE;
        /**
         * 循环
         */
        private static LOOP;
        /**
         * 倒序
         */
        private static REVERSE;
        private static _tweens;
        /**
         * 帧循环逻辑, 请在项目的合适地方进行循环调用
         */
        static tick(passedTime: number, paused?: boolean): void;
        /**
         * 激活一个对象, 对其添加 Tween 动画
         * @param target 要激活 Tween 的对象
         * @param props 参数
         * @param override 是否移除对象之前添加的tween
         * @returns 缓动对象
         */
        static get(target: any, props?: {
            loop?: boolean;
            onChange?: Function;
            onChangeObj?: any;
        }, override?: boolean): Tween;
        /**
         * 暂停某个对象的所有 Tween 动画
         */
        static pauseTweens(target: any): void;
        /**
         * 继续播放某个对象的所有 Tween 动画
         */
        static resumeTweens(target: any): void;
        /**
         * 删除一个对象上的全部 Tween 动画
         */
        static removeTweens(target: any): void;
        /**
         * 删除所有的 Tween 动画
         */
        static removeAllTweens(): void;
        private static _register;
        private _target;
        private _useTicks;
        private _ignoreGlobalPause;
        private _loop;
        private _curQueueProps;
        private _initQueueProps;
        private _steps;
        private _paused;
        private _duration;
        private _prevPos;
        private _position;
        private _prevPosition;
        private _stepPosition;
        private _passive;
        constructor(target: any, props: any);
        private initialize;
        /**
         * 设置是否暂停
         */
        setPaused(value: boolean): Tween;
        /**
         * 等待指定毫秒后执行下一个动画
         * @param duration 要等待的时间, 以毫秒为单位
         * @param passive 等待期间属性是否会更新
         * @returns Tween 对象本身
         */
        wait(duration: number, passive?: boolean): Tween;
        /**
         * 将指定对象的属性修改为指定值
         * @param props 对象的属性集合
         * @param duration 持续时间
         * @param ease 缓动算法
         * @returns Tween 对象本身
         */
        to(props: any, duration?: number, ease?: Function): Tween;
        /**
         * 执行回调函数
         * @param callback 回调方法
         * @param thisObj 回调方法 this 作用域
         * @param params 回调方法参数
         * @returns Tween 对象本身
         */
        call(callback: Function, thisObj?: any, params?: any[]): Tween;
        /**
         * 立即将指定对象的属性修改为指定值
         * @param props 对象的属性集合
         * @param target 要继续播放 Tween 的对象
         * @returns Tween 对象本身
         */
        set(props: any, target?: any): Tween;
        /**
         * 播放
         * @param tween 需要操作的 Tween 对象, 默认 this
         * @returns Tween 对象本身
         */
        play(tween?: Tween): Tween;
        /**
         * 暂停
         * @param tween 需要操作的 Tween 对象, 默认 this
         * @returns Tween 对象本身
         */
        pause(tween?: Tween): Tween;
        /**
         * @private
         */
        $tick(delta: number): void;
        /**
         * @private
         */
        setPosition(value: number, actionsMode?: number): boolean;
        private _runAction;
        private _updateTargetProps;
        private _cloneProps;
        private _addStep;
        private _appendQueueProps;
        private _addAction;
        private _set;
    }
}
declare namespace dou {
    /**
     * 获取引擎启动之后经过的毫秒数
     */
    function getTimer(): number;
}
declare namespace dou {
    /**
     * 通过对象池进行缓存的对象类型
     * @author wizardc
     */
    interface ICacheable {
        /**
         * 加入对象池时调用
         */
        onRecycle?(): void;
        /**
         * 从对象池中取出时调用
         */
        onReuse?(): void;
    }
}
declare namespace dou {
    type Creator<T> = {
        new (): T;
    };
    /**
     * 对象池
     * @author wizardc
     */
    class ObjectPool<T> {
        private _creator;
        private _maxCount;
        private _list;
        constructor(creator: Creator<T>, maxCount?: number);
        readonly size: number;
        join(obj: T): void;
        take(): T;
        clear(): void;
    }
}
declare namespace dou {
    type Recyclable<T> = T & {
        recycle(): void;
    };
    /**
     * 获取一个可回收的对象
     */
    function recyclable<T>(creator: Creator<T> & {
        __pool?: ObjectPool<T>;
    }): Recyclable<T>;
    /**
     * 对象池配置
     */
    function deployPool(targetClass: {
        new (): any;
    }, maxCount: number): void;
}
declare namespace dou {
    /**
     * 字节顺序
     * @author wizardc
     */
    const enum Endian {
        littleEndian = 0,
        bigEndian = 1
    }
}
declare namespace dou {
    /**
     * 字节数组
     * @author wizardc
     */
    class ByteArray {
        protected _bufferExtSize: number;
        protected _data: DataView;
        protected _bytes: Uint8Array;
        protected _position: number;
        protected _writePosition: number;
        protected _endian: Endian;
        private _eofByte;
        private _eofCodePoint;
        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize?: number);
        endian: Endian;
        readonly readAvailable: number;
        buffer: ArrayBuffer;
        readonly rawBuffer: ArrayBuffer;
        readonly bytes: Uint8Array;
        dataView: DataView;
        readonly bufferOffset: number;
        position: number;
        length: number;
        protected validateBuffer(value: number): void;
        readonly bytesAvailable: number;
        validate(len: number): boolean;
        protected validateBuffer2(len: number): void;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readInt(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readDouble(): number;
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        readUTF(): string;
        readUTFBytes(length: number): string;
        private decodeUTF8;
        private inRange;
        private decoderError;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeShort(value: number): void;
        writeUnsignedShort(value: number): void;
        writeInt(value: number): void;
        writeUnsignedInt(value: number): void;
        writeFloat(value: number): void;
        writeDouble(value: number): void;
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        private encodeUTF8;
        private stringToCodePoints;
        writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer?: boolean): void;
        private div;
        clear(): void;
        toString(): string;
    }
}
declare namespace dou {
    /**
     * 提供泛型哈希表的支持
     * 如果 key 使用继承 dou.HashObject 的对象, 则使用 hashCode 作为其键值, 否则使用 toString() 的返回作为键值
     * @author wizardc
     */
    class Dictionary<TKey, TValue> {
        private _map;
        private _keyMap;
        private _size;
        constructor(map?: {
            [k: string]: TValue;
        });
        readonly size: number;
        private getKey;
        add(key: TKey, value: TValue): void;
        has(key: TKey): boolean;
        get(key: TKey): TValue;
        forEach(callbackfn: (item: TValue, key: TKey, dictionary: Dictionary<TKey, TValue>) => void, thisArg?: any): void;
        remove(key: TKey): boolean;
        clear(): void;
        toString(): string;
        keyOf(): {
            [k: string]: TKey;
        };
        valueOf(): {
            [k: string]: TValue;
        };
    }
}
declare namespace dou {
    /**
     * HTTP 请求工具类
     * @author wizardc
     */
    namespace HttpUtil {
        function addParamToUrl(url: string, data: Object): string;
        function get(url: string, callback?: (response: any) => void, thisObj?: any, errorCallback?: (status: number) => void, errorThisObj?: any): void;
        function post(url: string, data?: any, callback?: (response: any) => void, thisObj?: any, errorCallback?: (status: number) => void, errorThisObj?: any): void;
    }
}
declare namespace dou {
    /**
     * 脚本工具类
     * @author wizardc
     */
    namespace ScriptUtil {
        /**
         * 同步加载 JS 文件
         */
        function loadJSSync(url: string): void;
        /**
         * 异步加载 JS 文件, 放在 head 中
         */
        function loadJSAsync(url: string): void;
        /**
         * 异步加载 JS 文件, 放在 body 中
         */
        function loadJS(url: string, cross?: boolean, callback?: Function, thisObj?: any, ...args: any[]): void;
    }
}
declare namespace dou {
    /**
     * 位运算工具类
     * @author wizardc
     */
    namespace BitUtil {
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @param value 设置为 1 (true) 还是 0 (false)
         */
        function setBit(target: number, position: number, value: boolean): number;
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @returns 对应的值为 1 (true) 还是 0 (false)
         */
        function getBit(target: number, position: number): boolean;
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @returns 对应的值为 1 (true) 还是 0 (false)
         */
        function switchBit32(target: number, position: number): number;
    }
}

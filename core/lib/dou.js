var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dou;
(function (dou) {
    dou.hashCount = 1;
    /**
     * 带有 Hash 码的对象
     * @author wizardc
     */
    var HashObject = /** @class */ (function () {
        function HashObject() {
            this._hashCode = dou.hashCount++;
        }
        Object.defineProperty(HashObject.prototype, "hashCode", {
            get: function () {
                return this._hashCode;
            },
            enumerable: true,
            configurable: true
        });
        return HashObject;
    }());
    dou.HashObject = HashObject;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 心跳计时器基类
     * 请使用 requestAnimationFrame 来调用 update 方法, 或者保证每 1/60 秒调用 update 方法 1 次
     * @author wizardc
     */
    var TickerBase = /** @class */ (function () {
        function TickerBase() {
            this._lastTimeStamp = 0;
            this._paused = false;
            TickerBase.$startTime = Date.now();
            this._frameRateList = [60, 30, 20, 15, 12, 10, 6, 5, 4, 3, 2, 1];
            this.frameRate = 60;
        }
        Object.defineProperty(TickerBase.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            /**
             * 设置帧率
             * 注意: 只能设置为可以被 60 整除的帧率, 包括 60, 30, 20, 15, 12, 10, 6, 5, 4, 3, 2, 1
             */
            set: function (value) {
                this.setFrameRate(value);
                this._frameCount = 60 / this._frameRate;
                this._lastCount = 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TickerBase.prototype, "paused", {
            /**
             * 是否暂停
             */
            get: function () {
                return this._paused;
            },
            enumerable: true,
            configurable: true
        });
        TickerBase.prototype.setFrameRate = function (value) {
            value = +value || 0;
            for (var i = 0, len = this._frameRateList.length; i < len; i++) {
                var frameRate = this._frameRateList[i];
                if (value >= frameRate) {
                    this._frameRate = frameRate;
                    return;
                }
            }
            this._frameRate = 1;
        };
        /**
         * 暂停计时器
         */
        TickerBase.prototype.pause = function () {
            this._paused = true;
        };
        /**
         * 恢复计时器
         */
        TickerBase.prototype.resume = function () {
            this._paused = false;
        };
        /**
         * 执行一次更新逻辑
         */
        TickerBase.prototype.update = function () {
            if (this._paused) {
                return;
            }
            this._lastCount++;
            if (this._lastCount >= this._frameCount) {
                this._lastCount = 0;
                var now = dou.getTimer();
                var interval = now - this._lastTimeStamp;
                this._lastTimeStamp = now;
                this.updateLogic(interval);
            }
        };
        TickerBase.$startTime = 0;
        return TickerBase;
    }());
    dou.TickerBase = TickerBase;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 事件发送器
     * @author wizardc
     */
    var EventDispatcher = /** @class */ (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            var _this = _super.call(this) || this;
            _this.$map = {};
            return _this;
        }
        EventDispatcher.prototype.on = function (type, listener, thisObj) {
            this.$addEvent(type, listener, thisObj, false);
        };
        EventDispatcher.prototype.once = function (type, listener, thisObj) {
            this.$addEvent(type, listener, thisObj, true);
        };
        EventDispatcher.prototype.$addEvent = function (type, listener, thisObj, once) {
            var map = this.$map;
            if (!map.hasOwnProperty(type)) {
                map[type] = [];
            }
            var list = map[type];
            for (var i = 0, len = list.length; i < len; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObj == thisObj) {
                    return false;
                }
            }
            var eventBin = dou.recyclable(EventBin);
            eventBin.listener = listener;
            eventBin.thisObj = thisObj;
            eventBin.once = once;
            list.push(eventBin);
            return true;
        };
        EventDispatcher.prototype.has = function (type) {
            return this.$map.hasOwnProperty(type) && this.$map[type].length > 0;
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            var map = this.$map;
            if (!map.hasOwnProperty(event.type)) {
                return true;
            }
            var list = map[event.type];
            if (list.length == 0) {
                return true;
            }
            event.setTarget(this);
            var currentIndex = 0;
            for (var i = 0, len = list.length; i < len; i++) {
                var bin = list[i];
                if (bin) {
                    var listener = bin.listener;
                    var thisObj = bin.thisObj;
                    if (bin.once) {
                        bin.recycle();
                        list[i] = null;
                    }
                    else {
                        if (currentIndex != i) {
                            list[currentIndex] = bin;
                            list[i] = null;
                        }
                        currentIndex++;
                    }
                    listener.call(thisObj, event);
                }
            }
            if (currentIndex != i) {
                length = list.length;
                while (i < length) {
                    list[currentIndex++] = list[i++];
                }
                list.length = currentIndex;
            }
            event.setTarget(null);
            return !event.isDefaultPrevented;
        };
        EventDispatcher.prototype.dispatch = function (type, data, cancelable) {
            var event = dou.recyclable(dou.Event);
            event.init(type, data, cancelable);
            var result = this.dispatchEvent(event);
            event.recycle();
            return result;
        };
        EventDispatcher.prototype.off = function (type, listener, thisObj) {
            var map = this.$map;
            if (map.hasOwnProperty(type)) {
                var list = map[event.type];
                for (var i = 0, len = list.length; i < len; i++) {
                    var info = list[i];
                    if (info && info.listener == listener && info.thisObj == thisObj) {
                        info.recycle();
                        list[i] = null;
                        break;
                    }
                }
            }
        };
        return EventDispatcher;
    }(dou.HashObject));
    dou.EventDispatcher = EventDispatcher;
    var EventBin = /** @class */ (function () {
        function EventBin() {
        }
        EventBin.prototype.onRecycle = function () {
            this.listener = this.thisObj = this.once = null;
        };
        return EventBin;
    }());
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 事件类
     * @author wizardc
     */
    var Event = /** @class */ (function (_super) {
        __extends(Event, _super);
        function Event() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._isDefaultPrevented = false;
            return _this;
        }
        Event.prototype.init = function (type, data, cancelable) {
            this._type = type;
            this._data = data;
            this._cancelable = cancelable;
        };
        Object.defineProperty(Event.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "cancelable", {
            get: function () {
                return this._cancelable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Event.prototype.setTarget = function (target) {
            this._target = target;
        };
        /**
         * 如果可以取消事件的默认行为, 则取消该行为
         */
        Event.prototype.preventDefault = function () {
            if (this._cancelable) {
                this._isDefaultPrevented = true;
            }
        };
        Event.prototype.isDefaultPrevented = function () {
            return this._isDefaultPrevented;
        };
        Event.prototype.onRecycle = function () {
            this._type = null;
            this._data = null;
            this._cancelable = null;
            this._isDefaultPrevented = false;
            this._target = null;
        };
        Event.OPEN = "open";
        Event.COMPLETE = "complete";
        Event.MESSAGE = "message";
        Event.CLOSE = "close";
        return Event;
    }(dou.HashObject));
    dou.Event = Event;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * IO 错误事件类
     * @author wizardc
     */
    var IOErrorEvent = /** @class */ (function (_super) {
        __extends(IOErrorEvent, _super);
        function IOErrorEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IOErrorEvent.dispatch = function (target, type, msg, cancelable) {
            var event = dou.recyclable(IOErrorEvent);
            event.initEvent(type, msg, cancelable);
            var result = target.dispatchEvent(event);
            event.recycle();
            return result;
        };
        Object.defineProperty(IOErrorEvent.prototype, "msg", {
            get: function () {
                return this._msg;
            },
            enumerable: true,
            configurable: true
        });
        IOErrorEvent.prototype.initEvent = function (type, msg, cancelable) {
            this.init(type, null, cancelable);
            this._msg = msg;
        };
        IOErrorEvent.prototype.onRecycle = function () {
            _super.prototype.onRecycle.call(this);
            this._msg = null;
        };
        IOErrorEvent.IO_ERROR = "ioError";
        return IOErrorEvent;
    }(dou.Event));
    dou.IOErrorEvent = IOErrorEvent;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 进度事件类
     * @author wizardc
     */
    var ProgressEvent = /** @class */ (function (_super) {
        __extends(ProgressEvent, _super);
        function ProgressEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ProgressEvent.dispatch = function (target, type, loaded, total, cancelable) {
            var event = dou.recyclable(ProgressEvent);
            event.initEvent(type, loaded, total, cancelable);
            var result = target.dispatchEvent(event);
            event.recycle();
            return result;
        };
        Object.defineProperty(ProgressEvent.prototype, "loaded", {
            get: function () {
                return this._loaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProgressEvent.prototype, "total", {
            get: function () {
                return this._total;
            },
            enumerable: true,
            configurable: true
        });
        ProgressEvent.prototype.initEvent = function (type, loaded, total, cancelable) {
            this.init(type, null, cancelable);
            this._loaded = loaded;
            this._total = total;
        };
        ProgressEvent.prototype.onRecycle = function () {
            _super.prototype.onRecycle.call(this);
            this._loaded = null;
            this._total = null;
        };
        ProgressEvent.PROGRESS = "progress";
        return ProgressEvent;
    }(dou.Event));
    dou.ProgressEvent = ProgressEvent;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * HTTP 请求加载器基类
     * @author wizardc
     */
    var RequestAnalyzerBase = /** @class */ (function () {
        function RequestAnalyzerBase() {
        }
        RequestAnalyzerBase.prototype.load = function (url, callback, thisObj) {
            var _this = this;
            var request = new dou.HttpRequest();
            request.responseType = this.getResponseType();
            request.on(dou.Event.COMPLETE, function (event) {
                callback.call(thisObj, url, _this.dataAnalyze(request.response));
            }, this);
            request.on(dou.IOErrorEvent.IO_ERROR, function (event) {
                callback.call(thisObj, url);
            }, this);
            request.open(url, dou.HttpMethod.GET);
            request.send();
        };
        RequestAnalyzerBase.prototype.release = function (data) {
            return true;
        };
        return RequestAnalyzerBase;
    }());
    dou.RequestAnalyzerBase = RequestAnalyzerBase;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 文本加载器
     * @author wizardc
     */
    var TextAnalyzer = /** @class */ (function (_super) {
        __extends(TextAnalyzer, _super);
        function TextAnalyzer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextAnalyzer.prototype.getResponseType = function () {
            return dou.HttpResponseType.text;
        };
        TextAnalyzer.prototype.dataAnalyze = function (data) {
            return data;
        };
        return TextAnalyzer;
    }(dou.RequestAnalyzerBase));
    dou.TextAnalyzer = TextAnalyzer;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * JSON 加载器
     * @author wizardc
     */
    var JsonAnalyzer = /** @class */ (function (_super) {
        __extends(JsonAnalyzer, _super);
        function JsonAnalyzer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JsonAnalyzer.prototype.getResponseType = function () {
            return dou.HttpResponseType.text;
        };
        JsonAnalyzer.prototype.dataAnalyze = function (data) {
            return JSON.parse(data);
        };
        return JsonAnalyzer;
    }(dou.RequestAnalyzerBase));
    dou.JsonAnalyzer = JsonAnalyzer;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 二进制加载器
     * @author wizardc
     */
    var BytesAnalyzer = /** @class */ (function (_super) {
        __extends(BytesAnalyzer, _super);
        function BytesAnalyzer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BytesAnalyzer.prototype.getResponseType = function () {
            return dou.HttpResponseType.arraybuffer;
        };
        BytesAnalyzer.prototype.dataAnalyze = function (data) {
            return new dou.ByteArray(data);
        };
        return BytesAnalyzer;
    }(dou.RequestAnalyzerBase));
    dou.BytesAnalyzer = BytesAnalyzer;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 加载管理器
     * @author wizardc
     */
    var LoadManager = /** @class */ (function () {
        function LoadManager() {
            this._maxLoadingThread = 5;
            this._resourceRoot = "";
            this._nowLoadingThread = 0;
            this._analyzerMap = {};
            this._extensionMap = {};
            this._priorityList = [];
            this._priorityMap = {};
            this._keyMap = {};
            this._loadingMap = {};
            this._cacheTypeMap = {};
            this._cacheDataMap = {};
        }
        Object.defineProperty(LoadManager, "instance", {
            get: function () {
                return LoadManager._instance || (LoadManager._instance = new LoadManager());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoadManager.prototype, "maxLoadingThread", {
            get: function () {
                return this._maxLoadingThread;
            },
            /**
             * 最大的下载线程数
             */
            set: function (value) {
                this._maxLoadingThread = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoadManager.prototype, "resourceRoot", {
            get: function () {
                return this._resourceRoot;
            },
            /**
             * 资源根路径
             */
            set: function (value) {
                this._resourceRoot = value || "";
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 注册加载器
         */
        LoadManager.prototype.registerAnalyzer = function (type, analyzer) {
            this._analyzerMap[type] = analyzer;
        };
        /**
         * 注册后缀名和其对应的默认类型
         */
        LoadManager.prototype.registerExtension = function (extension, type) {
            this._extensionMap[extension] = type;
        };
        /**
         * 加载指定项
         */
        LoadManager.prototype.load = function (url, callback, thisObj, type, priority, cache) {
            if (priority === void 0) { priority = 0; }
            if (cache === void 0) { cache = true; }
            if (this.isLoaded(url)) {
                callback.call(thisObj, this.get(url), url);
                return;
            }
            if (!type) {
                type = this.getDefaultType(url);
            }
            if (!this._analyzerMap[type]) {
                console.error("Can not find resource type: \"" + type + "\"");
                return;
            }
            var item = { url: url, type: type, priority: priority, cache: cache, callback: callback, thisObj: thisObj };
            if (!this._priorityMap[priority]) {
                this._priorityList.push(priority);
                this._priorityList.sort(this.sortFunc);
                this._priorityMap[priority] = [];
            }
            var list = this._priorityMap[priority];
            list.push(item);
            if (!this._keyMap[item.url]) {
                this._keyMap[item.url] = [];
            }
            this._keyMap[item.url].push(item);
            this.loadNext();
        };
        LoadManager.prototype.getDefaultType = function (url) {
            var suffix;
            var regexp = /\.(\w+)\?|\.(\w+)$/;
            var result = regexp.exec(url);
            if (result) {
                suffix = result[1] || result[2];
            }
            if (this._extensionMap.hasOwnProperty(suffix)) {
                return this._extensionMap[suffix];
            }
            return suffix;
        };
        LoadManager.prototype.sortFunc = function (a, b) {
            return b - a;
        };
        LoadManager.prototype.loadNext = function () {
            var _this = this;
            if (this._nowLoadingThread >= this._maxLoadingThread) {
                return;
            }
            var item;
            for (var _i = 0, _a = this._priorityList; _i < _a.length; _i++) {
                var priority = _a[_i];
                var list = this._priorityMap[priority];
                if (list.length > 0) {
                    item = list.shift();
                    break;
                }
            }
            if (item) {
                if (this._loadingMap[item.url]) {
                    this.loadNext();
                }
                else {
                    this._nowLoadingThread++;
                    this._loadingMap[item.url] = true;
                    var analyzer = this._analyzerMap[item.type];
                    analyzer.load(this._resourceRoot + item.url, function (url, data) {
                        delete _this._loadingMap[url];
                        var items = _this._keyMap[url];
                        if (items && items.length > 0) {
                            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                                var item_1 = items_1[_i];
                                if (_this._priorityMap[item_1.priority]) {
                                    var list = _this._priorityMap[item_1.priority];
                                    var index = list.indexOf(item_1);
                                    if (index != -1) {
                                        list.splice(index, 1);
                                    }
                                }
                                if (item_1.cache && data) {
                                    _this._cacheTypeMap[item_1.url] = item_1.type;
                                    _this._cacheDataMap[item_1.url] = data;
                                }
                                if (item_1.callback) {
                                    item_1.callback.call(item_1.thisObj, data, url);
                                }
                            }
                            delete _this._keyMap[url];
                        }
                        _this.loadNext();
                    }, this);
                }
            }
        };
        LoadManager.prototype.loadAsync = function (url, type, priority, cache) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            if (cache === void 0) { cache = true; }
            return new Promise(function (resolve, reject) {
                _this.load(url, function (url, data) {
                    if (data) {
                        resolve(data);
                    }
                    else {
                        reject("Load Error: " + url);
                    }
                }, _this, type, priority, cache);
            });
        };
        /**
         * 加载多个指定项
         */
        LoadManager.prototype.loadGroup = function (items, callback, thisObj) {
            var current = 0, total = items.length;
            var itemCallback = function (url, data) {
                current++;
                callback.call(thisObj, current, total, url, data);
            };
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var item = items_2[_i];
                this.load(item.url, itemCallback, this, item.url, item.priority, item.cache);
            }
        };
        LoadManager.prototype.loadGroupAsync = function (items) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadGroup(items, function (current, total, url, data) {
                    if (current == total) {
                        resolve();
                    }
                }, _this);
            });
        };
        /**
         * 资源是否已经加载并缓存
         */
        LoadManager.prototype.isLoaded = function (url) {
            return this._cacheDataMap.hasOwnProperty(url);
        };
        /**
         * 获取已经加载并缓存的资源
         */
        LoadManager.prototype.get = function (url) {
            return this._cacheDataMap[url];
        };
        /**
         * 释放已经加载并缓存的资源
         */
        LoadManager.prototype.release = function (url) {
            if (this.isLoaded(url)) {
                var type = this._cacheTypeMap[url];
                var analyzer = this._analyzerMap[type];
                if (!analyzer) {
                    return false;
                }
                var data = this._cacheDataMap[url];
                var success = analyzer.release(data);
                if (success) {
                    delete this._cacheTypeMap[url];
                    delete this._cacheDataMap[url];
                }
                return success;
            }
            return false;
        };
        return LoadManager;
    }());
    dou.LoadManager = LoadManager;
    /**
     * 加载管理器快速访问
     */
    dou.loader = LoadManager.instance;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * HTTP 请求方法
     * @author wizardc
     */
    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod[HttpMethod["GET"] = 0] = "GET";
        HttpMethod[HttpMethod["POST"] = 1] = "POST";
    })(HttpMethod = dou.HttpMethod || (dou.HttpMethod = {}));
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * HTTP 返回值类型
     * @author wizardc
     */
    var HttpResponseType;
    (function (HttpResponseType) {
        HttpResponseType[HttpResponseType["arraybuffer"] = 1] = "arraybuffer";
        HttpResponseType[HttpResponseType["blob"] = 2] = "blob";
        HttpResponseType[HttpResponseType["document"] = 3] = "document";
        HttpResponseType[HttpResponseType["json"] = 4] = "json";
        HttpResponseType[HttpResponseType["text"] = 5] = "text";
    })(HttpResponseType = dou.HttpResponseType || (dou.HttpResponseType = {}));
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * HTTP 请求类
     * @author wizardc
     */
    var HttpRequest = /** @class */ (function (_super) {
        __extends(HttpRequest, _super);
        function HttpRequest() {
            return _super.call(this) || this;
        }
        Object.defineProperty(HttpRequest.prototype, "responseType", {
            get: function () {
                return this._responseType;
            },
            set: function (value) {
                this._responseType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "withCredentials", {
            get: function () {
                return this._withCredentials;
            },
            set: function (value) {
                this._withCredentials = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "response", {
            get: function () {
                if (!this._xhr) {
                    return this._xhr.response;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        HttpRequest.prototype.setRequestHeader = function (header, value) {
            if (!this._headerMap) {
                this._headerMap = {};
            }
            this._headerMap[header] = value;
        };
        HttpRequest.prototype.getResponseHeader = function (header) {
            return this._headerMap[header];
        };
        HttpRequest.prototype.getAllResponseHeaders = function () {
            return this._headerMap;
        };
        HttpRequest.prototype.open = function (url, method) {
            if (method === void 0) { method = dou.HttpMethod.GET; }
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            this._xhr = new XMLHttpRequest();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(dou.HttpMethod[this._method], this._url, true);
        };
        HttpRequest.prototype.send = function (data) {
            if (this._responseType) {
                this._xhr.responseType = dou.HttpResponseType[this._responseType];
            }
            if (this._withCredentials) {
                this._xhr.withCredentials = true;
            }
            if (this._headerMap) {
                for (var key in this._headerMap) {
                    this._xhr.setRequestHeader(key, this._headerMap[key]);
                }
            }
            this._xhr.send(data);
        };
        HttpRequest.prototype.onReadyStateChange = function (event) {
            var _this = this;
            var xhr = this._xhr;
            if (xhr.readyState == 4) {
                var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                setTimeout(function () {
                    if (ioError_1) {
                        dou.IOErrorEvent.dispatch(_this, dou.IOErrorEvent.IO_ERROR, "Request Error: " + _this._url);
                    }
                    else {
                        _this.dispatch(dou.Event.COMPLETE);
                    }
                }, 0);
            }
        };
        HttpRequest.prototype.updateProgress = function (event) {
            if (event.lengthComputable) {
                dou.ProgressEvent.dispatch(this, dou.ProgressEvent.PROGRESS, event.loaded, event.total);
            }
        };
        HttpRequest.prototype.abort = function () {
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            this._url = null;
            this._method = null;
        };
        return HttpRequest;
    }(dou.EventDispatcher));
    dou.HttpRequest = HttpRequest;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 图片加载器
     * @author wizardc
     */
    var ImageLoader = /** @class */ (function (_super) {
        __extends(ImageLoader, _super);
        function ImageLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ImageLoader.prototype, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
            /**
             * 是否开启跨域访问控制
             */
            set: function (value) {
                this._crossOrigin = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageLoader.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        ImageLoader.prototype.load = function (url) {
            this._data = null;
            var image = this._currentImage = new Image();
            if (this._crossOrigin !== null) {
                if (this._crossOrigin) {
                    image.crossOrigin = "anonymous";
                }
            }
            else {
                if (ImageLoader.crossOrigin) {
                    image.crossOrigin = "anonymous";
                }
            }
            image.onload = this.onLoad.bind(this);
            image.onerror = this.onError.bind(this);
            image.src = url;
        };
        ImageLoader.prototype.getImage = function (element) {
            element.onload = element.onerror = null;
            if (this._currentImage === element) {
                this._data = element;
                this._currentImage = null;
                return element;
            }
            return null;
        };
        ImageLoader.prototype.onLoad = function (event) {
            var _this = this;
            var image = this.getImage(event.target);
            if (image) {
                setTimeout(function () {
                    _this.dispatch(dou.Event.COMPLETE);
                }, 0);
            }
        };
        ImageLoader.prototype.onError = function (event) {
            var _this = this;
            var image = this.getImage(event.target);
            if (image) {
                setTimeout(function () {
                    dou.IOErrorEvent.dispatch(_this, dou.IOErrorEvent.IO_ERROR, "Image load error: " + image.src);
                }, 0);
            }
        };
        /**
         * 默认是否开启跨域访问控制
         */
        ImageLoader.crossOrigin = false;
        return ImageLoader;
    }(dou.EventDispatcher));
    dou.ImageLoader = ImageLoader;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 声音加载器
     * @author wizardc
     */
    var SoundLoader = /** @class */ (function (_super) {
        __extends(SoundLoader, _super);
        function SoundLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SoundLoader.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        SoundLoader.prototype.load = function (url) {
            this._data = null;
            var audio = this._currentAudio = new Audio(url);
            audio.addEventListener("canplaythrough", this.onLoaded.bind(this));
            audio.addEventListener("error", this.onError.bind(this));
            audio.load();
        };
        SoundLoader.prototype.getAudio = function (element) {
            if (this._currentAudio === element) {
                this._data = element;
                this._currentAudio = null;
                return element;
            }
            return null;
        };
        SoundLoader.prototype.onLoaded = function (event) {
            var _this = this;
            var audio = this.getAudio(event.target);
            if (audio) {
                setTimeout(function () {
                    _this.dispatch(dou.Event.COMPLETE);
                }, 0);
            }
        };
        SoundLoader.prototype.onError = function (event) {
            var _this = this;
            var audio = this.getAudio(event.target);
            if (audio) {
                setTimeout(function () {
                    dou.IOErrorEvent.dispatch(_this, dou.IOErrorEvent.IO_ERROR, "Sound load error: " + audio.src);
                }, 0);
            }
        };
        return SoundLoader;
    }(dou.EventDispatcher));
    dou.SoundLoader = SoundLoader;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 套接字对象
     * @author wizardc
     */
    var Socket = /** @class */ (function (_super) {
        __extends(Socket, _super);
        function Socket(host, port) {
            var _this = _super.call(this) || this;
            _this._endian = 1 /* bigEndian */;
            _this._connected = false;
            _this._cacheInput = true;
            _this._addInputPosition = 0;
            if (host && port > 0 && port < 65535) {
                _this.connect(host, port);
            }
            return _this;
        }
        Object.defineProperty(Socket.prototype, "endian", {
            get: function () {
                return this._endian;
            },
            set: function (value) {
                this._endian = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "input", {
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "output", {
            get: function () {
                return this._output;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "connected", {
            get: function () {
                return this._connected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "cacheInput", {
            get: function () {
                return this._cacheInput;
            },
            /**
             * 是否缓存服务端发送的数据到输入流中
             */
            set: function (value) {
                this._cacheInput = value;
            },
            enumerable: true,
            configurable: true
        });
        Socket.prototype.connect = function (host, port) {
            var url;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            }
            else {
                url = "ws://" + host + ":" + port;
            }
            this.connectByUrl(url);
        };
        Socket.prototype.connectByUrl = function (url) {
            var _this = this;
            if (this._webSocket) {
                this.close();
            }
            this._url = url;
            this._webSocket = new WebSocket(url);
            this._webSocket.binaryType = "arraybuffer";
            this._input = new dou.ByteArray();
            this._input.endian = this.endian;
            this._output = new dou.ByteArray();
            this._output.endian = this.endian;
            this._addInputPosition = 0;
            this._webSocket.onopen = function (event) {
                _this.onOpen(event);
            };
            this._webSocket.onmessage = function (messageEvent) {
                _this.onMessage(messageEvent);
            };
            this._webSocket.onclose = function (event) {
                _this.onClose(event);
            };
            this._webSocket.onerror = function (event) {
                _this.onError(event);
            };
        };
        Socket.prototype.onOpen = function (event) {
            this._connected = true;
            this.dispatch(dou.Event.OPEN);
        };
        Socket.prototype.onMessage = function (messageEvent) {
            if (!messageEvent || !messageEvent.data) {
                return;
            }
            var data = messageEvent.data;
            if (!this._cacheInput && data) {
                this.dispatch(dou.Event.MESSAGE, data);
                return;
            }
            if (this._input.length > 0 && this._input.bytesAvailable < 1) {
                this._input.clear();
                this._addInputPosition = 0;
            }
            var pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            this._input.position = this._addInputPosition;
            if (data) {
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                }
                else {
                    this._input.writeUint8Array(new Uint8Array(data));
                }
                this._addInputPosition = this._input.position;
                this._input.position = pre;
            }
            this.dispatch(dou.Event.MESSAGE, data);
        };
        Socket.prototype.onClose = function (event) {
            this._connected = false;
            this.dispatch(dou.Event.CLOSE);
        };
        Socket.prototype.onError = function (event) {
            dou.IOErrorEvent.dispatch(this, dou.IOErrorEvent.IO_ERROR, "Socket connect error: " + this._url);
        };
        Socket.prototype.send = function (data) {
            this._webSocket.send(data);
        };
        Socket.prototype.flush = function () {
            if (this._output && this._output.length > 0) {
                var error = void 0;
                try {
                    if (this._webSocket) {
                        this._webSocket.send(this._output.buffer);
                    }
                }
                catch (e) {
                    error = e;
                }
                this._output.endian = this.endian;
                this._output.clear();
                if (error) {
                    dou.IOErrorEvent.dispatch(this, dou.IOErrorEvent.IO_ERROR, "Socket connect error: " + this._url);
                }
            }
        };
        Socket.prototype.close = function () {
            if (this._webSocket) {
                this.cleanSocket();
            }
        };
        Socket.prototype.cleanSocket = function () {
            this._webSocket.close();
            this._connected = false;
            this._webSocket.onopen = null;
            this._webSocket.onmessage = null;
            this._webSocket.onclose = null;
            this._webSocket.onerror = null;
            this._webSocket = null;
            this._url = null;
        };
        return Socket;
    }(dou.EventDispatcher));
    dou.Socket = Socket;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 获取引擎启动之后经过的毫秒数
     */
    function getTimer() {
        return Date.now() - dou.TickerBase.$startTime;
    }
    dou.getTimer = getTimer;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 对象池
     * @author wizardc
     */
    var ObjectPool = /** @class */ (function () {
        function ObjectPool(creator, maxCount) {
            if (maxCount === void 0) { maxCount = 50; }
            this._creator = creator;
            this._maxCount = maxCount;
            this._list = [];
        }
        Object.defineProperty(ObjectPool.prototype, "size", {
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
        ObjectPool.prototype.join = function (obj) {
            if (typeof obj.onRecycle === "function") {
                obj.onRecycle();
            }
            if (this._list.length < this._maxCount) {
                if (this._list.indexOf(obj) == -1) {
                    this._list.push(obj);
                }
            }
        };
        ObjectPool.prototype.take = function () {
            var obj;
            if (this._list.length == 0) {
                obj = new this._creator();
            }
            else {
                obj = this._list.pop();
                if (typeof obj.onReuse === "function") {
                    obj.onReuse();
                }
            }
            return obj;
        };
        ObjectPool.prototype.clear = function () {
            this._list.length = 0;
        };
        return ObjectPool;
    }());
    dou.ObjectPool = ObjectPool;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 获取一个可回收的对象
     */
    function recyclable(creator) {
        var pool;
        if (creator.hasOwnProperty("__pool")) {
            pool = creator.__pool;
        }
        else {
            var maxCount = creator.prototype.constructor.__cacheMaxCount || 50;
            pool = new dou.ObjectPool(creator, maxCount);
            var prototype = creator.prototype;
            if (!prototype.hasOwnProperty("recycle")) {
                prototype.recycle = function () {
                    pool.join(this);
                };
            }
            creator.__pool = pool;
        }
        return pool.take();
    }
    dou.recyclable = recyclable;
    /**
     * 对象池配置
     */
    function deployPool(targetClass, maxCount) {
        targetClass.prototype.constructor.__cacheMaxCount = maxCount;
    }
    dou.deployPool = deployPool;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 字节数组
     * @author wizardc
     */
    var ByteArray = /** @class */ (function () {
        function ByteArray(buffer, bufferExtSize) {
            if (bufferExtSize === void 0) { bufferExtSize = 0; }
            this._bufferExtSize = 0;
            this._eofByte = -1;
            this._eofCodePoint = -1;
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this._bufferExtSize = bufferExtSize;
            var bytes, wpos = 0;
            if (buffer) {
                var uint8 = void 0;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                }
                else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            }
            else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this._writePosition = wpos;
            this._position = 0;
            this._bytes = bytes;
            this._data = new DataView(bytes.buffer);
            this._endian = 1 /* bigEndian */;
        }
        Object.defineProperty(ByteArray.prototype, "endian", {
            get: function () {
                return this._endian;
            },
            set: function (value) {
                this._endian = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "readAvailable", {
            get: function () {
                return this._writePosition - this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "buffer", {
            get: function () {
                return this._data.buffer.slice(0, this._writePosition);
            },
            set: function (value) {
                var wpos = value.byteLength;
                var uint8 = new Uint8Array(value);
                var bufferExtSize = this._bufferExtSize;
                var bytes;
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
                this._writePosition = wpos;
                this._bytes = bytes;
                this._data = new DataView(bytes.buffer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "rawBuffer", {
            get: function () {
                return this._data.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytes", {
            get: function () {
                return this._bytes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "dataView", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this.buffer = value.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            get: function () {
                return this._data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                if (value > this._writePosition) {
                    this._writePosition = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "length", {
            get: function () {
                return this._writePosition;
            },
            set: function (value) {
                this._writePosition = value;
                if (this._data.byteLength > value) {
                    this._position = value;
                }
                this.validateBuffer(value);
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.validateBuffer = function (value) {
            if (this._data.byteLength < value) {
                var be = this._bufferExtSize;
                var tmp = void 0;
                if (be == 0) {
                    tmp = new Uint8Array(value);
                }
                else {
                    var nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this._data = new DataView(tmp.buffer);
            }
        };
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
            get: function () {
                return this._data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.validate = function (len) {
            var bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            }
            else {
                console.error("End of the file");
            }
        };
        ByteArray.prototype.validateBuffer2 = function (len) {
            this._writePosition = len > this._writePosition ? len : this._writePosition;
            len += this._position;
            this.validateBuffer(len);
        };
        ByteArray.prototype.readBoolean = function () {
            if (this.validate(1 /* SIZE_OF_BOOLEAN */)) {
                return !!this._bytes[this.position++];
            }
        };
        ByteArray.prototype.readByte = function () {
            if (this.validate(1 /* SIZE_OF_INT8 */)) {
                return this._data.getInt8(this.position++);
            }
        };
        ByteArray.prototype.readUnsignedByte = function () {
            if (this.validate(1 /* SIZE_OF_UINT8 */))
                return this._bytes[this.position++];
        };
        ByteArray.prototype.readShort = function () {
            if (this.validate(2 /* SIZE_OF_INT16 */)) {
                var value = this._data.getInt16(this._position, this._endian == 0 /* littleEndian */);
                this.position += 2 /* SIZE_OF_INT16 */;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedShort = function () {
            if (this.validate(2 /* SIZE_OF_UINT16 */)) {
                var value = this._data.getUint16(this._position, this._endian == 0 /* littleEndian */);
                this.position += 2 /* SIZE_OF_UINT16 */;
                return value;
            }
        };
        ByteArray.prototype.readInt = function () {
            if (this.validate(4 /* SIZE_OF_INT32 */)) {
                var value = this._data.getInt32(this._position, this._endian == 0 /* littleEndian */);
                this.position += 4 /* SIZE_OF_INT32 */;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedInt = function () {
            if (this.validate(4 /* SIZE_OF_UINT32 */)) {
                var value = this._data.getUint32(this._position, this._endian == 0 /* littleEndian */);
                this.position += 4 /* SIZE_OF_UINT32 */;
                return value;
            }
        };
        ByteArray.prototype.readFloat = function () {
            if (this.validate(4 /* SIZE_OF_FLOAT32 */)) {
                var value = this._data.getFloat32(this._position, this._endian == 0 /* littleEndian */);
                this.position += 4 /* SIZE_OF_FLOAT32 */;
                return value;
            }
        };
        ByteArray.prototype.readDouble = function () {
            if (this.validate(8 /* SIZE_OF_FLOAT64 */)) {
                var value = this._data.getFloat64(this._position, this._endian == 0 /* littleEndian */);
                this.position += 8 /* SIZE_OF_FLOAT64 */;
                return value;
            }
        };
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!bytes) {
                return;
            }
            var pos = this._position;
            var available = this._writePosition - pos;
            if (available < 0) {
                console.error("End of the file");
                return;
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                console.error("End of the file");
                return;
            }
            var position = bytes._position;
            bytes._position = 0;
            bytes.validateBuffer2(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        };
        ByteArray.prototype.readUTF = function () {
            var length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length)) {
                return;
            }
            var data = this._data;
            var bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        };
        ByteArray.prototype.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var byte = data[pos++];
                if (byte == this._eofByte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this._eofCodePoint;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(byte, 0x00, 0x7F)) {
                            code_point = byte;
                        }
                        else {
                            if (this.inRange(byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = byte - 0xC0;
                            }
                            else if (this.inRange(byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = byte - 0xE0;
                            }
                            else if (this.inRange(byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, byte);
                            }
                        }
                    }
                }
                if (code_point !== null && code_point !== this._eofCodePoint) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0) {
                            result += String.fromCharCode(code_point);
                        }
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        ByteArray.prototype.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        ByteArray.prototype.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
                console.error("Decoding error");
            }
            return opt_code_point || 0xFFFD;
        };
        ByteArray.prototype.writeBoolean = function (value) {
            this.validateBuffer2(1 /* SIZE_OF_BOOLEAN */);
            this._bytes[this.position++] = +value;
        };
        ByteArray.prototype.writeByte = function (value) {
            this.validateBuffer2(1 /* SIZE_OF_INT8 */);
            this._bytes[this.position++] = value & 0xff;
        };
        ByteArray.prototype.writeShort = function (value) {
            this.validateBuffer2(2 /* SIZE_OF_INT16 */);
            this._data.setInt16(this._position, value, this._endian == 0 /* littleEndian */);
            this.position += 2 /* SIZE_OF_INT16 */;
        };
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this.validateBuffer2(2 /* SIZE_OF_UINT16 */);
            this._data.setUint16(this._position, value, this._endian == 0 /* littleEndian */);
            this.position += 2 /* SIZE_OF_UINT16 */;
        };
        ByteArray.prototype.writeInt = function (value) {
            this.validateBuffer2(4 /* SIZE_OF_INT32 */);
            this._data.setInt32(this._position, value, this._endian == 0 /* littleEndian */);
            this.position += 4 /* SIZE_OF_INT32 */;
        };
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this.validateBuffer2(4 /* SIZE_OF_UINT32 */);
            this._data.setUint32(this._position, value, this._endian == 0 /* littleEndian */);
            this.position += 4 /* SIZE_OF_UINT32 */;
        };
        ByteArray.prototype.writeFloat = function (value) {
            this.validateBuffer2(4 /* SIZE_OF_FLOAT32 */);
            this._data.setFloat32(this._position, value, this._endian == 0 /* littleEndian */);
            this.position += 4 /* SIZE_OF_FLOAT32 */;
        };
        ByteArray.prototype.writeDouble = function (value) {
            this.validateBuffer2(8 /* SIZE_OF_FLOAT64 */);
            this._data.setFloat64(this._position, value, this._endian == 0 /* littleEndian */);
            this.position += 8 /* SIZE_OF_FLOAT64 */;
        };
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer2(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        };
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer2(2 /* SIZE_OF_UINT16 */ + length);
            this._data.setUint16(this._position, length, this._endian == 0 /* littleEndian */);
            this.position += 2 /* SIZE_OF_UINT16 */;
            this.writeUint8Array(utf8bytes, false);
        };
        ByteArray.prototype.writeUTFBytes = function (value) {
            this.writeUint8Array(this.encodeUTF8(value));
        };
        ByteArray.prototype.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    console.error("EncodingError The code point " + code_point + " could not be encoded");
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count = void 0, offset = void 0;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        ByteArray.prototype.stringToCodePoints = function (string) {
            var cps = [];
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        ByteArray.prototype.writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            var pos = this._position;
            var npos = pos + bytes.length;
            if (validateBuffer) {
                this.validateBuffer2(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        };
        ByteArray.prototype.div = function (n, d) {
            return Math.floor(n / d);
        };
        ByteArray.prototype.clear = function () {
            var buffer = new ArrayBuffer(this._bufferExtSize);
            this._data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this._writePosition = 0;
        };
        ByteArray.prototype.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        return ByteArray;
    }());
    dou.ByteArray = ByteArray;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 提供泛型哈希表的支持
     * 如果 key 使用继承 dou.HashObject 的对象, 则使用 hashCode 作为其键值, 否则使用 toString() 的返回作为键值
     * @author wizardc
     */
    var Dictionary = /** @class */ (function () {
        function Dictionary(map) {
            this._map = map || {};
            this._keyMap = {};
            this._size = 0;
        }
        Object.defineProperty(Dictionary.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Dictionary.prototype.getKey = function (key) {
            if ((key) instanceof dou.HashObject) {
                return (key).hashCode.toString();
            }
            return key.toString();
        };
        Dictionary.prototype.add = function (key, value) {
            var k = this.getKey(key);
            if (!this._map.hasOwnProperty(k)) {
                ++this._size;
            }
            this._map[k] = value;
            this._keyMap[k] = key;
        };
        Dictionary.prototype.has = function (key) {
            var k = this.getKey(key);
            return this._map.hasOwnProperty(k);
        };
        Dictionary.prototype.get = function (key) {
            var k = this.getKey(key);
            return this._map[k];
        };
        Dictionary.prototype.forEach = function (callbackfn, thisArg) {
            for (var key in this._map) {
                if (this._map.hasOwnProperty(key)) {
                    callbackfn.call(thisArg, this._map[key], this._keyMap[key], this);
                }
            }
        };
        Dictionary.prototype.remove = function (key) {
            var k = this.getKey(key);
            if (!this._map.hasOwnProperty(k)) {
                return false;
            }
            delete this._map[k];
            delete this._keyMap[k];
            --this._size;
            return true;
        };
        Dictionary.prototype.clear = function () {
            this._map = {};
            this._keyMap = {};
            this._size = 0;
        };
        Dictionary.prototype.toString = function () {
            var result = [];
            for (var key in this._map) {
                if (this._map.hasOwnProperty(key)) {
                    result.push("{key:" + this._keyMap[key] + ", value:" + this._map[key] + "}");
                }
            }
            return "{" + result.join(", ") + "}";
        };
        Dictionary.prototype.keyOf = function () {
            return this._keyMap;
        };
        Dictionary.prototype.valueOf = function () {
            return this._map;
        };
        return Dictionary;
    }());
    dou.Dictionary = Dictionary;
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * HTTP 请求工具类
     * @author wizardc
     */
    var HttpUtil;
    (function (HttpUtil) {
        function addParamToUrl(url, data) {
            if (data) {
                for (var key in data) {
                    var value = data[key];
                    url += "&" + key + "=" + value;
                }
                if (url.indexOf("?") == -1) {
                    url = url.replace("&", "?");
                }
            }
            return url;
        }
        HttpUtil.addParamToUrl = addParamToUrl;
        function get(url, callback, thisObj, errorCallback, errorThisObj) {
            request("GET", url, null, callback, thisObj, errorCallback, errorThisObj);
        }
        HttpUtil.get = get;
        function post(url, data, callback, thisObj, errorCallback, errorThisObj) {
            request("POST", url, data, callback, thisObj, errorCallback, errorThisObj);
        }
        HttpUtil.post = post;
        function request(method, url, data, callback, thisObj, errorCallback, errorThisObj) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var error = (xhr.status >= 400 || xhr.status == 0);
                    if (error) {
                        if (errorCallback) {
                            errorCallback.call(errorThisObj, xhr.status);
                        }
                    }
                    else {
                        if (callback) {
                            callback.call(thisObj, xhr.response);
                        }
                    }
                }
            };
            xhr.open(method, url, true);
            switch (typeof data) {
                case "string":
                    break;
                case "object":
                    data = JSON.stringify(data);
                    break;
                default:
                    data = "" + data;
            }
            xhr.send(data);
        }
    })(HttpUtil = dou.HttpUtil || (dou.HttpUtil = {}));
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 脚本工具类
     * @author wizardc
     */
    var ScriptUtil;
    (function (ScriptUtil) {
        /**
         * 同步加载 JS 文件
         */
        function loadJSSync(url) {
            document.write("<script type=\"text/javascript\" src=\"" + url + "\"></script>");
        }
        ScriptUtil.loadJSSync = loadJSSync;
        /**
         * 异步加载 JS 文件, 放在 head 中
         */
        function loadJSAsync(url) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        ScriptUtil.loadJSAsync = loadJSAsync;
        /**
         * 异步加载 JS 文件, 放在 body 中
         */
        function loadJS(url, cross, callback, thisObj) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            var script = document.createElement("script");
            script.async = false;
            script.src = url;
            if (cross) {
                script.crossOrigin = "anonymous";
            }
            script.addEventListener("load", function () {
                script.parentNode.removeChild(script);
                script.removeEventListener("load", arguments.callee, false);
                callback.apply(thisObj, args);
            }, false);
            document.body.appendChild(script);
        }
        ScriptUtil.loadJS = loadJS;
    })(ScriptUtil = dou.ScriptUtil || (dou.ScriptUtil = {}));
})(dou || (dou = {}));
var dou;
(function (dou) {
    /**
     * 位运算工具类
     * @author wizardc
     */
    var BitUtil;
    (function (BitUtil) {
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @param value 设置为 1 (true) 还是 0 (false)
         */
        function setBit(target, position, value) {
            if (value) {
                target |= 1 << position;
            }
            else {
                target &= ~(1 << position);
            }
            return target;
        }
        BitUtil.setBit = setBit;
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @returns 对应的值为 1 (true) 还是 0 (false)
         */
        function getBit(target, position) {
            return target == (target | (1 << position));
        }
        BitUtil.getBit = getBit;
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @returns 对应的值为 1 (true) 还是 0 (false)
         */
        function switchBit32(target, position) {
            target ^= 1 << position;
            return target;
        }
        BitUtil.switchBit32 = switchBit32;
    })(BitUtil = dou.BitUtil || (dou.BitUtil = {}));
})(dou || (dou = {}));

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var examples;
(function (examples) {
    var SkyBoxTest = /** @class */ (function () {
        function SkyBoxTest(view3D) {
            this.showSkyBox(view3D).then(function () {
                console.log("done");
            }).catch(function (error) {
                console.error(error);
            });
        }
        SkyBoxTest.prototype.showSkyBox = function (view3D) {
            return __awaiter(this, void 0, void 0, function () {
                var texture, geometery, material, skybox, controller, pos, pan, tilt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            view3D.backColor = 0xff666666;
                            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
                            return [4 /*yield*/, dou.loader.loadGroupAsync([
                                    { url: "resource/skybox/up.jpg" },
                                    { url: "resource/skybox/down.jpg" },
                                    { url: "resource/skybox/left.jpg" },
                                    { url: "resource/skybox/right.jpg" },
                                    { url: "resource/skybox/front.jpg" },
                                    { url: "resource/skybox/back.jpg" }
                                ])];
                        case 1:
                            _a.sent();
                            texture = new dou3d.CubeTexture();
                            texture.image_up = dou.loader.get("resource/skybox/up.jpg").texture2D;
                            texture.image_down = dou.loader.get("resource/skybox/down.jpg").texture2D;
                            texture.image_left = dou.loader.get("resource/skybox/left.jpg").texture2D;
                            texture.image_right = dou.loader.get("resource/skybox/right.jpg").texture2D;
                            texture.image_front = dou.loader.get("resource/skybox/front.jpg").texture2D;
                            texture.image_back = dou.loader.get("resource/skybox/back.jpg").texture2D;
                            geometery = new dou3d.CubeGeometry(8000, 8000, 8000);
                            material = new dou3d.CubeTextureMaterial(texture);
                            skybox = new dou3d.SkyBox(geometery, material);
                            view3D.scene.root.addChild(skybox);
                            controller = new dou3d.HoverController(view3D.camera3D, new dou3d.Vector3(), 0, 0, 1000);
                            view3D.on(dou3d.Event3D.TOUCH_BEGIN, function (event) {
                                pos = new dou3d.Vector3();
                                pos.copy(event.data);
                                pan = controller.panAngle;
                                tilt = controller.tiltAngle;
                            });
                            view3D.on(dou3d.Event3D.TOUCH_MOVE, function (event) {
                                if (pos) {
                                    var distX = event.data.x - pos.x;
                                    var distY = event.data.y - pos.y;
                                    controller.panAngle = pan + distX * 0.1;
                                    controller.tiltAngle = tilt + distY * 0.1;
                                }
                            });
                            view3D.on(dou3d.Event3D.TOUCH_END, function (event) {
                                pos = null;
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SkyBoxTest;
    }());
    examples.SkyBoxTest = SkyBoxTest;
})(examples || (examples = {}));

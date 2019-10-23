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
    var AnimationTest = /** @class */ (function () {
        function AnimationTest(view3D) {
            this.showAnimation(view3D).then(function () {
                console.log("done");
            }).catch(function (error) {
                console.error(error);
            });
        }
        AnimationTest.prototype.showAnimation = function (view3D) {
            return __awaiter(this, void 0, void 0, function () {
                var material, geometry, mesh, animationList, _i, animationList_1, animation, clip;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            view3D.backColor = 0xff666666;
                            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
                            return [4 /*yield*/, dou.loader.loadGroupAsync([
                                    { url: "resource/anim/xiaoqiao/body_27.esm" },
                                    { url: "resource/anim/xiaoqiao/hero_27.png" },
                                    { url: "resource/anim/xiaoqiao/idle_1.eam" },
                                    { url: "resource/anim/xiaoqiao/run_1.eam" },
                                    { url: "resource/anim/xiaoqiao/death_1.eam" },
                                    { url: "resource/anim/xiaoqiao/attack_1.eam" },
                                    { url: "resource/anim/xiaoqiao/attack_2.eam" },
                                    { url: "resource/anim/xiaoqiao/skill_1.eam" },
                                    { url: "resource/anim/xiaoqiao/skill_2.eam" },
                                    { url: "resource/anim/xiaoqiao/skill_3.eam" },
                                    { url: "resource/anim/xiaoqiao/skill_4.eam" }
                                ])];
                        case 1:
                            _a.sent();
                            material = new dou3d.TextureMaterial(dou.loader.get("resource/anim/xiaoqiao/hero_27.png"));
                            geometry = dou.loader.get("resource/anim/xiaoqiao/body_27.esm");
                            mesh = new dou3d.Mesh(geometry, material);
                            view3D.scene.root.addChild(mesh);
                            animationList = ["idle_1", "run_1", "death_1", "attack_1", "attack_2", "skill_1", "skill_2", "skill_3", "skill_4"];
                            for (_i = 0, animationList_1 = animationList; _i < animationList_1.length; _i++) {
                                animation = animationList_1[_i];
                                clip = dou.loader.get("resource/anim/xiaoqiao/" + animation + ".eam");
                                clip.animationName = animation;
                                mesh.animation.addSkeletonAnimationClip(clip);
                            }
                            mesh.animation.play("idle_1");
                            document.addEventListener("keydown", function (e) {
                                switch (e.keyCode) {
                                    case 97:
                                        mesh.animation.play("idle_1");
                                        break;
                                    case 98:
                                        mesh.animation.play("run_1");
                                        break;
                                    case 99:
                                        mesh.animation.play("death_1");
                                        break;
                                    case 100:
                                        mesh.animation.play("attack_1");
                                        break;
                                    case 101:
                                        mesh.animation.play("attack_2");
                                        break;
                                    case 102:
                                        mesh.animation.play("skill_1");
                                        break;
                                    case 103:
                                        mesh.animation.play("skill_2");
                                        break;
                                    case 104:
                                        mesh.animation.play("skill_3");
                                        break;
                                    case 105:
                                        mesh.animation.play("skill_4");
                                        break;
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AnimationTest;
    }());
    examples.AnimationTest = AnimationTest;
})(examples || (examples = {}));

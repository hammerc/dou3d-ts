"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec = require("child_process").exec;
const util = require('util');
const execAsync = util.promisify(exec);
/**
 * 调用一个外部命令
 * @param cwd 当前工作目录
 * @param cmd 执行的命令
 * @param print 是否打印外部命令的消息
 */
function process(cwd, cmd, print) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout, stderr } = yield execAsync(cmd, { cwd });
        if (print && stdout) {
            console.log(stdout);
        }
        if (print && stderr) {
            console.error(stderr);
        }
    });
}
exports.process = process;

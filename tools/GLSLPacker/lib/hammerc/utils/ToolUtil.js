"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ToolUtil;
(function (ToolUtil) {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"];
    /**
     * 根据数字获取混淆后的变量名
     * 需要特别注意: 混淆后的变量名不能出现 $ 符号, 因为如果使用正则表达式替换时, 出现混淆后的名字为 ab$1ab 时, 会因为组的写法被替换为未知的字符串, 如 ab"ab 之类导致问题
     * @param num 数字
     * @param prefix 前缀
     */
    function getNameByNum(num, prefix) {
        let len = chars.length;
        let result = [];
        do {
            result.push(chars[num % len]);
            num = ~~(num / len);
        } while (num > 0);
        return (prefix || "") + result.reverse().join("");
    }
    ToolUtil.getNameByNum = getNameByNum;
})(ToolUtil || (ToolUtil = {}));
exports.ToolUtil = ToolUtil;

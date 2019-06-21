declare namespace ToolUtil {
    /**
     * 根据数字获取混淆后的变量名
     * 需要特别注意: 混淆后的变量名不能出现 $ 符号, 因为如果使用正则表达式替换时, 出现混淆后的名字为 ab$1ab 时, 会因为组的写法被替换为未知的字符串, 如 ab"ab 之类导致问题
     * @param num 数字
     * @param prefix 前缀
     */
    function getNameByNum(num: number, prefix?: string): string;
}
export { ToolUtil };

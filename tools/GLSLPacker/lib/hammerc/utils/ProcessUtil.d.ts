/**
 * 调用一个外部命令
 * @param cwd 当前工作目录
 * @param cmd 执行的命令
 * @param print 是否打印外部命令的消息
 */
declare function process(cwd: string, cmd: string, print?: boolean): Promise<any>;
export { process };

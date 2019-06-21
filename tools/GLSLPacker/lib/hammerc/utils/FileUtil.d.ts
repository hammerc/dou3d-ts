declare namespace FileUtil {
    /**
     * 获取指定文件夹下的所有文件
     * @param fileDir 指定文件夹
     * @param ext 文件后缀名, 空表示不过滤文件后缀名, 多个可用 "|" 分隔
     * @param subfolder 是否获取子文件夹
     * @param ignoreFile 用于自定义来判断是否需要忽略指定的文件或文件夹
     * @returns 指定文件夹下的所有文件
     */
    function getAllFile(fileDir: string, ext?: string, subfolder?: boolean, ignoreFile?: (filePath: string, isFile: boolean) => boolean): string[];
    /**
     * 创建文件夹
     * @param dir 文件夹路径
     * @returns 是否创建成功
     */
    function createDir(dir: string): boolean;
    /**
     * 复制文件
     * @param src 源文件
     * @param dst 目标文件
     */
    function copyFile(src: string, dst: string): boolean;
    /**
     * 复制文件夹
     * @param srcDir 源文件夹
     * @param dstDir 目标文件夹
     * @param ext 文件后缀名, 空表示不过滤文件后缀名, 多个可用 "|" 分隔
     * @param subfolder 是否获取子文件夹
     * @param ignoreFile 用于自定义来判断是否需要忽略指定的文件或文件夹
     */
    function copyDir(srcDir: string, dstDir: string, ext?: string, subfolder?: boolean, ignoreFile?: (filePath: string, isFile: boolean) => boolean): void;
    /**
     * 删除指定文件夹
     * @param dir 文件夹路径
     * @returns 是否删除成功
     */
    function deleteDir(dir: string): boolean;
}
export { FileUtil };

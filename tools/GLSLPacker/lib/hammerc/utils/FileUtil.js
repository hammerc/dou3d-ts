"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var FileUtil;
(function (FileUtil) {
    /**
     * 获取指定文件夹下的所有文件
     * @param fileDir 指定文件夹
     * @param ext 文件后缀名, 空表示不过滤文件后缀名, 多个可用 "|" 分隔
     * @param subfolder 是否获取子文件夹
     * @param ignoreFile 用于自定义来判断是否需要忽略指定的文件或文件夹
     * @returns 指定文件夹下的所有文件
     */
    function getAllFile(fileDir, ext, subfolder = true, ignoreFile) {
        fileDir = path.normalize(fileDir);
        let result = [];
        let extList;
        if (ext) {
            extList = ext.split("|");
            extList = extList.map(v => {
                return v.toLowerCase();
            });
        }
        fileExplore(result, fileDir, extList, subfolder, ignoreFile);
        return result;
    }
    FileUtil.getAllFile = getAllFile;
    function fileExplore(list, fileDir, ext, subfolder, ignoreFile) {
        let files = fs.readdirSync(fileDir);
        files.forEach((filename) => {
            let filePath = path.join(fileDir, filename);
            let stats = fs.statSync(filePath);
            let isFile = stats.isFile();
            let isDir = stats.isDirectory();
            if (isFile) {
                if (!(ignoreFile && ignoreFile(filePath, true))) {
                    if (!ext) {
                        list.push(filePath);
                    }
                    else {
                        let extName = path.extname(filePath).toLowerCase().substr(1);
                        if (ext.indexOf(extName) != -1) {
                            list.push(filePath);
                        }
                    }
                }
            }
            if (subfolder && isDir) {
                if (!(ignoreFile && ignoreFile(filePath, false))) {
                    fileExplore(list, filePath, ext, subfolder, ignoreFile);
                }
            }
        });
    }
    /**
     * 创建文件夹
     * @param dir 文件夹路径
     * @returns 是否创建成功
     */
    function createDir(dir) {
        dir = path.normalize(dir);
        if (fs.existsSync(dir)) {
            return true;
        }
        else {
            if (createDir(path.dirname(dir))) {
                fs.mkdirSync(dir);
                return true;
            }
        }
        return false;
    }
    FileUtil.createDir = createDir;
    /**
     * 复制文件
     * @param src 源文件
     * @param dst 目标文件
     */
    function copyFile(src, dst) {
        src = path.normalize(src);
        dst = path.normalize(dst);
        if (!fs.existsSync(src)) {
            return false;
        }
        createDir(path.dirname(dst));
        fs.writeFileSync(dst, fs.readFileSync(src));
        return true;
    }
    FileUtil.copyFile = copyFile;
    /**
     * 复制文件夹
     * @param srcDir 源文件夹
     * @param dstDir 目标文件夹
     * @param ext 文件后缀名, 空表示不过滤文件后缀名, 多个可用 "|" 分隔
     * @param subfolder 是否获取子文件夹
     * @param ignoreFile 用于自定义来判断是否需要忽略指定的文件或文件夹
     */
    function copyDir(srcDir, dstDir, ext, subfolder = true, ignoreFile) {
        srcDir = path.normalize(srcDir);
        dstDir = path.normalize(dstDir);
        createDir(dstDir);
        let filePaths = getAllFile(srcDir, ext, subfolder, ignoreFile);
        filePaths.forEach(v => {
            v = path.normalize(v);
            let dirStr = v.replace(srcDir, "");
            let dstPath = path.join(dstDir, dirStr);
            copyFile(v, dstPath);
        });
    }
    FileUtil.copyDir = copyDir;
    /**
     * 删除指定文件夹
     * @param dir 文件夹路径
     * @returns 是否删除成功
     */
    function deleteDir(dir) {
        dir = path.normalize(dir);
        let files = [];
        if (fs.existsSync(dir)) {
            files = fs.readdirSync(dir);
            for (let file of files) {
                let curPath = path.join(dir, file);
                if (fs.statSync(curPath).isDirectory()) {
                    deleteDir(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            }
            fs.rmdirSync(dir);
            return true;
        }
        return false;
    }
    FileUtil.deleteDir = deleteDir;
})(FileUtil || (FileUtil = {}));
exports.FileUtil = FileUtil;

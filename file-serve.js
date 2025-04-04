import fs from 'fs';
import path from 'path';
export function isStaticFile(filePath){
    const rootPath = getCurrentDirPath();
    const fullPath = path.join(rootPath, 'public', filePath);
    const ext = path.extname(fullPath);
    const fileType = ['.html','.css','.js','.png','.jpeg','.jpg'];
    console.log(fileType.indexOf(ext)>=0);
    return fileType.indexOf(ext)>=0;
}
export function serveStaticFile(filePath, response){
    const rootPath = getCurrentDirPath();
    const fullPath = path.join(rootPath, 'public', filePath);
    const stream = fs.createReadStream(fullPath);
    stream.pipe(response);
}
function getCurrentDirPath(){
    return import.meta.dirname;
}
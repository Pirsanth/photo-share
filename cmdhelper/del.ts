import FS from "fs";
var fs = FS.promises;

const originalsSrc = "../public/originals";
const thumbsSrc = "../public/thumbnails";

Promise.all([cleanInsideTheDir(thumbsSrc), cleanInsideTheDir(originalsSrc)])
.then(() => console.log("The public folder has been emptied"))
.catch(err => console.log(err))

function cleanInsideTheDir(dirPath: string):Promise<void[]>{
  return fs.readdir(dirPath)
          .then(arr => Promise.all(arr.map(filePath => removeOneFile(dirPath, filePath))))
}

function removeOneFile(dirPath:string, filepath: string):Promise<void>{
  return fs.unlink(`${dirPath}/${filepath}`);
}

import FS from "fs";
var fs = FS.promises;
import path from "path";

const publicDir = path.join(__dirname, "..", "public")


function cleanInsideTheDir(dirPath: string){
 return fs.readdir(dirPath)
          .then(arr => Promise.all(arr.map(fileName => removeOneFile(dirPath, fileName))))
}

function removeOneFile(dirPath:string, filename: string){
  const pathToFile = path.join(dirPath, filename);
  return fs.unlink(pathToFile);
}

async function cleanPublic(){
  //we have to preserve the subfolders of the public directory
  var dirsNotToDel =  await fs.readdir(publicDir);

  await Promise.all(dirsNotToDel.map(dirName => cleanInsideTheDir(path.join(publicDir, dirName))));
  console.log("Static files in the public folder cleared");

}
cleanPublic();

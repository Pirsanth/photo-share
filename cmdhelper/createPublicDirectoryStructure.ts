import FS from "fs";
var fs = FS.promises;
import path from "path";

const publicDir = path.join(__dirname, "..", "public")
const folderNames = ['avatars', 'originals', 'temp', 'thumbnails'];

( async function() {
  await Promise.all(folderNames.map(folderName => makeAFolderInPublicDir(folderName)));
  console.log("Public directory initialized");
})();



function makeAFolderInPublicDir(folderName){
  return fs.mkdir( path.join(publicDir, folderName), {recursive: true} );
}

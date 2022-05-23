const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir(src) {
  let dst = src.replace('files','files-copy');
  if (src === path.join(__dirname,'files')) {
    await fsPromises.rmdir(dst,{recursive:true, force:true});
  }
  fsPromises.mkdir(dst,{recursive:true});
  fs.readdir(src,{withFileTypes:true},(err, files)=>{
    files.forEach(file=>{
      if (file.isDirectory()) {
        fsPromises.mkdir(path.join(src,file.name).replace('files','files-copy'),{recursive:true});
        copyDir(path.join(src,file.name));
      }
      else {
        fsPromises.copyFile(path.join(src,file.name), path.join(src,file.name).replace('files','files-copy'),fs.constants.COPYFILE_FICLONE);
      }
    });
  });
}

copyDir(path.join(__dirname,'files'));
const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const bundle = path.join(__dirname,'project-dist','bundle.css');

async function update(src) {
  if (src === path.join(__dirname,'styles')) await fs.promises.rm(bundle,{force:true});
  let files = await fsPromises.readdir(src,{withFileTypes:true});
  files.forEach(file=>{
    if (file.isDirectory()) {
      update(path.join(src,file.name));
    }
    else {
      if (path.extname(file.name) === '.css') {
        fs.readFile(path.join(src, file.name),(err, data)=>{
          fsPromises.appendFile(bundle, data);
        });
      }
    }
  });
}

update(path.join(__dirname,'styles'));
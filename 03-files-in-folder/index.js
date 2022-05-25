const fs = require('fs');
const path = require('path');
let name,ext,size;

fs.readdir(path.join(__dirname,'secret-folder'), {withFileTypes:true}, (err, files)=>{
  files.forEach(async (file)=>{
    if (!(file.isDirectory())) {
      name =  file.name;
      size = (await fs.promises.stat(path.join(__dirname, 'secret-folder', file.name))).size;
      name = name.replace(`.${ext}`,'');
      ext = path.extname(file.name).replace('.','');
      process.stdout.write(`${file.name.replace(/\..+/,'')} - ${path.extname(file.name).replace('.','')} - ${size}b\n`);
    }
  });
});

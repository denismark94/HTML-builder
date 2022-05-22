const fs = require('fs');
const path = require('path');
let name,ext,size;
fs.readdir(path.join(__dirname,'secret-folder'), {withFileTypes:true}, (err, files)=>{
  files.forEach((file)=>{
    if (!(file.isDirectory())) {
      name = file.name;
      ext = path.extname(file.name);
      size = fs.statSync(path.join(__dirname, 'secret-folder', name)).size;
      name = name.replace(ext,'');
      ext = ext.replace('.','');
      process.stdout.write(`${name} - ${ext} - ${size}b\n`);
    }
  });
});

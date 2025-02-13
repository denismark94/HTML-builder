const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const bundle = path.join(__dirname,'project-dist','style.css');

async function buildStyles(src) {
  let files = await fsPromises.readdir(src,{withFileTypes:true});
  files.forEach(file=>{
    if (file.isDirectory()) {
      buildStyles(path.join(src,file.name));
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

let dst = path.join(__dirname,'project-dist');

async function copyDir(src) {
  dst = src.replace(__dirname, path.join(__dirname,'project-dist'));
  fsPromises.mkdir(dst,{recursive:true, force:true});
  fs.readdir(src,{withFileTypes:true},(err, files)=>{
    files.forEach(file=>{
      if (file.isDirectory()) {
        copyDir(path.join(src,file.name));
      }
      else {
        dst = src.replace(__dirname, path.join(__dirname,'project-dist'));
        fsPromises.copyFile(path.join(src,file.name), path.join(dst,file.name), fs.constants.COPYFILE_FICLONE);
      }
    });
  });
}

async function buildHTML() {
  let data = await fsPromises.readFile(path.join(__dirname,'template.html'),'utf-8');
  fs.readdir(path.join(__dirname,'components'),{withFileTypes:true},(err,files)=>{
    if (err) throw err;
    files.forEach(file=>{
      fs.readFile(path.join(__dirname,'components',file.name),'utf-8',async (err, component)=>{
        data = await data.replace(`{{${file.name.replace(/\..+/,'')}}}`,component);
        fsPromises.writeFile(path.join(__dirname,'project-dist','index.html'),data);
      });
    });
  });
}


async function build() {
  unlink(path.join(__dirname,'project-dist')).then(()=>{
    fsPromises.mkdir(path.join(__dirname,'project-dist'),{recursive:true}).then(()=>{
      buildStyles(path.join(__dirname,'styles'));
      copyDir(path.join(__dirname,'assets'));
      buildHTML();
    });
  });
}

build();


async function unlink(src) {
  fs.readdir(src,{withFileTypes:true},async (err, files)=>{
    if (files) {
      files.forEach(async file=>{
        if (file.isDirectory()) {
          await unlink(path.join(src,file.name));
        } else {
          await fs.promises.unlink(path.join(src,file.name),{recursive:true, force:true});
        }
      });
    }
  });
}
const fs = require('fs');
const path = require('path');


function append(buffer) {
  fs.appendFile(path.join(__dirname,'text.txt'),buffer,(err)=>{if (err) throw err;});
}
process.stdout.write('Type any text here. Type \'exit\' or press ctrl+c to stop execution\n');
fs.promises.writeFile(path.join(__dirname,'text.txt'),'');
process.stdin.on('data', (data)=>{
  if (data.toString().includes('exit')) {
    process.exit();
  }
  append(data.toString());
});
process.on('exit',()=>process.stdout.write('Execution finished'));
process.on('SIGINT',()=>{
  process.stdout.write('\n');
  process.exit();
});
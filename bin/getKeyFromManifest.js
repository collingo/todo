var manifest = require('../package.json');
if(!process.argv[2]) {
  console.error("ERROR: Please pass the key you wish to extract from package.json");
  process.exit(1);
}
process.stdout.write(manifest[process.argv[2]]);

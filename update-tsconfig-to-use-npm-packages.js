const fs = require('fs');

// Read the tsconfig.json file
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

// Remove the paths property if it exists
if (tsconfig.compilerOptions) {
  delete tsconfig.compilerOptions.paths;
}

// Write the modified config back to file
// Using pretty-printing with 2 spaces for indentation to match typical tsconfig format
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

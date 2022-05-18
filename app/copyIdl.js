const fs = require("fs");
const idl = require("../target/idl/maius_payment.json");
const Path = require("path");
const FSP = require("fs").promises;

async function copyDir(src, dest) {
  const entries = await FSP.readdir(src, { withFileTypes: true });
  await FSP.mkdir(dest);
  for (let entry of entries) {
    const srcPath = Path.join(src, entry.name);
    const destPath = Path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await FSP.copyFile(srcPath, destPath);
    }
  }
}

fs.writeFileSync("./src/idl.json", JSON.stringify(idl));
copyDir("../target/types", "./src/types");

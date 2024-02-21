const path = require("path");
const fs = require("fs-extra");
let inquirer = require("inquirer");
let init = require("./init");

module.exports = async function (name, options) {
  // current cmd directory address
  const cwd = process.cwd();

  // create target directory address
  const targetAir = path.join(cwd, name);
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      let answer = await inquirer.prompt([
        {
          name: "language",
          type: "list",
          message: `Target directory ${targetAir} already exists. Pick an action: (Use arrow keys)`,
          choices: ["Overwrite", "Cancel"],
        },
      ]);
      if (answer.language === "Overwrite") {
        await fs.remove(targetAir);
      }
      if (answer.language === "Cancel") {
        return;
      }
    }
  }
  init(name);
};

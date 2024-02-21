let { promisify } = require("util");
const ora = require("ora");
const download = promisify(require("download-git-repo"));
let chalk = require("chalk");
let inquirer = require("inquirer");
let asyncFiglet = promisify(require("figlet"));

const source = require("./constants");

const sourceChoices = source.LIST.map((res) => {
  return res.label;
});

// 日志打印函数
const log = (content) => console.log(chalk.yellow(content));

// 打印LOGO
async function printLogo() {
  let data = await asyncFiglet("constituere");
  log(data);
}

module.exports = async (appName) => {
  await printLogo();
  log(`🚀 create project ${appName}`);
  let answer = await inquirer.prompt([
    {
      name: "project",
      type: "list",
      message: "Please pick a present:",
      choices: sourceChoices,
    },
  ]);

  // Loop through the source list to find the corresponding gitURL for the selected project
  for (let i = 0; i < source.LIST.length; i++) {
    if (answer.project === source.LIST[i].label) {
      // If the selected project matches a project in the source list, download the corresponding gitURL
      const spinner = ora("downloading...").start();
      try {
        await download(
          `direct:${source.LIST[i].gitUrl}`, // 目标项目地址
          appName,
          { clone: true }
        );
        spinner.succeed("🎉download  success");
        log(`
        cd ${appName}
        yarn or npm install 
        `);
      } catch (error) {
        spinner.fail(`😨download error`, error);
        spinner.stop();
      }
      break;
    }
  }
};

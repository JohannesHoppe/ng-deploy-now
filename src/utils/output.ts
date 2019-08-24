import ora from "ora";
import chalk from "chalk";

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const wait = (text: string) => {
  const spinner = ora({ text: chalk.gray(`${text}\n`), color: "gray" });

  spinner.start();

  return spinner;
};

export const highlight = (text: string) => chalk.bold.underline(text);

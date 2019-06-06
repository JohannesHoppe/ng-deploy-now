import chalk from "chalk";
import ora from "ora";

export const sleep = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export default function wait(msg: string, timeout: number = 300, _ora = ora) {
	let spinner: ReturnType<typeof ora>;
	let running = false;
	let stopped = false;

	// @ts-ignore
	setTimeout(() => {
		if (stopped) {
			return null;
		}

		spinner = ora(chalk.gray(msg));
		spinner.color = "gray";
		spinner.start();
		running = true;
	}, timeout);

	const cancel = () => {
		stopped = true;
		if (running) {
			spinner.stop();
			running = false;
		}
		process.removeListener("nowExit", cancel);
	};

	// @ts-ignore
	process.on("nowExit", cancel);
	return cancel;
}

import { BuilderContext } from "@angular-devkit/architect";
import createDeployment from "now-client";
import { SchematicsException } from "@angular-devkit/schematics";
import { wait, highlight } from "../../utils/output";
import { DeployOptions } from "../deploy.builder";

export async function deploy(
	context: BuilderContext,
	token: string,
	_options: DeployOptions
) {
	context.logger.info(`Building your application 📦 `);

	// Build production code
	const build = await context.scheduleTarget({
		target: "build",
		project: context!.target!.project,
		configuration: "production"
	});

	await build.result;

	// Empty line

	const spinner = wait("deploying your application 🚀");

	for await (const event of createDeployment(context.workspaceRoot, {
		token
		// teamId: options.scope !== '' ? options.scope : undefined
	})) {
		if (event.type === "ready" || event.type === "created") {
			spinner.stop();
			const { url } = event.payload;
			context.logger.info(
				`Your application is deployed at: ${highlight(
					`https://${url}`
				)}`
			);
			break;
		}

		if (event.type === "error") {
			console.log(event);
			throw new SchematicsException(
				`There was error during your deployment:${event.payload}`
			);
		}
	}
}

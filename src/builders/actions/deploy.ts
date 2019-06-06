import { BuilderContext } from "@angular-devkit/architect";
import createDeployment from "now-client";
import { SchematicsException } from "@angular-devkit/schematics";

export async function deploy(context: BuilderContext, token: string) {
	context.logger.info(`📦 building your application`);

	// Build production code
	// const build = await context.scheduleTarget({
	// 	target: "build",
	// 	project: context!.target!.project,
	// 	configuration: "production"
	// });

	//  await build.result;

	context.logger.info(`🚀 deploying your application`);

	for await (const event of createDeployment(context.workspaceRoot, {
		token
	})) {
		if (event.type === "ready") {
			const { url } = event.payload;
			context.logger.info(
				`Your application is deployed at https://${url}`
			);
			break;
		}

		if (event.type === "error") {
			throw new SchematicsException(
				`There was error during your deployment:${event.payload}`
			);
		}
	}
}

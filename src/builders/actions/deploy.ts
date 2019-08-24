import { BuilderContext } from "@angular-devkit/architect";
import { createDeployment } from "now-client";
import { SchematicsException } from "@angular-devkit/schematics";
import { wait, highlight } from "../../utils/output";
import { DeployOptions } from "../deploy.builder";
import { getTeamIdFromSlug } from "../../utils/scope";

export async function deploy(
  context: BuilderContext,
  token: string,
  options: DeployOptions
) {
  context.logger.info(`Building your application 📦`);

  // Build production code
  if (!options["no-build"]) {
    const build = await context.scheduleTarget({
      target: "build",
      project: context!.target!.project,
      configuration: options.configuration
    });

    await build.result;
  }

  // Empty line
  console.log();

  const spinner = wait("deploying your application 🚀");

  const teamId = await getTeamIdFromSlug(options.scope, token);

  for await (const event of createDeployment(context.workspaceRoot, {
    token,
    teamId,
    target: options.target,
    force: options.force
  })) {
    if (event.type === "ready" || event.type === "created") {
      spinner.stop();
      const { url } = event.payload;
      context.logger.info(
        `Your application is deployed at: ${highlight(`https://${url}`)}`
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

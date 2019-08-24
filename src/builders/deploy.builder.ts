import {
  createBuilder,
  BuilderOutput,
  BuilderContext
} from "@angular-devkit/architect";
import { deploy } from "./actions/deploy";
import { loginToNow } from "../utils/auth";

export type DeployOptions = {
  force: boolean;
  scope: string;
  ["no-build"]: boolean;
  configuration: string;
  target: string;
};

export default createBuilder(
  async (
    options: DeployOptions,
    context: BuilderContext
  ): Promise<BuilderOutput> => {
    if (!context.target) {
      throw new Error("Not possible to deploy application without a target");
    }

    const token = await loginToNow();

    try {
      await deploy(context, token!, options);
    } catch (e) {
      context.logger.error(`Error when trying to deploy:`);
      context.logger.error(JSON.stringify(e));
      return { success: false };
    }

    return { success: true };
  }
);

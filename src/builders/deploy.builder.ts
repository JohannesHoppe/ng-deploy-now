import {
	createBuilder,
	BuilderOutput,
	BuilderContext
} from "@angular-devkit/architect";
import { deploy } from "./actions/deploy";
import { loginToNow } from "../utils/auth";

export default createBuilder(
	async (_: any, context: BuilderContext): Promise<BuilderOutput> => {
		if (!context.target) {
			throw new Error(
				"Not possible to deploy application without a target"
			);
		}

		const { token } = await loginToNow();

		try {
			await deploy(context, token);
		} catch (e) {
			context.logger.error(`Error when trying to deploy:`);
			console.log(e);
			context.logger.error(e);
			return { success: false };
		}

		return { success: true };
	}
);

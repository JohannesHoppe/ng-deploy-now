import Conf from "conf";
import { login } from "./login";

type Authorization = {
	token: string;
};

const AUTHORIZATION = "authorization";

const globalConfig = new Conf<Authorization | null>({
	defaults: {
		token: null
	},
	configName: "ng-now"
});

globalConfig.clear()

export async function loginToNow() {
	let authorization = (await globalConfig.get(
		AUTHORIZATION
	)) as Authorization | null;

	if (!authorization) {
		authorization = await login();
		globalConfig.set(AUTHORIZATION, authorization);
	}

	return authorization;
}

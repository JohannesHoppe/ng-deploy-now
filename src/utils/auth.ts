import { login } from "./login";
import { readAuthConfigFile, writeToAuthConfigFile } from "./filte";
import { SchematicsException } from "@angular-devkit/schematics";

export type AuthConfig = {
  token: string;
  _: string;
};

export async function loginToNow() {
  let token;
  try {
    token = readAuthConfigFile().token;
  } catch (e) {
    if (e.code === "ENOENT") {
      const { token } = await login();
      const config: AuthConfig = { ...defaultConfig, token };
      writeToAuthConfigFile(config);
      return token;
    } else {
      throw new SchematicsException(e);
    }
  }

  return token;
}

const defaultConfig = {
  _:
    "This is your Now credentials file. DON'T SHARE! More: https://bit.ly/2qAK8bb"
};

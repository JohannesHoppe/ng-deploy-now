import { homedir } from "os";
import { join } from "path";
import loadJSON from "load-json-file";
import writeJSON from "write-json-file";
import { highlight } from "./output";
import { SchematicsException } from "@angular-devkit/schematics";
import { AuthConfig } from "./auth";

const NOW_DIR = join(homedir(), ".now");
const AUTH_CONFIG_FILE_PATH = join(NOW_DIR, "auth.json");

/**
 * Reads auth config file
 */
export const readAuthConfigFile = (): AuthConfig =>
  loadJSON.sync(AUTH_CONFIG_FILE_PATH);

/**
 * Write auth config
 * @param config auth config
 */
export const writeToAuthConfigFile = (config: object) => {
  try {
    return writeJSON.sync(AUTH_CONFIG_FILE_PATH, config, { indent: 2 });
  } catch (err) {
    if (err.code === "EPERM") {
      throw new SchematicsException(
        `Not able to create ${highlight(
          AUTH_CONFIG_FILE_PATH
        )} (operation not permitted).`
      );
    } else if (err.code === "EBADF") {
      throw new SchematicsException(
        `Not able to create ${highlight(
          AUTH_CONFIG_FILE_PATH
        )} (bad file descriptor).`
      );
    }

    throw err;
  }
};

import {
  Tree,
  chain,
  Rule,
  SchematicContext
} from "@angular-devkit/schematics";
import { AngularJson } from "../workspace/angular-json";
import { loginToNow } from "../utils/auth";

export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([addDeployToNow()])(tree, context);
  };
}

function addDeployToNow() {
  return async (tree: Tree, _context: SchematicContext) => {
    const angularJson = new AngularJson(tree);

    angularJson.addDeployArchitect();

    await loginToNow();
  };
}

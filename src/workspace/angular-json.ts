import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { parseJson } from "@angular-devkit/core";
import { SchematicsException } from "@angular-devkit/schematics";
import {
  WorkspaceSchema,
  WorkspaceProject
} from "@angular-devkit/core/src/experimental/workspace";

export class AngularJson {
  private tree: Tree;
  private path: string;
  private json: string;
  private schema: WorkspaceSchema;
  private projectName: string;
  private project: WorkspaceProject;
  private outputPath: string;

  constructor(tree: Tree) {
    this.tree = tree;
    this.path = "/angular.json";
    this.json = this.getJson();
    this.schema = this.getSchema();
    this.projectName = this.getProjectName({});
    const { project, outputPath } = this.getProject();
    this.project = project;
    this.outputPath = outputPath;
  }

  private getJson() {
    const buffer = this.tree.read(this.path);
    if (buffer === null) {
      throw new SchematicsException("Could not find angular.json file");
    }
    return buffer.toString();
  }

  private getSchema() {
    let schema: WorkspaceSchema;
    try {
      schema = (parseJson(this.json) as {}) as WorkspaceSchema;
    } catch (e) {
      throw new SchematicsException(
        `Could not parse angular.json: ${e.message}`
      );
    }

    return schema;
  }

  private getProjectName(options: any) {
    let projectName = options.project;

    if (!projectName) {
      if (this.schema.defaultProject) {
        projectName = this.schema.defaultProject;
      } else {
        throw new SchematicsException(
          "No project selected or no default project in workspace"
        );
      }
    }
    return projectName;
  }

  private getProject() {
    const project = this.schema.projects[this.projectName];

    if (!project) {
      throw new SchematicsException(
        `Project: ${this.projectName} is not defined in workspace`
      );
    }

    if (project.projectType !== "application") {
      throw new SchematicsException(
        'Project needs to be "application" in angular.json'
      );
    }

    if (
      !project.architect ||
      !project.architect.build ||
      !project.architect.build.options ||
      !project.architect.build.options.outputPath
    ) {
      throw new SchematicsException(
        `Cannot read the output path (architect.build.options.outputPath) of project "${
          this.projectName
        }" in angular.json`
      );
    }

    const outputPath = project.architect.build.options.outputPath;

    return { project, outputPath };
  }

  public addDeployArchitect() {
    if (!this.project || !this.project.architect) {
      throw new SchematicsException(
        "An error has occured during modification of angular.json"
      );
    }
    this.project.architect["deploy"] = {
      builder: "@zeit/ng-deploy:deploy"
    };

    this.saveJson();
  }

  public getMeta() {
    return { projectName: this.projectName, outputPath: this.outputPath };
  }

  private saveJson() {
    this.tree.overwrite(this.path, JSON.stringify(this.schema, null, 2));
  }
}

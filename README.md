# ng-deploy

Deploy Angular projects to Now

## Developmnet

If you want to try the latest package locally without installing it from npm, use the following instructions. This may be useful when you want to try the latest non published version of this library or you want to make a contribution.

### yarn link

Use the following instructions to make ng-deploy-now available locally via `yarn link`.

1. Clone the project

    ```sh
    git clone https://github.com/zeit/ng-deploy-now
    cd ng-deploy-now
    ```

1. Install the dependencies

    ```sh
    yarn install
    ```

1. Build the project:

    ```sh
    yarn run build
    ```

1. Create a local yarn link:

    ```sh
    yarn link
    ```

### Adding to an Angular project - ng add

Once you have completed the previous steps to yarn link the local copy of ng-deploy-now, follow these steps to use it in a local angular project.

1. Enter the project's directory

    ```sh
    cd your-angular-project
    ```

1. To add the local version of @zeit/ng-deploy, link @zeit/ng-deploy.

    ```sh
    yarn link @zeit/ng-deploy
    ```

1. You may be prompted you to sign in to Now.

1. Then, instead of running `ng add @zeit/ng-deploy`, add the local version.

    ```sh
    ng add @zeit/ng-deploy
    ```

1. Now you can deploy your angular app to Now.

    ```sh
    ng run your-angular-project:deploy
    ```

> You can remove the link later by running `yarn unlink`

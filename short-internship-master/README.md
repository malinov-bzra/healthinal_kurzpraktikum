# Short Internship

[internship @ healthinal](https://healthinal.github.io/internship/docs/short-internship/welcome)

This monorepo contains the basic setup for the frontend and backend application.

> **Important:** Do not edit this repo directly. Create a fork of it into your own account.

## Development

### Prerequisites

* [Docker](https://docs.docker.com/desktop/install/mac-install/)

#### MacOS

* [SDKMAN!](https://sdkman.io/install)
* [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

#### Windows
* [Node.js](https://nodejs.org/en)
* [Yarn](https://yarnpkg.com/getting-started/install)

### Setup

For macOS execute the following script to get started.

```shell
./setup.sh
```

For windows execute the necessary commands from the [setup script](./setup.sh) manually. Fell free to ask for help.

#### Frontend

The frontend is a React-Typescript application using [Vite](https://vite.dev/) as a build tool.

To start the application run the following commands in the [frontend](./frontend) directory: 

```shell
# To install the dependencies
yarn install

# To start the dev server
yarn dev
```

This will start the dev server for the frontend at [localhost:3040](http://localhost:3040).

The frontend contains a linter and formatter configuration which helps you to keep your code clean.

```shell
# To lint your code
yarn lint

# To format your code
yarn format

# To check the formatting of your code
yarn format:check
```

#### Backend

The backend is a spring-boot kotlin application. To start it you can use the `Run configuration` in IntelliJ. To check if it works call the hello world controller at [localhost:8040/hello-world](http://localhost:8040/hello-world).

The backend contains a detekt and ktfmt configuration that formats and lints your code. These are gradle tasks which can be executed directly in IntelliJ.

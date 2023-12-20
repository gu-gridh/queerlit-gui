# Queerlit GUI

Search interface for the [Queerlit](https://queerlit.dh.gu.se/) database and the QLIT thesaurus.

1. [Running and building the code](#running-and-building-the-code)
2. [Code](#code)
3. [Environment](#environment)
4. [Visual Studio Code settings](#visual-studio-code-settings)
5. [Releases](#releases)

## Running and building the code

### Serve locally with hot module replacement

This is suitable while developing, as the site will automatically be updated upon code changes.

1. Install Node.js 16 and [Yarn 3](https://yarnpkg.com/getting-started/install)
2. `yarn install`
3. `yarn dev`

#### Why Node 16?

Node 16 is an old version, but it's currently used on GRIDH servers and cannot be upgraded there because the OS doesn't support newer versions.Using the same version when developing will make sure the code can be properly built on the servers when deploying.

### Build optimized code for deployment

1. Install Node.js and Yarn
2. `yarn install`
3. `yarn build`

Resulting files in the `dist` folder can be placed on a web server, or served locally with `npx http-server dist` or similar.

### Build and serve with Docker

This will build the optimized code as above, and then serve it locally. You need to install Docker, but not Node.js or Yarn.

Make sure to edit `.env.local` (see [Environment](#environment)) before building, if needed.

1. [Install Docker](https://www.docker.com/get-started/)
2. `docker build -t queerlit-gui .`
3. `docker run -p 8090:80 queerlit-gui`
4. Visit site at http://localhost:8090/

## Code

The frontend is written in TypeScript, using the [Vue 3](https://vuejs.org/) framework with [Vite](https://vitejs.dev/) as a build toolchain. [Tailwind](https://tailwindcss.com/) is used for styling.

HTTP requests are made with [Axios](https://axios-http.com/docs/intro) to Libris XL ([libris.service.ts](src/services/libris.service.ts)), the Queerlit thesaurus backend ([terms.service.ts](src/services/terms.service.ts)) and Library of Congress Subject Headings ([lcsh.service.ts](src/services/lcsh.service.ts)).

While developing, you may be helped by running `yarn typecheck`, `yarn lint` and `yarn format`. See their definitions in [package.json](package.json).

## Environment

A few settings can be configured by setting environment variables. See [Vite docs](https://vitejs.dev/guide/env-and-mode).

- Set `VITE_XLAPI_QA` to `1` to use the test environment of Libris XL, libris-qa.kb.se
- Set `VITE_MATOMO_URL` and `VITE_MATOMO_ID` to enable stats reporting to a Matomo backend
- Set `VITE_QLIT_BASE` to override the standard thesaurus backend URL (including trailing slash), e.g. if you are developing that too and want to test the frontend against it

## Visual Studio Code settings

If you are using [Visual Studio Code](https://code.visualstudio.com/) to edit the code, these settings should enable automatic linting and formatting.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Releases

Notable changes are logged in [CHANGELOG.md](CHANGELOG.md). Releasing a new version means:

1. Making sure changes are logged under a new version number (bump the major, minor or patch number) in `CHANGELOG.md` in the `dev` branch
2. Update version number in `package.json`
3. Merging `dev` into `main` without fast-forwarding
4. Tagging the merge commit with the version number in the form `vX.X.X`
5. Pushing the branches and the tag: `git push; git push --tags`

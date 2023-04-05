# Queerlit GUI

Search interface for the [Queerlit](https://queerlit.dh.gu.se/) database and the QLIT thesaurus.

## Development

1. Install Node.js and [Yarn 3](https://yarnpkg.com/getting-started/install).
2. `yarn install`
3. `yarn dev`

### Visual Studio Code settings

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "vetur.validation.template": false,
  "editor.formatOnSave": true,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Issue queue

Issues are on GitHub: https://github.com/CDH-DevTeam/queerlit-gui/issues

To get a sorted overview, run [`docs/issues.sh`](docs/issues.sh). It requires [jq](https://stedolan.github.io/jq/) and outputs CSV data, which you can save to a file and open in LibreOffice Calc or similar.

### Releases

Notable changes are logged in [CHANGELOG.md](CHANGELOG.md). Releasing a new version means:

1. Making sure changes are logged under a new version number (bump the major, minor or patch number) in `CHANGELOG.md` in the `dev` branch
2. Update version number in `package.json`
3. Merging `dev` into `main` without fast-forwarding
4. Tagging the merge commit with the version number in the form `vX.X.X`
5. Pushing the branches and the tag: `git push; git push --tags`

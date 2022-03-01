# Queerlit GUI

Search interface for the [Queerlit](https://queerlit.dh.gu.se/) database and the QLIT thesaurus.

## Development

1. Install Node.js and [Yarn 2](https://yarnpkg.com/getting-started/install).
2. `yarn install`
3. `yarn dev`

## Deploy dev

```bash
BASE=/dev/ yarn build
rsync -avz dist/ cdh03:/var/www/html2/queerlit/dev/
```

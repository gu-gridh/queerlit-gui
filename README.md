# Queerlit GUI

Search interface for the [Queerlit](https://queerlit.dh.gu.se/) database and the QLIT thesaurus.

## Deploy dev

```bash
BASE=/dev/ yarn build
rsync -avz dist/ cdh03:/var/www/html2/queerlit/dev/
```

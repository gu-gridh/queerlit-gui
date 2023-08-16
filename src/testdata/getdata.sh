#!/bin/bash

cd $(dirname $0)

curl https://libris.kb.se/find\?q\=\*\&%40reverse.itemOf.heldBy.%40id\=https%3A%2F%2Flibris.kb.se%2Flibrary%2FQLIT\&_sort\=-meta.modified\&_limit\=1 \
  | jq '.items[0]' > recent1.json
  
curl https://libris.kb.se/find\?q\=\*\&%40reverse.itemOf.heldBy.%40id\=https%3A%2F%2Flibris.kb.se%2Flibrary%2FQLIT\&_sort\=-meta.modified\&_limit\=20 \
  | jq '.items' > recent.json

curl https://libris.kb.se/find\?q\=\*\&%40reverse.itemOf.heldBy.%40id\=https%3A%2F%2Flibris.kb.se%2Flibrary%2FQLIT\&_sort\=-meta.modified\&_limit\=100 \
  | jq '.items' > recent100.json
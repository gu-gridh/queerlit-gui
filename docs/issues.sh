#!/bin/bash
# Fetches issue list, sorts by prio and effort labels, and outputs CSV
# Requires `jq` to be installed: https://stedolan.github.io/jq/

curl https://api.github.com/repos/CDH-DevTeam/queerlit-gui/issues?per_page=200 | \
  jq -r '
    map([
      .title,
      [.labels[].name | select(contains("prio"))][0],
      [.labels[].name | select(contains("effort"))][0],
      [.labels[].name | select(contains("kb"))][0]
    ])
    | sort_by(.[2]) | reverse
    | sort_by(.[1]) | reverse
    | .[] | @csv'
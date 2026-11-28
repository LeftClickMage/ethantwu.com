#!/bin/sh
# Builds the fixed scene pages from the four base pages.
# Edit the base pages (mainConsole.html, engineerone/two/three.html), then run:  sh build-scenes.sh
cd "$(dirname "$0")" || exit 1
build() {  # build <page> <scene>
  label=$(echo "$2" | tr '[:lower:]' '[:upper:]')
  sed -e "s#<script src=\"spss.js\"></script>#<script>window.SPSS_LOCK = '$2';</script>\n<script src=\"spss.js\"></script>#" \
      -e "s#</title># — $label</title>#" \
      "$1.html" > "$1-$2.html"
  echo "wrote $1-$2.html"
}
for page in mainConsole engineerone engineertwo engineerthree; do
  for scene in poll launch orbit ending; do build "$page" "$scene"; done
done

#!/usr/bin/env bash
# Atualiza o ?v= dos arquivos de estilo e script em todas as páginas.
# Rode antes de cada publicação para o navegador nunca usar uma versão antiga em cache.
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(cat assets/css/site.css assets/js/site.js | sha1sum | cut -c1-8)
for f in index.html casos/*.html; do
  sed -i -E "s#(assets/css/site\.css)(\?v=[a-z0-9]+)?\"#\1?v=$V\"#; s#(assets/js/site\.js)(\?v=[a-z0-9]+)?\"#\1?v=$V\"#" "$f"
done
echo "versão $V aplicada"

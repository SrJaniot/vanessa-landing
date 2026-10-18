#!/usr/bin/env sh
# PUBLICA LA LANDING EN GITHUB PAGES (https://srjaniot.github.io/vanessa-landing/)
# 1. CREA EL REPO PUBLICO SrJaniot/vanessa-landing SI NO EXISTE (API DE GITHUB CON LA CREDENCIAL DE GIT DEL PC, SIN MOSTRAR EL TOKEN)
# 2. SUBE EL CODIGO A main
# 3. COMPILA (npm run build:pages) Y SUBE dist/vanessa-landing/browser A LA RAMA gh-pages
# 4. ACTIVA GITHUB PAGES SOBRE gh-pages (SOLO LA PRIMERA VEZ)
# USO (DESDE LA CARPETA DE LA LANDING): sh scripts/publicar-pages.sh
# NO SUBE investigacion/ NI revision/ (ESTAN EN .gitignore)
set -e
USUARIO=SrJaniot
REPO=vanessa-landing
API=https://api.github.com
cd "$(dirname "$0")/.."

TOKEN=$(printf 'protocol=https\nhost=github.com\n\n' | git credential fill 2>/dev/null | sed -n 's/^password=//p')
if [ -z "$TOKEN" ]; then echo "No encontre la credencial de GitHub en git"; exit 1; fi

#PASO 1: EL REPO
CODIGO=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $TOKEN" "$API/repos/$USUARIO/$REPO")
if [ "$CODIGO" = "404" ]; then
  curl -s -o /dev/null -w "Repo creado: %{http_code}\n" -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" \
    "$API/user/repos" -d "{\"name\":\"$REPO\",\"description\":\"Landing de Vanessa: plataforma escolar hecha para Colombia\",\"private\":false,\"has_wiki\":false}"
else
  echo "El repo ya existe ($CODIGO)"
fi

#PASO 2: EL CODIGO
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USUARIO/$REPO.git"
git push -u origin main

#PASO 3: LA RAMA gh-pages CON LO COMPILADO
npm run build:pages
SALIDA=dist/vanessa-landing/browser
rm -rf "$SALIDA/.git"
git -C "$SALIDA" init -q
git -C "$SALIDA" checkout -q -b gh-pages
git -C "$SALIDA" add -A
git -C "$SALIDA" -c user.name="$USUARIO" -c user.email="estebanjaniot10@gmail.com" commit -q -m "publicar landing"
git -C "$SALIDA" push -q -f "https://github.com/$USUARIO/$REPO.git" gh-pages
rm -rf "$SALIDA/.git"

#PASO 4: ACTIVAR PAGES (SI YA ESTA ACTIVO RESPONDE 409 Y NO PASA NADA)
curl -s -o /dev/null -w "Pages: %{http_code}\n" -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" \
  "$API/repos/$USUARIO/$REPO/pages" -d '{"source":{"branch":"gh-pages","path":"/"}}'
unset TOKEN
echo "Listo: https://srjaniot.github.io/$REPO/ (puede tardar 1 o 2 minutos la primera vez)"

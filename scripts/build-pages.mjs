//BUILD PARA GITHUB PAGES
//uso: npm run build:pages                       (base-href por defecto: /vanessa-landing/)
//     npm run build:pages -- /otra-ruta/        (base-href como argumento)
//     BASE_HREF=/ npm run build:pages           (dominio propio: base-href en la raiz)
//COPIA index.html COMO 404.html (GITHUB PAGES LO SIRVE EN CUALQUIER RUTA DESCONOCIDA) Y CREA .nojekyll
import { spawnSync } from 'node:child_process';
import { copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

let baseHref = process.argv[2] || process.env.BASE_HREF || '/vanessa-landing/';
if (!baseHref.startsWith('/')) baseHref = '/' + baseHref;
if (!baseHref.endsWith('/')) baseHref = baseHref + '/';

console.log(`Construyendo con base-href ${baseHref}`);
const resultado = spawnSync('npx', ['ng', 'build', '--configuration', 'production', '--base-href', baseHref], {
  stdio: 'inherit',
  shell: true,
  //EVITA QUE GIT BASH (MSYS) CONVIERTA /vanessa-landing/ EN UNA RUTA DE WINDOWS
  env: { ...process.env, MSYS_NO_PATHCONV: '1' },
});
if (resultado.status !== 0) process.exit(resultado.status ?? 1);

const salida = join('dist', 'vanessa-landing', 'browser');
if (!existsSync(join(salida, 'index.html'))) {
  console.error('No se encontró el index.html en ' + salida);
  process.exit(1);
}
copyFileSync(join(salida, 'index.html'), join(salida, '404.html'));
writeFileSync(join(salida, '.nojekyll'), '');
console.log(`Listo: ${salida} (con 404.html y .nojekyll). Sube esa carpeta a la rama de GitHub Pages.`);

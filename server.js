const { createServer } = require('http');
const { parse } = require('url');
const { exec } = require('child_process');

process.chdir(__dirname);

const next = require('next');
const app = next({ dev: true, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('');
    console.log('  ================================');
    console.log('    La Buena Semilla - Activa!   ');
    console.log('  ================================');
    console.log('');
    console.log('  Abri el navegador en:');
    console.log('  >>> http://localhost:3000 <<<');
    console.log('');
    console.log('  (Ctrl+C para detener el servidor)');
    console.log('');
    console.log('  Compilando paginas, espera unos segundos...');
    setTimeout(() => {
      console.log('  Abriendo navegador...');
      exec('start http://localhost:3000');
    }, 6000);
  });
}).catch(err => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});

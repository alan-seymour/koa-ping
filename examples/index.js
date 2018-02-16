

const Koa = require('koa');
const health = require('../index');

const app = new Koa();

// using the default (/ping)
// app.use(health());

// OR using custom URL
let customUrl = '';
customUrl = '/test/ping';
app.use(health(customUrl, ['timestamp']));

app.listen(3000);

const message = customUrl.length > 0 ? customUrl : '/ping';
console.log(`Ready. http://localhost:3000${message} to check health`);

const app = require('./app');
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

process.on('uncaughtException', error => {
  console.log('uncaughtException', error);
  process.exit(0);
});

process.on('exit', code => {
  console.log('server shut down', code);
});

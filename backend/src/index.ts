
import app from "./app";

const { createServer } = require('node:http');

const server = createServer(app);

server.listen(3000, () => {
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
});

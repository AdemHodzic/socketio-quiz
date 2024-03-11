
import app from "./app";
import { createServer } from 'node:http';
import Game from './game/game';

const server = createServer(app);

server.listen(3000, () => {
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
});

const game = new Game(server);
